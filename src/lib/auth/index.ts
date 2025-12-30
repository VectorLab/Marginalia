import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

import { getAdminEmail, setAdminEmail } from "./verify";

type AuthEnvironment = {
  suudBaseURL: string;
  suudClientId: string;
  suudClientSecret: string;
  appSecret: string;
};

const resolveAuthEnvironment = (): AuthEnvironment => {
  const suudBaseURL = process.env.VITE_SUUD_BASE_URL || "https://suud.net";
  const suudClientId = process.env.SUUD_OAUTH_CLIENT_ID || "";
  const suudClientSecret = process.env.SUUD_OAUTH_CLIENT_SECRET || "";
  const appSecret = process.env.BETTER_AUTH_SECRET || "";

  return {
    suudBaseURL,
    suudClientId,
    suudClientSecret,
    appSecret,
  };
};

const getBaseURL = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return (
    process.env.VITE_BASE_URL ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000"
  );
};

const createAuthInstance = () => {
  const env = resolveAuthEnvironment();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verificationTokens,
      },
    }),

    emailAndPassword: {
      enabled: true,
    },

    socialProviders: {},

    plugins: [
      genericOAuth({
        config: [
          {
            providerId: "suud",
            discoveryUrl: `${env.suudBaseURL}/api/auth/.well-known/openid-configuration`,
            clientId: env.suudClientId,
            clientSecret: env.suudClientSecret,
            scopes: ["openid", "profile", "email"],
            pkce: true,
            overrideUserInfo: true,
            mapProfileToUser: (profile) => {
              return {
                id: profile.sub,
                name: profile.preferred_username || profile.name,
                email: profile.email,
                image: profile.picture,
                emailVerified: profile.email_verified,
              };
            },
          },
        ],
      }),
    ],
    secret: env.appSecret,
    baseURL: getBaseURL(),
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60 * 24 * 7,
      },
    },
    advanced: {
      cookiePrefix: "marginalia",
      database: {
        generateId: () =>
          crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    },
    databaseHooks: {
      session: {
        create: {
          after: async (session) => {
            const adminEmail = await getAdminEmail();
            if (!adminEmail && session.userId) {
              const user = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.id, session.userId),
              });
              if (user?.email) {
                await setAdminEmail(user.email);
              }
            }
          },
        },
      },
    },
  });
};

type AuthInstance = ReturnType<typeof createAuthInstance>;

let authInstance: AuthInstance | null = null;

export const getAuth = (): AuthInstance => {
  if (!authInstance) {
    authInstance = createAuthInstance();
  }
  return authInstance;
};

export const auth = getAuth();

export type Session = AuthInstance["$Infer"]["Session"];

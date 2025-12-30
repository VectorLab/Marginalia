import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return import.meta.env.VITE_BASE_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [genericOAuthClient()],
});

export const { signIn, signOut, useSession } = authClient;

export const signInWithSuud = async (callbackURL = "/") => {
  await authClient.signIn.oauth2({
    providerId: "suud",
    callbackURL,
  });
};

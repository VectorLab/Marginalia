import { getAdminEmail } from "@/lib/auth/verify";

export function getEnvConfigStatus() {
  return {
    BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
    SUUD_OAUTH_CLIENT_ID: !!process.env.SUUD_OAUTH_CLIENT_ID,
    SUUD_OAUTH_CLIENT_SECRET: !!process.env.SUUD_OAUTH_CLIENT_SECRET,
    VITE_SUUD_BASE_URL: !!process.env.VITE_SUUD_BASE_URL,
  };
}

export async function getConfigStatus() {
  const envStatus = getEnvConfigStatus();
  const adminEmail = await getAdminEmail();

  return {
    ...envStatus,
    adminConfigured: !!adminEmail,
  };
}

export async function isConfigured(): Promise<boolean> {
  const requiredEnvVars = [
    "BETTER_AUTH_SECRET",
    "SUUD_OAUTH_CLIENT_ID",
    "SUUD_OAUTH_CLIENT_SECRET",
  ];

  const envOk = requiredEnvVars.every((key) => {
    const value = process.env[key];
    return value && value.trim().length > 0;
  });

  if (!envOk) return false;

  const adminEmail = await getAdminEmail();
  return !!adminEmail;
}

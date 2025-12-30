import { eq } from "drizzle-orm";

import { errorResponse, HTTP_STATUS } from "@/lib/api";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";

const ADMIN_EMAIL_KEY = "adminEmail";

type VerifyResult = {
  authorised: boolean;
  error?: Response;
};

export async function getAdminEmail(): Promise<string | null> {
  try {
    const row = await db.query.settings.findFirst({
      where: eq(settings.key, ADMIN_EMAIL_KEY),
    });
    return row?.value || null;
  } catch {
    return null;
  }
}

export async function setAdminEmail(email: string): Promise<boolean> {
  try {
    const existing = await db.query.settings.findFirst({
      where: eq(settings.key, ADMIN_EMAIL_KEY),
    });

    if (existing) {
      await db
        .update(settings)
        .set({ value: email })
        .where(eq(settings.key, ADMIN_EMAIL_KEY));
    } else {
      await db.insert(settings).values({ key: ADMIN_EMAIL_KEY, value: email });
    }
    return true;
  } catch {
    return false;
  }
}

export async function verifyOwner(request: Request): Promise<VerifyResult> {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.email) {
    return {
      authorised: false,
      error: errorResponse("Unauthorised", HTTP_STATUS.UNAUTHORISED),
    };
  }

  const adminEmail = await getAdminEmail();

  if (!adminEmail) {
    return {
      authorised: false,
      error: errorResponse("No admin configured", HTTP_STATUS.FORBIDDEN),
    };
  }

  if (session.user.email !== adminEmail) {
    return {
      authorised: false,
      error: errorResponse("Forbidden", HTTP_STATUS.FORBIDDEN),
    };
  }

  return { authorised: true };
}

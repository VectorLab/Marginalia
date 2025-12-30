const JSON_HEADERS = { "Content-Type": "application/json" } as const;

export const jsonResponse = <T>(data: T, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });

export const errorResponse = (error: string, status: number): Response =>
  jsonResponse({ error }, status);

export const successResponse = <T extends Record<string, unknown>>(
  data?: T,
): Response => jsonResponse({ success: true, ...data });

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORISED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

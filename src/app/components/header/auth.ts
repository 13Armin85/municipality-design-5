// Decodes the payload of a JWT without any external library.
const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

/**
 * Checks whether the JWT carries the "Admin" role.
 * The API returns: { ..., "role": "Admin", ... }
 * We also handle array form just in case.
 */
export const isAdminToken = (token: string): boolean => {
  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  const raw =
    payload["role"] ??
    payload["Role"] ??
    payload["roles"] ??
    payload["Roles"] ??
    "";
  const rolesArr: string[] = Array.isArray(raw)
    ? (raw as string[])
    : [raw as string];
  return rolesArr.some((r) => r === "Admin");
};

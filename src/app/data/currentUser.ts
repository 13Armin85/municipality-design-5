import { dotNet10ApiFetch, dotNet10ApiUrl } from "./api";
import { AUTH_TOKEN_KEY } from "../utils/authStorage";

export interface CurrentUser {
  id: string;
  name: string;
  family: string;
  nationalCode: string;
  phoneNumber: string;
  userName: string;
  roleId: string;
  roleName: string;
  email: string;
  address: string;
  picture: string;
  pictureUrl: string;
  birthDay: string;
}

type ApiEnvelope<T = unknown> = {
  isSuccess?: boolean;
  IsSuccess?: boolean;
  isFailure?: boolean;
  IsFailure?: boolean;
  value?: T;
  Value?: T;
  message?: string;
  Message?: string;
  error?: { code?: string; name?: string; description?: string };
  Error?: { Code?: string; Name?: string; Description?: string };
};

type RawCurrentUser = {
  id?: string;
  Id?: string;
  name?: string;
  Name?: string;
  family?: string;
  Family?: string;
  nationalCode?: string;
  NationalCode?: string;
  phoneNumber?: string;
  PhoneNumber?: string;
  userName?: string;
  UserName?: string;
  roleId?: string;
  RoleId?: string;
  roleName?: string;
  RoleName?: string;
  email?: string | null;
  Email?: string | null;
  address?: string | null;
  Address?: string | null;
  picture?: string | null;
  Picture?: string | null;
  birthDay?: string | null;
  BirthDay?: string | null;
};

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(AUTH_TOKEN_KEY)?.replace(/^Bearer\s+/i, "")
      : "";

  return {
    Accept: "*/*",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getBase64ImageMimeType(value: string) {
  if (value.startsWith("/9j/")) return "image/jpeg";
  if (value.startsWith("iVBOR")) return "image/png";
  if (value.startsWith("R0lG")) return "image/gif";
  if (value.startsWith("UklGR")) return "image/webp";
  return null;
}

export function resolveUserPictureSrc(value: string | null | undefined) {
  const imageValue = value?.trim();
  if (!imageValue) return "";
  if (/^(https?:|data:|blob:)/i.test(imageValue)) return imageValue;

  const compactBase64 = imageValue.replace(/^data:image\/[^;]+;base64,/i, "");
  const mimeType = getBase64ImageMimeType(compactBase64);
  if (mimeType) return `data:${mimeType};base64,${compactBase64}`;

  const normalizedPath = imageValue.replace(/\\/g, "/");
  return dotNet10ApiUrl(
    normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`,
  );
}

async function parseResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<ApiEnvelope<T>> {
  const text = await response.text();
  let payload: ApiEnvelope<T> = {};

  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      if (!response.ok) throw new Error(text);
    }
  }

  const isSuccess = payload.isSuccess ?? payload.IsSuccess;
  const isFailure = payload.isFailure ?? payload.IsFailure;

  if (!response.ok || isSuccess === false || (isSuccess !== true && isFailure === true)) {
    throw new Error(
      payload.error?.name ||
        payload.error?.description ||
        payload.Error?.Name ||
        payload.Error?.Description ||
        payload.message ||
        payload.Message ||
        fallbackMessage,
    );
  }

  return payload;
}

function normalizeCurrentUser(user: RawCurrentUser): CurrentUser {
  const picture = user.picture ?? user.Picture ?? "";

  return {
    id: user.id ?? user.Id ?? "",
    name: user.name ?? user.Name ?? "",
    family: user.family ?? user.Family ?? "",
    nationalCode: user.nationalCode ?? user.NationalCode ?? "",
    phoneNumber: user.phoneNumber ?? user.PhoneNumber ?? "",
    userName: user.userName ?? user.UserName ?? "",
    roleId: user.roleId ?? user.RoleId ?? "",
    roleName: user.roleName ?? user.RoleName ?? "",
    email: user.email ?? user.Email ?? "",
    address: user.address ?? user.Address ?? "",
    picture,
    pictureUrl: resolveUserPictureSrc(picture),
    birthDay: user.birthDay ?? user.BirthDay ?? "",
  };
}

export async function fetchCurrentUser(
  signal?: AbortSignal,
): Promise<CurrentUser> {
  const response = await dotNet10ApiFetch("/api/auth/current", {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const payload = await parseResponse<RawCurrentUser>(
    response,
    "دریافت اطلاعات پروفایل ناموفق بود.",
  );
  const value = payload.value ?? payload.Value;

  if (!value) throw new Error("اطلاعات پروفایل معتبر نیست.");
  return normalizeCurrentUser(value);
}

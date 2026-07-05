import { dotNet10ApiFetch } from "./api";

export interface FaqItem {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

export interface FaqInput {
  title: string;
  description: string;
}

type ApiEnvelope<T = unknown> = {
  isSuccess?: boolean;
  IsSuccess?: boolean;
  isFailure?: boolean;
  IsFailure?: boolean;
  value?: T;
  Value?: T;
  title?: string;
  detail?: string;
  message?: string;
  Message?: string;
  error?: { code?: string; name?: string; description?: string };
  Error?: { Code?: string; Name?: string; Description?: string };
  errors?: unknown;
  Errors?: unknown;
};

type RawFaqItem = Partial<FaqItem> & {
  Id?: string;
  Title?: string;
  Description?: string;
  IsActive?: boolean;
};

const FAQ_ENDPOINT = "/api/faq";
const ADMIN_FAQ_ENDPOINT = "/api/admin/faq";

let adminFaqCache: FaqItem[] | null = null;
let adminFaqCacheToken = "";

function getAuthToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("auth-token")?.replace(/^Bearer\s+/i, "") ?? ""
    : "";
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();

  return {
    Accept: "application/json, text/plain, */*",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function collectMessages(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectMessages);

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(
      collectMessages,
    );
  }

  return [];
}

function getErrorMessage(data: ApiEnvelope, fallback: string) {
  const messages = [
    data.message,
    data.Message,
    data.detail,
    data.error?.name,
    data.error?.description,
    data.Error?.Name,
    data.Error?.Description,
    ...collectMessages(data.errors),
    ...collectMessages(data.Errors),
  ].filter(Boolean);

  return messages.length ? messages.join(" ") : fallback;
}

async function parseResponse<T>(
  response: Response,
  fallback: string,
): Promise<ApiEnvelope<T>> {
  const text = await response.text();
  let data: ApiEnvelope<T> = {};

  if (text) {
    try {
      data = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      if (!response.ok) throw new Error(text);
    }
  }

  const isSuccess = data.isSuccess ?? data.IsSuccess;
  const isFailure = data.isFailure ?? data.IsFailure;

  if (!response.ok || isSuccess === false || (isSuccess !== true && isFailure === true)) {
    throw new Error(getErrorMessage(data, fallback));
  }

  return data;
}

function normalizeFaqItem(item: RawFaqItem): FaqItem {
  return {
    id: item.id ?? item.Id ?? "",
    title: item.title ?? item.Title ?? "",
    description: item.description ?? item.Description ?? "",
    isActive: item.isActive ?? item.IsActive ?? true,
  };
}

async function requestFaq<T>(
  endpoint: string,
  options: RequestInit,
  fallback: string,
) {
  const response = await dotNet10ApiFetch(endpoint, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  return parseResponse<T>(response, fallback);
}

export async function fetchFaq(signal?: AbortSignal): Promise<FaqItem[]> {
  const data = await requestFaq<RawFaqItem[]>(
    FAQ_ENDPOINT,
    { method: "GET", signal },
    "دریافت سوالات متداول ناموفق بود.",
  );

  const value = data.value ?? data.Value ?? [];
  if (!Array.isArray(value)) throw new Error("ساختار سوالات متداول معتبر نیست.");

  return value.map(normalizeFaqItem).filter((item) => item.isActive);
}

export async function fetchAdminFaq(
  signal?: AbortSignal,
  options?: { force?: boolean },
): Promise<FaqItem[]> {
  const token = getAuthToken();
  if (!options?.force && adminFaqCache && adminFaqCacheToken === token) {
    return adminFaqCache;
  }

  const data = await requestFaq<RawFaqItem[]>(
    ADMIN_FAQ_ENDPOINT,
    { method: "GET", signal },
    "دریافت سوالات ثبت شده ناموفق بود.",
  );

  const value = data.value ?? data.Value ?? [];
  if (!Array.isArray(value)) throw new Error("ساختار سوالات ثبت شده معتبر نیست.");

  const items = value.map(normalizeFaqItem);
  adminFaqCache = items;
  adminFaqCacheToken = token;

  return items;
}

export async function createFaq(input: FaqInput): Promise<void> {
  await requestFaq(
    ADMIN_FAQ_ENDPOINT,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    "ثبت سوال متداول ناموفق بود.",
  );
  adminFaqCache = null;
}

export async function updateFaq(id: string, input: FaqInput): Promise<void> {
  await requestFaq(
    ADMIN_FAQ_ENDPOINT,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...input }),
    },
    "ویرایش سوال متداول ناموفق بود.",
  );
  adminFaqCache = null;
}

export async function deleteFaq(id: string): Promise<void> {
  await requestFaq(
    `${ADMIN_FAQ_ENDPOINT}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    "حذف سوال متداول ناموفق بود.",
  );
  adminFaqCache = adminFaqCache?.filter((item) => item.id !== id) ?? null;
}

export async function changeFaqStatus(id: string): Promise<void> {
  await requestFaq(
    `${ADMIN_FAQ_ENDPOINT}/${encodeURIComponent(id)}/status`,
    { method: "PATCH" },
    "تغییر وضعیت سوال متداول ناموفق بود.",
  );
  adminFaqCache =
    adminFaqCache?.map((item) =>
      item.id === id ? { ...item, isActive: !item.isActive } : item,
    ) ?? null;
}

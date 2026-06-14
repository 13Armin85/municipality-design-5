import { dotNet10ApiFetch } from "./api";

export interface NewsGroup {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface NewsGroupInput {
  name: string;
  description: string;
}

type ApiEnvelope<T = unknown> = {
  isSuccess?: boolean;
  IsSuccess?: boolean;
  isFailure?: boolean;
  IsFailure?: boolean;
  error?: { code?: string; name?: string; description?: string };
  Error?: { Description?: string };
  value?: T;
  Value?: T;
};

const NEWS_GROUPS_ENDPOINT = "/api/NewsGroups";
const ADMIN_NEWS_GROUPS_ENDPOINT = `${NEWS_GROUPS_ENDPOINT}/admin`;

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("auth-token")?.replace(/^Bearer\s+/i, "")
      : null;

  return {
    Accept: "text/plain",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse<T>(response: Response): Promise<ApiEnvelope<T>> {
  const text = await response.text();
  let data: ApiEnvelope<T> = {};

  if (response.status === 405) {
    throw new Error(
      "سرور IIS متدهای PUT و DELETE را مسدود کرده است. WebDAV یا محدودیت HTTP Verbs باید روی سرور API غیرفعال شود.",
    );
  }

  if (text) {
    try {
      data = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      if (!response.ok) throw new Error(text);
    }
  }

  const isSuccess = data.isSuccess ?? data.IsSuccess;
  const isFailure = data.isFailure ?? data.IsFailure;

  if (!response.ok || isSuccess === false || isFailure === true) {
    throw new Error(
      data.error?.name ||
        data.error?.description ||
        data.Error?.Description ||
        "عملیات دسته‌بندی اخبار با خطا مواجه شد.",
    );
  }

  return data;
}

export async function fetchPublicNewsGroups(
  signal?: AbortSignal,
): Promise<NewsGroup[]> {
  const response = await dotNet10ApiFetch(NEWS_GROUPS_ENDPOINT, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await parseResponse<NewsGroup[]>(response);
  return (data.value ?? data.Value ?? []).filter((group) => group.isActive);
}

export async function fetchAdminNewsGroups(
  signal?: AbortSignal,
): Promise<NewsGroup[]> {
  const response = await dotNet10ApiFetch(ADMIN_NEWS_GROUPS_ENDPOINT, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await parseResponse<NewsGroup[]>(response);
  return data.value ?? data.Value ?? [];
}

export async function createNewsGroup(group: NewsGroupInput): Promise<void> {
  const response = await dotNet10ApiFetch(NEWS_GROUPS_ENDPOINT, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: group.name,
      description: group.description,
    }),
  });
  await parseResponse(response);
}

export async function updateNewsGroup(
  id: string,
  group: NewsGroupInput,
): Promise<void> {
  const response = await dotNet10ApiFetch(NEWS_GROUPS_ENDPOINT, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      name: group.name,
      description: group.description,
    }),
  });
  await parseResponse(response);
}

export async function deleteNewsGroup(id: string): Promise<void> {
  const response = await dotNet10ApiFetch(NEWS_GROUPS_ENDPOINT, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  await parseResponse(response);
}

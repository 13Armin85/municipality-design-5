import { dotNet10ApiFetch } from "./api";
import { AUTH_TOKEN_KEY } from "../utils/authStorage";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  isRead: boolean;
}

type ApiEnvelope<T = unknown> = {
  isSuccess?: boolean;
  IsSuccess?: boolean;
  isFailure?: boolean;
  IsFailure?: boolean;
  value?: T;
  Value?: T;
  error?: { code?: string; name?: string; description?: string };
  Error?: { Code?: string; Name?: string; Description?: string };
  message?: string;
  Message?: string;
};

type RawNotification = {
  id?: string;
  Id?: string;
  title?: string;
  Title?: string;
  subject?: string;
  Subject?: string;
  description?: string;
  Description?: string;
  message?: string;
  Message?: string;
  text?: string;
  Text?: string;
  date?: string;
  Date?: string;
  createdAt?: string;
  CreatedAt?: string;
  createDateTime?: string;
  CreateDateTime?: string;
  isRead?: boolean;
  IsRead?: boolean;
  read?: boolean;
  Read?: boolean;
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

async function parseResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<ApiEnvelope<T> | T> {
  const text = await response.text();
  let payload: ApiEnvelope<T> | T = {} as ApiEnvelope<T>;

  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T> | T;
    } catch {
      if (!response.ok) throw new Error(text);
    }
  }

  const envelope = payload as ApiEnvelope<T>;
  const isSuccess = envelope.isSuccess ?? envelope.IsSuccess;
  const isFailure = envelope.isFailure ?? envelope.IsFailure;

  if (
    !response.ok ||
    isSuccess === false ||
    (isSuccess !== true && isFailure === true)
  ) {
    throw new Error(
      envelope.error?.name ||
        envelope.error?.description ||
        envelope.Error?.Name ||
        envelope.Error?.Description ||
        envelope.message ||
        envelope.Message ||
        fallbackMessage,
    );
  }

  return payload;
}

function unwrapValue<T>(payload: ApiEnvelope<T> | T): T {
  const envelope = payload as ApiEnvelope<T>;
  return (envelope.value ?? envelope.Value ?? payload) as T;
}

const formatNotificationTime = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function normalizeNotification(item: RawNotification): NotificationItem {
  const id = item.id ?? item.Id ?? crypto.randomUUID();
  const date =
    item.date ??
    item.Date ??
    item.createdAt ??
    item.CreatedAt ??
    item.createDateTime ??
    item.CreateDateTime ??
    "";
  const description =
    item.description ??
    item.Description ??
    item.message ??
    item.Message ??
    item.text ??
    item.Text ??
    "";

  return {
    id,
    title:
      item.title ??
      item.Title ??
      item.subject ??
      item.Subject ??
      description ??
      "اعلان",
    description,
    date,
    time: formatNotificationTime(date),
    isRead: item.isRead ?? item.IsRead ?? item.read ?? item.Read ?? false,
  };
}

export async function fetchNotifications(
  signal?: AbortSignal,
): Promise<NotificationItem[]> {
  const response = await dotNet10ApiFetch("/api/notifications", {
    method: "GET",
    signal,
    headers: getAuthHeaders(),
  });
  const payload = await parseResponse<RawNotification[]>(
    response,
    "دریافت اعلان‌ها ناموفق بود.",
  );
  const value = unwrapValue(payload);

  if (!Array.isArray(value)) return [];
  return value.map(normalizeNotification);
}

export async function markNotificationRead(id: string): Promise<void> {
  const endpoint = `/api/notifications?id=${encodeURIComponent(id)}`;
  const response = await dotNet10ApiFetch(endpoint, {
    method: "POST",
    headers: getAuthHeaders(),
    body: "",
  });

  await parseResponse(response, "خواندن اعلان ناموفق بود.");
}

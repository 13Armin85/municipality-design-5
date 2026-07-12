import { dotNet10ApiFetch } from "./api";
import { AUTH_TOKEN_KEY } from "../utils/authStorage";

export interface ActivityItem {
  title: string;
  status: string;
  description: string;
  date: string;
  displayDate: string;
}

type RawActivity = {
  title?: string;
  Title?: string;
  status?: string;
  Status?: string;
  description?: string;
  Description?: string;
  date?: string;
  Date?: string;
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

function formatActivityDate(value: string) {
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
}

function normalizeActivity(item: RawActivity): ActivityItem {
  const date = item.date ?? item.Date ?? "";

  return {
    title: item.title ?? item.Title ?? "فعالیت",
    status: item.status ?? item.Status ?? "",
    description: item.description ?? item.Description ?? "",
    date,
    displayDate: formatActivityDate(date),
  };
}

export async function fetchActivities(
  signal?: AbortSignal,
): Promise<ActivityItem[]> {
  const response = await dotNet10ApiFetch("/api/activities", {
    method: "GET",
    signal,
    headers: getAuthHeaders(),
  });
  const text = await response.text();
  let payload: unknown = [];

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      if (!response.ok) throw new Error(text);
    }
  }

  if (!response.ok) throw new Error("دریافت فعالیت‌های اخیر ناموفق بود.");

  const items = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { value?: unknown[] }).value)
      ? (payload as { value: unknown[] }).value
      : [];

  return items.map((item) => normalizeActivity(item as RawActivity));
}

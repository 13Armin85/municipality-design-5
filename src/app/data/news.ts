import { dotNet10ApiFetch, dotNet10ApiUrl } from "./api";
import type { ApiResponse } from "../utils/apiResponseHandler";

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  time: string;
  category: string;
  publishAt?: string;
  imageUrl?: string;
}

export interface AdminNewsItem extends NewsItem {
  groupId: string;
  description: string;
  shortDescription: string;
  picture: string;
  publishDate: string;
  publishTime: string;
  isActive: boolean;
}

export interface NewsInput {
  groupId: string;
  title: string;
  description: string;
  shortDescription: string;
  picture: string;
  publishDate: string;
  publishTime: string;
}

interface NewsApiItem {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  description: string;
  shortDescription: string;
  picture: string;
  publishDate: string;
  publishTime: string;
  isActive: boolean;
}

interface ProblemDetails {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

const NEWS_ENDPOINT = "/api/News";
const ADMIN_NEWS_ENDPOINT = `${NEWS_ENDPOINT}/admin`;

const formatPublishDate = (value: string) => {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const formatPublishTime = (value: string) => {
  const match = value.match(/^(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : value;
};

const getBase64ImageMimeType = (value: string) => {
  if (value.startsWith("/9j/")) return "image/jpeg";
  if (value.startsWith("iVBORw0KGgo")) return "image/png";
  if (value.startsWith("R0lGOD")) return "image/gif";
  if (value.startsWith("UklGR")) return "image/webp";
  return null;
};

const resolvePictureUrl = (picture: string) => {
  const value = picture?.trim();
  if (!value) return undefined;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;

  const mimeType = getBase64ImageMimeType(value);
  if (mimeType) return `data:${mimeType};base64,${value}`;

  return dotNet10ApiUrl(value);
};

const toParagraphs = (description: string, fallback: string) => {
  const text = description?.trim() || fallback?.trim();
  if (!text) return [];

  return text
    .split(/\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const getPublishAt = (item: NewsApiItem) => {
  if (!item.publishDate) return "";
  if (!item.publishTime) return item.publishDate;

  // TimeOnly values may include Z, but the selected publication clock time is local.
  return `${item.publishDate}T${item.publishTime.replace(/Z$/i, "")}`;
};

const mapNewsItem = (item: NewsApiItem): AdminNewsItem => ({
  id: item.id,
  slug: item.id,
  title: item.title?.trim() || "بدون عنوان",
  excerpt: item.shortDescription?.trim() || item.description?.trim() || "",
  content: toParagraphs(item.description, item.shortDescription),
  date: formatPublishDate(item.publishDate),
  time: formatPublishTime(item.publishTime),
  category: item.groupName?.trim() || "خبر",
  publishAt: getPublishAt(item),
  imageUrl: resolvePictureUrl(item.picture),
  groupId: item.groupId,
  description: item.description ?? "",
  shortDescription: item.shortDescription ?? "",
  picture: item.picture ?? "",
  publishDate: item.publishDate ?? "",
  publishTime: item.publishTime ?? "",
  isActive: item.isActive,
});

const getPublishTimestamp = (item: NewsApiItem) => {
  const timestamp = new Date(getPublishAt(item)).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

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

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const text = await response.text();
  let payload: ApiResponse<T> & ProblemDetails = {};

  if (response.status === 405) {
    throw new Error(
      "سرور متدهای PUT و DELETE را مسدود کرده است. تنظیمات WebDAV یا HTTP Verbs سرور API باید بررسی شود.",
    );
  }

  if (text) {
    try {
      payload = JSON.parse(text) as ApiResponse<T> & ProblemDetails;
    } catch {
      if (!response.ok) throw new Error(text);
    }
  }

  const isSuccess = payload.isSuccess ?? payload.IsSuccess;
  const isFailure = payload.isFailure ?? payload.IsFailure;

  if (!response.ok || isSuccess === false || isFailure === true) {
    const validationMessage = payload.errors
      ? Object.entries(payload.errors)
          .flatMap(([field, messages]) =>
            messages.filter(Boolean).map((message) => `${field}: ${message}`),
          )
          .join(" ")
      : "";

    throw new Error(
      validationMessage ||
        payload.detail ||
        payload.error?.name ||
        payload.error?.description ||
        payload.Error?.Description ||
        payload.title ||
        "عملیات اخبار با خطا مواجه شد.",
    );
  }

  return payload;
}

async function requestNews<T>(
  endpoint: string,
  options: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await dotNet10ApiFetch(endpoint, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  return parseResponse<T>(response);
}

export async function fetchNews(signal?: AbortSignal): Promise<NewsItem[]> {
  const payload = await requestNews<NewsApiItem[]>(NEWS_ENDPOINT, {
    method: "GET",
    signal,
  });
  const value = payload.value ?? payload.Value;

  if (!Array.isArray(value)) throw new Error("دریافت اخبار ناموفق بود.");

  return value
    .filter((item) => item.isActive)
    .sort((a, b) => getPublishTimestamp(b) - getPublishTimestamp(a))
    .map(mapNewsItem);
}

export async function fetchAdminNews(
  signal?: AbortSignal,
): Promise<AdminNewsItem[]> {
  const payload = await requestNews<NewsApiItem[]>(ADMIN_NEWS_ENDPOINT, {
    method: "GET",
    signal,
  });
  const value = payload.value ?? payload.Value;

  if (!Array.isArray(value)) {
    throw new Error("دریافت خبرهای ثبت شده ناموفق بود.");
  }

  return value
    .sort((a, b) => getPublishTimestamp(b) - getPublishTimestamp(a))
    .map(mapNewsItem);
}

export async function createNews(news: NewsInput): Promise<void> {
  await requestNews(NEWS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(news),
  });
}

export async function updateNews(
  id: string,
  news: NewsInput,
): Promise<void> {
  await requestNews(NEWS_ENDPOINT, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...news }),
  });
}

export async function deleteNews(id: string): Promise<void> {
  await requestNews(NEWS_ENDPOINT, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function changeNewsStatus(id: string): Promise<void> {
  await requestNews(`${NEWS_ENDPOINT}/change-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

const normalizeDateTime = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isNewsPublished = (item: NewsItem, now = new Date()) => {
  const publishDate = normalizeDateTime(item.publishAt);
  return !publishDate || publishDate.getTime() <= now.getTime();
};

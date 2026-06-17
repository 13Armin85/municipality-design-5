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
  picture?: string | File | null;
  publishDateTime: string;
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

let adminNewsCache: AdminNewsItem[] | null = null;
let adminNewsCacheToken = "";

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
  const cleanTime = item.publishTime.replace(/Z$/i, "");
  const separator = /^\d{4}-\d{2}-\d{2}/.test(item.publishDate) ? "T" : " ";
  return `${item.publishDate}${separator}${cleanTime}`;
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

function fromJalali(jy: number, jm: number, jd: number): Date {
  const jy2 = jy - 979;
  const jm2 = jm - 1;
  const jd2 = jd - 1;

  let jDayNo =
    365 * jy2 + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4);

  for (let i = 0; i < jm2; i++) jDayNo += i < 6 ? 31 : 30;
  jDayNo += jd2;

  const gDayNo = jDayNo + 79;
  let gy = 1600 + 400 * Math.floor(gDayNo / 146097);
  let days = gDayNo % 146097;

  let leap = true;
  if (days >= 36525) {
    days--;
    gy += 100 * Math.floor(days / 36524);
    days %= 36524;
    if (days >= 365) days++;
    else leap = false;
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days >= 366) {
    leap = false;
    days--;
    gy += Math.floor(days / 365);
    days %= 365;
  }

  const gDaysInMonth = [
    31,
    leap ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  for (let i = 0; i < 12 && days >= gDaysInMonth[i]; i++) {
    days -= gDaysInMonth[i];
    gm = i + 1;
  }
  return new Date(gy, gm, days + 1);
}

const parsePublishDateTime = (value?: string) => {
  if (!value) return null;

  const jalaliMatch = value.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
  );

  if (jalaliMatch) {
    const [, year, month, day, hour = "0", minute = "0", second = "0"] =
      jalaliMatch;
    const date = fromJalali(Number(year), Number(month), Number(day));
    date.setHours(Number(hour), Number(minute), Number(second), 0);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getPublishTimestamp = (item: NewsApiItem) => {
  return parsePublishDateTime(getPublishAt(item))?.getTime() ?? 0;
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

function getAuthTokenKey() {
  return typeof window !== "undefined"
    ? (localStorage.getItem("auth-token")?.replace(/^Bearer\s+/i, "") ?? "")
    : "";
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

  if (!response.ok || isSuccess === false || (isSuccess !== true && isFailure === true)) {
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
  options?: { force?: boolean },
): Promise<AdminNewsItem[]> {
  const tokenKey = getAuthTokenKey();

  if (
    !options?.force &&
    adminNewsCache &&
    adminNewsCacheToken === tokenKey
  ) {
    return adminNewsCache;
  }

  const payload = await requestNews<NewsApiItem[]>(ADMIN_NEWS_ENDPOINT, {
    method: "GET",
    signal,
  });
  const value = payload.value ?? payload.Value;

  if (!Array.isArray(value)) {
    throw new Error("دریافت خبرهای ثبت شده ناموفق بود.");
  }

  const items = value
    .sort((a, b) => getPublishTimestamp(b) - getPublishTimestamp(a))
    .map(mapNewsItem);

  adminNewsCache = items;
  adminNewsCacheToken = tokenKey;

  return items;
}

export async function createNews(news: NewsInput): Promise<void> {
  await requestNews(NEWS_ENDPOINT, {
    method: "POST",
    body: toNewsFormData(news),
  });
  adminNewsCache = null;
}

export async function updateNews(
  id: string,
  news: NewsInput,
): Promise<void> {
  await requestNews(NEWS_ENDPOINT, {
    method: "PUT",
    body: toNewsFormData(news, id),
  });
  adminNewsCache = null;
}

export async function deleteNews(id: string): Promise<void> {
  await requestNews(`${NEWS_ENDPOINT}/${id}`, {
    method: "DELETE",
  });
  adminNewsCache = adminNewsCache?.filter((item) => item.id !== id) ?? null;
}

export async function changeNewsStatus(id: string): Promise<void> {
  await requestNews(`${NEWS_ENDPOINT}/${id}/status`, {
    method: "PATCH",
  });
  adminNewsCache =
    adminNewsCache?.map((item) =>
      item.id === id ? { ...item, isActive: !item.isActive } : item,
    ) ?? null;
}

function toNewsFormData(news: NewsInput, id?: string) {
  const formData = new FormData();

  if (id) formData.append("Id", id);
  formData.append("GroupId", news.groupId);
  formData.append("Title", news.title);
  formData.append("Description", news.description);
  formData.append("ShortDescription", news.shortDescription);

  if (typeof File !== "undefined" && news.picture instanceof File) {
    formData.append("Picture", news.picture, news.picture.name);
  } else {
    formData.append("Picture", "");
  }

  formData.append("PublishDateTime", news.publishDateTime);

  return formData;
}

const normalizeDateTime = (value?: string) => {
  return parsePublishDateTime(value);
};

export const isNewsPublished = (item: NewsItem, now = new Date()) => {
  const publishDate = normalizeDateTime(item.publishAt);
  return !publishDate || publishDate.getTime() <= now.getTime();
};

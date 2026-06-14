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

export const adminNewsStorageKey = "municipality-admin-news-items";

export const newsCategories = [
  "اطلاعیه",
  "خبر",
  "خدمات",
  "پشتیبانی",
  "گزارش",
  "عمران",
  "فرهنگی",
];

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

const resolvePictureUrl = (picture: string) => {
  const value = picture?.trim();
  if (!value) return undefined;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;

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

const mapNewsItem = (item: NewsApiItem): NewsItem => ({
  id: item.id,
  slug: item.id,
  title: item.title?.trim() || "بدون عنوان",
  excerpt: item.shortDescription?.trim() || item.description?.trim() || "",
  content: toParagraphs(item.description, item.shortDescription),
  date: formatPublishDate(item.publishDate),
  time: formatPublishTime(item.publishTime),
  category: item.groupName?.trim() || "خبر",
  publishAt:
    item.publishDate && item.publishTime
      ? `${item.publishDate}T${item.publishTime}`
      : item.publishDate,
  imageUrl: resolvePictureUrl(item.picture),
});

const getPublishTimestamp = (item: NewsApiItem) => {
  const value =
    item.publishDate && item.publishTime
      ? `${item.publishDate}T${item.publishTime}`
      : item.publishDate;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export async function fetchNews(signal?: AbortSignal): Promise<NewsItem[]> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("auth-token")?.replace(/^Bearer\s+/i, "")
      : null;

  const response = await dotNet10ApiFetch("/api/News", {
    method: "GET",
    headers: {
      Accept: "text/plain",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`News request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<NewsApiItem[]>;
  const isSuccess = payload.isSuccess ?? payload.IsSuccess;
  const isFailure = payload.isFailure ?? payload.IsFailure;
  const value = payload.value ?? payload.Value;

  if (isSuccess === false || isFailure === true || !Array.isArray(value)) {
    throw new Error(
      payload.error?.name ||
        payload.error?.description ||
        payload.Error?.Description ||
        "دریافت اخبار ناموفق بود.",
    );
  }

  return value
    .filter((item) => item.isActive)
    .sort((a, b) => getPublishTimestamp(b) - getPublishTimestamp(a))
    .map(mapNewsItem);
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

export const getStoredNewsItems = (): NewsItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(
      localStorage.getItem(adminNewsStorageKey) ?? "[]",
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getAllNewsItems = () => getStoredNewsItems();

export const getVisibleNewsItems = (now = new Date()) =>
  getAllNewsItems().filter((item) => isNewsPublished(item, now));

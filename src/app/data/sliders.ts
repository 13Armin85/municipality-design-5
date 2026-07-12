import { dotNet10ApiFetch, dotNet10ApiUrl } from "./api";
import { AUTH_TOKEN_KEY } from "../utils/authStorage";

export interface SliderItem {
  id: string;
  picture: string;
  imageUrl: string;
  publishDateTime: string;
  isActive: boolean;
}

export interface SliderInput {
  id?: string;
  picture?: File | null;
  publishDateTime: string;
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

type RawSlider = {
  id?: string;
  Id?: string;
  sliderId?: string;
  SliderId?: string;
  sliderID?: string;
  SliderID?: string;
  picture?: string;
  Picture?: string;
  image?: string;
  Image?: string;
  imageUrl?: string;
  ImageUrl?: string;
  publishDateTime?: string;
  PublishDateTime?: string;
  publishDate?: string;
  PublishDate?: string;
  publishTime?: string;
  PublishTime?: string;
  isActive?: boolean;
  IsActive?: boolean;
  status?: boolean;
  Status?: boolean;
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

function getBase64ImageMimeType(value: string) {
  if (value.startsWith("/9j/")) return "image/jpeg";
  if (value.startsWith("iVBOR")) return "image/png";
  if (value.startsWith("R0lG")) return "image/gif";
  if (value.startsWith("UklGR")) return "image/webp";
  return null;
}

export function resolveSliderImageSrc(value: string | null | undefined) {
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

function getPublishDateTime(item: RawSlider) {
  const direct = item.publishDateTime ?? item.PublishDateTime;
  if (direct) return direct;

  const date = item.publishDate ?? item.PublishDate ?? "";
  const time = item.publishTime ?? item.PublishTime ?? "";
  return [date, time].filter(Boolean).join(" ").trim();
}

function getSliderId(item: RawSlider) {
  return (
    item.id ??
    item.Id ??
    item.sliderId ??
    item.SliderId ??
    item.sliderID ??
    item.SliderID ??
    ""
  ).trim();
}

function normalizeSlider(item: RawSlider): SliderItem | null {
  const id = getSliderId(item);
  if (!id) return null;

  const picture =
    item.picture ?? item.Picture ?? item.imageUrl ?? item.ImageUrl ?? item.image ?? item.Image ?? "";

  return {
    id,
    picture,
    imageUrl: resolveSliderImageSrc(picture),
    publishDateTime: getPublishDateTime(item),
    isActive: item.isActive ?? item.IsActive ?? item.status ?? item.Status ?? true,
  };
}

async function requestSliders<T>(
  endpoint: string,
  options: RequestInit,
  fallbackMessage: string,
) {
  const response = await dotNet10ApiFetch(endpoint, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  return parseResponse<T>(response, fallbackMessage);
}

export async function fetchSliders(
  signal?: AbortSignal,
): Promise<SliderItem[]> {
  const payload = await requestSliders<RawSlider[]>(
    "/api/sliders",
    { method: "GET", signal },
    "دریافت اسلایدرها ناموفق بود.",
  );
  const value = unwrapValue(payload);

  if (!Array.isArray(value)) return [];
  return value
    .map(normalizeSlider)
    .filter((item): item is SliderItem => Boolean(item?.isActive && item.imageUrl));
}

export async function fetchAdminSliders(
  signal?: AbortSignal,
): Promise<SliderItem[]> {
  const payload = await requestSliders<RawSlider[]>(
    "/api/admin/sliders",
    { method: "GET", signal },
    "دریافت اسلایدرهای پنل ناموفق بود.",
  );
  const value = unwrapValue(payload);

  if (!Array.isArray(value)) return [];
  return value
    .map(normalizeSlider)
    .filter((item): item is SliderItem => item !== null);
}

function toSliderFormData(
  input: SliderInput,
  options: { includePicture?: boolean } = {},
) {
  const formData = new FormData();
  const includePicture = options.includePicture ?? true;

  if (input.id) formData.append("Id", input.id);
  if (includePicture && input.picture instanceof File && input.picture.size > 0) {
    formData.append("Picture", input.picture, input.picture.name);
  }
  formData.append("PublishDateTime", input.publishDateTime);

  return formData;
}

export async function createSlider(input: SliderInput): Promise<void> {
  await requestSliders(
    "/api/admin/sliders",
    {
      method: "POST",
      body: toSliderFormData(input),
    },
    "ثبت اسلایدر ناموفق بود.",
  );
}

export async function updateSlider(input: SliderInput): Promise<void> {
  if (!input.id?.trim()) throw new Error("شناسه اسلایدر معتبر نیست.");

  await requestSliders(
    "/api/admin/sliders",
    {
      method: "PUT",
      body: toSliderFormData(input, { includePicture: false }),
    },
    "ویرایش اسلایدر ناموفق بود.",
  );
}

export async function deleteSlider(id: string): Promise<void> {
  const sliderId = id.trim();
  if (!sliderId) throw new Error("شناسه اسلایدر معتبر نیست.");

  await requestSliders(
    `/api/admin/sliders/${encodeURIComponent(sliderId)}`,
    { method: "DELETE" },
    "حذف اسلایدر ناموفق بود.",
  );
}

export async function changeSliderStatus(id: string): Promise<void> {
  const sliderId = id.trim();
  if (!sliderId) throw new Error("شناسه اسلایدر معتبر نیست.");

  await requestSliders(
    `/api/admin/sliders/${encodeURIComponent(sliderId)}/status`,
    { method: "PATCH" },
    "تغییر وضعیت اسلایدر ناموفق بود.",
  );
}

import { dotNet10ApiFetch } from "./api";
import { AUTH_TOKEN_KEY } from "../utils/authStorage";

type ApiEnvelope<T = unknown> = {
  isSuccess?: boolean;
  IsSuccess?: boolean;
  isFailure?: boolean;
  IsFailure?: boolean;
  error?: { code?: string; name?: string; description?: string };
  Error?: { Description?: string; Name?: string };
  value?: T;
  Value?: T;
};

export interface ShahkarSettings {
  id: string;
  url: string;
  token: string;
}

export interface SmsSettings {
  id: string;
  type: number | null;
  userName: string;
  password: string;
  systemNumber: string;
}

export interface SmsPanelType {
  id: number;
  name: string;
}

export interface ShahkarLog {
  id: string;
  mobile: string;
  nationalCode: string;
  isMatched: string;
  errorMessage: string;
}

export interface SmsLog {
  id: string;
  mobile: string;
  message: string;
  sendDate: string;
  status: string;
  errorMessage: string;
}

const SHAHKAR_ENDPOINT = "/api/admin/shahkar";
const SMS_ENDPOINT = "/api/admin/sms";
const SHAHKAR_LOGS_ENDPOINT = `${SHAHKAR_ENDPOINT}/logs`;
const SMS_LOGS_ENDPOINT = `${SMS_ENDPOINT}/logs`;
const SMS_PANEL_TYPE_ENDPOINT = `${SMS_ENDPOINT}/panelType`;

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(AUTH_TOKEN_KEY)?.replace(/^Bearer\s+/i, "")
      : null;

  return {
    Accept: "text/plain",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse<T>(
  response: Response,
  fallbackMessage: string,
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
    throw new Error(
      data.error?.name ||
        data.error?.description ||
        data.Error?.Name ||
        data.Error?.Description ||
        fallbackMessage,
    );
  }

  return data;
}

async function requestAdminSettings<T>(
  endpoint: string,
  options: RequestInit,
  fallbackMessage: string,
): Promise<ApiEnvelope<T>> {
  const response = await dotNet10ApiFetch(endpoint, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  return parseResponse<T>(response, fallbackMessage);
}

export async function fetchShahkarSettings(
  signal?: AbortSignal,
): Promise<ShahkarSettings> {
  const data = await requestAdminSettings<ShahkarSettings>(
    SHAHKAR_ENDPOINT,
    { method: "GET", signal },
    "دریافت تنظیمات شاهکار ناموفق بود.",
  );

  return data.value ?? data.Value ?? { id: "", url: "", token: "" };
}

export async function fetchShahkarLogs(
  signal?: AbortSignal,
): Promise<ShahkarLog[]> {
  const data = (await requestAdminSettings<ShahkarLog[]>(
    SHAHKAR_LOGS_ENDPOINT,
    { method: "GET", signal },
    "دریافت گزارشات شاهکار ناموفق بود.",
  )) as ApiEnvelope<ShahkarLog[]> | ShahkarLog[];

  if (Array.isArray(data)) return data;
  return data.value ?? data.Value ?? [];
}

export async function saveShahkarSettings(
  settings: ShahkarSettings,
): Promise<void> {
  await requestAdminSettings(
    SHAHKAR_ENDPOINT,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    },
    "ذخیره تنظیمات شاهکار ناموفق بود.",
  );
}

export async function fetchSmsSettings(
  signal?: AbortSignal,
): Promise<SmsSettings> {
  const data = await requestAdminSettings<SmsSettings>(
    SMS_ENDPOINT,
    { method: "GET", signal },
    "دریافت تنظیمات پنل پیامکی ناموفق بود.",
  );

  return (
    data.value ??
    data.Value ?? { id: "", type: null, userName: "", password: "", systemNumber: "" }
  );
}

export async function fetchSmsPanelTypes(
  signal?: AbortSignal,
): Promise<SmsPanelType[]> {
  const response = await dotNet10ApiFetch(SMS_PANEL_TYPE_ENDPOINT, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "دریافت نوع پنل پیامکی ناموفق بود.");
  }

  if (!text) return [];

  try {
    const data = JSON.parse(text) as SmsPanelType[] | ApiEnvelope<SmsPanelType[]>;
    if (Array.isArray(data)) return data;
    return data.value ?? data.Value ?? [];
  } catch {
    throw new Error("دریافت نوع پنل پیامکی ناموفق بود.");
  }
}

export async function fetchSmsLogs(signal?: AbortSignal): Promise<SmsLog[]> {
  const data = (await requestAdminSettings<SmsLog[]>(
    SMS_LOGS_ENDPOINT,
    { method: "GET", signal },
    "دریافت گزارشات پنل پیامکی ناموفق بود.",
  )) as ApiEnvelope<SmsLog[]> | SmsLog[];

  if (Array.isArray(data)) return data;
  return data.value ?? data.Value ?? [];
}

export async function saveSmsSettings(
  settings: SmsSettings & { type: number },
): Promise<void> {
  await requestAdminSettings(
    SMS_ENDPOINT,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    },
    "ذخیره تنظیمات پنل پیامکی ناموفق بود.",
  );
}

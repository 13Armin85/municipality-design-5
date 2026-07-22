import { paymentApiFetch } from "../data/api";

export interface PaymentIdentifiers {
  paymentId: string;
  billId: string;
}

export interface PaymentGatewayRedirect {
  refId: string;
  redirectUrl: string;
}

type PaymentApiEnvelope<T = unknown> = {
  isSuccess?: boolean;
  IsSuccess?: boolean;
  isFailure?: boolean;
  IsFailure?: boolean;
  value?: T;
  Value?: T;
  error?: {
    code?: string;
    name?: string;
    description?: string;
  };
  Error?: {
    Code?: string;
    Name?: string;
    Description?: string;
  };
};

const PAYMENT_TOKEN_ENDPOINT = "/api/payment/token";
const DEFAULT_PAYMENT_GATEWAY_URL = "http://asan.shaparak.ir";
const PAYMENT_GATEWAY_HOSTNAME = "asan.shaparak.ir";

const paymentIdAliases = new Set([
  "paymentid",
  "payid",
  "payno",
  "paymentidentifier",
  "pardakhtid",
  "shomarepardakht",
  "shenasepardakht",
  "shenasepayment",
  "idpardakht",
  "shpardakht",
  "شمارهپرداخت",
  "شناسهپرداخت",
]);

const billIdAliases = new Set([
  "billid",
  "billno",
  "billidentifier",
  "ghabzid",
  "shomareghabz",
  "shenaseghabz",
  "idghabz",
  "shghabz",
  "شمارهقبض",
  "شناسهقبض",
]);

const labelAliases = new Set(["label", "title", "name", "key", "caption"]);
const valueAliases = new Set(["value", "text", "id", "code"]);

const normalizeFieldName = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[\s_\-.:/\\\u200c\u200f]+/g, "");

const toEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

const normalizeIdentifier = (value: unknown): string | null => {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "bigint") {
    return null;
  }

  const normalized = toEnglishDigits(String(value)).replace(/[\s\-_]/g, "");
  if (!/^\d+$/.test(normalized) || /^0+$/.test(normalized)) return null;

  return normalized;
};

/**
 * پاسخ سرویس نوسازی در نسخه‌های مختلف API شکل ثابتی نداشته است؛ این تابع
 * شناسه‌ها را هم از فیلدهای مستقیم و هم از آیتم‌های label/value پیدا می‌کند.
 */
export function extractPaymentIdentifiers(source: unknown): PaymentIdentifiers | null {
  let paymentId: string | null = null;
  let billId: string | null = null;
  const visited = new WeakSet<object>();

  const assignIdentifier = (key: unknown, value: unknown) => {
    const normalizedKey = normalizeFieldName(key);
    const normalizedValue = normalizeIdentifier(value);
    if (!normalizedValue) return;

    if (!paymentId && paymentIdAliases.has(normalizedKey)) {
      paymentId = normalizedValue;
    }
    if (!billId && billIdAliases.has(normalizedKey)) {
      billId = normalizedValue;
    }
  };

  const visit = (value: unknown, depth: number) => {
    if (depth > 7 || value === null || typeof value !== "object") return;
    if (visited.has(value)) return;
    visited.add(value);

    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1));
      return;
    }

    const entries = Object.entries(value as Record<string, unknown>);
    entries.forEach(([key, item]) => assignIdentifier(key, item));

    const labelEntry = entries.find(([key]) => labelAliases.has(normalizeFieldName(key)));
    const valueEntry = entries.find(([key]) => valueAliases.has(normalizeFieldName(key)));
    if (labelEntry && valueEntry) {
      assignIdentifier(labelEntry[1], valueEntry[1]);
    }

    entries.forEach(([, item]) => visit(item, depth + 1));
  };

  visit(source, 0);
  return paymentId && billId ? { paymentId, billId } : null;
}

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text().catch(() => "");
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const firstStringByKey = (source: unknown, keys: Set<string>): string | null => {
  if (source === null || source === undefined) return null;
  if (typeof source === "string") return source.trim() || null;
  if (typeof source !== "object") return null;

  const queue: unknown[] = [source];
  const visited = new WeakSet<object>();
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== "object" || visited.has(current)) continue;
    visited.add(current);

    for (const [key, value] of Object.entries(current as Record<string, unknown>)) {
      if (keys.has(normalizeFieldName(key)) && typeof value === "string" && value.trim()) {
        return value.trim();
      }
      if (value && typeof value === "object") queue.push(value);
    }
  }

  return null;
};

const isPaymentEnvelope = (value: unknown): value is PaymentApiEnvelope =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const getErrorDetails = (payload: unknown) => {
  if (!isPaymentEnvelope(payload)) return { code: "", message: "" };

  return {
    code: payload.error?.code ?? payload.Error?.Code ?? "",
    message:
      payload.error?.name ??
      payload.error?.description ??
      payload.Error?.Name ??
      payload.Error?.Description ??
      "",
  };
};

const friendlyPaymentError = (status: number, payload: unknown) => {
  const { code, message } = getErrorDetails(payload);
  const searchable = `${code} ${message}`.toLocaleLowerCase("en-US");

  if (status === 401) return "نشست کاربری شما منقضی شده است؛ دوباره وارد حساب شوید.";
  if (status === 403) return "شما مجوز لازم برای انجام این پرداخت را ندارید.";
  if (status === 408 || status === 504) {
    return "پاسخی از سرویس پرداخت دریافت نشد؛ کمی بعد دوباره تلاش کنید.";
  }
  if (status === 429) {
    return "تعداد درخواست‌های پرداخت بیش از حد مجاز است؛ کمی بعد دوباره تلاش کنید.";
  }
  if (
    status === 404 ||
    searchable.includes("inquiry.notfound") ||
    searchable.includes("inquiry.not_found") ||
    searchable.includes("could not be converted")
  ) {
    return "اطلاعات قابل پرداختی برای این شناسه قبض و شناسه پرداخت یافت نشد.";
  }
  if (status >= 500) return "سرویس پرداخت موقتاً در دسترس نیست؛ کمی بعد دوباره تلاش کنید.";
  if (/[\u0600-\u06ff]/.test(message)) return message;

  return "دریافت توکن پرداخت انجام نشد؛ شناسه‌های قبض را بررسی و دوباره تلاش کنید.";
};

export async function requestPaymentToken(
  identifiers: PaymentIdentifiers,
  accessToken: string,
): Promise<PaymentGatewayRedirect> {
  const normalizedToken = accessToken.replace(/^Bearer\s+/i, "").trim();
  if (!normalizedToken) {
    throw new Error("برای پرداخت باید وارد حساب کاربری شوید.");
  }

  const paymentId = normalizeIdentifier(identifiers.paymentId);
  const billId = normalizeIdentifier(identifiers.billId);
  if (!paymentId || !billId) {
    throw new Error("شناسه قبض یا شناسه پرداخت معتبر نیست.");
  }

  let response: Response;
  try {
    response = await paymentApiFetch(PAYMENT_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${normalizedToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentId, billId }),
    });
  } catch {
    throw new Error("ارتباط با سرویس پرداخت برقرار نشد؛ اتصال شبکه را بررسی کنید.");
  }

  const payload = await parseResponseBody(response);
  const envelope = isPaymentEnvelope(payload) ? payload : null;
  const isSuccess = envelope?.isSuccess ?? envelope?.IsSuccess;
  const isFailure = envelope?.isFailure ?? envelope?.IsFailure;

  if (!response.ok || isSuccess === false || (isSuccess !== true && isFailure === true)) {
    throw new Error(friendlyPaymentError(response.status, payload));
  }

  const value = envelope?.value ?? envelope?.Value ?? payload;
  const refId = firstStringByKey(
    value,
    new Set(["refid", "token", "paymenttoken", "gatewaytoken", "value"]),
  );

  if (!refId || refId.length > 4096 || /[\s<>"']/.test(refId)) {
    throw new Error("پاسخ سرویس پرداخت معتبر نیست؛ توکن درگاه دریافت نشد.");
  }

  const responseRedirectUrl = firstStringByKey(
    value,
    new Set(["redirecturl", "gatewayurl", "paymenturl"]),
  );
  const redirectUrl =
    responseRedirectUrl ||
    import.meta.env.VITE_PAYMENT_GATEWAY_URL?.trim() ||
    DEFAULT_PAYMENT_GATEWAY_URL;

  return { refId, redirectUrl };
}

/**
 * طبق قرارداد آسان‌پرداخت، endpoint داخلی Pay مقصد callback درگاه است و
 * نباید از مرورگر فراخوانی شود. مرورگر فقط RefId را با POST به درگاه می‌فرستد.
 */
export function redirectToPaymentGateway(refId: string, redirectUrl: string) {
  if (typeof document === "undefined") {
    throw new Error("انتقال به درگاه پرداخت در این محیط امکان‌پذیر نیست.");
  }

  let gatewayUrl: URL;
  try {
    gatewayUrl = new URL(redirectUrl);
  } catch {
    throw new Error("آدرس درگاه پرداخت معتبر نیست.");
  }
  if (
    !["http:", "https:"].includes(gatewayUrl.protocol) ||
    gatewayUrl.hostname.toLocaleLowerCase("en-US") !== PAYMENT_GATEWAY_HOSTNAME ||
    gatewayUrl.port !== "" ||
    gatewayUrl.username ||
    gatewayUrl.password
  ) {
    throw new Error("آدرس بازگشتی درگاه پرداخت معتبر نیست.");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = gatewayUrl.toString();
  form.target = "_self";
  form.acceptCharset = "UTF-8";
  form.style.display = "none";

  const refIdInput = document.createElement("input");
  refIdInput.type = "hidden";
  refIdInput.name = "RefId";
  refIdInput.value = refId;
  form.appendChild(refIdInput);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

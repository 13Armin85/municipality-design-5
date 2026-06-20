// src/data/retreat.ts

import {
  isApiSuccess,
  getApiErrorMessage,
  getApiValue,
  type ApiResponse,
} from "../utils/apiResponseHandler";
import { apiFetch } from "./api";

export interface LabelValueRow {
  label: string;
  value: string;
}

export interface RetreatAreaData {
  originalArea: string;
  reformedArea: string;
  remainingArea: string;
  rows: LabelValueRow[];
}

export interface RetreatDimension {
  title: string;
  rowNumber: string;
  direction: string;
  rows: LabelValueRow[];
}

export interface RetreatSetback {
  title: string;
  rowNumber: string;
  direction: string;
  rows: LabelValueRow[];
}

export interface RetreatDirectionTableRow {
  direction: string;
  passageType: string;
  passageName: string;
  documentSideLength: string;
  documentFrontLength: string;
  currentSideLength: string;
  currentFrontLength: string;
}

export interface RetreatSetbackTableRow {
  direction: string;
  amount: string;
  length: string;
  width: string;
  compliant: string;
}

export interface RetreatData {
  area: RetreatAreaData | null;
  directions: RetreatDimension[];
  setbacks: RetreatSetback[];
  directionRows: RetreatDirectionTableRow[];
  setbackRows: RetreatSetbackTableRow[];
}

const emptyDisplay = "—";

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

const toPersianDigits = (value: string) =>
  value.replace(/\d/g, (digit) => persianDigits[Number(digit)] ?? digit);

const normalizeText = (value: unknown, fallback = emptyDisplay) => {
  if (value === null || value === undefined) return fallback;

  const text = String(value).trim();
  return text.length ? toPersianDigits(text) : fallback;
};

const formatValue = (value: unknown, unit = "") => {
  if (value === null || value === undefined || value === "") return emptyDisplay;

  if (typeof value === "number" && Number.isFinite(value)) {
    const formatted = value.toLocaleString("fa-IR");
    return unit ? `${formatted} ${unit}` : formatted;
  }

  if (typeof value === "boolean") return value ? "بله" : "خیر";

  return normalizeText(value);
};

const firstDefined = (...values: unknown[]) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  for (const key of ["Value", "value", "items", "data", "result", "results"]) {
    if (Array.isArray(data[key])) return data[key];
  }

  return [data];
};

const unwrapObject = (data: any): any | null => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  for (const key of ["Value", "value", "data", "result"]) {
    if (data[key] && typeof data[key] === "object" && !Array.isArray(data[key])) {
      return data[key];
    }
  }

  return data;
};

const createAreaData = (area: any): RetreatAreaData | null => {
  const source = unwrapObject(area);
  if (!source) return null;

  const originalArea = firstDefined(source?.masahat_s, source?.masahat1, source?.originalArea);
  const reformedArea = firstDefined(source?.masahat_e, source?.masahat2, source?.reformedArea);
  const remainingArea = firstDefined(source?.masahat_b, source?.masahatposht, source?.remainingArea);

  return {
    originalArea: formatValue(originalArea, "متر مربع"),
    reformedArea: formatValue(reformedArea, "متر مربع"),
    remainingArea: formatValue(remainingArea, "متر مربع"),
    rows: [
      { label: "مساحت سندی", value: formatValue(originalArea, "متر مربع") },
      { label: "مساحت اصلاحی", value: formatValue(reformedArea, "متر مربع") },
      { label: "مساحت باقیمانده", value: formatValue(remainingArea, "متر مربع") },
    ],
  };
};

const getDirectionTitle = (row: any, index: number) => {
  const direction = normalizeText(row?.jahat_m, "");
  return direction ? `جهت ${direction}` : `جهت ${index + 1}`;
};

const createDirectionRows = (row: any): LabelValueRow[] => [
  { label: "ردیف", value: formatValue(row?.d_radif) },
  { label: "شناسه", value: formatValue(row?.id) },
  { label: "شماره پرونده", value: formatValue(row?.shop) },
  { label: "نام جدول", value: formatValue(row?.mtable_name) },
  { label: "کد جهت", value: formatValue(row?.c_jahat_m) },
  { label: "جهت", value: formatValue(row?.jahat_m) },
  { label: "کد نوع معبر", value: formatValue(row?.c_noe_m) },
  { label: "نوع معبر", value: formatValue(row?.noe_m) },
  { label: "نام معبر", value: formatValue(row?.name_m) },
  { label: "اضلاع جهت", value: formatValue(row?.azla_jahat) },
  { label: "طول بر", value: formatValue(row?.tolbar, "متر") },
  { label: "طول ضلع", value: formatValue(row?.tolzel, "متر") },
  { label: "عرض معبر", value: formatValue(row?.arz_m, "متر") },
  { label: "اضلاع نسبی", value: formatValue(row?.azlanesbi) },
  { label: "طول ضلع سند", value: formatValue(row?.tolzel_s, "متر") },
  { label: "طول بر سند", value: formatValue(row?.tolbar_s, "متر") },
  { label: "عرض معبر در طرح", value: formatValue(row?.mabar_d, "متر") },
  { label: "مساحت ۱", value: formatValue(row?.masahat1, "متر مربع") },
  { label: "مساحت ۲", value: formatValue(row?.masahat2, "متر مربع") },
  { label: "مساحت ۳", value: formatValue(row?.masahat3, "متر مربع") },
  { label: "مساحت پشت", value: formatValue(row?.masahatposht, "متر مربع") },
  { label: "توضیحات", value: formatValue(row?.tozihat) },
];

const createSetbackRows = (row: any): LabelValueRow[] => [
  { label: "ردیف", value: formatValue(row?.d_radif) },
  { label: "شناسه", value: formatValue(row?.id) },
  { label: "جهت عقب‌نشینی", value: formatValue(firstDefined(row?.aghab, row?.jahat_m)) },
  { label: "مقدار", value: formatValue(firstDefined(row?.meghdar, row?.Retreat), "متر") },
  { label: "طول عقب‌نشینی", value: formatValue(row?.LengthAghabNeshini, "متر") },
  { label: "عرض عقب‌نشینی", value: formatValue(row?.WidthAghabNeshini, "متر") },
  { label: "رعایت شده", value: formatValue(row?.reayat) },
];

const createDirectionTableRow = (row: any): RetreatDirectionTableRow => ({
  direction: formatValue(row?.jahat_m),
  passageType: formatValue(row?.noe_m),
  passageName: formatValue(row?.name_m),
  documentSideLength: formatValue(firstDefined(row?.tolzel_s, row?.tolzel)),
  documentFrontLength: formatValue(firstDefined(row?.tolbar_s, row?.tolbar)),
  currentSideLength: formatValue(row?.tolzel),
  currentFrontLength: formatValue(row?.tolbar),
});

const createSetbackTableRow = (row: any): RetreatSetbackTableRow => ({
  direction: formatValue(firstDefined(row?.aghab, row?.jahat_m)),
  amount: formatValue(firstDefined(row?.meghdar, row?.Retreat), "متر"),
  length: formatValue(row?.LengthAghabNeshini, "متر"),
  width: formatValue(row?.WidthAghabNeshini, "متر"),
  compliant: formatValue(row?.reayat),
});

const createRetreatData = (
  setbackRows: any[],
  area: any,
  directionRows: any[],
): RetreatData => ({
  area: createAreaData(area),
  directions: directionRows.map((row, index) => ({
    title: getDirectionTitle(row, index),
    rowNumber: formatValue(firstDefined(row?.d_radif, index + 1)),
    direction: formatValue(row?.jahat_m),
    rows: createDirectionRows(row),
  })),
  setbacks: setbackRows.map((row, index) => ({
    title: `عقب‌نشینی ${normalizeText(row?.jahat_m, String(index + 1))}`,
    rowNumber: formatValue(firstDefined(row?.d_radif, index + 1)),
    direction: formatValue(row?.jahat_m),
    rows: createSetbackRows(row),
  })),
  directionRows: directionRows.map(createDirectionTableRow),
  setbackRows: setbackRows.map(createSetbackTableRow),
});

/**
 * GET /api/retreat
 * GET /api/retreat/area
 * GET /api/retreat/directions
 */
export const fetchRetreatData = async (
  codeNosazi: string,
  token: string,
): Promise<RetreatData> => {
  const authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  const headers = {
    Accept: "application/json",
    Authorization: authorization,
  };
  const encodedCode = encodeURIComponent(codeNosazi);

  const fetchApiValue = async (endpoint: string, errorMessage: string) => {
    const response = await apiFetch(`${endpoint}?codeNosazi=${encodedCode}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(errorMessage);
    }

    const result: ApiResponse = await response.json();

    if (!isApiSuccess(result)) {
      throw new Error(getApiErrorMessage(result));
    }

    return getApiValue(result);
  };

  const [retreatValue, areaValue, directionsValue] = await Promise.all([
    fetchApiValue("/api/retreat", "خطا در دریافت جدول وضعیت عقب‌نشینی"),
    fetchApiValue("/api/retreat/area", "خطا در دریافت جدول عقب‌نشینی"),
    fetchApiValue("/api/retreat/directions", "خطا در دریافت جهات چهارگانه"),
  ]);

  return createRetreatData(
    unwrapList(retreatValue),
    areaValue,
    unwrapList(directionsValue),
  );
};

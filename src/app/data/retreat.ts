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
  wideningWidth: string;
  retreat: string;
  expansionDepth: string;
  originalFrontDepth: string;
  boundaryType: string;
  boundaryDistance: string;
  adjacencyType: string;
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

const asNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value ?? "")
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .match(/-?\d+(\.\d+)?/);

  if (!normalized) return 0;

  const numberValue = Number(normalized[0]);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  for (const key of ["Value", "value", "items", "data", "result", "results"]) {
    if (Array.isArray(data[key])) return data[key];
  }

  return [data];
};

const totalByKey = (rows: any[], key: string) =>
  rows.reduce((sum, row) => sum + asNumber(row?.[key]), 0);

const createAreaData = (rows: any[]): RetreatAreaData | null => {
  if (rows.length === 0) return null;

  const originalArea = totalByKey(rows, "masahat1");
  const reformedArea = totalByKey(rows, "masahat2");
  const remainingArea = totalByKey(rows, "masahatposht");

  return {
    originalArea: formatValue(originalArea, "متر مربع"),
    reformedArea: formatValue(reformedArea, "متر مربع"),
    remainingArea: formatValue(remainingArea, "متر مربع"),
    rows: [
      { label: "مساحت طبق وضع موجود", value: formatValue(originalArea, "متر مربع") },
      { label: "مساحت اصلاحی", value: formatValue(reformedArea, "متر مربع") },
      { label: "مساحت باقیمانده پشت", value: formatValue(remainingArea, "متر مربع") },
      { label: "تعداد جهات ثبت شده", value: formatValue(rows.length) },
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
  { label: "جهت", value: formatValue(row?.jahat_m) },
  { label: "عرض تعریض", value: formatValue(row?.Arz_Tariz, "متر") },
  { label: "عمق نمای اصلی", value: formatValue(row?.OrginFrontDepth, "متر") },
  { label: "کد عمق نمای اصلی", value: formatValue(row?.c_OrginFrontDepth) },
  { label: "کد نوع حریم", value: formatValue(row?.c_noe_harim) },
  { label: "نوع حریم", value: formatValue(row?.noe_harim) },
  { label: "فاصله حریم", value: formatValue(row?.faseleh_harim, "متر") },
  { label: "نوع مجاورت", value: formatValue(row?.AdjacencyType) },
  { label: "کد نوع مجاورت", value: formatValue(row?.c_AdjacencyType) },
  { label: "عقب‌نشینی", value: formatValue(row?.Retreat, "متر") },
  { label: "عمق توسعه", value: formatValue(row?.Depthofexpansion, "متر") },
  { label: "طول ضلع اصلاحی", value: formatValue(row?.tolzeleslahi, "متر") },
  { label: "طول بر اصلاحی", value: formatValue(row?.tolbareslahi, "متر") },
  { label: "توضیحات", value: formatValue(row?.tozihat) },
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
  direction: formatValue(row?.jahat_m),
  wideningWidth: formatValue(row?.Arz_Tariz),
  retreat: formatValue(row?.Retreat),
  expansionDepth: formatValue(row?.Depthofexpansion),
  originalFrontDepth: formatValue(row?.OrginFrontDepth),
  boundaryType: formatValue(row?.noe_harim),
  boundaryDistance: formatValue(row?.faseleh_harim),
  adjacencyType: formatValue(row?.AdjacencyType),
});

const createRetreatData = (rows: any[]): RetreatData => ({
  area: createAreaData(rows),
  directions: rows.map((row, index) => ({
    title: getDirectionTitle(row, index),
    rowNumber: formatValue(firstDefined(row?.d_radif, index + 1)),
    direction: formatValue(row?.jahat_m),
    rows: createDirectionRows(row),
  })),
  setbacks: rows.map((row, index) => ({
    title: `عقب‌نشینی ${normalizeText(row?.jahat_m, String(index + 1))}`,
    rowNumber: formatValue(firstDefined(row?.d_radif, index + 1)),
    direction: formatValue(row?.jahat_m),
    rows: createSetbackRows(row),
  })),
  directionRows: rows.map(createDirectionTableRow),
  setbackRows: rows.map(createSetbackTableRow),
});

/**
 * GET /api/retreat
 */
export const fetchRetreatData = async (
  codeNosazi: string,
  token: string,
): Promise<RetreatData> => {
  const response = await apiFetch(
    `/api/retreat?codeNosazi=${encodeURIComponent(codeNosazi)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("خطا در دریافت وضعیت عقب‌نشینی");
  }

  const result: ApiResponse = await response.json();

  if (!isApiSuccess(result)) {
    throw new Error(getApiErrorMessage(result));
  }

  const rows = unwrapList(getApiValue(result));
  return createRetreatData(rows);
};

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { 
  Layers,
  Info,
  Plus,
  Minus,
  Home,
  LayoutGrid,  
  MapPinHouse,     
  Trash2,
} from "lucide-react";
import { type RenewalCodeKey, type RenewalCodes, getSelectedPropertyFullCode, normalizeRenewalCode } from "../data/properties";
import {
  isApiSuccess,
  getApiErrorMessage,
  getApiValue,
  type ApiResponse,
} from "../utils/apiResponseHandler";
import { apiFetch } from "../data/api";
import { PropertyTreeList, type PropertyItem, type PropertyTreeItem } from "../components/PropertyTreeList";
import {
  fetchCurrentUserPropertyFiles,
  flattenApiPropertyFiles,
  getPropertyFileList,
} from "../data/propertyFiles";
import { GuildFeesHeader } from "./guild-fees/GuildFeesHeader";
import { GuildFeesHelpModal } from "./guild-fees/GuildFeesHelpModal";
import {
  GuildFeesCurrentFeesSection,
  GuildFeesEmptyState,
  GuildFeesMapSection,
  GuildFeesSearchSection,
  type GuildPropertyItem,
  type LabelValue,
} from "./guild-fees/GuildFeesSections";

import { useRef } from "react";
//import Map from "@/app/components/Map";
import Map from "../components/Map";
//import { MapHandle } from "@/app/components/Map/types";
import { MapHandle } from "../components/Map/types";

interface GuildFeesPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const emptyCodes: RenewalCodes = {
  region: "",
  neighborhood: "",
  block: "",
  property: "",
  building: "",
  apartment: "",
  guild: "",
};

const keyLabels: Record<string, string> = {
  Id: "شناسه",
  id: "شناسه",
  ID: "شناسه",
  shop: "شماره پرونده",
  Shop: "شماره پرونده",
  Shofish: "شماره فیش",
  FishNo: "شماره فیش",
  fishNo: "شماره فیش",
  jobCode: "کد شغل",
  JobCode: "کد شغل",
  Jobcode: "کد شغل",
  jobcode: "کد شغل",
  codeN: "کد نوسازی",
  CodeN: "کد نوسازی",
  codeNosazi: "کد نوسازی",
  CodeNosazi: "کد نوسازی",
  fullCode: "کد نوسازی",
  ownerName: "مالک",
  owner: "مالک",
  Owner: "مالک",
  Nam_malek: "نام مالک",
  MalekName: "نام مالک",
  malekName: "نام مالک",
  Name: "نام",
  name: "نام",
  Family: "نام خانوادگی",
  family: "نام خانوادگی",
  lastName: "نام خانوادگی",
  firstName: "نام",
  Father: "نام پدر",
  fatherName: "نام پدر",
  Sodor: "محل صدور",
  issuePlace: "محل صدور",
  NoeMalek: "نوع مالک",
  ownerType: "نوع مالک",
  address: "آدرس",
  Address: "آدرس",
  Nam_address: "آدرس",
  amount: "مبلغ",
  Amount: "مبلغ",
  Mablagh: "مبلغ",
  price: "مبلغ",
  Price: "مبلغ",
  total: "جمع کل",
  Total: "جمع کل",
  Avarez: "عوارض",
  Moavaghe: "معوقه",
  Tax: "مالیات",
  Mafiyat: "معافیت",
  Khoshhesabi: "خوش حسابی",
  BadHesabi: "بدحسابی",
  Education: "آموزش و پرورش",
  FireStation: "آتش نشانی",
  Khadamat: "خدمات",
  M_khadamat: "مبلغ خدمات",
  SahmMalek: "سهم مالک",
  date: "تاریخ",
  Date: "تاریخ",
  tarikh: "تاریخ",
  Tarikh: "تاریخ",
  status: "وضعیت",
  Status: "وضعیت",
  Motesadi: "متصدی",
  motesadi: "متصدی",
  Nam_motesadi: "نام متصدی",
  ShoghlType: "نوع شغل",
  shoghlType: "نوع شغل",
  JobName: "عنوان شغل",
  jobName: "عنوان شغل",
  JobTitle: "عنوان شغل",
  jobTitle: "عنوان شغل",
  CurrentPrice: "مبلغ عوارض جاری",
  currentPrice: "مبلغ عوارض جاری",
  current_price: "مبلغ عوارض جاری",
  DelayedPrice: "مبلغ عوارض معوقه",
  delayedPrice: "مبلغ عوارض معوقه",
  delayed_price: "مبلغ عوارض معوقه",
  Azsal: "از سال",
  EndDate: "تا سال",
  endDate: "تا سال",
  end_date: "تا سال",
  Tasal: "تا سال",
  StartDate: "از سال",
  startDate: "از سال",
  start_date: "از سال",
  TotalPrice: "مبلغ کل",
  totalPrice: "مبلغ کل",
  total_price: "مبلغ کل",
  TotalPriceFarsi: "مبلغ به حروف",
  totalPriceFarsi: "مبلغ به حروف",
  total_price_farsi: "مبلغ به حروف",
  FinePrice: "مبلغ جریمه",
  finePrice: "مبلغ جریمه",
  DiscountPrice: "مبلغ تخفیف",
  discountPrice: "مبلغ تخفیف",
  PayablePrice: "مبلغ قابل پرداخت",
  payablePrice: "مبلغ قابل پرداخت",
  PaymentDate: "تاریخ پرداخت",
  paymentDate: "تاریخ پرداخت",
  payment_date: "تاریخ پرداخت",
  Year: "سال",
  year: "سال",
};

const normalizeDigits = (value: unknown = "") =>
  String(value ?? "").replace(/[۰-۹٠-٩]/g, (digit) => {
    const fa = "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);
    if (fa >= 0) return String(fa);
    return String("٠١٢٣٤٥٦٧٨٩".indexOf(digit));
  });

const normalizeCode = (code: unknown = "") =>
  normalizeDigits(code)
    .replace(/[^\d]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const splitCode = (code: unknown = ""): RenewalCodes => {
  const parts = normalizeCode(code).split("-");
  return {
    region: parts[0] ?? "",
    neighborhood: parts[1] ?? "",
    block: parts[2] ?? "",
    property: parts[3] ?? "",
    building: parts[4] ?? "",
    apartment: parts[5] ?? "",
    guild: parts[6] ?? "",
  };
};

const buildCodeFromInputs = (codes: RenewalCodes) =>
  normalizeCode(
    [
      codes.region,
      codes.neighborhood,
      codes.block,
      codes.property,
      codes.building,
      codes.apartment,
      codes.guild,
    ].join("-"),
  );

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const key of ["items", "data", "result", "results", "list", "rows"]) {
    if (Array.isArray(data[key])) return data[key];
  }
  for (const key of ["data", "result"]) {
    if (data[key] && typeof data[key] === "object") return [data[key]];
  }
  return [data];
};

const firstDefined = (...values: unknown[]) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const moneyKeyPattern =
  /(amount|price|total|mablagh|avarez|tax|fine|discount|payable|current|delayed|fee)/i;
const dateKeyPattern = /(date|tarikh|paymentdate|startdate|enddate)/i;

const persianNumberFormatter = new Intl.NumberFormat("fa-IR", {
  useGrouping: false,
});

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const toPersianDigits = (value: string) =>
  value.replace(/\d/g, (digit) => persianNumberFormatter.format(Number(digit)));

const orderedKeyIndexes: Record<string, number> = {
  Shofish: 1,
  FishNo: 1,
  Nam_malek: 2,
  ownerName: 2,
  Address: 3,
  address: 3,
  StartDate: 4,
  startDate: 4,
  Azsal: 4,
  EndDate: 5,
  endDate: 5,
  Tasal: 5,
  JobCode: 6,
  jobCode: 6,
  Jobcode: 6,
  JobName: 7,
  jobName: 7,
  ShoghlType: 8,
  shoghlType: 8,
  CurrentPrice: 20,
  currentPrice: 20,
  DelayedPrice: 21,
  delayedPrice: 21,
  FinePrice: 22,
  finePrice: 22,
  DiscountPrice: 23,
  discountPrice: 23,
  TotalPrice: 24,
  totalPrice: 24,
  PayablePrice: 25,
  payablePrice: 25,
  TotalPriceFarsi: 26,
  totalPriceFarsi: 26,
};

const isMoneyKey = (key?: string) => Boolean(key && moneyKeyPattern.test(key));
const isDateKey = (key?: string) => Boolean(key && dateKeyPattern.test(key));

const formatDateValue = (value: unknown): string | null => {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) return null;
  const normalized = normalizeDigits(rawValue);

  if (/^1[34]\d{2}([/-]\d{1,2}([/-]\d{1,2})?)?$/.test(normalized)) {
    return toPersianDigits(rawValue.replace(/-/g, "/"));
  }

  if (/^1[34]\d{6}$/.test(normalized)) {
    return toPersianDigits(
      `${normalized.slice(0, 4)}/${normalized.slice(4, 6)}/${normalized.slice(6, 8)}`,
    );
  }

  if (/^(19|20)\d{6}$/.test(normalized)) {
    const date = new Date(
      Number(normalized.slice(0, 4)),
      Number(normalized.slice(4, 6)) - 1,
      Number(normalized.slice(6, 8)),
    );
    if (!Number.isNaN(date.getTime())) return persianDateFormatter.format(date);
  }

  if (/^\d{4}$/.test(normalized)) {
    return toPersianDigits(normalized);
  }

  const isoMatch = normalized.match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s].*)?$/,
  );

  if (!isoMatch) return null;

  const [, year, month, day] = isoMatch;
  const numericYear = Number(year);
  if (numericYear < 1700) return toPersianDigits(`${year}/${month}/${day}`);

  const date = new Date(
    numericYear,
    Number(month) - 1,
    Number(day),
  );
  if (Number.isNaN(date.getTime())) return null;

  return persianDateFormatter.format(date);
};

const labelTokenMap: Record<string, string> = {
  id: "شناسه",
  no: "شماره",
  number: "شماره",
  code: "کد",
  fish: "فیش",
  shop: "پرونده",
  job: "شغل",
  title: "عنوان",
  name: "نام",
  owner: "مالک",
  malek: "مالک",
  address: "آدرس",
  type: "نوع",
  date: "تاریخ",
  start: "شروع",
  end: "پایان",
  year: "سال",
  price: "مبلغ",
  amount: "مبلغ",
  total: "کل",
  current: "جاری",
  delayed: "معوقه",
  fine: "جریمه",
  discount: "تخفیف",
  payable: "قابل پرداخت",
  payment: "پرداخت",
  status: "وضعیت",
  farsi: "به حروف",
  text: "متن",
  description: "توضیحات",
};

const toReadableLabel = (label: string) => {
  const trimmed = label.trim();
  if (!trimmed) return "عنوان";
  if (/^[\d۰-۹٠-٩]+$/.test(trimmed)) return `عنوان ${toPersianDigits(normalizeDigits(trimmed))}`;
  if (/[\u0600-\u06FF]/.test(trimmed)) return trimmed;

  const tokens = trimmed
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s._-]+/)
    .map((token) => token.toLowerCase())
    .filter(Boolean);

  const translated = tokens.map((token) => labelTokenMap[token] ?? "");
  const knownTokens = translated.filter(Boolean);
  if (knownTokens.length > 0) {
    return knownTokens.join(" ");
  }

  return "عنوان";
};

const toDisplay = (value: unknown, key?: string): string => {
  if (value === undefined || value === null || value === "") return "—";
  if (isDateKey(key)) {
    const dateValue = formatDateValue(value);
    if (dateValue) return dateValue;
  }
  if (typeof value === "boolean") return value ? "بله" : "خیر";
  if (typeof value === "number" && Number.isFinite(value)) {
    const formatted = value.toLocaleString("fa-IR");
    return isMoneyKey(key) ? `${formatted} ریال` : formatted;
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "—";
    }
  }
  return toPersianDigits(String(value));
};

const toLabel = (label: unknown): string => {
  const normalizedLabel = toDisplay(label);
  return keyLabels[normalizedLabel] ?? toReadableLabel(normalizedLabel);
};

const toPairs = (data: any): LabelValue[] => {
  const rows = unwrapList(data);
  const objectRows = rows.filter(
    (row) => row && typeof row === "object" && !Array.isArray(row),
  );
  const source = objectRows[0];
  if (!source) return [];

  if (Array.isArray(source.items)) {
    return source.items.map((item: any, index: number) => {
      const labelSource = item.title ?? item.label ?? item.key ?? index + 1;
      const valueKey = String(item.key ?? item.title ?? item.label ?? "");
      return {
        label: toLabel(labelSource),
        value: toDisplay(item.value ?? item.text ?? item.amount ?? item, valueKey),
      };
    });
  }

  return objectRows.flatMap((row) => {
    const entries = Object.entries(row)
      .filter(([, value]) => typeof value !== "object" || value === null)
      .sort(([keyA], [keyB]) => {
        const indexA = orderedKeyIndexes[keyA] ?? 1000;
        const indexB = orderedKeyIndexes[keyB] ?? 1000;
        return indexA === indexB ? keyA.localeCompare(keyB) : indexA - indexB;
      });

    return entries.map(([key, value]) => ({
      label: toLabel(key),
      value: toDisplay(value, key),
    }));
  });
};

const splitPairs = (pairs: LabelValue[]) => ({
  right: pairs.filter((_, index) => index % 2 === 0),
  left: pairs.filter((_, index) => index % 2 === 1),
});

const escapeExcelCell = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const exportPairsToExcel = (rows: LabelValue[], title: string) => {
  if (rows.length === 0 || typeof window === "undefined") return;

  const tableRows = rows
    .map(
      (row) =>
        `<tr><td>${escapeExcelCell(row.label)}</td><td>${escapeExcelCell(
          row.value,
        )}</td></tr>`,
    )
    .join("");
  const html = `
    <html dir="rtl">
      <head><meta charset="utf-8" /></head>
      <body>
        <table border="1">
          <caption>${escapeExcelCell(title)}</caption>
          <thead><tr><th>عنوان</th><th>مقدار</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;
  const blob = new Blob([`\uFEFF${html}`], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.replace(/\s+/g, "-")}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportPairsToPdf = (rows: LabelValue[], title: string) => {
  if (rows.length === 0 || typeof window === "undefined") return;

  const tableRows = rows
    .map(
      (row) =>
        `<tr><td>${escapeExcelCell(row.label)}</td><td>${escapeExcelCell(
          row.value,
        )}</td></tr>`,
    )
    .join("");
  const html = `
    <!doctype html>
    <html dir="rtl" lang="fa">
      <head>
        <meta charset="utf-8" />
        <title>${escapeExcelCell(title)}</title>
        <style>
          @page { size: A4; margin: 16mm; }
          body {
            font-family: Tahoma, Arial, sans-serif;
            color: #111827;
            direction: rtl;
          }
          h1 {
            margin: 0 0 18px;
            font-size: 18px;
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 8px 10px;
            text-align: right;
            vertical-align: top;
          }
          th {
            background: #f3f4f6;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <h1>${escapeExcelCell(title)}</h1>
        <table>
          <thead><tr><th>عنوان</th><th>مقدار</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 250);
};

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth-token");
};

const getAuthHeaders = (token: string) => ({
  Accept: "application/json",
  Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
});

const mapFileItem = (item: any, index: number): GuildPropertyItem => {
  const fullCode = normalizeCode(
    item.codeN ?? item.fullCode ?? item.codeNosazi,
  );
  const description = toDisplay(
    item.tvItems?.[0]?.Text?.trim() ?? item.codeN ?? "بدون توضیحات",
  );
  return {
    id: String(item.shop ?? item.Shop ?? item.Id ?? item.id ?? index + 1),
    fullCode: fullCode || "—",
    ownerName: toDisplay(
      item.ownerName ??
        item.malekName ??
        item.tvItems?.[0]?.Text?.trim() ??
        item.Name,
    ),
    description: description,
    type: toDisplay(item.type ?? item.fileType ?? item.noeMelk ?? "صنفی"),
    codes: splitCode(fullCode),
    shop: firstDefined(item.shop, item.Shop, item.Id, item.id)?.toString(),
    jobCode: firstDefined(
      item.jobCode,
      item.JobCode,
      item.job,
      item.Job,
    )?.toString(),
  };
};

const extractGuildParams = (
  selectedCase: GuildPropertyItem | null,
  guildData: any,
) => {
  const firstGuild = unwrapList(guildData)[0] ?? {};
  return {
    shop: firstDefined(
      selectedCase?.shop,
      firstGuild.shop,
      firstGuild.Shop,
      firstGuild.Id,
      firstGuild.id,
    )?.toString(),
    jobCode: firstDefined(
      selectedCase?.jobCode,
      firstGuild.jobCode,
      firstGuild.JobCode,
      firstGuild.Jobcode,
      firstGuild.jobcode,
      firstGuild.job,
      firstGuild.Job,
    )?.toString(),
  };
};

export function GuildFeesPage({ isDark, toggleTheme }: GuildFeesPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });
  const [searchInputs, setSearchInputs] = useState<RenewalCodes>(emptyCodes);
  const [cases, setCases] = useState<GuildPropertyItem[]>([]);
  const [selectedCase, setSelectedCase] = useState<GuildPropertyItem | null>(
    null,
  );
  const [receiptPairs, setReceiptPairs] = useState<LabelValue[]>([]);
  const [taxPairs, setTaxPairs] = useState<LabelValue[]>([]);
  const [isCasesLoading, setIsCasesLoading] = useState(false);
  const [isGuildLoading, setIsGuildLoading] = useState(false);
  const [error, setError] = useState("");

  const receiptColumns = useMemo(
    () => splitPairs(receiptPairs),
    [receiptPairs],
  );
  const taxColumns = useMemo(() => splitPairs(taxPairs), [taxPairs]);

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  const loadGuildData = async (
    codeNosazi: string,
    currentCase: GuildPropertyItem | null,
  ) => {
    const token = getAuthToken();

    if (!token) {
      setError("برای دریافت اطلاعات عوارض صنفی ابتدا وارد حساب کاربری شوید.");
      return;
    }

    setIsGuildLoading(true);
    setError("");
    setReceiptPairs([]);
    setTaxPairs([]);

    try {
      const normalizedCode = normalizeCode(codeNosazi);
      const guildResponse = await apiFetch(
        `/api/guilds?codeNosazi=${encodeURIComponent(normalizedCode)}`,
        {
          method: "GET",
          headers: getAuthHeaders(token),
        },
      );

      if (!guildResponse.ok) {
        throw new Error("guilds request failed");
      }

      const guildData: ApiResponse = await guildResponse.json();

      if (!isApiSuccess(guildData)) {
        throw new Error(getApiErrorMessage(guildData));
      }

      const guildValue = getApiValue(guildData);
      const receiptData = unwrapList(guildValue);
      setReceiptPairs(toPairs(receiptData));

      const { shop, jobCode } = extractGuildParams(currentCase, guildValue);

      if (shop && jobCode) {
        const taxResponse = await apiFetch(
          `/api/guilds/tax?shop=${encodeURIComponent(shop)}&jobCode=${encodeURIComponent(jobCode)}`,
          {
            method: "GET",
            headers: getAuthHeaders(token),
          },
        );

        if (taxResponse.ok) {
          const taxData: ApiResponse = await taxResponse.json();
          if (isApiSuccess(taxData)) {
            const taxValue = getApiValue(taxData);
            setTaxPairs(toPairs(unwrapList(taxValue)));
          } else {
            setError("فیش دریافت شد، اما دریافت عوارض صنفی با خطا مواجه شد.");
          }
        } else {
          setError("فیش دریافت شد، اما دریافت عوارض صنفی با خطا مواجه شد.");
        }
      } else {
        setError(
          "برای دریافت عوارض صنفی، مقدار shop و jobCode در پاسخ فیش پیدا نشد.",
        );
      }
    } catch {
      setError("خطا در دریافت اطلاعات فیش و عوارض صنفی.");
    } finally {
      setIsGuildLoading(false);
    }
  };

  useEffect(() => {
    const loadCases = async () => {
      const token = getAuthToken();
      const nationalCode =
        typeof window !== "undefined"
          ? localStorage.getItem("user-national-code")
          : null;

      if (!token || !nationalCode) return;

      setIsCasesLoading(true);
      try {
        const data = await fetchCurrentUserPropertyFiles(token);

        if (!isApiSuccess(data)) {
          setError(getApiErrorMessage(data));
          return;
        }

        const mapped = flattenApiPropertyFiles(getPropertyFileList(data)).map(mapFileItem);
        setCases(mapped);
        
        if (mapped.length > 0) {
          // Try to restore previously selected property from localStorage
          const storedFullCode = getSelectedPropertyFullCode();
          let selectedProperty: GuildPropertyItem | null = null;
          
          if (storedFullCode) {
            const normalizedStoredCode = normalizeRenewalCode(storedFullCode);
            // Find matching property by fullCode
            selectedProperty = mapped.find(item => 
              normalizeCode(item.fullCode) === normalizedStoredCode
            ) ?? null;

            if (!selectedProperty) {
              const cleanedStoredCode = normalizeCode(storedFullCode);
              selectedProperty = {
                id:
                  localStorage.getItem("municipality-selected-property-id") ??
                  cleanedStoredCode,
                fullCode: cleanedStoredCode,
                ownerName: "—",
                description: storedFullCode,
                type: "ملک",
                codes: splitCode(cleanedStoredCode),
              };
            }
          }
          
          // If no stored property found, use the first one
          const propertyToSelect = selectedProperty ?? mapped[0];
          setSelectedCase(propertyToSelect);
          setSearchInputs(propertyToSelect.codes);
          void loadGuildData(propertyToSelect.fullCode, propertyToSelect);
        }
      } catch {
        setError("خطا در دریافت پرونده‌های زیرمجموعه.");
      } finally {
        setIsCasesLoading(false);
      }
    };

    void loadCases();
  }, []);

  const handleCaseClick = (item: GuildPropertyItem) => {
    setSearchInputs(item.codes);
    setSelectedCase(item);
    setReceiptPairs([]);
    setTaxPairs([]);
    setError("");
  };

  const handlePropertyTreeSelect = (property: PropertyItem, treeItem: PropertyTreeItem) => {
    const codes: RenewalCodes = {
      region: "",
      neighborhood: "",
      block: "",
      property: "",
      building: "",
      apartment: "",
      guild: "",
    };
    
    // Parse the fullCode to extract codes
    const parts = treeItem.fullCode.split("-").map(p => p.trim()).filter(Boolean);
    if (parts.length >= 7) {
      codes.region = parts[0];
      codes.neighborhood = parts[1];
      codes.block = parts[2];
      codes.property = parts[3];
      codes.building = parts[4];
      codes.apartment = parts[5];
      codes.guild = parts[6];
    }
    
    const guildItem: GuildPropertyItem = {
      id: treeItem.id,
      fullCode: treeItem.fullCode,
      ownerName: property.description,
      description: treeItem.text,
      type: "ملک",
      codes: codes,
      shop: treeItem.id,
      jobCode: "",
    };
    
    handleCaseClick(guildItem);
    void loadGuildData(guildItem.fullCode, guildItem);
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const code = buildCodeFromInputs(searchInputs);
    const matchedCase =
      cases.find((item) => normalizeCode(item.fullCode) === code) ?? null;
    setSelectedCase(matchedCase);
    void loadGuildData(code, matchedCase);
  };

  const handleInputChange = (key: RenewalCodeKey, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [key]: normalizeDigits(value) }));
  };

  const hasGuildData = receiptPairs.length > 0 || taxPairs.length > 0;

  // GIS Parameters
  const mapRef = useRef<MapHandle>(null);
  const fullCode = buildCodeFromInputs(searchInputs);

  return (
    <>
      <GuildFeesHelpModal
        isOpen={isModalOpen}
        title={modalContent.title}
        description={modalContent.description}
        onClose={() => setIsModalOpen(false)}
      />

      <GuildFeesHeader isDark={isDark} toggleTheme={toggleTheme} />

      <section className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-6xl px-0 md:px-2 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-4 rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm"
          >
            پس از انتخاب پرونده یا ورود کد نوسازی، فیش اصناف و عوارض صنفی از
            سرویس شهرداری دریافت می‌شود.
          </motion.div>

          <div className="space-y-4 md:space-y-5">
            <GuildFeesSearchSection
              isLoading={isGuildLoading}
              onHelp={handleOpenHelp}
              onInputChange={handleInputChange}
              onSubmit={handleSearch}
              searchInputs={searchInputs}
            />

            {/* Property Tree List */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="soft-card mesh-panel overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold">پرونده‌های زیر مجموعه</h2>
                </div>
                <button
                  onClick={() => handleOpenHelp("پرونده‌ها", "لیست املاک و پرونده‌های شما در این بخش نمایش داده می‌شود.")}
                  className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 md:text-xs"
                >
                  <Info className="h-3.5 w-3.5" /> راهنما
                </button>
              </div>
              <div className="p-4">
                <PropertyTreeList
                  onPropertySelect={handlePropertyTreeSelect}
                  compact
                />
              </div>
            </motion.article>

            {error && (
              <div className="rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {hasGuildData || isGuildLoading ? (
              <>
                <GuildFeesCurrentFeesSection
                  title="فیش اصناف"
                  right={receiptColumns.right}
                  left={receiptColumns.left}
                  items={receiptPairs}
                  isLoading={isGuildLoading}
                  onHelp={handleOpenHelp}
                  onExportExcel={() =>
                    exportPairsToExcel(receiptPairs, "فیش اصناف")
                  }
                  onExportPdf={() =>
                    exportPairsToPdf(receiptPairs, "فیش اصناف")
                  }
                />
                <GuildFeesCurrentFeesSection
                  title="عوارض صنفی جاری"
                  right={taxColumns.right}
                  left={taxColumns.left}
                  items={taxPairs}
                  isLoading={isGuildLoading}
                  onHelp={handleOpenHelp}
                />
              </>
            ) : (
              <GuildFeesEmptyState onHelp={handleOpenHelp} />
            )}

            {/* <GuildFeesMapSection activeData={selectedCase} onHelp={handleOpenHelp} /> */}
            <motion.article
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="soft-card mesh-panel group relative h-64 overflow-hidden sm:h-80 md:h-[400px]">
                <button
                  type="button"
                  onClick={() =>
                    handleOpenHelp(
                      "نقشه پرونده",
                      "این قسمت موقعیت ملک را نشان می‌دهد. با کلیک کردن روی هر ملک، اطلاعات اصلی ملک روی نقشه نمایش داده می‌شود و دکمه‌های بزرگنمایی و بازگشت برای کنترل نما قرار دارند.",
                    )
                  }
                  className="absolute right-4 top-4 z-20 inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-card/90 px-2.5 py-1 text-[10px] font-bold text-primary shadow-lg transition-colors hover:bg-card md:text-xs"
                >
                  <Info className="h-3.5 w-3.5" /> راهنما
                </button>
                {/* {onOpenHelp && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenHelp(
                        "نقشه ملک",
                        "این قسمت موقعیت ملک را نشان می‌دهد. با کلیک کردن روی هر ملک، اطلاعات اصلی ملک روی نقشه نمایش داده می‌شود و دکمه‌های بزرگنمایی و بازگشت برای کنترل نما قرار دارند.",
                      )
                    }
                    className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-lg border bor                                                                                                                                                                                                                                                                                                         der-primary/35 bg-card/90 px-2.5 py-1 text-[10px] font-bold text-primary shadow-lg transition-colors hover:bg-card md:text-xs"
                  >
                    <Info className="h-3.5 w-3.5" /> راهنما
                  </button>
                )}        */}
                <div className="absolute inset-0 bg-slate-800">
                  <Map ref={mapRef} />                   
                  {/* {activeProperty && (
                    <div className="absolute bottom-4 left-1/2 w-56 -translate-x-1/2 space-y-1.5 rounded-2xl border border-border bg-card/95 p-3 text-xs shadow-xl backdrop-blur-md sm:bottom-8 sm:w-64 sm:space-y-2 sm:p-4">
                      <div className="mb-2 flex justify-between border-b border-border/50 pb-2">
                        <span className="text-sm font-bold text-foreground">
                          اطلاعات ملک
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-foreground">کد نوسازی</span>
                        <span className="text-[10px] text-muted-foreground sm:text-xs">
                          {Object.values(activeProperty.codes).join("-")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-foreground">نام مالک</span>
                        <span className="text-muted-foreground">
                          {activeProperty.owner.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-foreground">مساحت</span>
                        <span className="text-muted-foreground">
                          {activeProperty.registration.map.area}
                        </span>
                      </div>
                    </div>*/}
                </div>
                <div className="absolute left-3 top-2 flex flex-col gap-2">
                  <button 
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/90 shadow-lg sm:h-9 sm:w-9"
                    onClick={() => mapRef.current?.zoomIn()}
                    title="بزرگ‌نمایی">
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button 
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/90 shadow-lg sm:h-9 sm:w-9"
                    onClick={() => mapRef.current?.zoomOut()}
                    title="کوچک‌نمایی">
                      <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button 
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/90 shadow-lg sm:h-9 sm:w-9"
                    onClick={() => mapRef.current?.goHome()}
                    title="بازگشت به نمای اصلی">
                      <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button          
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/90 shadow-lg sm:h-9 sm:w-9"
                    onClick={() => mapRef.current?.toggleBasemap()}
                    title="تغییر نقشه زمینه">
                    <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4"/>
                  </button>
                </div>
                <div className="absolute right-3 top-12 flex flex-col gap-2">
                {/*<div className="absolute right-3 top-12 flex flex-col gap-2 sm:left-4 sm:top-12">*/}                  
                  <button 
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/90 shadow-lg sm:h-9 sm:w-9"
                  onClick={() => {mapRef.current?.selectMelkByCodeNosazi(fullCode);}}
                  title="موقعیت من">
                    <MapPinHouse className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button 
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/90 shadow-lg sm:h-9 sm:w-9 hover:bg-destructive transition-colors"
                  onClick={() => mapRef.current?.clearGraphics()}
                  title="پاک کردن انتخاب">
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>          
                </div>       
              </motion.article>
          </div>
        </div>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Home,
  Info,
  Minus,
  Plus,
  Search,
  Moon,
  Sun,
  Trash2,
  X,
  Download,
  Layers,
  FileText,
  Users,
  Receipt,
  History,
  LayoutGrid,  
  MapPinHouse, 
} from "lucide-react";
import { Link } from "react-router";
import {
  guildCodeFields,
  type RenewalCodeKey,
  type RenewalCodes,
  getSelectedPropertyFullCode,
  normalizeRenewalCode,
} from "../data/properties";
import {
  isApiSuccess,
  getApiValue,
  type ApiResponse,
} from "../utils/apiResponseHandler";
import { apiFetch } from "../data/api";
import { PropertyTreeList, type PropertyItem as TreePropertyItem, type PropertyTreeItem } from "../components/PropertyTreeList";
import {
  fetchCurrentUserPropertyFiles,
  flattenApiPropertyFiles,
  getPropertyFileList,
} from "../data/propertyFiles";

import { useRef } from "react";
//import Map from "@/app/components/Map";
import Map from "../components/Map";
//import { MapHandle } from "@/app/components/Map/types";
import { MapHandle } from "../components/Map/types";

interface LocalPropertyItem {
  id: string;
  fullCode: string;
  ownerName: string;
  description: string;
  codes: RenewalCodes;
}

interface OwnerItem {
  id: string;
  firstName: string;
  lastName: string;
  ownerType: string;
  fatherName: string;
  birthPlace: string;
}

interface LabelValue {
  label: string;
  value: string;
}

interface HistoryItem {
  id: string;
  date: string;
  amount: string;
  status: string;
}

interface ModernTollPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const emptyDisplay = "\u2014";

const asArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value.items)) return value.items;
  if (Array.isArray(value.data)) return value.data;
  if (Array.isArray(value.Value)) return value.Value;
  return [value];
};

const firstFilledText = (...values: unknown[]) => {
  const value = values.find(
    (item) => item !== undefined && item !== null && String(item).trim() !== "",
  );
  return value === undefined ? emptyDisplay : String(value);
};

const modernTollLabels: Record<string, string> = {
  Shofish: "شماره فیش",
  Nam_malek: "نام مالک",
  Address: "نشانی",
  Azsal: "از سال",
  Tasal: "تا سال",
  Avarez: "عوارض",
  Moavaghe: "معوقه",
  SahmMalek: "سهم مالک",
  Education: "آموزش و پرورش",
  FireStation: "آتش نشانی",
  Khadamat: "خدمات",
  M_khadamat: "مبلغ خدمات",
  Tax: "مالیات",
  Mafiyat: "معافیت",
  Khoshhesabi: "خوش حسابی",
  BadHesabi: "بدحسابی",
  Mablagh: "مبلغ قابل پرداخت",
  Mablagh_farsi: "مبلغ به حروف",
};

const modernTollOrder = [
  "Shofish",
  "Nam_malek",
  "Address",
  "Azsal",
  "Tasal",
  "Avarez",
  "Moavaghe",
  "SahmMalek",
  "Education",
  "FireStation",
  "Khadamat",
  "M_khadamat",
  "Tax",
  "Mafiyat",
  "Khoshhesabi",
  "BadHesabi",
  "Mablagh",
  "Mablagh_farsi",
];

const modernTollMoneyKeys = new Set([
  "Avarez",
  "Moavaghe",
  "SahmMalek",
  "Education",
  "FireStation",
  "Khadamat",
  "M_khadamat",
  "Tax",
  "Mafiyat",
  "Khoshhesabi",
  "BadHesabi",
  "Mablagh",
]);

const formatDisplayValue = (value: unknown, key?: string) => {
  if (value === undefined || value === null || value === "") return emptyDisplay;
  if (typeof value === "number" && Number.isFinite(value)) {
    const formatted = value.toLocaleString("fa-IR");
    return key && modernTollMoneyKeys.has(key) ? `${formatted} ریال` : formatted;
  }
  if (typeof value === "boolean") return value ? "بله" : "خیر";
  return String(value);
};

const getPrimitiveKeys = (source: Record<string, unknown>) =>
  Object.keys(source).filter((key) => {
    const value = source[key];
    return typeof value !== "object" || value === null;
  });

const toModernTollPairs = (value: any): LabelValue[] => {
  const rows = asArray(value);
  const source = rows[0];

  if (!source || typeof source !== "object") return [];

  if (Array.isArray(source.items)) {
    return source.items.map((item: any, index: number) => ({
      label: item.title ?? item.label ?? item.key ?? String(index + 1),
      value: formatDisplayValue(item.value ?? item.text ?? item.amount ?? item),
    }));
  }

  const keys = getPrimitiveKeys(source);
  const orderedKeys = [
    ...modernTollOrder.filter((key) => keys.includes(key)),
    ...keys.filter((key) => !modernTollOrder.includes(key)),
  ];

  return orderedKeys.map((key) => ({
    label: modernTollLabels[key] ?? key,
    value: formatDisplayValue(source[key], key),
  }));
};

const mergePairs = (right: LabelValue[], left: LabelValue[]) => {
  const rows: LabelValue[] = [];
  const maxLength = Math.max(right.length, left.length);

  for (let index = 0; index < maxLength; index += 1) {
    if (right[index]) rows.push(right[index]);
    if (left[index]) rows.push(left[index]);
  }

  return rows;
};

const escapeExportCell = (value: string) =>
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
        `<tr><td>${escapeExportCell(row.label)}</td><td>${escapeExportCell(
          row.value,
        )}</td></tr>`,
    )
    .join("");
  const html = `
    <html dir="rtl">
      <head><meta charset="utf-8" /></head>
      <body>
        <table border="1">
          <caption>${escapeExportCell(title)}</caption>
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
        `<tr><td>${escapeExportCell(row.label)}</td><td>${escapeExportCell(
          row.value,
        )}</td></tr>`,
    )
    .join("");
  const html = `
    <!doctype html>
    <html dir="rtl" lang="fa">
      <head>
        <meta charset="utf-8" />
        <title>${escapeExportCell(title)}</title>
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
        <h1>${escapeExportCell(title)}</h1>
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

const getOwnerId = (owner: any) => {
  if (typeof owner === "number" || typeof owner === "string") {
    return String(owner).trim();
  }

  if (!owner || typeof owner !== "object") return "";

  return firstFilledText(
    owner.Id,
    owner.id,
    owner.MalekId,
    owner.malekId,
    owner.OwnerId,
    owner.ownerId,
    owner.C_Malek,
    owner.c_Malek,
    owner.malek_id,
    owner.owner_id,
  ).replace(emptyDisplay, "");
};

const mapOwner = (owner: any, index: number): OwnerItem => {
  const source = owner && typeof owner === "object" ? owner : {};

  return {
    id: getOwnerId(owner) || String(index + 1),
    firstName: firstFilledText(source.Name, source.firstName, source.name),
    lastName: firstFilledText(source.Family, source.lastName),
    ownerType: firstFilledText(source.NoeMalek, source.ownerType),
    fatherName: firstFilledText(source.Father, source.fatherName),
    birthPlace: firstFilledText(source.Sodor, source.birthPlace, source.issuePlace),
  };
};

export function ModernTollPage({ isDark, toggleTheme }: ModernTollPageProps) {
  const [propertyItems, setPropertyItems] = useState<LocalPropertyItem[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<LocalPropertyItem | null>(
    null,
  );
  const [owners, setOwners] = useState<OwnerItem[]>([]);
  const [feesRight, setFeesRight] = useState<LabelValue[]>([]);
  const [feesLeft, setFeesLeft] = useState<LabelValue[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  // وضعیت فیلدهای ورودی جستجو
  const [searchInputs, setSearchInputs] = useState<RenewalCodes>({
    region: "",
    neighborhood: "",
    block: "",
    property: "",
    building: "",
    apartment: "",
    guild: "",
  });

  const [error, setError] = useState("");

  const token = localStorage.getItem("auth-token");

  const normalizeCode = (code = ""): string => {
    const segments = code
      .split("-")
      .map((part) => part.trim())
      .filter((part) => part !== "");

    const normalized = segments.length > 7 ? segments.slice(-7) : [...segments];
    while (normalized.length < 7) {
      normalized.push("");
    }
    return normalized.join("-");
  };

  const splitCode = (code = ""): RenewalCodes => {
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

  const codeNosazi = normalizeCode(
    `${searchInputs.region}-${searchInputs.neighborhood}-${searchInputs.block}-${searchInputs.property}-${searchInputs.building}-${searchInputs.apartment}-${searchInputs.guild}`,
  );

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  // هندلر تغییر مقادیر ورودی
  const handleInputChange = (key: RenewalCodeKey, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [key]: value }));
  };

  const loadRenovationData = async (propertyId: string, code: string) => {
    if (!token) return;
    try {
      const normalizedCode = normalizeCode(code);
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const ownersRes = await apiFetch(
        `/api/owners?codeNosazi=${encodeURIComponent(normalizedCode)}`,
        { headers },
      );
      const ownersData: ApiResponse = ownersRes.ok
        ? await ownersRes.json()
        : { IsSuccess: false, IsFailure: true };
      const ownersValue = isApiSuccess(ownersData)
        ? getApiValue(ownersData)
        : null;
      let rawOwners = asArray(ownersValue);
      setOwners(rawOwners.map(mapOwner));

      const ownerId =
        rawOwners.map(getOwnerId).find(Boolean) || String(propertyId).trim();

      const [renovationRes, recordsRes] = await Promise.all([
        apiFetch(
          `/api/renovation?malekId=${encodeURIComponent(ownerId)}&codeNosazi=${encodeURIComponent(normalizedCode)}`,
          { headers },
        ),
        apiFetch(
          `/api/renovation/records?malekId=${encodeURIComponent(ownerId)}&codeNosazi=${encodeURIComponent(normalizedCode)}`,
          { headers },
        ),
      ]);

      const renovationData: ApiResponse = renovationRes.ok
        ? await renovationRes.json()
        : { IsSuccess: false, IsFailure: true };
      const recordsData: ApiResponse = recordsRes.ok
        ? await recordsRes.json()
        : { IsSuccess: false, IsFailure: true };
      const renovationValue = isApiSuccess(renovationData)
        ? getApiValue(renovationData)
        : {};
      const recordsValue = isApiSuccess(recordsData)
        ? getApiValue(recordsData)
        : [];

      const feePairs = toModernTollPairs(renovationValue);
      setFeesRight(feePairs.filter((_: unknown, i: number) => i % 2 === 0));
      setFeesLeft(feePairs.filter((_: unknown, i: number) => i % 2 === 1));

      const rawRecords = Array.isArray(recordsValue)
        ? recordsValue
        : (recordsValue.items ?? recordsValue.data ?? []);
      setHistoryItems(
        rawRecords.map((item: any, index: number) => ({
          id: String(item.id ?? index + 1),
          date: item.date ?? item.tarikh ?? "—",
          amount: String(item.amount ?? item.mablagh ?? "—"),
          status: item.status ?? "—",
        })),
      );

      if (rawOwners.length === 0) {
        rawOwners = Array.isArray(renovationValue?.owners)
          ? renovationValue.owners
          : renovationValue?.owner
            ? [renovationValue.owner]
            : [];
      }
      setOwners(rawOwners.map(mapOwner));
    } catch {}
  };

  // هندلر کلیک روی یک ملک از لیست زیرمجموعه
  const selectPropertyFromList = (property: LocalPropertyItem) => {
    setSearchInputs(property.codes);
    setSelectedProperty(property);
    setOwners([]);
    setFeesRight([]);
    setFeesLeft([]);
    setHistoryItems([]);
    setError("");
  };

  const handlePropertyTreeSelect = (property: TreePropertyItem, treeItem: PropertyTreeItem) => {
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
    
    const prop: LocalPropertyItem = {
      id: treeItem.id,
      fullCode: treeItem.fullCode,
      ownerName: property.description,
      description: treeItem.text,
      codes: codes,
    };
    
    selectPropertyFromList(prop);
    void loadRenovationData(prop.id, prop.fullCode);
  };

  useEffect(() => {
    const loadProperties = async () => {
      const nationalCode = localStorage.getItem("user-national-code");
      if (!token || !nationalCode) return;
      try {
        const data = await fetchCurrentUserPropertyFiles(token);

        if (!isApiSuccess(data)) return;

        const rawList = getPropertyFileList(data);
        const mapped: LocalPropertyItem[] = flattenApiPropertyFiles(rawList).map(
          (item: any, index: number) => {
            const cleanedCode = normalizeCode(
              item.codeN ?? item.fullCode ?? item.codeNosazi ?? "",
            );
            return {
              id: String(item.Id ?? item.shop ?? index + 1),
              fullCode: cleanedCode || "—",
              ownerName: item.ownerName ?? item.tvItems?.[0]?.Text ?? "—",
              description:
                item.tvItems?.[0]?.Text?.trim() ?? item.codeN ?? "بدون توضیحات",
              codes: splitCode(cleanedCode),
            };
          },
        );
        setPropertyItems(mapped);

        // انتخاب خودکار آیتم اول - تلاش برای بازیابی ملک انتخاب شده از localStorage
        if (mapped.length > 0) {
          // Try to restore previously selected property from localStorage
          const storedFullCode = getSelectedPropertyFullCode();
          let selectedProp: LocalPropertyItem | null = null;
          
          if (storedFullCode) {
            const normalizedStoredCode = normalizeRenewalCode(storedFullCode);
            // Find matching property by fullCode
            selectedProp = mapped.find(item => 
              normalizeRenewalCode(item.fullCode) === normalizedStoredCode
            ) ?? null;

            if (!selectedProp) {
              const cleanedStoredCode = normalizeCode(storedFullCode);
              selectedProp = {
                id:
                  localStorage.getItem("municipality-selected-property-id") ??
                  cleanedStoredCode,
                fullCode: cleanedStoredCode,
                ownerName: "—",
                description: storedFullCode,
                codes: splitCode(cleanedStoredCode),
              };
            }
          }
          
          // If no stored property found, use the first one
          const propertyToSelect = selectedProp ?? mapped[0];
          setSelectedProperty(propertyToSelect);
          setSearchInputs(propertyToSelect.codes);
          void loadRenovationData(propertyToSelect.id, propertyToSelect.fullCode);
        }
      } catch {}
    };
    void loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSearch = async () => {
    if (!selectedProperty) return;
    setError("");
    setOwners([]);
    setFeesRight([]);
    setFeesLeft([]);
    setHistoryItems([]);
    try {
      await loadRenovationData(selectedProperty.id, codeNosazi);
    } catch {
      setError("خطا در دریافت اطلاعات نوسازی.");
    }
  };

  const HelpButton = ({ title, desc }: { title: string; desc: string }) => (
    <button
      type="button"
      onClick={() => handleOpenHelp(title, desc)}
      className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 md:text-xs"
    >
      <Info className="h-3.5 w-3.5" /> راهنما
    </button>
  );

  const currentFeeRows = mergePairs(feesRight, feesLeft);
  const hasCurrentFees = currentFeeRows.length > 0;

  // GIS Parameters
  const mapRef = useRef<MapHandle>(null);
  const fullCode = codeNosazi;
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
    >
      {/* مودال راهنما */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                <h3 className="flex items-center gap-2 text-base font-bold text-primary">
                  <Info className="h-5 w-5" />
                  {modalContent.title}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 text-sm leading-7 text-foreground/80">
                {modalContent.description}
              </div>
              <div className="px-6 py-4 text-left">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform active:scale-95"
                >
                  فهمیدم
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* هدر */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
      >
        <div className="container mx-auto px-0 md:px-2 lg:px-6">
          <div className="nav-shell">
            <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
              <Link
                to="/"
                className="header-action-btn inline-flex items-center gap-2 px-3"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden text-sm md:block">بازگشت</span>
              </Link>
              <h1 className="text-sm font-bold text-foreground md:text-base">
                عوارض نوسازی
              </h1>
              <button onClick={toggleTheme} className="header-action-btn">
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="section-decor px-3 pb-12 pt-10 md:pb-20 md:pt-10 lg:px-6">
        <div className="container mx-auto max-w-6xl space-y-5">
          <div className="rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm">
            کاربر گرامی، لطفاً پس از انتخاب ملک خود دکمه جستجو را بزنید.
          </div>

          {/* بخش جستجو */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">جستجو</h2>
              </div>
              <HelpButton
                title="جستجو"
                desc="کد نوسازی ۷ بخشی خود را وارد کنید."
              />
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-8">
              <button
                onClick={handleSearch}
                className="flex h-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/20"
              >
                <Search className="ml-1.5 h-4 w-4" /> جستجو
              </button>

              {guildCodeFields.map((field) => (
                <div key={field.key} className="relative">
                  <input
                    value={searchInputs[field.key]}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-border/70 bg-card px-2 text-center text-sm font-medium outline-none focus:border-primary transition-colors"
                    dir="ltr"
                  />
                  <span className="absolute -top-2 right-3 bg-card px-1 text-[9px] text-muted-foreground">
                    {field.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.article>

          {/* Property Tree List */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  پرونده‌های زیرمجموعه
                </h2>
              </div>
              <HelpButton
                title="زیرمجموعه"
                desc="لیست املاک شما در این بخش نمایش داده می‌شود."
              />
            </div>
            <div className="p-4">
              <PropertyTreeList
                onPropertySelect={handlePropertyTreeSelect}
                compact
              />
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">مالکین</h2>
              </div>
              <HelpButton
                title="مالکین"
                desc="در این جدول اطلاعات مالک یا مالکین پرونده انتخاب‌شده نمایش داده می‌شود. برای به‌روزرسانی جدول، پرونده را انتخاب کنید و جستجو را بزنید."
              />
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-right text-[11px] md:text-xs">
                <thead>
                  <tr className="bg-[var(--primary-soft)] text-primary">
                    <th className="border border-border/50 p-2 text-center">
                      #
                    </th>
                    <th className="border border-border/50 p-2">نام</th>
                    <th className="border border-border/50 p-2">
                      نام خانوادگی
                    </th>
                    <th className="border border-border/50 p-2">نوع مالک</th>
                    <th className="border border-border/50 p-2">نام پدر</th>
                    <th className="border border-border/50 p-2">محل صدور</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map((owner, i) => (
                    <tr key={i} className="transition-colors hover:bg-muted/30">
                      <td className="border border-border/50 p-2 text-center font-bold">
                        {owner.id}
                      </td>
                      <td className="border border-border/50 p-2">
                        {owner.firstName}
                      </td>
                      <td className="border border-border/50 p-2">
                        {owner.lastName}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.ownerType}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.fatherName}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.birthPlace}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-muted-foreground"
                      >
                        ابتدا جستجو کنید
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.article>

          {/* عوارض نوسازی جاری */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  عوارض نوسازی جاری
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <HelpButton
                  title="عوارض نوسازی جاری"
                  desc="پس از جستجو، ریز مبالغ عوارض نوسازی، بدهی، معافیت، تخفیف و مبلغ قابل پرداخت در این بخش نمایش داده می‌شود. خروجی اکسل و PDF فقط وقتی داده دریافت شده باشد فعال است."
                />
                {hasCurrentFees && (
                  <>
                  <button
                    type="button"
                    onClick={() =>
                      exportPairsToExcel(currentFeeRows, "عوارض نوسازی جاری")
                    }
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:text-emerald-300"
                  >
                    <Download className="h-4 w-4" />
                    خروجی اکسل
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      exportPairsToPdf(currentFeeRows, "عوارض نوسازی جاری")
                    }
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-sky-500/35 bg-sky-500/10 px-3 text-xs font-bold text-sky-700 transition-colors hover:bg-sky-500/15 dark:text-sky-300"
                  >
                    <FileText className="h-4 w-4" />
                    خروجی پی دی اف
                  </button>
                  </>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-0 md:grid-cols-2">
                <div className="space-y-0">
                  {(feesRight.length
                    ? feesRight
                    : Array(9).fill({ label: "—", value: "—" })
                  ).map((field, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-border/30 py-2.5 text-xs md:text-sm"
                    >
                      <span className="text-muted-foreground">
                        {field.label} :
                      </span>
                      <span className="font-medium text-foreground/80">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-0">
                  {(feesLeft.length
                    ? feesLeft
                    : Array(9).fill({ label: "—", value: "—" })
                  ).map((field, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-border/30 py-2.5 text-xs md:text-sm"
                    >
                      <span className="text-muted-foreground">
                        {field.label} :
                      </span>
                      <span className="font-medium text-foreground/80">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>

          {/* سوابق نوسازی */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  سوابق نوسازی جاری
                </h2>
              </div>
              <HelpButton
                title="سوابق نوسازی"
                desc="در این قسمت سوابق پرداخت یا رکوردهای قبلی مرتبط با پرونده انتخاب‌شده نمایش داده می‌شود. اگر موردی وجود نداشته باشد پیام خالی بودن داده نشان داده می‌شود."
              />
            </div>
            <div className="p-4">
              {historyItems.length > 0 ? (
                <div className="space-y-2">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between rounded-lg border p-3 text-xs"
                    >
                      <span>تاریخ: {item.date}</span>
                      <span>مبلغ: {item.amount}</span>
                      <span className="text-emerald-500">{item.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-xs text-destructive">
                  موردی برای نمایش وجود ندارد.
                </div>
              )}
              {error && (
                <div className="mt-3 text-xs text-destructive">{error}</div>
              )}
            </div>
          </motion.article>
          
          {/* نقشه */}
          <motion.article
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel group relative h-64 overflow-hidden sm:h-80 md:h-[400px]">            
              <button
                type="button"
                onClick={() =>
                  handleOpenHelp(
                    "نقشه ملک",
                    "این قسمت موقعیت ملک را نشان می‌دهد. با کلیک کردن روی هر ملک، اطلاعات اصلی ملک روی نقشه نمایش داده می‌شود و دکمه‌های بزرگنمایی و بازگشت برای کنترل نما قرار دارند.",
                  )
                }
                className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-lg border bor                                                                                                                                                                                                                                                                                                         der-primary/35 bg-card/90 px-2.5 py-1 text-[10px] font-bold text-primary shadow-lg transition-colors hover:bg-card md:text-xs"
              >
                <Info className="h-3.5 w-3.5" /> راهنما
              </button>                  
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
      </main>
    </div>
  );
}

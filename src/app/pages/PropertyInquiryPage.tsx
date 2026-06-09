// src/pages/PropertyInquiryPage.tsx

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import {
  AlertCircle,
  ArrowRight,
  Compass,
  FileText,
  Home,
  Info,
  Layers,
  Loader,
  Minus,
  Moon,
  Plus,
  Search,
  Sun,
  Trash2,
  X,
} from "lucide-react";

import { Link } from "react-router";

import {
  guildCodeFields,
  type RenewalCodeKey,
  type RenewalCodes,
  getSelectedPropertyFullCode,
  normalizeRenewalCode,
} from "../data/properties";
import { useRetreatData } from "../data/Useretreatdata";
import type {
  LabelValueRow,
  RetreatDirectionTableRow,
  RetreatSetbackTableRow,
} from "../data/retreat";
import { apiFetch } from "../data/api";
import {
  isApiSuccess,
  getApiErrorMessage,
  getApiValue,
  type ApiResponse,
} from "../utils/apiResponseHandler";
import { PropertyTreeList, type PropertyItem, type PropertyTreeItem } from "../components/PropertyTreeList";

interface PropertyInquiryPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

interface SubProperty {
  id: string;
  fullCode: string;
  ownerName: string;
  description: string;
  codes: RenewalCodes;
}

function ResponsiveInfoTable({
  rows,
  title,
}: {
  rows: LabelValueRow[];
  title?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card/40">
      <table className="w-full table-fixed text-right text-[11px] sm:text-xs md:text-sm">
        {title && (
          <caption className="border-b border-border/70 bg-[var(--primary-soft)]/60 px-3 py-2 text-right font-bold text-foreground">
            {title}
          </caption>
        )}
        <tbody className="divide-y divide-border/60">
          {rows.map((row, index) => (
            <tr key={`${row.label}-${index}`} className="align-top">
              <th className="w-[42%] bg-muted/25 px-2.5 py-2 text-right font-semibold leading-6 text-muted-foreground sm:px-3">
                <span className="block whitespace-normal break-words">
                  {row.label}
                </span>
              </th>
              <td className="px-2.5 py-2 font-medium leading-6 text-foreground sm:px-3">
                <span className="block whitespace-normal break-words [overflow-wrap:anywhere]">
                  {row.value}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type CompactColumn<T> = {
  key: keyof T;
  label: string;
  optional?: boolean;
};

function CompactRetreatTable<T extends object>({
  columns,
  rows,
}: {
  columns: CompactColumn<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card/40">
      <table className="w-full table-fixed border-collapse text-right text-[10px] leading-5 sm:text-[11px] md:text-xs">
        <thead className="bg-[var(--primary-soft)]/70 text-foreground">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`border border-border/60 px-1.5 py-2 font-bold sm:px-2 ${
                  column.optional ? "hidden min-[560px]:table-cell" : ""
                }`}
              >
                <span className="block whitespace-normal break-words">
                  {column.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="align-middle hover:bg-muted/25">
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`border border-border/60 px-1.5 py-2 font-semibold text-foreground sm:px-2 ${
                    column.optional ? "hidden min-[560px]:table-cell" : ""
                  }`}
                >
                  <span className="block whitespace-normal break-words [overflow-wrap:anywhere]">
                    {String(row[column.key] ?? "")}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const setbackColumns: CompactColumn<RetreatSetbackTableRow>[] = [
  { key: "direction", label: "جهت" },
  { key: "wideningWidth", label: "عرض تعریض" },
  { key: "retreat", label: "عقب‌نشینی" },
  { key: "expansionDepth", label: "عمق توسعه", optional: true },
  { key: "originalFrontDepth", label: "عمق نمای اصلی", optional: true },
  { key: "boundaryType", label: "نوع حریم", optional: true },
  { key: "boundaryDistance", label: "فاصله حریم", optional: true },
  { key: "adjacencyType", label: "نوع مجاورت", optional: true },
];

const directionColumns: CompactColumn<RetreatDirectionTableRow>[] = [
  { key: "direction", label: "جهت" },
  { key: "passageType", label: "نوع معبر" },
  { key: "passageName", label: "نام معبر" },
  { key: "documentSideLength", label: "طول ضلع طبق سند" },
  { key: "documentFrontLength", label: "طول بر طبق سند" },
  { key: "currentSideLength", label: "طول ضلع موجود", optional: true },
  { key: "currentFrontLength", label: "طول بر موجود", optional: true },
];

export function PropertyInquiryPage({
  isDark,
  toggleTheme,
}: PropertyInquiryPageProps) {
  const {
    data: retreatData,
    loading: loadingRetreat,
    error: retreatError,
    refetch: refetchRetreat,
    reset: resetRetreat,
  } = useRetreatData();

  const [subProperties, setSubProperties] = useState<SubProperty[]>([]);

  const [loadingSubProperties, setLoadingSubProperties] = useState(false);

  const [subPropertiesError, setSubPropertiesError] = useState<string | null>(
    null,
  );

  const [selectedSubProperty, setSelectedSubProperty] =
    useState<SubProperty | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

  const splitCode = (code = ""): RenewalCodes => {
    const parts = code.split("-");

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

  const codeNosazi = `${searchInputs.region}-${searchInputs.neighborhood}-${searchInputs.block}-${searchInputs.property}-${searchInputs.building}-${searchInputs.apartment}-${searchInputs.guild}`;

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({
      title,
      description,
    });

    setIsModalOpen(true);
  };

  const handleInputChange = (key: RenewalCodeKey, value: string) => {
    setSearchInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const loadRetreatData = async (code: string) => {
    if (!token) return;

    try {
      await refetchRetreat(code, token);
    } catch (err) {
      console.error(err);
    }
  };

  const selectPropertyFromList = (subProperty: SubProperty) => {
    setSelectedSubProperty(subProperty);

    setSearchInputs(subProperty.codes);

    setError("");
    resetRetreat();
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
    
    const subProp: SubProperty = {
      id: treeItem.id,
      fullCode: treeItem.fullCode,
      ownerName: property.description,
      description: treeItem.text,
      codes: codes,
    };
    
    selectPropertyFromList(subProp);
    void loadRetreatData(subProp.fullCode);
  };

  useEffect(() => {
    const loadSubProperties = async () => {
      const nationalCode =
        typeof window !== "undefined"
          ? localStorage.getItem("user-national-code")
          : null;

      if (!token || !nationalCode) return;

      setLoadingSubProperties(true);

      setSubPropertiesError(null);

      try {
        const response = await apiFetch(
          `/api/file?nationalCode=${encodeURIComponent(nationalCode)}`,
          {
            method: "GET",
            cache: "no-store",

            headers: {
              Accept: "application/json",

              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("خطا در دریافت پرونده‌ها");
        }

        const result: ApiResponse = await response.json();

        if (!isApiSuccess(result)) {
          throw new Error(getApiErrorMessage(result));
        }

        const fileValue = getApiValue(result);
        const rawList = Array.isArray(fileValue)
          ? fileValue
          : (fileValue.items ?? fileValue.data ?? fileValue.files ?? []);

        const mapped: SubProperty[] = rawList.map(
          (item: any, index: number) => ({
            id: String(item.Id ?? item.shop ?? index + 1),

            fullCode: item.codeN ?? "—",

            ownerName: item.ownerName ?? item.tvItems?.[0]?.Text ?? "—",

            description:
              item.tvItems?.[0]?.Text?.trim() ?? item.codeN ?? "بدون توضیحات",

            codes: splitCode(item.codeN ?? ""),
          }),
        );

        setSubProperties(mapped);

        // انتخاب اولیه - تلاش برای بازیابی ملک انتخاب شده از localStorage
        if (mapped.length > 0) {
          // Try to restore previously selected property from localStorage
          const storedFullCode = getSelectedPropertyFullCode();
          let selectedProperty: SubProperty | null = null;
          
          if (storedFullCode) {
            const normalizedStoredCode = normalizeRenewalCode(storedFullCode);
            // Find matching property by fullCode
            selectedProperty = mapped.find(item => 
              normalizeRenewalCode(item.fullCode) === normalizedStoredCode
            ) ?? null;

            if (!selectedProperty) {
              selectedProperty = {
                id:
                  localStorage.getItem("municipality-selected-property-id") ??
                  normalizedStoredCode,
                fullCode: storedFullCode,
                ownerName: "—",
                description: storedFullCode,
                codes: splitCode(storedFullCode),
              };
            }
          }
          
          // If no stored property found, use the first one
          const propertyToSelect = selectedProperty ?? mapped[0];
          setSelectedSubProperty(propertyToSelect);
          setSearchInputs(propertyToSelect.codes);
          void loadRetreatData(propertyToSelect.fullCode);
        }
      } catch (err) {
        console.error(err);

        setSubPropertiesError("خطا در بارگذاری پرونده‌ها");
      } finally {
        setLoadingSubProperties(false);
      }
    };

    void loadSubProperties();
  }, [token]);

  const handleSearch = async () => {
    if (!codeNosazi || codeNosazi === "------") {
      setError("کد نوسازی کامل نیست");

      return;
    }

    setError("");

    await loadRetreatData(codeNosazi);
  };

  const HelpButton = ({ title, desc }: { title: string; desc: string }) => (
    <button
      onClick={() => handleOpenHelp(title, desc)}
      className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 md:text-xs"
    >
      <Info className="h-3.5 w-3.5" />
      راهنما
    </button>
  );

  const ErrorAlert = ({ message }: { message: string }) => (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-start gap-3 text-sm text-destructive">
      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />

      <span>{message}</span>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <Loader className="h-6 w-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
    >
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
      >
        <div className="container mx-auto px-0 md:px-2 lg:px-6">
          <div className="nav-shell bg-card border border-border/50 rounded-2xl shadow-sm">
            <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
              <Link
                to="/"
                className="header-action-btn inline-flex items-center gap-2 px-3"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden text-sm md:block">بازگشت</span>
              </Link>

              <h1 className="text-sm font-bold text-foreground md:text-base">
                وضعیت عقب نشینی
              </h1>

              <div className="flex items-center gap-1.5 md:gap-3 flex-row-reverse">
                <button
                  onClick={toggleTheme}
                  className="header-action-btn flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 md:py-2 text-xs font-bold text-primary-foreground shadow transition-transform active:scale-95"
                >
                  <Info className="h-3.5 w-3.5" />
                  راهنما
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/40 backdrop-blur-md"
            />

            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
                y: 20,
              }}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="px-3 pb-12 pt-10">
        <div className="container mx-auto max-w-6xl space-y-5">
          {/* search */}
          <motion.article className="soft-card mesh-panel overflow-hidden mt-[60px]">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />

                <h2 className="text-sm font-bold">جستجو</h2>
              </div>

              <HelpButton title="جستجو" desc="کد نوسازی" />
            </div>

            <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-8">
              <button
                onClick={handleSearch}
                className="flex h-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white"
              >
                <Search className="ml-1.5 h-4 w-4" />
                جستجو
              </button>

              {guildCodeFields.map((field) => (
                <div key={field.key} className="relative">
                  <input
                    value={searchInputs[field.key]}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-border/70 bg-card px-2 text-center text-sm"
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
          <motion.article className="soft-card mesh-panel">
            <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
              <Layers className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold">پرونده‌های زیر مجموعه</h2>
            </div>
            <div className="p-4">
              <PropertyTreeList
                onPropertySelect={handlePropertyTreeSelect}
                compact
              />
            </div>
          </motion.article>
          {/* area */}
          <div className="space-y-5">
            <motion.article className="soft-card mesh-panel">
              <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
                <FileText className="h-4 w-4 text-primary" />

                <span className="text-sm font-bold">وضعیت عقب نشینی</span>
              </div>

              <div className="space-y-3 p-4">
                {loadingRetreat ? (
                  <LoadingSpinner />
                ) : retreatError ? (
                  <ErrorAlert message={retreatError} />
                ) : retreatData?.area ? (
                  <ResponsiveInfoTable rows={retreatData.area.rows} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    ابتدا جستجو کنید
                  </div>
                )}
              </div>
            </motion.article>

            <motion.article className="soft-card mesh-panel overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
                <FileText className="h-4 w-4 text-primary" />

                <span className="text-sm font-bold">عقب‌نشینی</span>
              </div>

              <div className="space-y-4 p-4">
                {loadingRetreat ? (
                  <LoadingSpinner />
                ) : retreatError ? (
                  <ErrorAlert message={retreatError} />
                ) : retreatData?.setbackRows?.length ? (
                  <CompactRetreatTable
                    columns={setbackColumns}
                    rows={retreatData.setbackRows}
                  />
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    اطلاعاتی موجود نیست
                  </div>
                )}
              </div>
            </motion.article>

            {/* directions */}
            <motion.article className="soft-card mesh-panel overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
                <Compass className="h-4 w-4 text-primary" />

                <span className="text-sm font-bold">جهات چهارگانه</span>
              </div>

              <div className="space-y-4 p-4">
                {loadingRetreat ? (
                  <LoadingSpinner />
                ) : retreatError ? (
                  <ErrorAlert message={retreatError} />
                ) : retreatData?.directionRows?.length ? (
                  <CompactRetreatTable
                    columns={directionColumns}
                    rows={retreatData.directionRows}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    اطلاعاتی موجود نیست
                  </div>
                )}
              </div>
            </motion.article>
          </div>

          {error && <ErrorAlert message={error} />}
        </div>
      </main>
    </div>
  );
}

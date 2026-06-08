import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Info,
  X,
  Layers,
  ClipboardList,
  FileSearch,
  Plus,
  Minus,
  Home,
  Trash2,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { Link } from "react-router";
import {
  guildCodeFields,
  getSelectedPropertyFullCode,
  type RenewalCodeKey,
  type RenewalCodes,
} from "../data/properties";
import {
  isApiSuccess,
  getApiErrorMessage,
  getApiValue,
  type ApiResponse,
} from "../utils/apiResponseHandler";
import { PropertyTreeList, type PropertyItem, type PropertyTreeItem } from "../components/PropertyTreeList";

interface OwnerPropertyItem {
  id: string;
  fullCode: string;
  type: string;
  ownerName: string;
  description: string;
  raw?: Record<string, unknown>;
}

interface RequestRow {
  code: string;
  title: string;
  status: string;
  date: string;
}

interface RequestDetailRow {
  label: string;
  value: string;
}

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
}

export function PropertyRequestDetails({ isDark, toggleTheme }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // فایلی که در لیست انتخاب شده اما هنوز جستجو نشده است
  const emptySearchValues: RenewalCodes = {
    region: "",
    neighborhood: "",
    block: "",
    property: "",
    building: "",
    apartment: "",
    guild: "",
  };
  // مقادیری که در اینپوت‌های جستجو نمایش داده می‌شوند
  const [searchValues, setSearchValues] =
    useState<RenewalCodes>(emptySearchValues);

  // فایلی که اطلاعاتش در کل صفحه (جدول و جزئیات) نمایش داده می‌شود
  const [ownerProperties, setOwnerProperties] = useState<OwnerPropertyItem[]>(
    [],
  );
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [requestDetails, setRequestDetails] = useState<RequestDetailRow[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [apiError, setApiError] = useState("");
  const [selectedCodeNosazi, setSelectedCodeNosazi] = useState("");

  const toSearchValuesFromCode = (fullCode: string): RenewalCodes => {
    const clean = fullCode.trim();
    if (!clean) return emptySearchValues;
    const parts = clean.includes("-") ? clean.split("-") : clean.split("/");
    const normalized = parts.map((part) => part.trim()).filter(Boolean);
    while (normalized.length < 7) normalized.push("");
    return {
      region: normalized[0] ?? "",
      neighborhood: normalized[1] ?? "",
      block: normalized[2] ?? "",
      property: normalized[3] ?? "",
      building: normalized[4] ?? "",
      apartment: normalized[5] ?? "",
      guild: normalized[6] ?? "",
    };
  };

  const buildCodeFromSearchValues = (values: RenewalCodes) =>
    [
      values.region,
      values.neighborhood,
      values.block,
      values.property,
      values.building,
      values.apartment,
      values.guild,
    ]
      .map((value) => value.trim())
      .join("-");

  const handleSearchInputChange = (key: RenewalCodeKey, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getTextValue = (value: unknown): string => {
    if (typeof value === "string") return value.trim();
    if (value === null || value === undefined) return "";
    return String(value).trim();
  };

  const getOwnerNameFromItem = (item: any): string => {
    const firstName = getTextValue(item.Name ?? item.firstName);
    const lastName = getTextValue(item.Family ?? item.lastName);
    const combinedName = [firstName, lastName].filter(Boolean).join(" ");

    return (
      getTextValue(item.ownerName) ||
      getTextValue(item.owner?.name) ||
      getTextValue(item.malekName) ||
      getTextValue(item.ownerFullName) ||
      combinedName ||
      getTextValue(item.name) ||
      "-"
    );
  };

  const getListFromApiValue = (value: any): any[] => {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];

    const nestedValue = value.Value ?? value.value;
    if (Array.isArray(nestedValue)) return nestedValue;

    const nestedList = value.data ?? value.items ?? value.files ?? value.result;
    if (Array.isArray(nestedList)) return nestedList;
    if (nestedList && typeof nestedList === "object") return [nestedList];

    return [value];
  };

  const mapApiResponseToRequests = (data: any): RequestRow[] => {
    const rawList = getListFromApiValue(data);

    return rawList.map((item: any, index: number) => ({
      code: String(item.shodarkhast ?? item.requestId ?? item.id ?? index + 1),
      title:
        item.noedarkhast ??
        item.requestTitle ??
        item.title ??
        item.subject ??
        "—",
      status: item.vaziatErja ?? item.statusTitle ?? item.status ?? "—",
      date: formatDate(
        item.date_rooz ?? item.date ?? item.createDate ?? item.createdAt ?? "—",
      ),
    }));
  };

  const mapApiResponseToDetails = (data: any): RequestDetailRow[] => {
    const detailObj = getListFromApiValue(data)[0];

    if (!detailObj) return [];

    return [
      { label: "شماره درخواست", value: String(detailObj.shodarkhast ?? "—") },
      { label: "نوع درخواست", value: String(detailObj.noedarkhast ?? "—") },
      { label: "وضعیت", value: String(detailObj.vaziatErja ?? "—") },
      { label: "تاریخ", value: formatDate(detailObj.date_rooz ?? "—") },
      { label: "مرحله", value: String(detailObj.marhaleh ?? "—") },
      { label: "گیرنده", value: String(detailObj.girandeh ?? "—") },
      {
        label: "وضعیت کسری",
        value: String(detailObj.EnumDefectStatus_Name ?? "—"),
      },
      { label: "شماره پیگیری", value: String(detailObj.shop ?? "—") },
    ];
  };

  const formatDate = (date: any): string => {
    if (!date) return "—";

    // اگر تاریخ به فرمت 14041216 باشد
    if (typeof date === "number" && date.toString().length === 8) {
      const dateStr = date.toString();
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${year}/${month}/${day}`;
    }

    // اگر تاریخ به فرمت‌های دیگر باشد
    if (typeof date === "string" && date.includes("/")) {
      return date;
    }

    return String(date);
  };

  const fetchRequestData = async (codeNosazi: string) => {
    setLoadingRequests(true);
    setApiError("");
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("توکن احراز هویت یافت نشد.");

      const response = await fetch(
        `/api/request?codeNosazi=${encodeURIComponent(codeNosazi)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات پیگیری درخواست.");
      }

      const data: ApiResponse = await response.json();

      if (isApiSuccess(data)) {
        const dataValue = getApiValue(data);
        const mappedRows = mapApiResponseToRequests(dataValue);
        const mappedDetails = mapApiResponseToDetails(dataValue);

        setRequests(mappedRows);
        setRequestDetails(mappedDetails);
      } else {
        throw new Error(getApiErrorMessage(data));
      }
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "خطا در دریافت اطلاعات",
      );
      setRequests([]);
      setRequestDetails([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    const fetchOwnerProperties = async () => {
      setLoadingProperties(true);
      setApiError("");
      try {
        const token = localStorage.getItem("auth-token");
        const nationalCode = localStorage.getItem("user-national-code");
        if (!token || !nationalCode) return;

        const response = await fetch(
          `/api/file?nationalCode=${encodeURIComponent(nationalCode)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("خطا در دریافت لیست املاک مالک.");
        }

        const data: ApiResponse = await response.json();

        if (!isApiSuccess(data)) {
          throw new Error(getApiErrorMessage(data));
        }

        const fileValue = getApiValue(data);
        const rawList = Array.isArray(fileValue)
          ? fileValue
          : (fileValue?.items ?? fileValue?.data ?? fileValue?.files ?? []);

        const mappedProperties: OwnerPropertyItem[] = rawList.map(
          (item: any, index: number) => ({
            id: String(item.Id ?? item.id ?? index),
            fullCode: item.codeN ?? item.fullCode ?? "—",
            type: item.type ?? "ملک",
            ownerName: getOwnerNameFromItem(item),
            description:
              getTextValue(item.tvItems?.[0]?.Text?.trim()) ||
              getTextValue(item.codeN) ||
              "بدون توضیحات",
            raw: item,
          }),
        );

        setOwnerProperties(mappedProperties);
        if (mappedProperties[0]) {
          const storedFullCode = getSelectedPropertyFullCode()?.trim();
          const codeToSelect =
            storedFullCode || mappedProperties[0].fullCode;

          setSelectedCodeNosazi(codeToSelect);
          setSearchValues(toSearchValuesFromCode(codeToSelect));
          void fetchRequestData(codeToSelect);
        }
      } catch (error) {
        setApiError(
          error instanceof Error ? error.message : "خطا در دریافت اطلاعات",
        );
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchOwnerProperties();
  }, []);

  // وقتی کاربر روی دکمه جستجو کلیک می‌کند
  const handleSearch = () => {
    const codeNosazi = buildCodeFromSearchValues(searchValues);
    setSelectedCodeNosazi(codeNosazi);
    void fetchRequestData(codeNosazi);
  };

  const handlePropertyTreeSelect = (property: PropertyItem, treeItem: PropertyTreeItem) => {
    const codeNosazi = treeItem.fullCode;
    setSelectedCodeNosazi(codeNosazi);
    setSearchValues(toSearchValuesFromCode(codeNosazi));
    setApiError("");
    void fetchRequestData(codeNosazi);
  };

  // آپدیت لیست درخواست‌ها بر اساس فایل فعال
  const filledRequestRows = useMemo(() => requests, [requests]);

  const HelpButton = () => (
    <button
      onClick={() => setIsModalOpen(true)}
      className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 md:text-xs"
    >
      <Info className="h-3.5 w-3.5" /> راهنما
    </button>
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
                پیگیری درخواست ها
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

      <main className="container mx-auto space-y-6 px-2 pt-10 md:px-4 md:pt-10 lg:px-6">
        <motion.article className="soft-card mesh-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold">جستجو</h2>
            </div>
            <HelpButton />
          </div>

          <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-8">
            <button
              onClick={handleSearch}
              disabled={loadingRequests}
              className="flex h-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search className="ml-1.5 h-4 w-4" />
              {loadingRequests ? "در حال دریافت" : "جستجو"}
            </button>

            {guildCodeFields.map((field) => (
              <div key={field.key} className="relative">
                <input
                  value={searchValues[field.key]}
                  onChange={(event) =>
                    handleSearchInputChange(field.key, event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-border/70 bg-card px-2 text-center text-sm font-medium outline-none transition-colors focus:border-primary"
                  dir="ltr"
                />
                <span className="absolute -top-2 right-3 bg-card px-1 text-[9px] text-muted-foreground">
                  {field.label}
                </span>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article className="soft-card mesh-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold">پرونده های زیرمجموعه</h2>
            </div>
            <HelpButton />
          </div>
          <div className="p-4">
            {loadingProperties ? (
              <div className="rounded-xl border border-border/70 bg-card/40 px-4 py-3 text-sm text-muted-foreground">
                در حال دریافت پرونده ها...
              </div>
            ) : (
              <PropertyTreeList
                onPropertySelect={handlePropertyTreeSelect}
                selectedPropertyFullCode={selectedCodeNosazi}
                compact
              />
            )}
          </div>
        </motion.article>

        {apiError && (
          <div className="rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {apiError}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* جدول پیگیری - متصل به activeFile */}
          <motion.article className="soft-card mesh-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold">پیگیری درخواست ها</h2>
              </div>
              <HelpButton />
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground">
                    <th className="p-2 text-right font-medium">کد</th>
                    <th className="p-2 text-right font-medium">عنوان</th>
                    <th className="p-2 text-right font-medium">وضعیت</th>
                    <th className="p-2 text-right font-medium">تاریخ</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRequests && (
                    <tr>
                      <td className="p-2 text-muted-foreground" colSpan={4}>
                        در حال دریافت اطلاعات...
                      </td>
                    </tr>
                  )}
                  {!loadingRequests && filledRequestRows.length === 0 && (
                    <tr>
                      <td className="p-2 text-muted-foreground" colSpan={4}>
                        اطلاعاتی یافت نشد
                      </td>
                    </tr>
                  )}
                  {filledRequestRows.map((row) => (
                    <tr
                      key={row.code}
                      className="border-b border-border/40 hover:bg-muted/20"
                    >
                      <td className="p-2">{row.code}</td>
                      <td className="p-2">{row.title}</td>
                      <td
                        className={`p-2 ${
                          row.status.includes("ابطال")
                            ? "text-red-600 dark:text-red-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {row.status}
                      </td>
                      <td className="p-2 text-left" dir="ltr">
                        {row.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.article>

          {/* جزئیات درخواست - متصل به activeFile */}
          <motion.article className="soft-card mesh-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <FileSearch className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold">جزئیات درخواست</h2>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {requestDetails.length > 0 ? (
                requestDetails.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between border-b border-border/40 pb-2 text-sm"
                  >
                    <span className="text-muted-foreground">{d.label}</span>
                    <strong className="text-foreground">{d.value}</strong>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">
                  {loadingRequests
                    ? "در حال بارگذاری..."
                    : "اطلاعاتی برای نمایش وجود ندارد"}
                </div>
              )}
            </div>
          </motion.article>
        </div>

        {/* بخش نقشه */}
        <motion.article className="soft-card mesh-panel relative h-[360px] overflow-hidden">
          <div className="absolute inset-0 bg-slate-800/10">
            <img
              src="/map-placeholder.jpg"
              alt="نقشه"
              className="h-full w-full object-cover opacity-80"
            />
          </div>
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-xl border border-border/40">
              <Plus className="h-5 w-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-xl border border-border/40">
              <Minus className="h-5 w-5" />
            </button>
          </div>
        </motion.article>
      </main>

      {/* مودال راهنما */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute left-4 top-4 rounded-lg p-1 hover:bg-muted/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-bold mb-4">راهنما</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • برای جستجوی کد نوسازی، مقادیر را وارد کرده و دکمه جستجو را
                  بزنید.
                </p>
                <p>
                  • با کلیک روی هر پرونده در لیست، اطلاعات آن نمایش داده می‌شود.
                </p>
                <p>
                  • جدول پیگیری درخواست‌ها و جزئیات به‌صورت خودکار بروزرسانی
                  می‌شوند.
                </p>
                <p>• برای بزرگنمایی نقشه از دکمه‌های + و - استفاده کنید.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

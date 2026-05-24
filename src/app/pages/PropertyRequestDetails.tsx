import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router";
import {
  getRenewalCodeValues,
  propertyItems,
  type MockProperty,
} from "../data/properties";
import { useSelectedProperty } from "../hooks/useSelectedProperty";

interface OwnerPropertyItem {
  id: string;
  fullCode: string;
  type: string;
  ownerName: string;
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
  const { selectedProperty, selectProperty } = useSelectedProperty();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // فایلی که در لیست انتخاب شده اما هنوز جستجو نشده است
  const [selectedFile, setSelectedFile] =
    useState<MockProperty>(selectedProperty);

  // مقادیری که در اینپوت‌های جستجو نمایش داده می‌شوند
  const [searchValues, setSearchValues] = useState<string[]>(
    getRenewalCodeValues(selectedProperty.codes),
  );

  // فایلی که اطلاعاتش در کل صفحه (جدول و جزئیات) نمایش داده می‌شود
  const [activeFile, setActiveFile] = useState<MockProperty>(selectedProperty);
  const [ownerProperties, setOwnerProperties] = useState<OwnerPropertyItem[]>(
    [],
  );
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [requestDetails, setRequestDetails] = useState<RequestDetailRow[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [apiError, setApiError] = useState("");
  const [selectedCodeNosazi, setSelectedCodeNosazi] = useState(
    selectedProperty.fullCode,
  );
  const [girandehName, setGirandehName] = useState<string>("");

  const propertyList =
    ownerProperties.length > 0
      ? ownerProperties
      : propertyItems.map((file) => ({
          id: file.id,
          fullCode: file.fullCode,
          type: file.type,
          ownerName: file.ownerName,
        }));

  const toSearchValuesFromCode = (fullCode: string): string[] => {
    const clean = fullCode.trim();
    if (!clean) return ["", "", "", "", "", "", ""];
    const parts = clean.includes("-") ? clean.split("-") : clean.split("/");
    const normalized = parts.map((part) => part.trim()).filter(Boolean);
    while (normalized.length < 7) normalized.push("");
    return normalized.slice(0, 7);
  };

  const mapApiResponseToRequests = (data: any): RequestRow[] => {
    if (!data || !data.data) return [];

    const rawList = Array.isArray(data.data) ? data.data : [data.data];

    // استخراج نام گیرنده از اولین آیتم
    if (rawList.length > 0 && rawList[0].girandeh) {
      setGirandehName(rawList[0].girandeh);
    }

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
    if (!data || !data.data) return [];

    const detailObj = Array.isArray(data.data) ? data.data[0] : data.data;

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

      const data = await response.json();

      if (data.success) {
        const mappedRows = mapApiResponseToRequests(data);
        const mappedDetails = mapApiResponseToDetails(data);

        setRequests(mappedRows);
        setRequestDetails(mappedDetails);
      } else {
        throw new Error("پاسخ ناموفق از سرور");
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

        const data = await response.json();
        const rawList = Array.isArray(data)
          ? data
          : (data.items ?? data.data ?? data.files ?? []);

        const mappedProperties: OwnerPropertyItem[] = rawList.map(
          (item: any, index: number) => ({
            id: String(item.Id ?? item.id ?? index),
            fullCode: item.codeN ?? item.fullCode ?? "—",
            type: item.type ?? "ملک",
            ownerName:
              item.ownerName ??
              item.owner?.name ??
              item.malekName ??
              item.ownerFullName ??
              item.name ??
              selectedProperty.ownerName,
            raw: item,
          }),
        );

        setOwnerProperties(mappedProperties);
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

  useEffect(() => {
    setSelectedFile(selectedProperty);
    setSearchValues(getRenewalCodeValues(selectedProperty.codes));
    setActiveFile(selectedProperty);
    setSelectedCodeNosazi(selectedProperty.fullCode);

    // بارگذاری اولیه داده‌های درخواست
    fetchRequestData(selectedProperty.fullCode);
  }, [selectedProperty]);

  // وقتی کاربر روی دکمه جستجو کلیک می‌کند
  const handleSearch = () => {
    setActiveFile(selectedFile);
    setSelectedCodeNosazi(selectedFile.fullCode);
    selectProperty(selectedFile.id);
    void fetchRequestData(selectedFile.fullCode);
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
          <div className="nav-shell">
            <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/20 md:text-sm"
              >
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">بازگشت به خانه</span>
              </Link>
              <h1 className="text-sm font-extrabold md:text-lg lg:text-xl">
                پیگیری جزئیات درخواست
              </h1>
              <button
                onClick={toggleTheme}
                className="rounded-xl bg-muted p-2 transition-colors hover:bg-muted/80"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto space-y-6 px-2 pt-24 md:px-4 md:pt-28 lg:px-6">
        {/* بخش جستجو */}
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="soft-card mesh-panel overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold">جستجوی کد نوسازی</h2>
            </div>
            <HelpButton />
          </div>
          <div className="p-4">
            <div className="flex flex-wrap items-end gap-3">
              {searchValues.map((value, index) => {
                const label =
                  index === 0
                    ? "منطقه"
                    : index === 1
                      ? "بلوک"
                      : index === 2
                        ? "قطعه"
                        : "کد";
                return (
                  <div key={index} className="relative flex-1 min-w-[80px]">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const updated = [...searchValues];
                        updated[index] = e.target.value;
                        setSearchValues(updated);
                      }}
                      className="h-11 w-full rounded-xl border border-border/70 bg-card px-2 text-center text-sm font-medium focus:outline-none"
                    />
                    <span className="absolute -top-2 right-2 bg-card px-1 text-[9px] text-muted-foreground">
                      {label}
                    </span>
                  </div>
                );
              })}
              <button
                onClick={handleSearch}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 md:text-sm"
              >
                <Search className="h-4 w-4" />
                جستجو
              </button>
            </div>
          </div>
        </motion.article>

        {/* لیست پرونده‌ها */}
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="soft-card mesh-panel overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold">پرونده های زیر مجموعه</h2>
            </div>
            <HelpButton />
          </div>
          <div className="p-4 space-y-2">
            {loadingProperties && (
              <div className="text-xs text-muted-foreground">
                در حال دریافت املاک مالک...
              </div>
            )}
            {propertyList.map((file) => {
              // استفاده از نام گیرنده اگر موجود باشد، در غیر این صورت نام مالک
              const displayName = girandehName || file.ownerName;

              return (
                <button
                  key={file.id}
                  onClick={() => {
                    const matchedFile = propertyItems.find(
                      (item) => item.fullCode === file.fullCode,
                    );
                    const effectiveFile = matchedFile ?? selectedProperty;
                    setSelectedFile(effectiveFile);
                    setSelectedCodeNosazi(file.fullCode);
                    setSearchValues(
                      matchedFile
                        ? getRenewalCodeValues(matchedFile.codes)
                        : toSearchValuesFromCode(file.fullCode),
                    );
                    setActiveFile(effectiveFile);
                    selectProperty(effectiveFile.id);
                    void fetchRequestData(file.fullCode);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 transition-all ${
                    selectedCodeNosazi === file.fullCode
                      ? "border-primary bg-primary/5"
                      : "border-border/70 bg-card/40 hover:bg-card/60"
                  }`}
                >
                  <span className="text-xs md:text-sm">
                    {file.fullCode} ({file.type}) - {displayName}
                  </span>
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
            {apiError && (
              <div className="text-xs text-red-600 dark:text-red-400">
                {apiError}
              </div>
            )}
          </div>
        </motion.article>

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
              alt="Map"
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

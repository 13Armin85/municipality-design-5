import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  Home,
  Info,
  Minus,
  Plus,
  Search,
  Moon,
  Sun,
  X,
  FileText,
  ClipboardList,
  User,
  Building2,
  MoreHorizontal,
  Calendar,
  ChevronRight,
  ChevronDown,
  Upload,
  Check,
  Trash2,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router";
import {
  areRenewalCodesEqual,
  findPropertyByCodes,
  propertyItems,
  type MockProperty,
} from "../data/properties";
import { useSelectedProperty } from "../hooks/useSelectedProperty";

const REQUEST_TYPES = [
  "نوسازی",
  "پایان کار",
  "تغییر کاربری",
  "افزایش طبقه",
  "تجمیع",
  "تفکیک",
  "استعلام",
  "عوارض نوسازی",
];

const APPLICANT_TYPES = [
  "حقیقی",
  "حقوقی",
  "وراث",
  "وکیل قانونی",
  "نماینده شرکت",
  "شهرداری",
];

const OFFICES = [
  "شهرداری منطقه ۱",
  "شهرداری منطقه ۲",
  "شهرداری منطقه ۳",
  "شهرداری منطقه ۴",
  "شهرداری منطقه ۵",
  "سازمان نوسازی",
  "سازمان آتش‌نشانی",
  "اداره ثبت اسناد",
  "اداره برق منطقه‌ای",
  "اداره آب و فاضلاب",
  "شرکت گاز",
  "مخابرات",
];

// ─── Persian Calendar Helpers ─────────────────────────────────────────────────

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const toPersianDigits = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

function getCurrentJalali() {
  const now = new Date();
  const gy = now.getFullYear(),
    gm = now.getMonth() + 1,
    gd = now.getDate();
  const g_d_no =
    365 * gy +
    Math.floor((gy + 3) / 4) -
    Math.floor((gy + 99) / 100) +
    Math.floor((gy + 399) / 400);
  let j_d_no = g_d_no - 79;
  const j_np = Math.floor(j_d_no / 12053);
  j_d_no %= 12053;
  let jy = 979 + 33 * j_np + 4 * Math.floor(j_d_no / 1461);
  j_d_no %= 1461;
  if (j_d_no >= 366) {
    jy += Math.floor((j_d_no - 1) / 365);
    j_d_no = (j_d_no - 1) % 365;
  }
  let jm = 0,
    jd = j_d_no + 1;
  const month_lengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  for (let i = 0; i < 12; i++) {
    if (jd <= month_lengths[i]) {
      jm = i + 1;
      break;
    }
    jd -= month_lengths[i];
  }
  return { year: jy, month: jm, day: jd };
}

function getDaysInJalaliMonth(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return year % 4 === 0 ? 30 : 29;
}

// ─── Persian Calendar Picker ──────────────────────────────────────────────────
// Three views: "day" → click month name → "month" → click year → "year"

type CalendarView = "day" | "month" | "year";

function PersianDatePicker({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const today = getCurrentJalali();

  const parseDate = (v: string) => {
    const parts = v.split("/").map(Number);
    if (parts.length === 3 && parts[0] > 1300)
      return { year: parts[0], month: parts[1], day: parts[2] };
    return today;
  };

  const [calView, setCalView] = useState<CalendarView>("day");
  const [view, setView] = useState<{ year: number; month: number }>(() => {
    const d = parseDate(value);
    return { year: d.year, month: d.month };
  });
  const [selected, setSelected] = useState(() => parseDate(value));

  // Year picker: show a window of 12 years, centered near current view year
  const [yearPageStart, setYearPageStart] = useState(() => {
    const d = parseDate(value);
    return Math.floor((d.year - 1) / 12) * 12 + 1;
  });

  // ── Day view helpers ──
  const days = getDaysInJalaliMonth(view.year, view.month);
  const firstDayOffset = (view.year * 365 + view.month * 30) % 7;
  const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  const prevMonth = () => {
    if (view.month === 1) setView({ year: view.year - 1, month: 12 });
    else setView({ ...view, month: view.month - 1 });
  };
  const nextMonth = () => {
    if (view.month === 12) setView({ year: view.year + 1, month: 1 });
    else setView({ ...view, month: view.month + 1 });
  };

  const selectDay = (d: number) => {
    const newSel = { year: view.year, month: view.month, day: d };
    setSelected(newSel);
    onChange(
      `${newSel.year}/${String(newSel.month).padStart(2, "0")}/${String(newSel.day).padStart(2, "0")}`,
    );
    onClose();
  };

  // ── Month view helpers ──
  const selectMonth = (m: number) => {
    setView({ year: view.year, month: m });
    setCalView("day");
  };

  // ── Year view helpers ──
  const YEAR_PAGE_SIZE = 12;
  const yearRange = Array.from(
    { length: YEAR_PAGE_SIZE },
    (_, i) => yearPageStart + i,
  );

  const selectYear = (y: number) => {
    setView({ year: y, month: view.month });
    setYearPageStart(Math.floor((y - 1) / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE + 1);
    setCalView("month");
  };

  const prevYearPage = () => setYearPageStart((s) => s - YEAR_PAGE_SIZE);
  const nextYearPage = () => setYearPageStart((s) => s + YEAR_PAGE_SIZE);

  // ── Header label ──
  const headerLabel = () => {
    if (calView === "day")
      return (
        <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <button
            onClick={() => setCalView("month")}
            className="hover:text-primary transition-colors underline-offset-2 hover:underline"
          >
            {PERSIAN_MONTHS[view.month - 1]}
          </button>
          <button
            onClick={() => {
              setYearPageStart(
                Math.floor((view.year - 1) / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE +
                  1,
              );
              setCalView("year");
            }}
            className="hover:text-primary transition-colors underline-offset-2 hover:underline"
          >
            {toPersianDigits(view.year)}
          </button>
        </span>
      );
    if (calView === "month")
      return (
        <button
          onClick={() => {
            setYearPageStart(
              Math.floor((view.year - 1) / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE + 1,
            );
            setCalView("year");
          }}
          className="text-sm font-bold text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
        >
          {toPersianDigits(view.year)}
        </button>
      );
    // year view
    return (
      <span className="text-sm font-bold text-foreground">
        {toPersianDigits(yearPageStart)} —{" "}
        {toPersianDigits(yearPageStart + YEAR_PAGE_SIZE - 1)}
      </span>
    );
  };

  const handlePrev = () => {
    if (calView === "day") prevMonth();
    else if (calView === "month") setView((v) => ({ ...v, year: v.year - 1 }));
    else prevYearPage();
  };
  const handleNext = () => {
    if (calView === "day") nextMonth();
    else if (calView === "month") setView((v) => ({ ...v, year: v.year + 1 }));
    else nextYearPage();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
      style={{ transformOrigin: "top" }}
      className="w-full mt-1 rounded-2xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden z-40"
      dir="rtl"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-primary/5">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {headerLabel()}
        <button
          onClick={handleNext}
          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* ── Body ── */}
      <AnimatePresence mode="wait">
        {calView === "day" && (
          <motion.div
            key="day"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="p-3"
          >
            {/* Week day headers */}
            <div className="grid grid-cols-7 mb-1">
              {weekDays.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-bold text-muted-foreground py-1"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDayOffset % 7 }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}
              {Array.from({ length: days }).map((_, i) => {
                const d = i + 1;
                const isSelected =
                  selected.year === view.year &&
                  selected.month === view.month &&
                  selected.day === d;
                const isToday =
                  today.year === view.year &&
                  today.month === view.month &&
                  today.day === d;
                return (
                  <button
                    key={d}
                    onClick={() => selectDay(d)}
                    className={`h-8 w-full rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-bold shadow-sm"
                        : isToday
                          ? "border border-primary/40 text-primary"
                          : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {toPersianDigits(d)}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {calView === "month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="p-3"
          >
            <div className="grid grid-cols-3 gap-2">
              {PERSIAN_MONTHS.map((name, i) => {
                const m = i + 1;
                const isSelected =
                  selected.year === view.year && selected.month === m;
                const isCurrentMonth =
                  today.year === view.year && today.month === m;
                return (
                  <button
                    key={m}
                    onClick={() => selectMonth(m)}
                    className={`rounded-xl py-2.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isCurrentMonth
                          ? "border border-primary/40 text-primary"
                          : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {calView === "year" && (
          <motion.div
            key="year"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="p-3"
          >
            <div className="grid grid-cols-3 gap-2">
              {yearRange.map((y) => {
                const isSelected = selected.year === y;
                const isCurrentYear = today.year === y;
                return (
                  <button
                    key={y}
                    onClick={() => selectYear(y)}
                    className={`rounded-xl py-2.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isCurrentYear
                          ? "border border-primary/40 text-primary"
                          : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {toPersianDigits(y)}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <div className="px-3 pb-3 flex items-center justify-between border-t border-border/40 pt-2">
        {/* Back button when not in day view */}
        {calView !== "day" ? (
          <button
            onClick={() => setCalView(calView === "year" ? "month" : "day")}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 px-2 py-1 rounded-lg hover:bg-primary/8 transition-colors"
          >
            <ChevronRight className="h-3 w-3" /> بازگشت
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground px-3 py-1 rounded-lg hover:bg-muted transition-colors"
        >
          بستن
        </button>
      </div>
    </motion.div>
  );
}

// ─── Selection Modal ───────────────────────────────────────────────────────────

function SelectionModal({
  title,
  items,
  onSelect,
  onClose,
}: {
  title: string;
  items: string[];
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = items.filter((i) => i.includes(search));
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/40 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-4 pt-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو..."
            className="h-9 w-full rounded-xl border border-border/70 bg-muted/30 px-3 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-3 space-y-1">
          {filtered.map((item) => (
            <button
              key={item}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="w-full text-right px-4 py-2.5 rounded-xl text-sm hover:bg-primary/8 hover:text-primary transition-colors font-medium"
            >
              {item}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Validation error display ─────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 text-[10px] text-destructive mt-1 pr-1"
    >
      <AlertCircle className="h-3 w-3 flex-shrink-0" /> {msg}
    </motion.p>
  );
}

// ─── Document Upload Step ─────────────────────────────────────────────────────

function UploadStep({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
  isDark: boolean;
}) {
  const [files, setFiles] = useState<
    { name: string; size: string; preview?: string }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map((f) => ({
      name: f.name,
      size: (f.size / 1024).toFixed(0) + " KB",
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setSubmitError(false);
  };

  const removeFile = (i: number) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    if (files.length === 0) {
      setSubmitError(true);
      return;
    }
    onSubmit();
  };

  const docTypes = [
    "سند مالکیت",
    "کارت ملی مالک",
    "نقشه ملک",
    "وکالت‌نامه (در صورت وجود)",
    "مدارک شرکت (برای متقاضی حقوقی)",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="space-y-5"
    >
      <div className="rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm text-right">
        مرحله ۲ از ۲ — آپلود مدارک. لطفاً مدارک مورد نیاز را بارگذاری کنید.
      </div>

      <motion.article className="soft-card mesh-panel">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <ClipboardList className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">مدارک مورد نیاز</h2>
        </div>
        <div className="p-4 space-y-2">
          {docTypes.map((doc, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-foreground/70"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary/50 flex-shrink-0" />
              {doc}
            </div>
          ))}
        </div>
      </motion.article>

      <motion.article className="soft-card mesh-panel">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <Upload className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">آپلود فایل‌ها</h2>
        </div>
        <div className="p-4 space-y-4">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const newFiles = Array.from(e.dataTransfer.files).map((f) => ({
                name: f.name,
                size: (f.size / 1024).toFixed(0) + " KB",
                preview: f.type.startsWith("image/")
                  ? URL.createObjectURL(f)
                  : undefined,
              }));
              setFiles((prev) => [...prev, ...newFiles]);
              setSubmitError(false);
            }}
            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 sm:p-8 cursor-pointer transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : submitError
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                فایل را اینجا رها کنید
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                یا کلیک کنید برای انتخاب
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                PNG، JPG، PDF — حداکثر ۱۰ مگابایت
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {submitError && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              لطفاً حداقل یک فایل بارگذاری کنید.
            </p>
          )}

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-3"
                >
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover border border-border/50 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {file.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="p-1.5 rounded-lg text-destructive/60 hover:bg-destructive/10 hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.article>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 pt-2">
        <button
          onClick={handleSubmit}
          className="rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <span className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4" /> ثبت نهایی
          </span>
        </button>
        <button
          onClick={onBack}
          className="rounded-xl border border-border/60 bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-all active:scale-95"
        >
          بازگشت
        </button>
      </div>
    </motion.div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="h-24 w-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
      >
        <Check className="h-12 w-12 text-emerald-600" />
      </motion.div>
      <div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          درخواست با موفقیت ثبت شد
        </h2>
        <p className="text-sm text-muted-foreground">
          کد پیگیری:{" "}
          <span className="font-bold text-primary">
            REQ-{Math.floor(Math.random() * 90000) + 10000}
          </span>
        </p>
      </div>
      <button
        onClick={onReset}
        className="rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-95"
      >
        درخواست جدید
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface SabtDarkhastPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function SabtDarkhastPage({
  isDark,
  toggleTheme,
}: SabtDarkhastPageProps) {
  const { selectedProperty, selectProperty } = useSelectedProperty();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  const [selectionModal, setSelectionModal] = useState<{
    open: boolean;
    title: string;
    items: string[];
    onSelect: (v: string) => void;
  }>({ open: false, title: "", items: [], onSelect: () => {} });

  // Date picker: which picker is open
  const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);

  // Step
  const [step, setStep] = useState<"form" | "upload" | "success">("form");

  const [searchValues, setSearchValues] = useState(selectedProperty.codes);
  const [activeProperty, setActiveProperty] = useState<MockProperty | null>(
    selectedProperty,
  );
  const [vakadari, setVakadari] = useState("");

  // Editable form state
  const [ownerForm, setOwnerForm] = useState({
    nationalId: selectedProperty.owner.nationalId,
    name: selectedProperty.owner.name,
    phone: selectedProperty.owner.phone,
    postalCode: selectedProperty.owner.postalCode,
    address: selectedProperty.owner.address,
  });
  const [requestForm, setRequestForm] = useState({
    id: selectedProperty.registration.request.id,
    type: selectedProperty.registration.request.type,
    applicantType: selectedProperty.registration.request.applicantType,
  });
  const [applicantForm, setApplicantForm] = useState({
    nationalId: selectedProperty.owner.nationalId,
    name: selectedProperty.owner.name,
    phone: selectedProperty.owner.phone,
  });
  const [complementaryForm, setComplementaryForm] = useState({
    letterNo: selectedProperty.registration.complementary.letterNo,
    letterDate: selectedProperty.registration.complementary.letterDate,
    secretNo: selectedProperty.registration.complementary.secretNo,
    secretDate: selectedProperty.registration.complementary.secretDate,
    office: selectedProperty.registration.complementary.office,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!ownerForm.nationalId.trim())
      newErrors["owner.nationalId"] = "این فیلد اجباری است";
    if (!ownerForm.name.trim()) newErrors["owner.name"] = "این فیلد اجباری است";
    if (!ownerForm.phone.trim())
      newErrors["owner.phone"] = "این فیلد اجباری است";
    if (!requestForm.id.trim()) newErrors["request.id"] = "این فیلد اجباری است";
    if (!requestForm.type.trim())
      newErrors["request.type"] = "این فیلد اجباری است";
    if (!requestForm.applicantType.trim())
      newErrors["request.applicantType"] = "این فیلد اجباری است";
    if (!applicantForm.nationalId.trim())
      newErrors["applicant.nationalId"] = "این فیلد اجباری است";
    if (!applicantForm.name.trim())
      newErrors["applicant.name"] = "این فیلد اجباری است";
    if (!applicantForm.phone.trim())
      newErrors["applicant.phone"] = "این فیلد اجباری است";
    return newErrors;
  };

  const handleContinue = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShowErrors(true);
      const firstErrEl = document.querySelector("[data-has-error='true']");
      firstErrEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setShowErrors(false);
    setStep("upload");
  };

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  const applyPropertyToPage = (property: MockProperty) => {
    setActiveProperty(property);
    setOwnerForm({
      nationalId: property.owner.nationalId,
      name: property.owner.name,
      phone: property.owner.phone,
      postalCode: property.owner.postalCode,
      address: property.owner.address,
    });
    setRequestForm({
      id: property.registration.request.id,
      type: property.registration.request.type,
      applicantType: property.registration.request.applicantType,
    });
    setApplicantForm({
      nationalId: property.owner.nationalId,
      name: property.owner.name,
      phone: property.owner.phone,
    });
    setComplementaryForm({
      letterNo: property.registration.complementary.letterNo,
      letterDate: property.registration.complementary.letterDate,
      secretNo: property.registration.complementary.secretNo,
      secretDate: property.registration.complementary.secretDate,
      office: property.registration.complementary.office,
    });
    setErrors({});
    setShowErrors(false);
  };

  useEffect(() => {
    setSearchValues(selectedProperty.codes);
    applyPropertyToPage(selectedProperty);
  }, [selectedProperty]);

  const handleSelectProperty = (prop: MockProperty) => {
    setSearchValues(prop.codes);
    applyPropertyToPage(prop);
    selectProperty(prop.id);
  };

  const handleSearch = () => {
    const found = findPropertyByCodes(searchValues);
    if (found) {
      applyPropertyToPage(found);
      selectProperty(found.id);
    } else {
      alert("ملکی با این مشخصات یافت نشد.");
      setActiveProperty(null);
    }
  };

  const openSelection = (
    title: string,
    items: string[],
    onSelect: (v: string) => void,
  ) => {
    setSelectionModal({ open: true, title, items, onSelect });
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-datepicker-container]")) {
        setActiveDatePicker(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const HelpButton = ({ title, desc }: { title: string; desc: string }) => (
    <button
      onClick={() => handleOpenHelp(title, desc)}
      className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 md:text-xs"
    >
      <Info className="h-3.5 w-3.5" /> راهنما
    </button>
  );

  const SectionHeader = ({
    icon: Icon,
    title,
  }: {
    icon: React.ElementType;
    title: string;
  }) => (
    <div className="flex items-center justify-center gap-2 rounded-xl bg-muted/60 border border-border/60 px-4 py-2 mb-4">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm font-bold text-foreground">{title}</span>
    </div>
  );

  // Generic editable field with validation
  const EditableField = ({
    label,
    required,
    value,
    onChange,
    type = "text",
    errorKey,
  }: {
    label: string;
    required?: boolean;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    errorKey?: string;
  }) => {
    const hasError = showErrors && errorKey && errors[errorKey];
    return (
      <div data-has-error={hasError ? "true" : "false"}>
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (errorKey && errors[errorKey]) {
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n[errorKey];
                  return n;
                });
              }
            }}
            className={`h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none transition-colors ${
              hasError
                ? "border-destructive focus:border-destructive"
                : "border-border/70 focus:border-primary"
            }`}
          />
          <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
            {label}
            {required && <span className="text-destructive mr-0.5">*</span>}
          </span>
        </div>
        {hasError && <FieldError msg={errors[errorKey!]} />}
      </div>
    );
  };

  // Field with "..." button that opens selection modal
  const SelectionField = ({
    label,
    required,
    value,
    onChange,
    items,
    title,
    errorKey,
  }: {
    label: string;
    required?: boolean;
    value: string;
    onChange: (v: string) => void;
    items: string[];
    title: string;
    errorKey?: string;
  }) => {
    const hasError = showErrors && errorKey && errors[errorKey];
    return (
      <div data-has-error={hasError ? "true" : "false"}>
        <div className="relative">
          <input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (errorKey && errors[errorKey]) {
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n[errorKey];
                  return n;
                });
              }
            }}
            className={`h-10 w-full rounded-xl border bg-card px-3 pl-10 text-sm outline-none transition-colors ${
              hasError
                ? "border-destructive focus:border-destructive"
                : "border-border/70 focus:border-primary"
            }`}
          />
          <button
            type="button"
            onClick={() =>
              openSelection(title, items, (v) => {
                onChange(v);
                if (errorKey && errors[errorKey]) {
                  setErrors((prev) => {
                    const n = { ...prev };
                    delete n[errorKey];
                    return n;
                  });
                }
              })
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors"
            title="انتخاب از لیست"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
          <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
            {label}
            {required && <span className="text-destructive mr-0.5">*</span>}
          </span>
        </div>
        {hasError && <FieldError msg={errors[errorKey!]} />}
      </div>
    );
  };

  // Date picker field — calendar renders inline below the input
  const DateField = ({
    label,
    value,
    onChange,
    pickerId,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    pickerId: string;
  }) => {
    const isOpen = activeDatePicker === pickerId;
    return (
      <div data-datepicker-container className="col-span-1">
        <div className="relative">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 pl-10 text-sm outline-none focus:border-primary transition-colors"
            placeholder="۱۴۰۳/۰۱/۰۱"
            readOnly
          />
          <button
            type="button"
            onClick={() => setActiveDatePicker(isOpen ? null : pickerId)}
            className={`absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-lg flex items-center justify-center transition-colors ${
              isOpen
                ? "bg-primary/15 text-primary"
                : "bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
          </button>
          <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
            {label}
          </span>
        </div>
        {/* Calendar renders inline, pushing content below it down */}
        <AnimatePresence>
          {isOpen && (
            <PersianDatePicker
              value={value}
              onChange={(v) => {
                onChange(v);
              }}
              onClose={() => setActiveDatePicker(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (step === "success") {
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
              <div className="flex h-14 sm:h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
                <div className="header-action-btn inline-flex items-center gap-2 px-3 opacity-0 pointer-events-none">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <h1 className="text-sm font-bold text-foreground md:text-base">
                  ثبت درخواست نوسازی
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
        <main className="section-decor px-3 pb-12 pt-20 sm:pt-24 md:pb-20 md:pt-28 lg:px-6">
          <div className="container mx-auto max-w-6xl">
            <SuccessScreen
              onReset={() => {
                setStep("form");
                applyPropertyToPage(selectedProperty);
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
    >
      {/* Help Modal */}
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
              <div className="flex items-center justify-between border-b border-border/50 px-5 sm:px-6 py-4">
                <h3 className="flex items-center gap-2 text-sm sm:text-base font-bold text-primary">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5" />{" "}
                  {modalContent.title}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              <div className="p-5 sm:p-6 text-sm leading-7 text-foreground/80">
                {modalContent.description}
              </div>
              <div className="px-5 sm:px-6 py-4 text-left">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg active:scale-95"
                >
                  فهمیدم
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Selection Modal */}
      <AnimatePresence>
        {selectionModal.open && (
          <SelectionModal
            title={selectionModal.title}
            items={selectionModal.items}
            onSelect={selectionModal.onSelect}
            onClose={() =>
              setSelectionModal({ ...selectionModal, open: false })
            }
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
      >
        <div className="container mx-auto px-0 md:px-2 lg:px-6">
          <div className="nav-shell">
            <div className="flex h-14 sm:h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
              {step === "upload" ? (
                <button
                  onClick={() => setStep("form")}
                  className="header-action-btn inline-flex items-center gap-1.5 px-2 sm:px-3"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="hidden text-sm sm:block">بازگشت</span>
                </button>
              ) : (
                <Link
                  to="/"
                  className="header-action-btn inline-flex items-center gap-1.5 px-2 sm:px-3"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="hidden text-sm sm:block">بازگشت</span>
                </Link>
              )}
              <h1 className="text-xs sm:text-sm font-bold text-foreground md:text-base truncate px-2">
                ثبت درخواست نوسازی {step === "upload" && "— آپلود مدارک"}
              </h1>
              <button
                onClick={toggleTheme}
                className="header-action-btn flex-shrink-0"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="section-decor px-2 sm:px-3 pb-12 pt-20 sm:pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-6xl space-y-5">
          <AnimatePresence mode="wait">
            {step === "upload" ? (
              <UploadStep
                key="upload"
                isDark={isDark}
                onBack={() => setStep("form")}
                onSubmit={() => setStep("success")}
              />
            ) : (
              <motion.div
                key="form"
                className="space-y-5"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: 30 }}
              >
                {/* Validation summary banner */}
                <AnimatePresence>
                  {showErrors && Object.keys(errors).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      لطفاً فیلدهای اجباری مشخص شده را تکمیل کنید.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm text-right">
                  کاربر گرامی، لطفاً پس از انتخاب ملک خود از لیست "پرونده‌های
                  زیر مجموعه" دکمه جستجو را بفشارید.
                </div>

                {/* Search */}
                <motion.article
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="soft-card mesh-panel overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-bold text-foreground">
                        جستجو
                      </h2>
                    </div>
                    <HelpButton
                      title="جستجو"
                      desc="کد نوسازی را وارد کنید یا از لیست زیر مجموعه انتخاب کنید."
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <button
                      onClick={handleSearch}
                      className="flex w-full sm:hidden h-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/20 mb-3"
                    >
                      <Search className="ml-1.5 h-4 w-4" /> جستجو
                    </button>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                      <button
                        onClick={handleSearch}
                        className="hidden md:flex h-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/20"
                      >
                        <Search className="ml-1.5 h-4 w-4" /> جستجو
                      </button>
                      {Object.entries(searchValues).map(([key, val]) => (
                        <div key={key} className="relative">
                          <input
                            value={val}
                            onChange={(e) =>
                              setSearchValues({
                                ...searchValues,
                                [key]: e.target.value,
                              })
                            }
                            className="h-10 sm:h-11 w-full rounded-xl border border-border/70 bg-card px-2 text-center text-xs sm:text-sm font-medium outline-none focus:border-primary transition-colors"
                          />
                          <span className="absolute -top-2 right-2 bg-card px-1 text-[8px] sm:text-[9px] text-muted-foreground">
                            {key === "region"
                              ? "منطقه"
                              : key === "neighborhood"
                                ? "محله"
                                : key === "block"
                                  ? "بلوک"
                                  : key === "property"
                                    ? "ملک"
                                    : key === "building"
                                      ? "ساختمان"
                                      : key === "apartment"
                                        ? "آپارتمان"
                                        : "صنفی"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleSearch}
                      className="hidden sm:flex md:hidden mt-2 h-10 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/20"
                    >
                      <Search className="ml-1.5 h-4 w-4" /> جستجو
                    </button>
                  </div>
                </motion.article>

                {/* Sub-properties */}
                <motion.article
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="soft-card mesh-panel"
                >
                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-bold">
                        پرونده های زیر مجموعه
                      </h2>
                    </div>
                    <HelpButton
                      title="زیر مجموعه"
                      desc="لیست املاک شما. با کلیک بر روی هر کدام، کدهای نوسازی در بخش جستجو درج می‌شود."
                    />
                  </div>
                  <div className="p-3 sm:p-4 space-y-2">
                    {propertyItems.map((prop) => (
                      <div
                        key={prop.id}
                        onClick={() => handleSelectProperty(prop)}
                        className={`flex items-center justify-between rounded-xl border p-2.5 sm:p-3 group cursor-pointer transition-all ${areRenewalCodesEqual(searchValues, prop.codes) ? "border-primary bg-primary/5" : "border-border/70 bg-card/50 hover:border-primary/40"}`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div
                            className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0 ${areRenewalCodesEqual(searchValues, prop.codes) ? "bg-primary animate-pulse" : "bg-orange-400"}`}
                          />
                          <span className="text-[11px] sm:text-xs font-medium md:text-sm truncate">
                            {Object.values(prop.codes).join("-")} (ملک) —{" "}
                            {prop.owner.name}
                          </span>
                        </div>
                        <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground transition-transform group-hover:-translate-x-1 flex-shrink-0 mr-1" />
                      </div>
                    ))}
                  </div>
                </motion.article>

                {/* Registration Form */}
                <motion.article
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="soft-card mesh-panel overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-bold">ثبت درخواست</h2>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 space-y-6 sm:space-y-8">
                    {/* Owner Info */}
                    <div>
                      <SectionHeader icon={User} title="اطلاعات مالک" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-4">
                        <div className="col-span-1 sm:col-span-2 md:col-span-4 flex items-center gap-4 text-xs text-muted-foreground">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="malek-type"
                              className="accent-primary"
                            />{" "}
                            کد ملی
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="malek-type"
                              defaultChecked
                              className="accent-primary"
                            />{" "}
                            شناسه ملی
                          </label>
                        </div>
                        <EditableField
                          label="شناسه ملی"
                          required
                          value={ownerForm.nationalId}
                          onChange={(v) =>
                            setOwnerForm({ ...ownerForm, nationalId: v })
                          }
                          errorKey="owner.nationalId"
                        />
                        <EditableField
                          label="نام مالک"
                          required
                          value={ownerForm.name}
                          onChange={(v) =>
                            setOwnerForm({ ...ownerForm, name: v })
                          }
                          errorKey="owner.name"
                        />
                        <EditableField
                          label="شماره همراه"
                          required
                          value={ownerForm.phone}
                          onChange={(v) =>
                            setOwnerForm({ ...ownerForm, phone: v })
                          }
                          errorKey="owner.phone"
                        />
                        <EditableField
                          label="کد پستی"
                          value={ownerForm.postalCode}
                          onChange={(v) =>
                            setOwnerForm({ ...ownerForm, postalCode: v })
                          }
                        />
                        <div className="col-span-1 sm:col-span-2 md:col-span-4 relative">
                          <input
                            value={ownerForm.address}
                            onChange={(e) =>
                              setOwnerForm({
                                ...ownerForm,
                                address: e.target.value,
                              })
                            }
                            className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none focus:border-primary transition-colors"
                          />
                          <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
                            نشانی مالک
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Request Info */}
                    <div>
                      <SectionHeader
                        icon={ClipboardList}
                        title="اطلاعات درخواست"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3">
                        <EditableField
                          label="شماره درخواست"
                          required
                          value={requestForm.id}
                          onChange={(v) =>
                            setRequestForm({ ...requestForm, id: v })
                          }
                          errorKey="request.id"
                        />
                        <SelectionField
                          label="نوع درخواست"
                          required
                          value={requestForm.type}
                          onChange={(v) =>
                            setRequestForm({ ...requestForm, type: v })
                          }
                          items={REQUEST_TYPES}
                          title="انتخاب نوع درخواست"
                          errorKey="request.type"
                        />
                        <SelectionField
                          label="نوع متقاضی"
                          required
                          value={requestForm.applicantType}
                          onChange={(v) =>
                            setRequestForm({ ...requestForm, applicantType: v })
                          }
                          items={APPLICANT_TYPES}
                          title="انتخاب نوع متقاضی"
                          errorKey="request.applicantType"
                        />
                      </div>
                    </div>

                    {/* Applicant Info */}
                    <div>
                      <SectionHeader icon={User} title="اطلاعات متقاضی" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-4">
                        <EditableField
                          label="شناسه ملی"
                          required
                          value={applicantForm.nationalId}
                          onChange={(v) =>
                            setApplicantForm({
                              ...applicantForm,
                              nationalId: v,
                            })
                          }
                          errorKey="applicant.nationalId"
                        />
                        <EditableField
                          label="نام متقاضی"
                          required
                          value={applicantForm.name}
                          onChange={(v) =>
                            setApplicantForm({ ...applicantForm, name: v })
                          }
                          errorKey="applicant.name"
                        />
                        <EditableField
                          label="شماره همراه"
                          required
                          value={applicantForm.phone}
                          onChange={(v) =>
                            setApplicantForm({ ...applicantForm, phone: v })
                          }
                          errorKey="applicant.phone"
                        />
                        <div className="relative">
                          <select
                            value={vakadari}
                            onChange={(e) => setVakadari(e.target.value)}
                            className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none appearance-none"
                          >
                            <option value="">انتخاب کنید</option>
                            <option value="1">مالک</option>
                            <option value="2">مستأجر</option>
                            <option value="3">وکیل</option>
                          </select>
                          <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
                            نوع واگذاری
                          </span>
                          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Complementary Info */}
                    <div>
                      <SectionHeader icon={Building2} title="اطلاعات تکمیلی" />
                      <div className="space-y-5">
                        {/* Row 1: letter no + letter date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5">
                          <EditableField
                            label="شماره نامه"
                            value={complementaryForm.letterNo}
                            onChange={(v) =>
                              setComplementaryForm({
                                ...complementaryForm,
                                letterNo: v,
                              })
                            }
                          />
                          <DateField
                            label="تاریخ نامه"
                            value={complementaryForm.letterDate}
                            onChange={(v) =>
                              setComplementaryForm({
                                ...complementaryForm,
                                letterDate: v,
                              })
                            }
                            pickerId="letterDate"
                          />
                        </div>
                        {/* Row 2: secret no + secret date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5">
                          <EditableField
                            label="شماره دبیرخانه"
                            value={complementaryForm.secretNo}
                            onChange={(v) =>
                              setComplementaryForm({
                                ...complementaryForm,
                                secretNo: v,
                              })
                            }
                          />
                          <DateField
                            label="تاریخ دبیرخانه"
                            value={complementaryForm.secretDate}
                            onChange={(v) =>
                              setComplementaryForm({
                                ...complementaryForm,
                                secretDate: v,
                              })
                            }
                            pickerId="secretDate"
                          />
                        </div>
                        {/* Row 3: office full width */}
                        <SelectionField
                          label="اداره استعلام کننده"
                          value={complementaryForm.office}
                          onChange={(v) =>
                            setComplementaryForm({
                              ...complementaryForm,
                              office: v,
                            })
                          }
                          items={OFFICES}
                          title="انتخاب اداره استعلام کننده"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 pt-2 border-t border-border/50">
                      <button
                        onClick={handleContinue}
                        className="rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-95"
                      >
                        ادامه
                      </button>
                      <button className="rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-2.5 text-sm font-semibold text-destructive transition-all active:scale-95">
                        انصراف
                      </button>
                    </div>
                  </div>
                </motion.article>

                {/* Previous Requests */}
                <motion.article
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="soft-card mesh-panel"
                >
                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-bold">درخواست های ثبت شده</h2>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    {activeProperty?.registration.prevRequests.length ? (
                      <div className="space-y-2">
                        {activeProperty.registration.prevRequests.map(
                          (req, i) => (
                            <div
                              key={i}
                              className="flex flex-wrap justify-between gap-2 p-3 rounded-lg bg-muted/40 text-xs"
                            >
                              <span>شماره: {req.id}</span>
                              <span>تاریخ: {req.date}</span>
                              <span className="text-primary">{req.status}</span>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-rose-200/40 bg-rose-50/30 dark:bg-rose-950/20 dark:border-rose-800/30 p-4 text-center text-xs text-rose-500 dark:text-rose-400">
                        موردی برای نمایش وجود ندارد.
                      </div>
                    )}
                  </div>
                </motion.article>

                {/* Map */}
                <motion.article
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="soft-card mesh-panel relative h-64 sm:h-80 md:h-[400px] overflow-hidden group"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <img
                      src="/map-placeholder.jpg"
                      alt="Map"
                      className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                    />
                    {activeProperty && (
                      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 w-56 sm:w-64 rounded-2xl border border-border bg-card/95 shadow-xl backdrop-blur-md p-3 sm:p-4 text-xs space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between border-b border-border/50 pb-2 mb-2">
                          <span className="text-sm font-bold text-foreground">
                            اطلاعات ملک
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-foreground">
                            کد نوسازی
                          </span>
                          <span className="text-muted-foreground text-[10px] sm:text-xs">
                            {Object.values(activeProperty.codes).join("-")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-foreground">
                            نام مالک
                          </span>
                          <span className="text-muted-foreground">
                            {activeProperty.owner.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-foreground">
                            مساحت
                          </span>
                          <span className="text-muted-foreground">
                            {activeProperty.registration.map.area}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute left-3 sm:left-4 top-3 sm:top-4 flex flex-col gap-2">
                    <button className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg">
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <button className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg">
                      <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <button className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg">
                      <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </motion.article>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

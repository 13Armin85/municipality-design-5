import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  Newspaper,
  Pencil,
  Power,
  RefreshCw,
  Save,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import {
  changeNewsStatus,
  createNews,
  deleteNews,
  fetchAdminNews,
  updateNews,
  type AdminNewsItem,
  type NewsInput,
} from "../../data/news";
import {
  fetchAdminNewsGroups,
  type NewsGroup,
} from "../../data/newsGroups";

// ─── Persian Calendar Utilities ────────────────────────────────────────────

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
const PERSIAN_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

/** Gregorian → Jalali  (Kazimierz Borkowski algorithm) */
function toJalali(
  gy: number,
  gm: number,
  gd: number,
): [number, number, number] {
  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  let jy: number, jm: number, jd: number;
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400);
  for (let i = 0; i < gm - 1; i++) days += g_days_in_month[i];
  if (gy % 4 === 0 && (gy % 100 !== 0 || gy % 400 === 0) && gm > 2) days++;
  days += gd;

  jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  jm =
    days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

/** Jalali → Gregorian Date */
function fromJalali(jy: number, jm: number, jd: number): Date {
  const jy2 = jy - 979;
  const jm2 = jm - 1;
  const jd2 = jd - 1;

  let j_day_no =
    365 * jy2 + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4);

  for (let i = 0; i < jm2; i++) j_day_no += i < 6 ? 31 : 30;
  j_day_no += jd2;

  const g_day_no = j_day_no + 79;
  let gy = 1600 + 400 * Math.floor(g_day_no / 146097);
  let days = g_day_no % 146097;

  let leap = true;
  if (days >= 36525) {
    days--;
    gy += 100 * Math.floor(days / 36524);
    days %= 36524;
    if (days >= 365) days++;
    else leap = false;
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days >= 366) {
    leap = false;
    days--;
    gy += Math.floor(days / 365);
    days %= 365;
  }

  const g_days_in_month = [
    31,
    leap ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  for (let i = 0; i < 12 && days >= g_days_in_month[i]; i++) {
    days -= g_days_in_month[i];
    gm = i + 1;
  }
  return new Date(gy, gm, days + 1);
}

function jalaliDaysInMonth(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  // اسفند — leap year check
  const remainder =
    ((((jy - (jy > 474 ? 473 : 474)) % 2820) + 474 + 38) * 682) % 2816;
  return remainder < 682 ? 30 : 29;
}

function jalaliFirstDayOfWeek(jy: number, jm: number): number {
  const d = fromJalali(jy, jm, 1);
  // Saturday=0, Sunday=1, ..., Friday=6
  return (d.getDay() + 1) % 7;
}

// ─── Persian Date Picker ────────────────────────────────────────────────────

// jm is always 1-based (1=فروردین … 12=اسفند) inside PersianDate
interface PersianDate {
  jy: number;
  jm: number;
  jd: number;
  hour: number;
  minute: number;
}

function toPersianStr(date: PersianDate | null): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.jy}/${pad(date.jm)}/${pad(date.jd)} ${pad(date.hour)}:${pad(date.minute)}:00`;
}

function dateToApiDateTime(date: PersianDate): string {
  return toPersianStr(date);
}

function apiDateTimeToGregorianDate(value: string): Date | null {
  const match = value.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
  );

  if (!match) return null;

  const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;
  const date = fromJalali(Number(year), Number(month), Number(day));
  date.setHours(Number(hour), Number(minute), Number(second), 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function valueToPersianDate(value: string): PersianDate | null {
  if (!value) return null;

  const apiDate = apiDateTimeToGregorianDate(value);
  const d = apiDate ?? new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  const [jy, jm, jd] = toJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return { jy, jm, jd, hour: d.getHours(), minute: d.getMinutes() }; // jm is 1-based from toJalali
}

interface PersianDatePickerProps {
  value: string;
  onChange: (iso: string) => void;
}

function PersianDatePicker({ value, onChange }: PersianDatePickerProps) {
  const now = new Date();
  // ty/tm/td are 1-based Jalali values for today
  const [ty, tm, td] = toJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );

  const selected = valueToPersianDate(value);

  // viewMonth is 0-based (0=فروردین … 11=اسفند)
  const [viewYear, setViewYear] = useState(selected?.jy ?? ty);
  const [viewMonth, setViewMonth] = useState(
    selected ? selected.jm - 1 : tm - 1,
  );
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(selected?.hour ?? 8);
  const [minute, setMinute] = useState(selected?.minute ?? 0);
  const [mode, setMode] = useState<"calendar" | "year" | "month">("calendar");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // viewMonth is 0-based → pass jm=viewMonth+1 (1-based) to helpers
  const daysInMonth = jalaliDaysInMonth(viewYear, viewMonth + 1);
  const firstDay = jalaliFirstDayOfWeek(viewYear, viewMonth + 1);

  const pick = (jd: number) => {
    // store jm as 1-based inside PersianDate
    const pd: PersianDate = {
      jy: viewYear,
      jm: viewMonth + 1,
      jd,
      hour,
      minute,
    };
    onChange(dateToApiDateTime(pd));
  };

  const confirmTime = () => {
    if (selected) {
      const pd: PersianDate = { ...selected, hour, minute };
      onChange(dateToApiDateTime(pd));
    }
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const goToToday = () => {
    setViewYear(ty);
    setViewMonth(tm - 1);
    setMode("calendar");
  };

  const displayText = selected ? toPersianStr(selected) : "";
  // yearRange centred on today's Jalali year
  const yearRange = Array.from({ length: 30 }, (_, i) => ty - 5 + i);
  const pad = (n: number) => String(n).padStart(2, "0");

  // Is the current view showing today's month?
  const isViewingToday = viewYear === ty && viewMonth === tm - 1;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setMode("calendar");
        }}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-right text-sm text-foreground outline-none transition-colors focus:border-primary flex items-center justify-between gap-2"
      >
        <span
          className={displayText ? "text-foreground" : "text-muted-foreground"}
        >
          {displayText || "انتخاب تاریخ"}
        </span>
        <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-12 z-50 rounded-2xl border border-border bg-card shadow-xl"
            dir="rtl"
          >
            {/* Today banner */}
            <div className="flex items-center justify-between border-b border-border/60 bg-primary/5 px-3 py-2 rounded-t-2xl">
              <span className="text-[11px] font-semibold text-muted-foreground">
                امروز:
                <span className="mr-1 font-bold text-primary">
                  {td} {PERSIAN_MONTHS[tm - 1]} {ty}
                </span>
              </span>
              {!isViewingToday && (
                <button
                  type="button"
                  onClick={goToToday}
                  className="text-[11px] font-bold text-primary hover:underline"
                >
                  برو به امروز
                </button>
              )}
            </div>

            {/* Month/Year nav */}
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
              <button
                type="button"
                onClick={prevMonth}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setMode((m) => (m === "month" ? "calendar" : "month"))
                  }
                  className="rounded-lg px-2.5 py-1 text-sm font-bold text-foreground hover:bg-muted transition-colors"
                >
                  {PERSIAN_MONTHS[viewMonth]}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMode((m) => (m === "year" ? "calendar" : "year"))
                  }
                  className="rounded-lg px-2.5 py-1 text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
                >
                  {viewYear}
                </button>
              </div>

              <button
                type="button"
                onClick={nextMonth}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === "year" && (
                <motion.div
                  key="year"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-4 gap-1 p-3 max-h-52 overflow-y-auto"
                >
                  {yearRange.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setViewYear(y);
                        setMode("calendar");
                      }}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition-colors
                        ${y === ty ? "ring-1 ring-primary/40" : ""}
                        ${y === viewYear ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
                    >
                      {y}
                    </button>
                  ))}
                </motion.div>
              )}
              {mode === "month" && (
                <motion.div
                  key="month"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-3 gap-1.5 p-3"
                >
                  {PERSIAN_MONTHS.map((m, i) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setViewMonth(i);
                        setMode("calendar");
                      }}
                      className={`rounded-lg py-2 text-xs font-semibold transition-colors
                        ${viewYear === ty && i === tm - 1 ? "ring-1 ring-primary/40" : ""}
                        ${i === viewMonth ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
                    >
                      {m}
                    </button>
                  ))}
                </motion.div>
              )}
              {mode === "calendar" && (
                <motion.div
                  key="cal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 px-3 pt-2.5">
                    {PERSIAN_WEEKDAYS.map((d) => (
                      <div
                        key={d}
                        className="py-1 text-center text-[10px] font-semibold text-muted-foreground"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  {/* Day cells */}
                  <div className="grid grid-cols-7 gap-0.5 px-3 pb-3">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`e${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                      (d) => {
                        // selected.jm is 1-based; viewMonth is 0-based
                        const isSel =
                          selected &&
                          selected.jy === viewYear &&
                          selected.jm === viewMonth + 1 &&
                          selected.jd === d;
                        // today: tm is 1-based, viewMonth is 0-based
                        const isToday =
                          viewYear === ty && viewMonth === tm - 1 && d === td;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => pick(d)}
                            className={`aspect-square rounded-lg text-xs font-medium transition-colors
                            ${
                              isSel
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : isToday
                                  ? "bg-primary/15 border border-primary text-primary font-bold"
                                  : "text-foreground hover:bg-muted"
                            }`}
                          >
                            {d}
                          </button>
                        );
                      },
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Time picker */}
            <div className="border-t border-border px-3 py-3 flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground shrink-0">
                ساعت
              </span>
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={pad(hour)}
                  onChange={(e) =>
                    setHour(
                      Math.max(0, Math.min(23, parseInt(e.target.value) || 0)),
                    )
                  }
                  className="w-14 rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm font-mono text-foreground outline-none focus:border-primary"
                  dir="ltr"
                />
                <span className="text-muted-foreground font-bold">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={pad(minute)}
                  onChange={(e) =>
                    setMinute(
                      Math.max(0, Math.min(59, parseInt(e.target.value) || 0)),
                    )
                  }
                  className="w-14 rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm font-mono text-foreground outline-none focus:border-primary"
                  dir="ltr"
                />
              </div>
              <button
                type="button"
                onClick={confirmTime}
                className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
              >
                تأیید
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Form & Utilities ───────────────────────────────────────────────────────

interface NewsForm {
  title: string;
  excerpt: string;
  description: string;
  publishAt: string;
  categoryId: string;
  imageUrl: string;
  imageFile: File | null;
}

const emptyForm: NewsForm = {
  title: "",
  excerpt: "",
  description: "",
  publishAt: "",
  categoryId: "",
  imageUrl: "",
  imageFile: null,
};

const toPersianDateTime = (value: string | undefined | null) => {
  if (!value) return "بدون زمان انتشار";
  const date = apiDateTimeToGregorianDate(value) ?? new Date(value);
  if (Number.isNaN(date.getTime())) return "بدون زمان انتشار";
  return date.toLocaleString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getPublishStatus = (publishAt: string | undefined | null) => {
  if (!publishAt) return "منتشر شده";
  const date = apiDateTimeToGregorianDate(publishAt) ?? new Date(publishAt);
  if (Number.isNaN(date.getTime())) return "منتشر شده";
  return date.getTime() > Date.now() ? "زمان‌بندی شده" : "منتشر شده";
};

const toPictureValue = (value: string) => {
  const dataUrlMatch = value.match(/^data:image\/[^;]+;base64,(.+)$/i);
  return dataUrlMatch?.[1] ?? value.trim();
};

const toNewsInput = (form: NewsForm): NewsInput => {
  const publishDate =
    valueToPersianDate(form.publishAt) ??
    (() => {
      const now = new Date();
      const [jy, jm, jd] = toJalali(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
      );
      return {
        jy,
        jm,
        jd,
        hour: now.getHours(),
        minute: now.getMinutes(),
      };
    })();

  return {
    groupId: form.categoryId,
    title: form.title.trim(),
    description: form.description.trim(),
    shortDescription: form.excerpt.trim(),
    picture: form.imageFile ?? toPictureValue(form.imageUrl),
    publishDateTime: dateToApiDateTime(publishDate),
  };
};

// ─── Field wrapper for consistent spacing ───────────────────────────────────

function Field({
  label,
  children,
  span = 1,
}: {
  label: string;
  children: React.ReactNode;
  span?: number;
}) {
  return (
    <label
      className={`flex flex-col gap-1.5 ${span === 2 ? "lg:col-span-2" : span === 3 ? "lg:col-span-3" : ""}`}
    >
      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/50";

// ─── Main Component ─────────────────────────────────────────────────────────

export function AdminNewsPage() {
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState<AdminNewsItem[]>([]);
  const [newsGroups, setNewsGroups] = useState<NewsGroup[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [areGroupsLoading, setAreGroupsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadNews = useCallback(async (
    signal?: AbortSignal,
    options?: { force?: boolean },
  ) => {
    setIsLoading(true);
    try {
      setItems(await fetchAdminNews(signal, options));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "دریافت خبرهای ثبت شده ناموفق بود.",
      });
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadGroups = async () => {
      try {
        const groups = await fetchAdminNewsGroups(controller.signal);
        setNewsGroups(groups);
        setForm((current) => ({
          ...current,
          categoryId:
            groups.some((group) => group.id === current.categoryId)
              ? current.categoryId
              : (groups.find((group) => group.isActive)?.id ??
                groups[0]?.id ??
                ""),
        }));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "دریافت دسته‌بندی‌های اخبار ناموفق بود.",
        });
      } finally {
        if (!controller.signal.aborted) setAreGroupsLoading(false);
      }
    };

    void Promise.all([loadGroups(), loadNews(controller.signal)]);
    return () => controller.abort();
  }, [loadNews]);

  const scheduledCount = useMemo(
    () =>
      items.filter(
        (item) => getPublishStatus(item.publishAt ?? null) === "زمان‌بندی شده",
      ).length,
    [items],
  );

  const resetForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      categoryId:
        newsGroups.find((group) => group.isActive)?.id ??
        newsGroups[0]?.id ??
        "",
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setMessage({
        type: "error",
        text: "حجم تصویر باید حداکثر ۵ مگابایت باشد.",
      });
      return;
    }

    setMessage(null);
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({
        ...prev,
        imageUrl: String(reader.result ?? ""),
        imageFile: file,
      }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (
      !form.title.trim() ||
      !form.excerpt.trim() ||
      !form.description.trim() ||
      !form.categoryId
    ) {
      setMessage({
        type: "error",
        text: "عنوان، دسته‌بندی، توضیحات کوتاه و متن خبر الزامی است.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = toNewsInput(form);
      if (editingId) {
        await updateNews(editingId, payload);
      } else {
        await createNews(payload);
      }

      setMessage({
        type: "success",
        text: editingId
          ? "خبر با موفقیت ویرایش شد."
          : "خبر با موفقیت ثبت شد.",
      });
      resetForm();
      await loadNews();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "ذخیره خبر ناموفق بود.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: AdminNewsItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      excerpt: item.shortDescription,
      description: item.description,
      publishAt: item.publishAt ?? "",
      categoryId: item.groupId,
      imageUrl: item.imageUrl || item.picture || "",
      imageFile: null,
    });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item: AdminNewsItem) => {
    if (!window.confirm(`خبر «${item.title}» حذف شود؟`)) return;

    setDeletingId(item.id);
    setMessage(null);
    try {
      await deleteNews(item.id);
      if (editingId === item.id) resetForm();
      setMessage({ type: "success", text: "خبر با موفقیت حذف شد." });
      await loadNews();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "حذف خبر ناموفق بود.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (item: AdminNewsItem) => {
    setStatusLoadingId(item.id);
    setMessage(null);
    try {
      await changeNewsStatus(item.id);
      setMessage({
        type: "success",
        text: item.isActive
          ? "خبر با موفقیت غیرفعال شد."
          : "خبر با موفقیت فعال شد.",
      });
      await loadNews();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "تغییر وضعیت خبر ناموفق بود.",
      });
    } finally {
      setStatusLoadingId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">مدیریت اخبار</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            خبرها را منتشر کنید یا برای آینده زمان‌بندی کنید.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 font-bold text-primary">
            {items.length} خبر
          </span>
          <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 font-bold text-amber-600">
            {scheduledCount} زمان‌بندی شده
          </span>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
        {/* Card header */}
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Newspaper className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-foreground">
            {editingId ? "ویرایش خبر" : "ثبت خبر جدید"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Row 1: title + category */}
            <Field label="عنوان خبر" span={2}>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="عنوان خبر را وارد کنید"
                className={inputCls}
              />
            </Field>

            <Field label="دسته‌بندی">
              <span className="relative block">
                <select
                  value={form.categoryId}
                  disabled={areGroupsLoading || newsGroups.length === 0}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className={`${inputCls} appearance-none disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {areGroupsLoading ? (
                    <option value="">در حال دریافت دسته‌بندی‌ها...</option>
                  ) : newsGroups.length === 0 ? (
                    <option value="">دسته‌بندی‌ای ثبت نشده است</option>
                  ) : (
                    newsGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))
                  )}
                </select>
                <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </span>
            </Field>

            {/* Row 2: excerpt full width */}
            <Field label="خلاصه خبر" span={3}>
              <input
                value={form.excerpt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="یک جمله‌ی کوتاه درباره این خبر"
                className={inputCls}
              />
            </Field>

            {/* Row 3: description + sidebar */}
            <Field label="متن خبر" span={2}>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={8}
                placeholder="متن کامل خبر را اینجا بنویسید..."
                className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-7 text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/50"
              />
            </Field>

            {/* Sidebar: date + image */}
            <div className="flex flex-col gap-4">
              <Field label="تاریخ انتشار">
                <PersianDatePicker
                  value={form.publishAt}
                  onChange={(v) =>
                    setForm((prev) => ({ ...prev, publishAt: v }))
                  }
                />
                {form.publishAt && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, publishAt: "" }))
                    }
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors w-fit"
                  >
                    <X className="h-3 w-3" />
                    پاک‌کردن تاریخ
                  </button>
                )}
              </Field>

              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  تصویر خبر
                </span>
                <label className="flex flex-1 min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background/60 px-3 py-4 text-center transition-colors hover:border-primary/50 hover:bg-primary/5">
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="پیش‌نمایش"
                      className="h-28 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <>
                      <ImagePlus className="mb-2 h-7 w-7 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        انتخاب تصویر
                      </span>
                      <span className="mt-0.5 text-[10px] text-muted-foreground/60">
                        PNG، JPG تا ۵ مگابایت
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        imageUrl: "",
                        imageFile: null,
                      }))
                    }
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors w-fit"
                  >
                    <X className="h-3 w-3" />
                    حذف تصویر
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingId ? "ذخیره تغییرات" : "ذخیره خبر"}
            </button>
            {editingId && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={resetForm}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                انصراف از ویرایش
              </button>
            )}

            <AnimatePresence>
              {message && (
                <motion.p
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-xs font-medium ${message.type === "error" ? "text-destructive" : "text-emerald-600"}`}
                >
                  {message.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>

      {/* News list */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-bold text-foreground">خبرهای ثبت شده</h3>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => void loadNews(undefined, { force: true })}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            بروزرسانی
          </button>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-background/60 px-4 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-8 text-center text-sm text-muted-foreground">
              هنوز خبری ثبت نشده است.
            </div>
          ) : (
            items.map((item, index) => {
              const publishAt = item.publishAt;
              const status = getPublishStatus(publishAt);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-background/50 p-3.5 sm:flex-row sm:items-center"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-20 w-full rounded-xl object-cover sm:w-28 sm:shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-sm font-bold text-foreground">
                        {item.title}
                      </h4>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {item.category}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          status === "زمان‌بندی شده"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-emerald-500/10 text-emerald-600"
                        }`}
                      >
                        {status}
                      </span>
                      {!item.isActive && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          غیرفعال
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {item.excerpt}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      انتشار: {toPersianDateTime(publishAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      disabled={statusLoadingId === item.id}
                      onClick={() => void handleToggleStatus(item)}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors disabled:opacity-60 ${
                        item.isActive
                          ? "border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/15"
                          : "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/15"
                      }`}
                      aria-label={item.isActive ? "غیرفعال کردن خبر" : "فعال کردن خبر"}
                      title={item.isActive ? "غیرفعال کردن خبر" : "فعال کردن خبر"}
                    >
                      {statusLoadingId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/5 text-primary transition-colors hover:bg-primary/15"
                      aria-label="ویرایش خبر"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={() => void handleDelete(item)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-60"
                      aria-label="حذف خبر"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

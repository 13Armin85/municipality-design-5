import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const gy = now.getFullYear();
  const gm = now.getMonth() + 1;
  const gd = now.getDate();
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
  let jm = 0;
  let jd = j_d_no + 1;
  const monthLengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  for (let i = 0; i < 12; i++) {
    if (jd <= monthLengths[i]) {
      jm = i + 1;
      break;
    }
    jd -= monthLengths[i];
  }
  return { year: jy, month: jm, day: jd };
}

function getDaysInJalaliMonth(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return year % 4 === 0 ? 30 : 29;
}

type CalendarView = "day" | "month" | "year";

interface PersianDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function PersianDatePicker({
  value,
  onChange,
  onClose,
}: PersianDatePickerProps) {
  const today = getCurrentJalali();

  const parseDate = (v: string) => {
    const parts = v.split("/").map(Number);
    if (parts.length === 3 && parts[0] > 1300) {
      return { year: parts[0], month: parts[1], day: parts[2] };
    }
    return today;
  };

  const [calView, setCalView] = useState<CalendarView>("day");
  const [view, setView] = useState<{ year: number; month: number }>(() => {
    const d = parseDate(value);
    return { year: d.year, month: d.month };
  });
  const [selected, setSelected] = useState(() => parseDate(value));

  const [yearPageStart, setYearPageStart] = useState(() => {
    const d = parseDate(value);
    return Math.floor((d.year - 1) / 12) * 12 + 1;
  });

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

  const selectMonth = (m: number) => {
    setView({ year: view.year, month: m });
    setCalView("day");
  };

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

  const headerLabel = () => {
    if (calView === "day") {
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
    }

    if (calView === "month") {
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
    }

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
      className="mt-1 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10 z-40"
      dir="rtl"
    >
      <div className="flex items-center justify-between border-b border-border/50 bg-primary/5 px-4 py-3">
        <button
          onClick={handlePrev}
          className="rounded-lg p-1.5 text-primary transition-colors hover:bg-primary/10"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {headerLabel()}
        <button
          onClick={handleNext}
          className="rounded-lg p-1.5 text-primary transition-colors hover:bg-primary/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

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
            <div className="mb-1 grid grid-cols-7">
              {weekDays.map((d) => (
                <div
                  key={d}
                  className="py-1 text-center text-[10px] font-bold text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>
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
                    className={`h-8 w-full rounded-lg text-xs font-medium transition-all ${isSelected ? "bg-primary text-primary-foreground font-bold shadow-sm" : isToday ? "border border-primary/40 text-primary" : "hover:bg-muted text-foreground"}`}
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
                    className={`rounded-xl py-2.5 text-xs font-semibold transition-all ${isSelected ? "bg-primary text-primary-foreground shadow-sm" : isCurrentMonth ? "border border-primary/40 text-primary" : "hover:bg-muted text-foreground"}`}
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
                    className={`rounded-xl py-2.5 text-xs font-semibold transition-all ${isSelected ? "bg-primary text-primary-foreground shadow-sm" : isCurrentYear ? "border border-primary/40 text-primary" : "hover:bg-muted text-foreground"}`}
                  >
                    {toPersianDigits(y)}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-t border-border/40 px-3 pb-3 pt-2">
        {calView !== "day" ? (
          <button
            onClick={() => setCalView(calView === "year" ? "month" : "day")}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/8 hover:text-primary/80"
          >
            <ChevronRight className="h-3 w-3" /> بازگشت
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={onClose}
          className="rounded-lg px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          بستن
        </button>
      </div>
    </motion.div>
  );
}

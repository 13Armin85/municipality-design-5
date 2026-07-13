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

const div = (a: number, b: number) => Math.trunc(a / b);

function gregorianToJalali(gy: number, gm: number, gd: number) {
  const gDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy: number;

  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }

  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) -
    80 +
    gd +
    gDaysInMonth[gm - 1];

  jy += 33 * div(days, 12053);
  days %= 12053;
  jy += 4 * div(days, 1461);
  days %= 1461;

  if (days > 365) {
    jy += div(days - 1, 365);
    days = (days - 1) % 365;
  }

  const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { year: jy, month: jm, day: jd };
}

function jalaliToGregorian(jy: number, jm: number, jd: number) {
  let gy: number;

  if (jy > 979) {
    gy = 1600;
    jy -= 979;
  } else {
    gy = 621;
  }

  let days =
    365 * jy +
    div(jy, 33) * 8 +
    div((jy % 33) + 3, 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  gy += 400 * div(days, 146097);
  days %= 146097;

  if (days > 36524) {
    gy += 100 * div(--days, 36524);
    days %= 36524;
    if (days >= 365) days++;
  }

  gy += 4 * div(days, 1461);
  days %= 1461;

  if (days > 365) {
    gy += div(days - 1, 365);
    days = (days - 1) % 365;
  }

  let gd = days + 1;
  const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
  const monthDays = [
    0,
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
  let gm = 1;

  while (gm <= 12 && gd > monthDays[gm]) {
    gd -= monthDays[gm];
    gm++;
  }

  return { year: gy, month: gm, day: gd };
}

function getCurrentJalali() {
  const now = new Date();
  return gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );
}

export function getCurrentJalaliDateString() {
  const today = getCurrentJalali();
  return `${today.year}/${String(today.month).padStart(2, "0")}/${String(today.day).padStart(2, "0")}`;
}

function isLeapJalaliYear(year: number) {
  const epBase = year - (year >= 0 ? 474 : 473);
  const epYear = 474 + (epBase % 2820);
  return ((epYear + 38) * 682) % 2816 < 682;
}

function getDaysInJalaliMonth(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isLeapJalaliYear(year) ? 30 : 29;
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
  const firstGregorianDay = jalaliToGregorian(view.year, view.month, 1);
  const firstDayOffset =
    (new Date(
      firstGregorianDay.year,
      firstGregorianDay.month - 1,
      firstGregorianDay.day,
    ).getDay() +
      1) %
    7;
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
            type="button"
            onClick={() => setCalView("month")}
            className="transition-colors underline-offset-2 hover:text-primary hover:underline"
          >
            {PERSIAN_MONTHS[view.month - 1]}
          </button>
          <button
            type="button"
            onClick={() => {
              setYearPageStart(
                Math.floor((view.year - 1) / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE +
                  1,
              );
              setCalView("year");
            }}
            className="transition-colors underline-offset-2 hover:text-primary hover:underline"
          >
            {toPersianDigits(view.year)}
          </button>
        </span>
      );
    }

    if (calView === "month") {
      return (
        <button
          type="button"
          onClick={() => {
            setYearPageStart(
              Math.floor((view.year - 1) / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE + 1,
            );
            setCalView("year");
          }}
          className="text-sm font-bold text-foreground transition-colors underline-offset-2 hover:text-primary hover:underline"
        >
          {toPersianDigits(view.year)}
        </button>
      );
    }

    return (
      <span className="text-sm font-bold text-foreground">
        {toPersianDigits(yearPageStart)} تا{" "}
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
      className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10"
      dir="rtl"
    >
      <div className="flex items-center justify-between border-b border-border/50 bg-primary/5 px-4 py-3">
        <button
          type="button"
          onClick={handlePrev}
          className="rounded-lg p-1.5 text-primary transition-colors hover:bg-primary/10"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {headerLabel()}
        <button
          type="button"
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
              {Array.from({ length: firstDayOffset }).map((_, i) => (
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
                    type="button"
                    key={d}
                    onClick={() => selectDay(d)}
                    className={`h-8 w-full rounded-lg text-xs font-medium transition-all ${isSelected ? "bg-primary font-bold text-primary-foreground shadow-sm" : isToday ? "border border-primary/40 text-primary" : "text-foreground hover:bg-muted"}`}
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
                    type="button"
                    key={m}
                    onClick={() => selectMonth(m)}
                    className={`rounded-xl py-2.5 text-xs font-semibold transition-all ${isSelected ? "bg-primary text-primary-foreground shadow-sm" : isCurrentMonth ? "border border-primary/40 text-primary" : "text-foreground hover:bg-muted"}`}
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
                    type="button"
                    key={y}
                    onClick={() => selectYear(y)}
                    className={`rounded-xl py-2.5 text-xs font-semibold transition-all ${isSelected ? "bg-primary text-primary-foreground shadow-sm" : isCurrentYear ? "border border-primary/40 text-primary" : "text-foreground hover:bg-muted"}`}
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
            type="button"
            onClick={() => setCalView(calView === "year" ? "month" : "day")}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/10 hover:text-primary/80"
          >
            <ChevronRight className="h-3 w-3" /> بازگشت
          </button>
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          بستن
        </button>
      </div>
    </motion.div>
  );
}

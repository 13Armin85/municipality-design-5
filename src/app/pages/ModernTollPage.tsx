import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  Compass,
  Home,
  Info,
  MapPin,
  Minus,
  Plus,
  Search,
  Moon,
  Sun,
  Trash2,
  X,
  Layers,
  FileText,
  Activity,
  Users,
  Receipt,
  History,
  Map,
} from "lucide-react";
import { Link } from "react-router";

interface ModernTollPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const searchFields = [
  { label: "منطقه", value: "2" },
  { label: "محله", value: "104" },
  { label: "بلوک", value: "37" },
  { label: "ملک", value: "44" },
  { label: "ساختمان", value: "0" },
  { label: "آپارتمان", value: "0" },
  { label: "صنفی", value: "0" },
];

const ownersData = [
  {
    id: "۱",
    name: "بهرام",
    lastName: "حضرتی",
    ownerType: "حقیقی",
    fatherName: "",
    birthPlace: "",
  },
];

const currentFeeFields = [
  { label: "نام مالک", value: "—" },
  { label: "آدرس مالک", value: "—" },
  { label: "شماره فیش", value: "—" },
  { label: "تا سال", value: "—" },
  { label: "خوش‌حسابی", value: "" },
  { label: "سهم مالک", value: "" },
  { label: "معافیت", value: "" },
  { label: "خدمات معوقه", value: "" },
  { label: "آتش‌نشانی", value: "" },
  { label: "بدحسابی", value: "" },
  { label: "ارزش افزوده", value: "" },
  { label: "آموزش و پرورش", value: "" },
  { label: "خدمات", value: "" },
  { label: "عوارض", value: "" },
  { label: "مبلغ قابل پرداخت", value: "—" },
  { label: "بدهی معوقه", value: "" },
  { label: "از سال", value: "—" },
  { label: "مبلغ به حروف", value: "—" },
];

export function ModernTollPage({ isDark, toggleTheme }: ModernTollPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  const HelpButton = ({ title, desc }: { title: string; desc: string }) => (
    <button
      onClick={() => handleOpenHelp(title, desc)}
      className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 md:text-xs"
    >
      <Info className="h-3.5 w-3.5" /> راهنما
    </button>
  );

  // Split fee fields into two columns: right side (odd indices) and left side (even indices)
  const rightFeeFields = [
    { label: "نام مالک", value: "—" },
    { label: "از سال", value: "—" },
    { label: "شماره فیش", value: "—" },
    { label: "خوش‌حسابی", value: "" },
    { label: "معافیت", value: "" },
    { label: "آتش‌نشانی", value: "" },
    { label: "ارزش افزوده", value: "" },
    { label: "خدمات", value: "" },
    { label: "مبلغ قابل پرداخت", value: "—" },
  ];

  const leftFeeFields = [
    { label: "آدرس مالک", value: "—" },
    { label: "تا سال", value: "—" },
    { label: "سهم مالک", value: "" },
    { label: "خدمات معوقه", value: "" },
    { label: "بدحسابی", value: "" },
    { label: "آموزش و پرورش", value: "" },
    { label: "عوارض", value: "" },
    { label: "بدهی معوقه", value: "" },
    { label: "مبلغ به حروف", value: "—" },
  ];

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

      {/* Header */}
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
                استعلام پرونده نوسازی
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

      <main className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-6xl space-y-5">
          {/* Notice banner */}
          <div className="rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm">
            کاربر گرامی، لطفاً پس از انتخاب ملک خود دکمه جستجو را بفشارید.
          </div>

          {/* Search Section */}
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
                desc="کد نوسازی ۷ رقمی خود را از روی قبض نوسازی در کادرهای مربوطه وارد کنید. ترتیب وارد کردن از منطقه (سمت راست) شروع می‌شود."
              />
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-8">
              <button className="flex h-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/20">
                <Search className="ml-1.5 h-4 w-4" /> جستجو
              </button>
              {searchFields.map((field, i) => (
                <div key={i} className="relative">
                  <input
                    defaultValue={field.value}
                    placeholder={field.label}
                    className="h-11 w-full rounded-xl border border-border/70 bg-card px-2 text-center text-sm font-medium outline-none focus:border-primary transition-colors"
                  />
                  <span className="absolute -top-2 right-3 bg-card px-1 text-[9px] text-muted-foreground">
                    {field.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.article>

          {/* Sub-files Section */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold">پرونده های زیر مجموعه</h2>
              </div>
              <HelpButton
                title="زیر مجموعه"
                desc="در صورتی که ملک شما دارای واحدهای آپارتمانی یا صنفی متعدد باشد، لیست آن‌ها در این بخش نمایش داده می‌شود."
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/50 p-3 group cursor-pointer hover:border-primary/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-orange-400" />
                  <span className="text-xs font-medium md:text-sm">
                    ۷-۱۰۴-۲۷-۴۴-۰-۰-۰ (ملک) - بهرام حضرتی
                  </span>
                </div>
                <ChevronLeft className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          </motion.article>

          {/* Owners Section */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold">مالکین</h2>
              </div>
              <HelpButton
                title="مالکین"
                desc="اطلاعات مالکین ثبت‌شده برای این ملک در سیستم شهرداری نمایش داده می‌شود."
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
                  {ownersData.map((owner, i) => (
                    <tr key={i} className="transition-colors hover:bg-muted/30">
                      <td className="border border-border/50 p-2 text-center font-bold">
                        {owner.id}
                      </td>
                      <td className="border border-border/50 p-2">
                        {owner.name}
                      </td>
                      <td className="border border-border/50 p-2">
                        {owner.lastName}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.ownerType}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.fatherName || "—"}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.birthPlace || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.article>

          {/* Current Renovation Fees Section */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold">عوارض نوسازی جاری</h2>
              </div>
              <HelpButton
                title="عوارض نوسازی"
                desc="جزئیات کامل عوارض نوسازی جاری برای این ملک، شامل سهم مالک، معافیت‌ها و مبلغ قابل پرداخت نمایش داده می‌شود."
              />
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-0 md:grid-cols-2">
                {/* Right column */}
                <div className="space-y-0">
                  {rightFeeFields.map((field, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-border/30 py-2.5 text-xs md:text-sm"
                    >
                      <span className="text-muted-foreground">
                        {field.label} :
                      </span>
                      <span className="font-medium text-foreground/80">
                        {field.value || ""}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Left column */}
                <div className="space-y-0">
                  {leftFeeFields.map((field, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-border/30 py-2.5 text-xs md:text-sm"
                    >
                      <span className="text-muted-foreground">
                        {field.label} :
                      </span>
                      <span className="font-medium text-foreground/80">
                        {field.value || ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* دریافت فیش button */}
              <div className="mt-5 flex justify-start">
                <button className="flex items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-destructive/20 transition-all hover:bg-destructive/90 active:scale-95">
                  <FileText className="h-4 w-4" />
                  دریافت فیش
                </button>
              </div>
            </div>
          </motion.article>

          {/* Current Renovation History Section */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold">سوابق نوسازی جاری</h2>
              </div>
              <HelpButton
                title="سوابق نوسازی"
                desc="تاریخچه و سوابق پرداخت عوارض نوسازی برای این ملک در این بخش نمایش داده می‌شود."
              />
            </div>
            <div className="p-4">
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-xs text-destructive">
                موردی برای نمایش وجود ندارد.
              </div>
            </div>
          </motion.article>

          {/* Map Section */}
          <motion.article
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel relative h-[400px] overflow-hidden group"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <img
                src="/map-placeholder.jpg"
                alt="Map"
                className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              {/* Map overlay tint */}
              <div className="absolute inset-0 bg-blue-900/20" />
            </div>
            {/* Zoom controls */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card transition-colors">
                <Plus className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card transition-colors">
                <Minus className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card transition-colors">
                <Home className="h-4 w-4" />
              </button>
            </div>
            {/* Trash button */}
            <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/90 text-white shadow-lg hover:bg-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.article>
        </div>
      </main>
    </div>
  );
}

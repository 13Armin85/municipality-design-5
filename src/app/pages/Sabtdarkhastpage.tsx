import { useState } from "react";
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
  Trash2,
  X,
  FileText,
  ClipboardList,
  User,
  Building2,
  CalendarDays,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router";

interface SabtDarkhastPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const searchFields = [
  { label: "منطقه", value: "1" },
  { label: "محله", value: "701" },
  { label: "بلوک", value: "5" },
  { label: "ملک", value: "56" },
  { label: "ساختمان", value: "۰" },
  { label: "آپارتمان", value: "۰" },
  { label: "صنفی", value: "۰" },
];

export function SabtDarkhastPage({
  isDark,
  toggleTheme,
}: SabtDarkhastPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });
  const [vakadari, setVakadari] = useState("");

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

  const FormField = ({
    label,
    required,
    type = "text",
    children,
    colSpan = 1,
  }: {
    label: string;
    required?: boolean;
    type?: string;
    children?: React.ReactNode;
    colSpan?: number;
  }) => (
    <div className={colSpan === 2 ? "col-span-2 md:col-span-2" : ""}>
      <div className="relative">
        {children ?? (
          <input
            type={type}
            className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none focus:border-primary transition-colors"
          />
        )}
        <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
          {label}
          {required && <span className="text-destructive mr-0.5">*</span>}
        </span>
      </div>
    </div>
  );

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

      <main className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-6xl space-y-5">
          {/* پیام راهنما */}
          <div className="rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm text-right">
            کاربر گرامی، لطفاً پس از انتخاب ملک خود دکمه جستجو را بفشارید.
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
                desc="کد نوسازی ۷ رقمی خود را از روی قبض نوسازی در کادرهای مربوطه وارد کنید."
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

          {/* پرونده‌های زیر مجموعه */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
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
                    ۱-۷۰۱-۵-۵۶-۰-۰-۰ (ملک) - بهرام حضرتی
                  </span>
                </div>
                <ChevronLeft className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          </motion.article>

          {/* ثبت درخواست */}
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
              <HelpButton
                title="ثبت درخواست"
                desc="اطلاعات مالک، درخواست، متقاضی، تکمیلی و خریدار را به‌ترتیب تکمیل نمایید و در پایان دکمه ادامه را بفشارید."
              />
            </div>

            <div className="p-4 space-y-6">
              {/* اطلاعات مالک */}
              <div>
                <SectionHeader icon={User} title="اطلاعات مالک" />
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4">
                  {/* Radio کد ملی */}
                  <div className="col-span-2 md:col-span-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="malek-type"
                        className="accent-primary"
                      />
                      کد ملی
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="malek-type"
                        defaultChecked
                        className="accent-primary"
                      />
                      شناسه ملی
                    </label>
                  </div>
                  <FormField label="شناسه ملی" required />
                  <FormField label="نام مالک" required />
                  <FormField label="شماره همراه" required />
                  <FormField label="کد پستی" />
                  <div className="col-span-2 md:col-span-4 relative">
                    <input
                      type="text"
                      className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none focus:border-primary transition-colors"
                    />
                    <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
                      نشانی مالک
                    </span>
                  </div>
                </div>
              </div>

              {/* اطلاعات درخواست */}
              <div>
                <SectionHeader icon={ClipboardList} title="اطلاعات درخواست" />
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3">
                  <FormField label="شماره درخواست" required>
                    <input
                      type="text"
                      defaultValue=""
                      className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </FormField>
                  <FormField label="نوع درخواست" required>
                    <input
                      type="text"
                      className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </FormField>
                  <FormField label="نوع متقاضی" required>
                    <input
                      type="text"
                      className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </FormField>
                  {/* دکمه‌های نوع درخواست */}
                  <div className="col-span-2 md:col-span-3 flex items-center gap-2">
                    <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">
                      جدید
                    </button>
                    <button className="rounded-lg border border-border/70 bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 transition-colors">
                      ...
                    </button>
                    <button className="rounded-lg border border-border/70 bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 transition-colors">
                      ...
                    </button>
                  </div>
                </div>
              </div>

              {/* اطلاعات متقاضی */}
              <div>
                <SectionHeader icon={User} title="اطلاعات متقاضی" />
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4">
                  <div className="col-span-2 md:col-span-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="motaqazi-type"
                        className="accent-primary"
                      />
                      کد ملی
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="motaqazi-type"
                        defaultChecked
                        className="accent-primary"
                      />
                      شناسه ملی
                    </label>
                  </div>
                  <FormField label="شناسه ملی" required />
                  <FormField label="نام متقاضی" required />
                  <FormField label="شماره همراه" required />
                  <FormField label="نوع واگذاری">
                    <select
                      value={vakadari}
                      onChange={(e) => setVakadari(e.target.value)}
                      className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="1">مالک</option>
                      <option value="2">مستأجر</option>
                      <option value="3">وکیل</option>
                    </select>
                  </FormField>
                  <div className="col-span-2 md:col-span-2 relative">
                    <input
                      type="text"
                      className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none focus:border-primary transition-colors"
                    />
                    <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
                      نشانی متقاضی
                    </span>
                  </div>
                  <FormField label="کد پستی" />
                </div>
              </div>

              {/* اطلاعات تکمیلی */}
              <div>
                <SectionHeader icon={Building2} title="اطلاعات تکمیلی" />
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4">
                  <FormField label="شماره نامه" />
                  <FormField label="تاریخ نامه">
                    <div className="relative">
                      <input
                        type="text"
                        className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 pl-9 text-sm outline-none focus:border-primary transition-colors"
                      />
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70" />
                    </div>
                  </FormField>
                  <FormField label="شماره دبیرخانه" />
                  <FormField label="تاریخ دبیرخانه">
                    <div className="relative">
                      <input
                        type="text"
                        className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 pl-9 text-sm outline-none focus:border-primary transition-colors"
                      />
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70" />
                    </div>
                  </FormField>
                  <div className="col-span-2 md:col-span-4 flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none focus:border-primary transition-colors"
                      />
                      <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
                        اداره استعلام کننده
                      </span>
                    </div>
                    <button className="mt-0 flex h-10 items-center justify-center rounded-xl bg-primary/90 px-3 text-white shadow hover:bg-primary transition-colors">
                      <span className="text-lg font-bold leading-none">
                        ...
                      </span>
                    </button>
                  </div>
                  <div className="col-span-2 md:col-span-4 relative">
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-border/70 bg-card px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none"
                    />
                    <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
                      توضیحات
                    </span>
                  </div>
                </div>
              </div>

              {/* اطلاعات خریدار */}
              <div>
                <SectionHeader icon={ShoppingCart} title="اطلاعات خریدار" />
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4">
                  <div className="col-span-2 md:col-span-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="buyer-type"
                        className="accent-primary"
                      />
                      کد ملی
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="buyer-type"
                        defaultChecked
                        className="accent-primary"
                      />
                      شناسه ملی
                    </label>
                  </div>
                  <FormField label="شناسه ملی" />
                  <FormField label="نام خریدار" />
                  <FormField label="شماره همراه" />
                  <FormField label="دانگ / سهم مورد انتقال از" />
                </div>
              </div>

              {/* دکمه‌های انتها */}
              <div className="flex items-center justify-start gap-3 pt-2 border-t border-border/50">
                <button className="rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95">
                  ادامه
                </button>
                <button className="rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-2.5 text-sm font-semibold text-destructive transition-all hover:bg-destructive/10 active:scale-95">
                  انصراف
                </button>
              </div>
            </div>
          </motion.article>

          {/* درخواست های ثبت شده */}
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
              <HelpButton
                title="درخواست‌های ثبت شده"
                desc="درخواست‌هایی که تا کنون برای این ملک ثبت شده‌اند در این بخش نمایش داده می‌شوند."
              />
            </div>
            <div className="p-4">
              <div className="rounded-xl border border-rose-200/40 bg-rose-50/30 dark:bg-rose-950/20 dark:border-rose-800/30 p-4 text-center text-xs text-rose-500 dark:text-rose-400">
                موردی برای نمایش وجود ندارد.
              </div>
            </div>
          </motion.article>

          {/* نقشه */}
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
              {/* اطلاعات ملک overlay */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 rounded-2xl border border-border bg-card/95 shadow-xl backdrop-blur-md p-4 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2">
                  <span className="text-sm font-bold text-foreground">
                    اطلاعات ملک
                  </span>
                  <button className="rounded-full p-0.5 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">کد نوسازی</span>
                  <span className="text-muted-foreground">
                    1-701-5-59-0-0-0
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">نام مالک</span>
                  <span className="text-muted-foreground">فاطمه محرم پور</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">مساحت</span>
                  <span className="text-muted-foreground">238.65</span>
                </div>
              </div>
            </div>
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card">
                <Plus className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card">
                <Minus className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card">
                <Home className="h-4 w-4" />
              </button>
            </div>
            <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/90 text-white shadow-lg">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.article>
        </div>
      </main>
    </div>
  );
}

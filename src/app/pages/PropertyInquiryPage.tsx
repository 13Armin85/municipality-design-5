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
} from "lucide-react";
import { Link } from "react-router";

interface PropertyInquiryPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const searchFields = [
  { label: "منطقه", value: "2" },
  { label: "محله", value: "104" },
  { label: "بلوک", value: "27" },
  { label: "ملک", value: "44" },
  { label: "ساختمان", value: "" },
  { label: "آپارتمان", value: "" },
  { label: "صنفی", value: "" },
];

const propertyDetails = [
  { label: "مساحت طبق سند", value: "۲۰۴۹" },
  { label: "مساحت اصلاحی", value: "-" },
  { label: "مساحت باقیمانده پس از اصلاح", value: "۲۰۴۹" },
];

const directionsData = [
  {
    dir: "شمال",
    type: "کوچه",
    name: "اخلاص",
    sideExist: "۱.۰۰",
    edgeExist: "۱",
  },
  { dir: "شرق", type: "---", name: "---", sideExist: "۱.۰۰", edgeExist: "۰" },
  { dir: "جنوب", type: "---", name: "---", sideExist: "۱.۰۰", edgeExist: "۰" },
  { dir: "غرب", type: "---", name: "---", sideExist: "۱.۰۰", edgeExist: "۰" },
];

export function PropertyInquiryPage({
  isDark,
  toggleTheme,
}: PropertyInquiryPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  // کامپوننت دکمه راهنما برای استفاده مجدد در سکشن‌ها
  const HelpButton = ({ title, desc }: { title: string; desc: string }) => (
    <button
      onClick={() => handleOpenHelp(title, desc)}
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
              <div className=" px-6 py-4 text-left">
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
          <div className="rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm">
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
                <h2 className="text-sm font-bold text-foreground">جستجو ملک</h2>
              </div>
              <HelpButton
                title="جستجو"
                desc="کد نوسازی ۷ رقمی خود را از روی قبض نوسازی در کادرهای مربوطه وارد کنید. ترتیب وارد کردن از منطقه (سمت راست) شروع می‌شود."
              />
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-8">
              {/* دکمه جستجو در سمت راست */}
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

          {/* وضعیت عقب نشینی */}
          <div className="grid gap-5 md:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="soft-card mesh-panel"
            >
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>وضعیت عقب نشینی</span>
                </div>
                <HelpButton
                  title="مساحت"
                  desc="مساحت طبق سند همان متراژ اولیه است. مساحت اصلاحی متراژی است که در طرح تعریض قرار گرفته است."
                />
              </div>
              <div className="space-y-3 p-4">
                {propertyDetails.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-border/40 pb-2 text-sm"
                  >
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="soft-card mesh-panel"
            >
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>عقب نشینی</span>
                </div>
                <HelpButton
                  title="عقب نشینی"
                  desc="در این بخش جزئیات دقیق متراژی که باید از هر سمت ملک آزاد شود (در صورت وجود طرح) نمایش داده می‌شود."
                />
              </div>
              <div className="p-4">
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-xs text-destructive">
                  موردی برای نمایش وجود ندارد. (ملک فاقد اصلاحی در طرح جاری است)
                </div>
              </div>
            </motion.article>
          </div>

          {/* جهات چهارگانه */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold">
                  طول بر و ابعاد (جهات چهارگانه)
                </h2>
              </div>
              <HelpButton
                title="جهات چهارگانه"
                desc="این جدول ابعاد دقیق ملک شما را از شمال، جنوب، شرق و غرب به همراه نام معبر و وضعیت فعلی نمایش می‌دهد."
              />
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-right text-[11px] md:text-xs">
                <thead>
                  <tr className="bg-[var(--primary-soft)] text-primary">
                    <th className="border border-border/50 p-2 text-center">
                      جهت
                    </th>
                    <th className="border border-border/50 p-2">نوع معبر</th>
                    <th className="border border-border/50 p-2">نام معبر</th>
                    <th className="border border-border/50 p-2 text-center">
                      طول ضلع
                    </th>
                    <th className="border border-border/50 p-2 text-center">
                      طول بر
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {directionsData.map((d, i) => (
                    <tr key={i} className="transition-colors hover:bg-muted/30">
                      <td className="border border-border/50 p-2 text-center font-bold">
                        {d.dir}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {d.type}
                      </td>
                      <td className="border border-border/50 p-2">{d.name}</td>
                      <td className="border border-border/50 p-2 text-center font-medium">
                        {d.sideExist}
                      </td>
                      <td className="border border-border/50 p-2 text-center font-medium">
                        {d.edgeExist}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            </div>
            <div className="absolute left-4 top-16 flex flex-col gap-2">
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
            <button className="absolute right-4 top-16 flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/90 text-white shadow-lg">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.article>
        </div>
      </main>
    </div>
  );
}

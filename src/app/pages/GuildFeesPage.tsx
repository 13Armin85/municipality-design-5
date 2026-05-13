import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  FileText,
  Home,
  Info,
  Minus,
  Moon,
  Plus,
  Search,
  Store,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router";

interface GuildFeesPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

// --- دیتاهای ثابت ---
const searchFields = [
  { label: "صنفی", placeholder: "صنفی" },
  { label: "آپارتمان", placeholder: "آپارتمان" },
  { label: "ساختمان", placeholder: "ساختمان" },
  { label: "ملک", placeholder: "ملک" },
  { label: "بلوک", placeholder: "بلوک" },
  { label: "محله", placeholder: "محله" },
  { label: "منطقه", placeholder: "منطقه" },
];

const childCases = [
  {
    id: "case-1",
    title: "۱-۷۰۱-۱۳-۱۶۲-۴۰۰",
    type: "ملک",
    owner: "احمد عزیزی",
    icon: Store,
  },
  {
    id: "case-2",
    title: "۱-۷۰۱-۱۳-۱۶۲-۴۰۰",
    type: "ساختمان",
    owner: "احمد عزیزی",
    icon: Home,
  },
];

const currentFeeInfoRight = [
  { label: "نام متصدی", value: "تکمیل شد" },
  { label: "از تاریخ", value: "تکمیل شد" },
  { label: "مبلغ جاری", value: "تکمیل شد" },
  { label: "مبلغ به حروف", value: "تکمیل شد" },
];

const currentFeeInfoLeft = [
  { label: "نوع شغل", value: "تکمیل شد" },
  { label: "تا تاریخ", value: "تکمیل شد" },
  { label: "مبلغ قسط", value: "تکمیل شد" },
  { label: "آدرس", value: "تکمیل شد" },
];

const owners = [
  {
    firstName: "احمد",
    lastName: "عزیزی",
    type: "حقیقی",
    fatherName: "جعفر",
    issuePlace: "مشهد",
  },
];

const parcels = [
  {
    id: "p1",
    top: "6%",
    right: "8%",
    width: "18%",
    height: "15%",
    tone: "bg-yellow-300/70",
    rotate: -4,
    title: "قطعه مسکونی A",
  },
  {
    id: "p2",
    top: "8%",
    right: "30%",
    width: "22%",
    height: "16%",
    tone: "bg-yellow-300/65",
    rotate: 5,
    title: "قطعه مسکونی B",
  },
  {
    id: "p3",
    top: "6%",
    right: "56%",
    width: "19%",
    height: "14%",
    tone: "bg-emerald-300/55",
    rotate: -3,
    title: "فضای سبز",
  },
  {
    id: "p4",
    top: "25%",
    right: "12%",
    width: "20%",
    height: "16%",
    tone: "bg-yellow-300/65",
    rotate: 2,
    title: "مجتمع تجاری",
  },
  {
    id: "p5",
    top: "26%",
    right: "38%",
    width: "18%",
    height: "13%",
    tone: "bg-yellow-300/70",
    rotate: -5,
    title: "قطعه C",
  },
  {
    id: "p6",
    top: "24%",
    right: "62%",
    width: "22%",
    height: "16%",
    tone: "bg-yellow-300/60",
    rotate: 4,
    title: "قطعه D",
  },
  {
    id: "p7",
    top: "46%",
    right: "10%",
    width: "24%",
    height: "18%",
    tone: "bg-yellow-300/70",
    rotate: -2,
    title: "قطعه E",
  },
  {
    id: "p8",
    top: "48%",
    right: "40%",
    width: "19%",
    height: "14%",
    tone: "bg-emerald-300/45",
    rotate: 3,
    title: "پارکینگ عمومی",
  },
  {
    id: "p9",
    top: "46%",
    right: "63%",
    width: "23%",
    height: "17%",
    tone: "bg-yellow-300/65",
    rotate: -6,
    title: "قطعه F",
  },
];

export function GuildFeesPage({ isDark, toggleTheme }: GuildFeesPageProps) {
  // مدیریت مودال راهنما
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  return (
    <>
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
                  className="rounded-full p-1.5 transition-colors hover:bg-muted text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 text-sm leading-7 text-foreground/80">
                {modalContent.description}
              </div>
              <div className="bg-muted/30 px-6 py-4 text-left">
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
                <span className="text-sm">بازگشت </span>
              </Link>

              <div className="min-w-0 text-center">
                <h1 className="truncate text-sm font-bold text-foreground md:text-base">
                  عوارض صنفی
                </h1>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="header-action-btn"
                aria-label="تغییر تم"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isDark ? "sun" : "moon"}
                    initial={{ opacity: 0, rotate: -18, scale: 0.9 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 18, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex"
                  >
                    {isDark ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <section className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-6xl px-0 md:px-2 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-4 rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm"
          >
            لطفا پس از انتخاب ملک، کدهای بخش جستجو را تکمیل کرده و دکمه جستجو را
            فشار دهید.
          </motion.div>

          <div className="space-y-4 md:space-y-5">
            {/* بخش جستجو */}
            {/* بخش جستجو */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="soft-card mesh-panel overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
                <h2 className="text-sm font-bold text-foreground md:text-base">
                  جستجو
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenHelp(
                        "راهنمای جستجو",
                        "در این بخش می‌توانید با وارد کردن کدهای نوسازی ملک شامل منطقه، محله، بلوک و غیره، اطلاعات دقیق ملک را از سامانه استعلام بگیرید.",
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/10"
                  >
                    <Info className="h-3.5 w-3.5" />
                    راهنما
                  </button>
                  <button
                    type="button"
                    aria-label="بازگشت"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background text-primary transition-all hover:bg-muted"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <form
                className="grid grid-cols-2 gap-x-2 gap-y-4 p-4 md:grid-cols-8 md:p-5"
                onSubmit={(event) => event.preventDefault()}
              >
                {/* دکمه جستجو */}
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:scale-95 md:order-first"
                >
                  <Search className="ml-1.5 h-4 w-4" />
                  جستجو
                </button>

                {/* اینپوت‌ها با لیبل بالای کادر */}
                {searchFields.map((field) => (
                  <div key={field.label} className="relative mt-2">
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="h-11 w-full rounded-xl border border-border/70 bg-card px-3 text-center text-sm text-foreground outline-none transition-all focus:border-primary/45 focus:ring-2 focus:ring-primary/10"
                    />
                    <label className="absolute -top-2.5 right-3 bg-card px-1.5 text-[10px] font-medium text-muted-foreground transition-all">
                      {field.label}
                    </label>
                  </div>
                ))}
              </form>
            </motion.article>

            {/* بخش پرونده‌های زیر مجموعه */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.03 }}
              className="soft-card mesh-panel overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
                <h2 className="text-sm font-bold text-foreground md:text-base">
                  پرونده‌های زیر مجموعه
                </h2>
                <button
                  onClick={() =>
                    handleOpenHelp(
                      "پرونده‌های زیرمجموعه",
                      "این لیست شامل تمامی واحدهای مستقر در ملک انتخابی (مانند واحدهای آپارتمانی یا مغازه‌ها) است که دارای پرونده صنفی مجزا هستند.",
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/10"
                >
                  <Info className="h-3.5 w-3.5" />
                  راهنما
                </button>
              </div>

              <div className="p-4 md:p-5">
                <div className="space-y-2 rounded-xl border border-border/70 bg-card/50 p-3">
                  {childCases.map((item) => (
                    <article
                      key={item.id}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm transition-all hover:border-primary/40 hover:shadow-sm group"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title} - ({item.type}) - {item.owner}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
                        <item.icon className="h-4 w-4 text-primary" />
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </motion.article>

            {/* بخش عوارض جاری */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.06 }}
              className="soft-card mesh-panel overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
                <h2 className="text-sm font-bold text-foreground md:text-base">
                  عوارض صنفی جاری
                </h2>
                <button
                  onClick={() =>
                    handleOpenHelp(
                      "عوارض جاری",
                      "در این قسمت جزئیات محاسباتی عوارض سال جاری، مبالغ اقساط و وضعیت پرداخت‌های متصدی واحد صنفی نمایش داده می‌شود.",
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/10"
                >
                  <Info className="h-3.5 w-3.5" />
                  راهنما
                </button>
              </div>

              <div className="p-4 md:p-5">
                <div className="grid gap-4 rounded-xl border border-border/70 bg-card/40 p-4 md:grid-cols-2 md:gap-8">
                  <ul className="space-y-2">
                    {currentFeeInfoRight.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                        <strong className="text-foreground">
                          {item.value}
                        </strong>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2">
                    {currentFeeInfoLeft.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                        <strong className="text-foreground">
                          {item.value}
                        </strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>

            {/* مالکین */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.09 }}
              className="soft-card mesh-panel overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
                <h2 className="text-sm font-bold text-foreground md:text-base">
                  مالکین
                </h2>
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary/65 animate-pulse" />
              </div>

              <div className="overflow-x-auto p-4 md:p-5">
                <table className="min-w-full overflow-hidden rounded-xl border border-border/70 text-sm">
                  <thead className="bg-[var(--primary-soft)]/70 text-foreground">
                    <tr>
                      <th className="px-3 py-2.5 text-right font-semibold">
                        نام
                      </th>
                      <th className="px-3 py-2.5 text-right font-semibold">
                        نام خانوادگی
                      </th>
                      <th className="px-3 py-2.5 text-right font-semibold">
                        نوع مالک
                      </th>
                      <th className="px-3 py-2.5 text-right font-semibold">
                        نام پدر
                      </th>
                      <th className="px-3 py-2.5 text-right font-semibold">
                        محل صدور
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70 bg-card/40">
                    {owners.map((owner, index) => (
                      <tr
                        key={`${owner.firstName}-${index}`}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-3 py-2.5 text-foreground">
                          {owner.firstName}
                        </td>
                        <td className="px-3 py-2.5 text-foreground">
                          {owner.lastName}
                        </td>
                        <td className="px-3 py-2.5 text-foreground">
                          {owner.type}
                        </td>
                        <td className="px-3 py-2.5 text-foreground">
                          {owner.fatherName}
                        </td>
                        <td className="px-3 py-2.5 text-foreground">
                          {owner.issuePlace}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.article>
            {/* بخش عوارض - وضعیت خالی */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.12 }}
              className="soft-card mesh-panel overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
                <h2 className="text-sm font-bold text-foreground md:text-base">
                  عوارض
                </h2>
                <FileText className="h-4 w-4 text-primary" />
              </div>

              <div className="p-4 md:p-5">
                <div className="rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  موردی برای نمایش وجود ندارد. ابتدا جستجو کنید.
                </div>
              </div>
            </motion.article>

            {/* نقشه زمین با قابلیت هوور */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.15 }}
              className="soft-card mesh-panel overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
                <h2 className="text-sm font-bold text-foreground md:text-base">
                  نقشه زمین (نمادین)
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleOpenHelp(
                        "راهنمای نقشه",
                        "این یک نقشه شماتیک از محدوده ملک انتخابی است. با نگه‌داشتن ماوس روی هر قطعه می‌توانید عنوان آن را مشاهده کنید. قطعه هاشورخورده نمایانگر موقعیت فعلی است.",
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/10"
                  >
                    <Info className="h-3.5 w-3.5" />
                    راهنما
                  </button>
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div className="relative h-[30rem] overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(145deg,#647257_0%,#7e8f6d_38%,#6a735f_100%)] md:h-[44rem]">
                  <div className="absolute inset-0 opacity-55 [background-image:radial-gradient(circle_at_12%_14%,rgba(255,255,255,0.18)_0,transparent_34%),radial-gradient(circle_at_88%_78%,rgba(255,255,255,0.1)_0,transparent_30%)]" />
                  <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(17,36,18,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(17,36,18,0.22)_1px,transparent_1px)] [background-size:70px_70px]" />

                  {/* قطعات نقشه با قابلیت هاور */}
                  {parcels.map((parcel) => (
                    <motion.div
                      key={parcel.id}
                      whileHover={{
                        scale: 1.03,
                        filter: "brightness(1.1)",
                        zIndex: 10,
                        boxShadow: "0 10px 20px -5px rgba(0,0,0,0.3)",
                      }}
                      className={`absolute rounded-sm border border-sky-900/25 cursor-pointer flex items-center justify-center group transition-all ${parcel.tone}`}
                      style={{
                        top: parcel.top,
                        right: parcel.right,
                        width: parcel.width,
                        height: parcel.height,
                        transform: `rotate(${parcel.rotate}deg)`,
                      }}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] md:text-xs font-bold text-sky-950 text-center px-1">
                        {parcel.title}
                      </span>
                    </motion.div>
                  ))}

                  {/* محدوده فعال (ملک انتخابی) */}
                  <div className="absolute left-[44%] top-[58%] h-28 w-24 rounded-md border-2 border-dashed border-sky-600 bg-emerald-300/35 shadow-[0_0_0_6px_rgba(18,80,126,0.14)] backdrop-blur-[1px] animate-pulse" />

                  {/* کنترل‌های نقشه */}
                  <div className="absolute left-3 top-3 space-y-1.5 md:left-4 md:top-4">
                    <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card/90 text-foreground shadow-sm transition-colors hover:bg-card">
                      <Plus className="h-4 w-4" />
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card/90 text-foreground shadow-sm transition-colors hover:bg-card">
                      <Minus className="h-4 w-4" />
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card/90 text-foreground shadow-sm transition-colors hover:bg-card">
                      <Home className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-destructive/35 bg-card/90 text-destructive shadow-sm md:right-4 md:top-4 transition-colors hover:bg-destructive hover:text-white"
                    aria-label="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="absolute bottom-3 left-3 rounded-lg border border-border/70 bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground md:bottom-4 md:left-4">
                    مقیاس 10m
                  </div>

                  <div className="absolute bottom-3 right-3 h-12 w-12 overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-sky-300/70 to-emerald-300/70 shadow-inner md:bottom-4 md:right-4" />
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
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
import {
  findPropertyByCodes,
  guildCodeFields,
  propertyItems,
  type MockProperty,
  type RenewalCodeKey,
  type RenewalCodes,
} from "../data/properties";
import { useSelectedProperty } from "../hooks/useSelectedProperty";

interface GuildFeesPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

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
  const { selectedProperty, selectProperty } = useSelectedProperty();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  // استیت‌های مربوط به جستجو و داده‌های فعال
  const [searchInputs, setSearchInputs] = useState<RenewalCodes>(
    selectedProperty.codes,
  );
  const [activeData, setActiveData] = useState<MockProperty | null>(
    selectedProperty,
  );

  useEffect(() => {
    setSearchInputs(selectedProperty.codes);
    setActiveData(selectedProperty);
  }, [selectedProperty]);

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  // وقتی روی یک ملک از لیست کلیک می‌شود
  const handleCaseClick = (item: MockProperty) => {
    setSearchInputs(item.codes);
    setActiveData(item);
    selectProperty(item.id);
  };

  // عملیات جستجو
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = findPropertyByCodes(searchInputs);
    setActiveData(result || null);
    if (result) selectProperty(result.id);
  };

  const handleInputChange = (key: RenewalCodeKey, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* مودال راهنما - بدون تغییر دیزاین */}
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
                        "در این بخش می‌توانید با وارد کردن کدهای نوسازی ملک اطلاعات دقیق را استعلام بگیرید.",
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/10"
                  >
                    <Info className="h-3.5 w-3.5" />
                    راهنما
                  </button>
                </div>
              </div>

              <form
                className="grid grid-cols-2 gap-x-2 gap-y-4 p-4 md:grid-cols-8 md:p-5"
                onSubmit={handleSearch}
              >
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:scale-95 md:order-first"
                >
                  <Search className="ml-1.5 h-4 w-4" />
                  جستجو
                </button>

                {guildCodeFields.map((field) => (
                  <div key={field.label} className="relative mt-2">
                    <input
                      type="text"
                      value={searchInputs[field.key] || ""}
                      onChange={(e) =>
                        handleInputChange(field.key, e.target.value)
                      }
                      placeholder={field.label}
                      className="h-11 w-full rounded-xl border border-border/70 bg-card px-3 text-center text-sm text-foreground outline-none transition-all focus:border-primary/45 focus:ring-2 focus:ring-primary/10"
                    />
                    <label className="absolute -top-2.5 right-3 bg-card px-1.5 text-[10px] font-medium text-muted-foreground transition-all">
                      {field.label}
                    </label>
                  </div>
                ))}
              </form>
            </motion.article>

            {/* پرونده‌های زیر مجموعه */}
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
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
                      "لیست واحدهای مستقر در ملک انتخابی.",
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
                  {propertyItems.map((item) => {
                    const ItemIcon = item.type === "آپارتمان" ? Home : Store;

                    return (
                      <article
                        key={item.id}
                        onClick={() => handleCaseClick(item)}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/80 px-3 py-2.5 text-sm transition-all hover:border-primary/40 hover:shadow-sm group"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.guildFees.title} - ({item.guildFees.type}) -{" "}
                            {item.ownerName}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
                          <ItemIcon className="h-4 w-4 text-primary" />
                          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </motion.article>

            {/* بخش عوارض جاری - نمایش در صورت وجود دیتا */}
            {activeData && (
              <>
                <motion.article
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="soft-card mesh-panel overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
                    <h2 className="text-sm font-bold text-foreground md:text-base">
                      عوارض صنفی جاری
                    </h2>
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="grid gap-4 rounded-xl border border-border/70 bg-card/40 p-4 md:grid-cols-2 md:gap-8">
                      <ul className="space-y-2">
                        {activeData.guildFees.feeInfo.right.map((item) => (
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
                        {activeData.guildFees.feeInfo.left.map((item) => (
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

                <motion.article
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="soft-card mesh-panel overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
                    <h2 className="text-sm font-bold text-foreground md:text-base">
                      مالکین
                    </h2>
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
                        {activeData.owners.map((owner, index) => (
                          <tr
                            key={index}
                            className="transition-colors hover:bg-muted/30"
                          >
                            <td className="px-3 py-2.5 text-foreground">
                              {owner.firstName}
                            </td>
                            <td className="px-3 py-2.5 text-foreground">
                              {owner.lastName}
                            </td>
                            <td className="px-3 py-2.5 text-foreground">
                            {owner.ownerType}
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
              </>
            )}

            {/* وضعیت خالی */}
            {!activeData && (
              <motion.article className="soft-card mesh-panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
                  <h2 className="text-sm font-bold text-foreground md:text-base">
                    عوارض
                  </h2>
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="p-4 md:p-5">
                  <div className="rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    موردی برای نمایش وجود ندارد. ابتدا ملکی را انتخاب و جستجو
                    کنید.
                  </div>
                </div>
              </motion.article>
            )}

            {/* نقشه - بدون تغییر دیزاین */}
            <motion.article className="soft-card mesh-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
                <h2 className="text-sm font-bold text-foreground md:text-base">
                  نقشه زمین (نمادین)
                </h2>
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div className="p-4 md:p-5">
                <div className="relative h-[30rem] overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(145deg,#647257_0%,#7e8f6d_38%,#6a735f_100%)] md:h-[44rem]">
                  {/* محتوای نقشه ثابت می ماند */}
                  {parcels.map((parcel) => (
                    <motion.div
                      key={parcel.id}
                      whileHover={{
                        scale: 1.03,
                        filter: "brightness(1.1)",
                        zIndex: 10,
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
                  {/* انیمیشن پالس روی ملک فعال اگر دیتایی پیدا شد */}
                  {activeData && (
                    <div className="absolute left-[44%] top-[58%] h-28 w-24 rounded-md border-2 border-dashed border-sky-600 bg-emerald-300/35 shadow-[0_0_0_6px_rgba(18,80,126,0.14)] backdrop-blur-[1px] animate-pulse" />
                  )}
                  {/* کنترل های نقشه */}
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
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>
    </>
  );
}

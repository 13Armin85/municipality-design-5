import { useEffect, useState } from "react";
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
  Layers,
  FileText,
  Users,
  Receipt,
  History,
} from "lucide-react";
import { Link } from "react-router";
import {
  findPropertyByCodes,
  propertyItems,
  type MockProperty,
  type RenewalCodeKey,
  type RenewalCodes,
} from "../data/properties";
import { useSelectedProperty } from "../hooks/useSelectedProperty";

interface ModernTollPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function ModernTollPage({ isDark, toggleTheme }: ModernTollPageProps) {
  const { selectedProperty, selectProperty } = useSelectedProperty();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  // وضعیت فیلدهای ورودی جستجو
  const [searchInputs, setSearchInputs] = useState<RenewalCodes>(
    selectedProperty.codes,
  );

  // وضعیت داده‌های در حال نمایش در صفحه
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

  // هندلر تغییر مقادیر ورودی
  const handleInputChange = (key: RenewalCodeKey, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [key]: value }));
  };

  // هندلر کلیک روی یک ملک از لیست زیرمجموعه
  const selectPropertyFromList = (property: MockProperty) => {
    setSearchInputs(property.codes);
    setActiveData(property);
    selectProperty(property.id);
  };

  // هندلر دکمه جستجو
  const handleSearch = () => {
    const found = findPropertyByCodes(searchInputs);
    if (found) {
      setActiveData(found);
      selectProperty(found.id);
    } else {
      alert("پرونده‌ای با این مشخصات یافت نشد.");
      setActiveData(null);
    }
  };

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

      <main className="section-decor px-3 pb-12 pt-10 md:pb-20 md:pt-10 lg:px-6">
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
                <h2 className="text-sm font-bold text-foreground">جستجو</h2>
              </div>
              <HelpButton
                title="جستجو"
                desc="کد نوسازی ۷ رقمی خود را وارد کنید."
              />
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-8">
              <button
                onClick={handleSearch}
                className="flex h-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/20"
              >
                <Search className="ml-1.5 h-4 w-4" /> جستجو
              </button>

              {[
                { label: "منطقه", key: "region" },
                { label: "محله", key: "neighborhood" },
                { label: "بلوک", key: "block" },
                { label: "ملک", key: "property" },
                { label: "ساختمان", key: "building" },
                { label: "آپارتمان", key: "apartment" },
                { label: "صنفی", key: "guild" },
              ].map((field) => (
                <div key={field.key} className="relative">
                  <input
                    value={searchInputs[field.key as RenewalCodeKey]}
                    onChange={(e) =>
                      handleInputChange(field.key as RenewalCodeKey, e.target.value)
                    }
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
                <h2 className="text-sm font-bold text-foreground">
                  پرونده های زیر مجموعه
                </h2>
              </div>
              <HelpButton
                title="زیر مجموعه"
                desc="لیست املاک شما در این بخش نمایش داده می‌شود."
              />
            </div>
            <div className="p-4 space-y-2">
              {propertyItems.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => selectPropertyFromList(prop)}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-card/50 p-3 group cursor-pointer hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${searchInputs.property === prop.codes.property ? "bg-emerald-500" : "bg-orange-400"}`}
                    />
                    <span className="text-xs font-medium md:text-sm">
                      {prop.fullCode} (ملک) - {prop.ownerName}
                    </span>
                  </div>
                  <ChevronLeft className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-x-1" />
                </div>
              ))}
            </div>
          </motion.article>

          {/* مالکین */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">مالکین</h2>
              </div>
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
                  {activeData?.owners.map((owner, i) => (
                    <tr key={i} className="transition-colors hover:bg-muted/30">
                      <td className="border border-border/50 p-2 text-center font-bold">
                        {owner.id}
                      </td>
                      <td className="border border-border/50 p-2">
                        {owner.firstName}
                      </td>
                      <td className="border border-border/50 p-2">
                        {owner.lastName}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.ownerType}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.fatherName}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.birthPlace}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-muted-foreground"
                      >
                        ابتدا جستجو کنید
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.article>

          {/* عوارض نوسازی جاری */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  عوارض نوسازی جاری
                </h2>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-0 md:grid-cols-2">
                <div className="space-y-0">
                  {(
                    activeData?.toll.fees.right ||
                    Array(9).fill({ label: "—", value: "—" })
                  ).map((field, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-border/30 py-2.5 text-xs md:text-sm"
                    >
                      <span className="text-muted-foreground">
                        {field.label} :
                      </span>
                      <span className="font-medium text-foreground/80">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-0">
                  {(
                    activeData?.toll.fees.left ||
                    Array(9).fill({ label: "—", value: "—" })
                  ).map((field, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-border/30 py-2.5 text-xs md:text-sm"
                    >
                      <span className="text-muted-foreground">
                        {field.label} :
                      </span>
                      <span className="font-medium text-foreground/80">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {activeData && (
                <div className="mt-5 flex justify-start">
                  <button className="flex items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-destructive/20 transition-all hover:bg-destructive/90 active:scale-95">
                    <FileText className="h-4 w-4" /> دریافت فیش
                  </button>
                </div>
              )}
            </div>
          </motion.article>

          {/* سوابق نوسازی */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  سوابق نوسازی جاری
                </h2>
              </div>
            </div>
            <div className="p-4">
              {activeData && activeData.toll.history.length > 0 ? (
                <div className="space-y-2">
                  {activeData.toll.history.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between rounded-lg border p-3 text-xs"
                    >
                      <span>تاریخ: {item.date}</span>
                      <span>مبلغ: {item.amount}</span>
                      <span className="text-emerald-500">{item.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-xs text-destructive">
                  موردی برای نمایش وجود ندارد.
                </div>
              )}
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
              <div className="absolute inset-0 bg-blue-900/20 z-10" />
              <img
                src="/map-placeholder.jpg"
                alt="Map"
                className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card transition-colors text-foreground">
                <Plus className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card transition-colors text-foreground">
                <Minus className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card transition-colors text-foreground">
                <Home className="h-4 w-4" />
              </button>
            </div>
            <button className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/90 text-white shadow-lg hover:bg-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.article>
        </div>
      </main>
    </div>
  );
}

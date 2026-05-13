import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Info,
  MapPin,
  Minus,
  Plus,
  Moon,
  Sun,
  Trash2,
  X,
  Home,
} from "lucide-react";
import { Link } from "react-router";

interface MyPropertyPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const myProperties = [
  {
    id: "۲-۱۰۱-۲۷-۳۸-۰-۰-۰",
    description:
      "شماره پرونده : ۷۵۸ ، وضعیت ملک : سکونت ، مساحت طبق سند : ۲۴۹.۲ ، پلاک ثبتی : ۱۶ ، آدرس : خیابان سرتیپ فلاحی کوچه مهکام بن بست مهکام پلاک ۱۶",
  },
];

export function MyPropertyPage({ isDark, toggleTheme }: MyPropertyPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<
    (typeof myProperties)[0] | null
  >(null);

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
                  راهنما
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 text-sm leading-7 text-foreground/80">
                در این بخش لیست املاک ثبت‌شده شما نمایش داده می‌شود. با کلیک روی
                آیکون نقشه می‌توانید موقعیت ملک را روی نقشه مشاهده کنید.
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
          <div className="nav-shell bg-card border border-border/50 rounded-2xl shadow-sm">
            <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
              {/* دکمه بازگشت سمت راست (شروع راست‌چین) */}
              <Link
                to="/"
                className="header-action-btn inline-flex items-center gap-2 px-3"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden text-sm md:block">بازگشت</span>
              </Link>

              {/* عنوان وسط */}
              <h1 className="text-sm font-bold text-foreground md:text-base">
                املاک من
              </h1>

              {/* دکمه‌های تم و راهنما سمت چپ */}
              <div className="flex items-center gap-1.5 md:gap-3 flex-row-reverse">
                <button
                  onClick={toggleTheme}
                  className="header-action-btn flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 md:py-2 text-xs font-bold text-primary-foreground shadow transition-transform active:scale-95"
                >
                  <Info className="h-3.5 w-3.5" />
                  راهنما
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6 bg-background">
        <div className="container mx-auto max-w-6xl space-y-5">
          {/* جدول املاک */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card bg-card border border-border/50 rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs md:text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/60">
                    <th className="px-4 py-3 font-semibold text-foreground/80 text-right">
                      کد نوسازی
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground/80 text-right">
                      توضیحات
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground/80 text-center w-20">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myProperties.map((property, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/40 hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {property.id}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground leading-6 text-xs">
                        {property.description}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            setSelectedProperty(
                              selectedProperty?.id === property.id
                                ? null
                                : property,
                            )
                          }
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-95 shadow-sm ${
                            selectedProperty?.id === property.id
                              ? "bg-emerald-500 text-white shadow-emerald-400/30"
                              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                          }`}
                          title="نمایش روی نقشه"
                        >
                          <MapPin className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.article>

          {/* نقشه */}
          <AnimatePresence>
            {selectedProperty && (
              <motion.article
                key="map"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 6 }}
                transition={{ duration: 0.3 }}
                className="soft-card bg-card border border-border/50 rounded-2xl relative h-[480px] overflow-hidden group"
              >
                {/* نقشه پس‌زمینه */}
                <div className="absolute inset-0 bg-slate-700">
                  <div className="h-full w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/40 select-none">
                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p className="text-xs">نقشه در حال بارگذاری...</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* کنترل‌های نقشه - سمت چپ */}
                <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
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

                {/* دکمه حذف - سمت راست */}
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/90 text-white shadow-lg hover:bg-destructive transition-colors z-10"
                  title="بستن نقشه"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* برچسب مقیاس */}
                <div className="absolute bottom-4 left-4 rounded-md bg-card/80 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm z-10">
                  m 50
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

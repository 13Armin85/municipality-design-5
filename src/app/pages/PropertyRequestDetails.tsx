import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Info,
  X,
  Layers,
  ClipboardList,
  FileSearch,
  Plus,
  Minus,
  Home,
  Trash2,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { Link } from "react-router";

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
}

export function PropertyRequestDetails({ isDark, toggleTheme }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const HelpButton = () => (
    <button
      onClick={() => setIsModalOpen(true)}
      className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 md:text-xs"
    >
      <Info className="h-3.5 w-3.5" /> راهنما
    </button>
  );

  const EmptyAlert = ({ message }: { message: string }) => (
    <div className="mx-4 mb-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-xs text-destructive/80 font-medium">
      {message}
    </div>
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
    >
      {/* هدر */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
      >
        <div className="container mx-auto px-0 md:px-2 lg:px-6">
          <div className="nav-shell">
            <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
              {/* دکمه بازگشت */}
              <Link
                to="/"
                className="header-action-btn inline-flex items-center gap-2 px-3"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden text-sm md:block">بازگشت</span>
              </Link>

              {/* عنوان وسط */}
              <h1 className="text-sm font-bold text-foreground md:text-base">
                پیگیری درخواست‌ها
              </h1>

              {/* دکمه‌های سمت چپ (تم و راهنما) */}
              <div className="flex items-center gap-1.5 md:gap-3">
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
                
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* محتوای اصلی */}
      <main className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-6xl space-y-6">
          {/* نوار راهنمای بالا */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm"
          >
            کاربر گرامی، لطفاً پس از انتخاب ملک خود دکمه جستجو را بفشارید.
          </motion.div>

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
                <h2 className="text-sm font-bold">جستجو</h2>
              </div>
              <HelpButton />
            </div>

            <div className="flex flex-wrap items-end gap-3 p-5">
              <button className="h-11 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95">
                جستجو
              </button>

              {[
                { label: "منطقه", val: "1" },
                { label: "محله", val: "58" },
                { label: "بلوک", val: "0" },
                { label: "ملک", val: "59" },
                { label: "ساختمان", val: "5" },
                { label: "آپارتمان", val: "701" },
                { label: "صنفی", val: "1" },
              ].map((field, i) => (
                <div key={i} className="relative flex-1 min-w-[60px]">
                  <input
                    type="text"
                    defaultValue={field.val}
                    className="h-11 w-full rounded-xl border border-border/70 bg-card px-2 text-center text-sm font-medium outline-none focus:border-primary transition-colors"
                  />
                  <span className="absolute -top-2 right-2 bg-card px-1 text-[9px] text-muted-foreground">
                    {field.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.article>

          {/* بخش‌های خالی (مشابه عکس) */}
          <div className="grid gap-6">
            {[
              {
                title: "پرونده های زیر مجموعه",
                icon: <Layers className="h-4 w-4 text-primary" />,
                help: true,
              },
              {
                title: "پیگیری درخواست ها",
                icon: <ClipboardList className="h-4 w-4 text-primary" />,
                help: true,
              },
              {
                title: "جزئیات درخواست",
                icon: <FileSearch className="h-4 w-4 text-primary" />,
                help: false,
              },
            ].map((item, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="soft-card mesh-panel overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h2 className="text-sm font-bold">{item.title}</h2>
                  </div>
                  {item.help && <HelpButton />}
                </div>
                <div className="pt-4">
                  <EmptyAlert message="موردی برای نمایش وجود ندارد." />
                </div>
              </motion.article>
            ))}
          </div>

          {/* نقشه */}
          <motion.article
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel relative h-[450px] overflow-hidden group"
          >
            <div className="absolute inset-0 bg-slate-800/10">
              <img
                src="/map-placeholder.jpg"
                alt="Map"
                className="h-full w-full object-cover opacity-80"
              />
            </div>
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-xl border border-border/40 hover:bg-muted transition-colors text-foreground">
                <Plus className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-xl border border-border/40 hover:bg-muted transition-colors text-foreground">
                <Minus className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-xl border border-border/40 hover:bg-muted transition-colors text-foreground">
                <Home className="h-5 w-5" />
              </button>
            </div>
            <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-destructive text-white shadow-xl hover:bg-destructive/90 transition-colors">
              <Trash2 className="h-5 w-5" />
            </button>
          </motion.article>
        </div>
      </main>

      {/* مودال راهنما با دکمه سبز "فهمیدم" */}
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
              className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 px-8 py-5">
                <h3 className="flex items-center gap-2 text-base font-bold text-primary">
                  <Info className="h-5 w-5" /> راهنمای سیستم
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-8 py-6 text-sm leading-8 text-foreground/80 text-justify">
                لطفاً برای استعلام دقیق، کد نوسازی ۷ رقمی مندرج در قبض نوسازی
                ملک خود را در فیلدهای مربوطه وارد نمایید. پس از اطمینان از صحت
                اعداد، دکمه جستجو را بفشارید.
              </div>

              {/* بخش دکمه سبز فهمیدم */}
              <div className="px-8 pb-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
                >
                  فهمیدم
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

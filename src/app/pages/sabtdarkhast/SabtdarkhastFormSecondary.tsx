import { motion } from "motion/react";
import { ClipboardList, Home, Info, Minus, Plus } from "lucide-react";
import type { PropertyRecord } from "../../data/properties";
import type { RegisteredRequestRow } from "../Sabtdarkhastpage";
import { HelpButton } from "./FormControls";

export function SabtdarkhastFormSecondary({
  activeProperty,
  requests,
  loading,
  error,
  onOpenHelp,
}: {
  activeProperty: PropertyRecord | null;
  requests: RegisteredRequestRow[];
  loading: boolean;
  error: string;
  onOpenHelp?: (title: string, description: string) => void;
}) {
  return (
    <>
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
          {onOpenHelp && (
            <HelpButton
              title="درخواست های ثبت شده"
              desc="در این بخش درخواست‌هایی که برای پرونده انتخاب‌شده ثبت شده‌اند نمایش داده می‌شود. شماره، عنوان، تاریخ و وضعیت هر درخواست را بررسی کنید و در صورت خالی بودن لیست، ابتدا پرونده را انتخاب یا جستجو کنید."
              onOpenHelp={onOpenHelp}
            />
          )}
        </div>
        <div className="p-3 sm:p-4">
          {loading ? (
            <div className="rounded-xl border border-border/70 bg-card/40 p-4 text-center text-xs text-muted-foreground">
              در حال دریافت درخواست ها...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-xs text-destructive">
              {error}
            </div>
          ) : requests.length ? (
            <div className="space-y-2">
              {requests.map((req) => (
                <div
                  key={`${req.id}-${req.date}-${req.title}`}
                  className="flex flex-wrap justify-between gap-2 rounded-lg bg-muted/40 p-3 text-xs"
                >
                  <span>شماره: {req.id}</span>
                  <span>{req.title}</span>
                  <span>تاریخ: {req.date}</span>
                  <span className="text-primary">{req.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-rose-200/40 bg-rose-50/30 p-4 text-center text-xs text-rose-500 dark:border-rose-800/30 dark:bg-rose-950/20 dark:text-rose-400">
              موردی برای نمایش وجود ندارد.
            </div>
          )}
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="soft-card mesh-panel group relative h-64 overflow-hidden sm:h-80 md:h-[400px]"
      >
        {onOpenHelp && (
          <button
            type="button"
            onClick={() =>
              onOpenHelp(
                "نقشه ملک",
                "این قسمت موقعیت نمایشی ملک انتخاب‌شده را نشان می‌دهد. پس از انتخاب پرونده، اطلاعات اصلی ملک روی نقشه نمایش داده می‌شود و دکمه‌های بزرگنمایی و بازگشت برای کنترل نما قرار دارند.",
              )
            }
            className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-lg border bor                                                                                                                                                                                                                                                                                                         der-primary/35 bg-card/90 px-2.5 py-1 text-[10px] font-bold text-primary shadow-lg transition-colors hover:bg-card md:text-xs"
          >
            <Info className="h-3.5 w-3.5" /> راهنما
          </button>
        )}
=        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <img
            src="/map-placeholder.jpg"
            alt="Map"
            className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
          />
          {activeProperty && (
            <div className="absolute bottom-4 left-1/2 w-56 -translate-x-1/2 space-y-1.5 rounded-2xl border border-border bg-card/95 p-3 text-xs shadow-xl backdrop-blur-md sm:bottom-8 sm:w-64 sm:space-y-2 sm:p-4">
              <div className="mb-2 flex justify-between border-b border-border/50 pb-2">
                <span className="text-sm font-bold text-foreground">
                  اطلاعات ملک
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-foreground">کد نوسازی</span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  {Object.values(activeProperty.codes).join("-")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-foreground">نام مالک</span>
                <span className="text-muted-foreground">
                  {activeProperty.owner.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-foreground">مساحت</span>
                <span className="text-muted-foreground">
                  {activeProperty.registration.map.area}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="absolute left-3 top-3 flex flex-col gap-2 sm:left-4 sm:top-4">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/90 shadow-lg sm:h-9 sm:w-9">
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/90 shadow-lg sm:h-9 sm:w-9">
            <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/90 shadow-lg sm:h-9 sm:w-9">
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </motion.article>
    </>
  );
}

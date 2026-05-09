import { motion } from 'motion/react';
import { CheckCircle2, Clock3, CircleDashed, FileText, LifeBuoy, ReceiptText, ChartNoAxesCombined } from 'lucide-react';

const activities = [
  { title: 'پرداخت عوارض نوسازی', detail: 'کد پیگیری: 905421', date: 'امروز - 09:40', status: 'completed', icon: ReceiptText },
  { title: 'ثبت درخواست پروانه', detail: 'شماره پرونده: PR-22318', date: 'دیروز - 16:10', status: 'in-progress', icon: FileText },
  { title: 'تیکت پشتیبانی', detail: 'موضوع: خطا در استعلام ملک', date: '3 روز قبل - 11:20', status: 'pending', icon: LifeBuoy },
];

function activityStatus(status: string) {
  if (status === 'completed') {
    return { label: 'تکمیل شده', icon: CheckCircle2, color: 'text-primary', bg: 'bg-[var(--primary-soft)]' };
  }
  if (status === 'in-progress') {
    return { label: 'در حال بررسی', icon: Clock3, color: 'text-secondary', bg: 'bg-[var(--primary-soft)]' };
  }
  return { label: 'در انتظار', icon: CircleDashed, color: 'text-muted-foreground', bg: 'bg-muted' };
}

export function RecentActivitiesSection() {
  return (
    <section id="activities" className="py-12 md:py-20 bg-background section-decor">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="section-chip mb-3">داشبورد شخصی</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground mb-3 md:mb-4">فعالیت‌های اخیر کاربر</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            مرور آخرین عملیات‌ها، درخواست‌ها و وضعیت رسیدگی پرونده‌های شما
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {activities.map((activity, index) => {
              const current = activityStatus(activity.status);
              return (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="soft-card p-4 md:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative mt-0.5">
                        <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-primary flex items-center justify-center flex-shrink-0">
                          <activity.icon className="w-5 h-5" />
                        </div>
                        {index < activities.length - 1 && (
                          <span className="absolute top-11 left-1/2 -translate-x-1/2 w-px h-7 bg-border" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm md:text-base font-bold text-foreground mb-1">{activity.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">{activity.detail}</p>
                        <p className="text-xs text-muted-foreground mt-2">{activity.date}</p>
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${current.bg} ${current.color}`}>
                      <current.icon className="w-3.5 h-3.5" />
                      <span>{current.label}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel p-5 md:p-6 h-fit"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-lg bg-[var(--primary-soft)] text-primary flex items-center justify-center">
                <ChartNoAxesCombined className="w-4 h-4" />
              </span>
              <h3 className="text-base md:text-lg font-bold text-foreground">خلاصه وضعیت</h3>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-[var(--primary-soft)] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">درخواست‌های فعال</span>
                  <span className="text-base font-bold text-primary">4</span>
                </div>
                <div className="h-2 rounded-full bg-white/50 dark:bg-background/50 overflow-hidden">
                  <span className="block h-full w-4/5 rounded-full bg-primary" />
                </div>
              </div>

              <div className="rounded-xl bg-muted p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">تیکت‌های باز</span>
                  <span className="text-base font-bold text-foreground">2</span>
                </div>
                <div className="h-2 rounded-full bg-background/60 overflow-hidden">
                  <span className="block h-full w-2/5 rounded-full bg-secondary" />
                </div>
              </div>

              <div className="rounded-xl bg-muted p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">عملیات تکمیل‌شده</span>
                  <span className="text-base font-bold text-foreground">18</span>
                </div>
                <div className="h-2 rounded-full bg-background/60 overflow-hidden">
                  <span className="block h-full w-5/6 rounded-full bg-primary/80" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

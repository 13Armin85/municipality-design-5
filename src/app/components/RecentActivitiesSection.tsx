import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  CircleDashed,
  Clock3,
  FileText,
} from "lucide-react";
import { fetchActivities, type ActivityItem } from "../data/activities";

function activityStatus(status: string) {
  if (status === "completed" || status.includes("موفق")) {
    return {
      label: status || "تکمیل شده",
      icon: CheckCircle2,
      color: "text-primary",
      bg: "bg-[var(--primary-soft)]",
    };
  }

  if (status === "in-progress" || status.includes("بررسی")) {
    return {
      label: status || "در حال بررسی",
      icon: Clock3,
      color: "text-secondary",
      bg: "bg-[var(--primary-soft)]",
    };
  }

  return {
    label: status || "در انتظار",
    icon: CircleDashed,
    color: "text-muted-foreground",
    bg: "bg-muted",
  };
}

export function RecentActivitiesSection() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetchActivities(controller.signal)
      .then((items) => {
        setActivities(items);
        setError("");
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          setError(
            error instanceof Error
              ? error.message
              : "دریافت فعالیت‌های اخیر ناموفق بود.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <section id="activities" className="bg-background py-12 section-decor md:py-20">
      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center md:mb-14"
        >
          <span className="section-chip mb-3">داشبورد شخصی</span>
          <h2 className="mb-3 text-2xl font-black text-foreground md:mb-4 md:text-3xl lg:text-4xl">
            فعالیت‌های اخیر کاربر
          </h2>
          <p className="mx-auto max-w-2xl px-4 text-sm text-muted-foreground md:text-base">
            مرور آخرین عملیات‌ها، درخواست‌ها و وضعیت رسیدگی پرونده‌های شما
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <div className="space-y-3 md:space-y-4">
            {loading ? (
              <div className="soft-card p-6 text-center text-sm text-muted-foreground">
                در حال دریافت فعالیت‌های اخیر...
              </div>
            ) : error ? (
              <div className="soft-card p-6 text-center text-sm text-destructive">
                {error}
              </div>
            ) : activities.length === 0 ? (
              <div className="soft-card p-6 text-center text-sm text-muted-foreground">
                فعالیتی برای نمایش وجود ندارد.
              </div>
            ) : (
              activities.map((activity, index) => {
                const current = activityStatus(activity.status);

                return (
                  <motion.div
                    key={`${activity.title}-${activity.date}-${index}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="soft-card p-4 md:p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="relative mt-0.5 mb-[20px]">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          {index < activities.length - 1 && (
                            <span className="absolute left-1/2 top-11 h-7 w-px -translate-x-1/2 bg-border" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="mb-1 text-sm font-bold text-foreground md:text-base">
                            {activity.title}
                          </h3>
                          {activity.description ? (
                            <p className="truncate text-xs text-muted-foreground md:text-sm">
                              {activity.description}
                            </p>
                          ) : null}
                          <p className="mt-2 text-xs text-muted-foreground">
                            {activity.displayDate}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${current.bg} ${current.color}`}
                      >
                        <current.icon className="h-3.5 w-3.5" />
                        <span>{current.label}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/*
            بخش خلاصه وضعیت طبق درخواست فعلا غیرفعال شد.
          */}
        </div>
      </div>
    </section>
  );
}

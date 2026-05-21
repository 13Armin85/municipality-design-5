import { motion } from "motion/react";
import { Bell, Calendar, Sparkles, TrendingUp } from "lucide-react";
import { recentActivities, stats, summaryItems } from "./adminData";

export function Dashboard() {
  const today = new Date().toLocaleDateString("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            داشبورد مدیریت
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{today}</span>
          </p>
        </div>
        <span className="inline-flex w-fit self-start rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary sm:self-auto">
          <Sparkles className="h-3 w-3" />
          نسخه جدید فعال است
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
              >
                <stat.icon className="h-4 w-4" />
              </span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${stat.trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
              >
                {stat.trend}
              </span>
            </div>
            <p className="mb-0.5 text-xl font-bold text-foreground sm:text-2xl">
              {stat.value}
            </p>
            <p className="text-[11px] leading-tight text-muted-foreground sm:text-xs">
              {stat.label}
            </p>
            <div
              className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-l ${stat.color} opacity-60`}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
            <Bell className="h-4 w-4 text-primary" />
            فعالیت‌های اخیر
          </h3>
          <div className="space-y-2">
            {recentActivities.map((item, index) => (
              <div
                key={`${item.text}-${index}`}
                className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50"
              >
                <span
                  className={`flex h-2 w-2 shrink-0 rounded-full ${item.type === "success" ? "bg-emerald-500" : item.type === "warning" ? "bg-amber-500" : "bg-blue-500"}`}
                />
                <p className="flex-1 text-sm leading-relaxed text-foreground">
                  {item.text}
                </p>
                <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            خلاصه وضعیت
          </h3>
          <div className="space-y-4">
            {summaryItems.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-bold text-foreground">{item.value}٪</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

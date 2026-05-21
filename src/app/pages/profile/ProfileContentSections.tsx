import { motion } from "motion/react";
import {
  BadgeInfo,
  Building,
  Building2,
  Clock3,
  Home,
  Landmark,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { contactInfo, personalInfo, properties, timelineItems } from "./profileData";

function PropertyIcon({ usage }: { usage: string }) {
  if (usage === "مسکونی") return <Home className="h-5 w-5" />;
  if (usage === "تجاری") return <Building className="h-5 w-5" />;
  return <Landmark className="h-5 w-5" />;
}

export function ProfileContentSections() {
  return (
    <div className="grid grid-cols-1 gap-5">
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="soft-card mesh-panel p-5 md:p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
            <ShieldCheck className="h-4 w-4" />
          </span>

          <h3 className="text-base font-bold text-foreground md:text-lg">
            اطلاعات هویتی و حساب
          </h3>
        </div>

        <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {personalInfo.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border/70 bg-card/80 px-3 py-2.5"
            >
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.04 }}
        className="soft-card mesh-panel p-5 md:p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
            <Phone className="h-4 w-4" />
          </span>

          <h3 className="text-base font-bold text-foreground md:text-lg">
            اطلاعات تماس
          </h3>
        </div>

        <div className="space-y-2.5">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5"
            >
              <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                <item.icon className="h-4 w-4" />
              </span>

              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.08 }}
        className="soft-card mesh-panel p-5 md:p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
            <Landmark className="h-4 w-4" />
          </span>

          <div>
            <h3 className="text-base font-bold text-foreground md:text-lg">
              دارایی‌ها و املاک
            </h3>
            <p className="text-xs text-muted-foreground">
              لیست املاک و دارایی‌های ثبت شده
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {properties.map((property) => (
            <motion.article
              key={property.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="rounded-2xl border border-border/70 bg-background/70 p-4 transition-all hover:border-primary/40 hover:bg-[var(--primary-soft)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-primary">
                    <PropertyIcon usage={property.usage} />
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">
                        {property.title}
                      </h4>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {property.address}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-xl bg-card px-2.5 py-1 text-xs text-foreground">
                        <BadgeInfo className="h-3.5 w-3.5 text-primary" />
                        {property.area}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-xl bg-card px-2.5 py-1 text-xs text-foreground">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        {property.usage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.12 }}
        className="soft-card mesh-panel p-5 md:p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
            <Clock3 className="h-4 w-4" />
          </span>

          <h3 className="text-base font-bold text-foreground md:text-lg">
            آخرین وضعیت درخواست‌ها
          </h3>
        </div>

        <div className="grid gap-3">
          {timelineItems.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-border/70 bg-background/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[var(--primary-soft)]"
            >
              <h4 className="text-sm font-bold text-foreground">
                {item.title}
              </h4>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.subtitle}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">{item.time}</p>
            </article>
          ))}
        </div>
      </motion.article>
    </div>
  );
}

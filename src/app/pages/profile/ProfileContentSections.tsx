import { motion } from "motion/react";
import { Building2, Home, Landmark, ShieldCheck } from "lucide-react";
import type { CurrentUser } from "../../data/currentUser";

export interface ProfilePropertyItem {
  id: string;
  title: string;
  usage?: string;
}

interface ProfileContentSectionsProps {
  currentUser: CurrentUser | null;
  properties: ProfilePropertyItem[];
  propertiesLoading?: boolean;
  propertiesError?: string | null;
  isLoading?: boolean;
  error?: string | null;
}

const displayValue = (value?: string | null) => value?.trim() || "-";

function PropertyIcon({ usage = "" }: { usage?: string }) {
  if (usage.includes("مسک")) return <Home className="h-5 w-5" />;
  if (usage.includes("تجار") || usage.includes("صنف")) {
    return <Building2 className="h-5 w-5" />;
  }
  return <Landmark className="h-5 w-5" />;
}

export function ProfileContentSections({
  currentUser,
  properties,
  propertiesLoading = false,
  propertiesError = null,
  isLoading = false,
  error = null,
}: ProfileContentSectionsProps) {
  const profileItems = currentUser
    ? [
        { label: "نام", value: displayValue(currentUser.name) },
        { label: "نام خانوادگی", value: displayValue(currentUser.family) },
        { label: "کد ملی", value: displayValue(currentUser.nationalCode) },
        { label: "شماره تماس", value: displayValue(currentUser.phoneNumber) },
        { label: "نام کاربری", value: displayValue(currentUser.userName) },
        { label: "ایمیل", value: displayValue(currentUser.email) },
        { label: "آدرس", value: displayValue(currentUser.address) },
        { label: "تصویر", value: displayValue(currentUser.picture) },
        { label: "تاریخ تولد", value: displayValue(currentUser.birthDay) },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 gap-5">
      {(isLoading || error) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-destructive/25 bg-destructive/5 text-destructive"
              : "border-border/70 bg-card text-muted-foreground"
          }`}
        >
          {error || "در حال دریافت اطلاعات پروفایل..."}
        </div>
      )}

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
            اطلاعات پروفایل
          </h3>
        </div>

        <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {profileItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border/70 bg-card/80 px-3 py-2.5"
            >
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd className="mt-1 break-words text-sm font-semibold text-foreground">
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
            <Landmark className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-foreground md:text-lg">
              دارایی‌ها و املاک
            </h3>
            <p className="text-xs text-muted-foreground">
              املاک ثبت‌شده برای حساب شما
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {propertiesLoading ? (
            <div className="rounded-xl border border-border/70 bg-card/80 px-3 py-4 text-sm text-muted-foreground">
              در حال دریافت املاک...
            </div>
          ) : propertiesError ? (
            <div className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-4 text-sm text-destructive">
              {propertiesError}
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-card/80 px-3 py-4 text-sm text-muted-foreground">
              ملکی برای نمایش وجود ندارد.
            </div>
          ) : (
            properties.map((property) => (
              <motion.article
                key={property.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className="rounded-2xl border border-border/70 bg-background/70 p-4 transition-all hover:border-primary/40 hover:bg-[var(--primary-soft)]"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-primary">
                    <PropertyIcon usage={property.usage} />
                  </span>
                  <div className="min-w-0">
                    <h4 className="break-words text-sm font-bold text-foreground">
                      {property.title}
                    </h4>
                    {property.usage ? (
                      <span className="mt-3 inline-flex items-center gap-1 rounded-xl bg-card px-2.5 py-1 text-xs text-foreground">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        {property.usage}
                      </span>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </motion.article>
    </div>
  );
}

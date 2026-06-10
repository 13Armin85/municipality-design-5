import type { FormEvent } from "react";
import { motion } from "motion/react";
import {
  Building2,
  ChevronLeft,
  Download,
  FileText,
  Home,
  Info,
  Minus,
  Plus,
  Search,
  Store,
} from "lucide-react";
import {
  guildCodeFields,
  type PropertyRecord,
  type RenewalCodeKey,
  type RenewalCodes,
} from "../../data/properties";
import { parcels } from "./parcels";

export type LabelValue = {
  label: string;
  value: string;
};

export type GuildPropertyItem = {
  id: string;
  fullCode: string;
  ownerName: string;
  description: string;
  type: string;
  codes: RenewalCodes;
  shop?: string;
  jobCode?: string;
};

export type GuildOwnerItem = {
  id: string;
  firstName: string;
  lastName: string;
  ownerType: string;
  fatherName: string;
  issuePlace: string;
};

interface GuildFeesSearchSectionProps {
  onHelp: (title: string, description: string) => void;
  onInputChange: (key: RenewalCodeKey, value: string) => void;
  onSubmit: (event: FormEvent) => void;
  searchInputs: RenewalCodes;
  isLoading?: boolean;
}

export function GuildFeesSearchSection({
  onHelp,
  onInputChange,
  onSubmit,
  searchInputs,
  isLoading = false,
}: GuildFeesSearchSectionProps) {
  return (
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
        <button
          type="button"
          onClick={() =>
            onHelp(
              "راهنمای جستجو",
              "کد نوسازی پرونده را وارد کنید تا فیش و عوارض صنفی همان پرونده دریافت شود.",
            )
          }
          className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/10"
        >
          <Info className="h-3.5 w-3.5" />
          راهنما
        </button>
      </div>

      <form
        className="grid grid-cols-2 gap-x-2 gap-y-4 p-4 md:grid-cols-8 md:p-5"
        onSubmit={onSubmit}
      >
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 md:order-first"
        >
          <Search className="ml-1.5 h-4 w-4" />
          {isLoading ? "در حال دریافت" : "جستجو"}
        </button>

        {guildCodeFields.map((field) => (
          <div key={field.label} className="relative mt-2">
            <input
              type="text"
              value={searchInputs[field.key] || ""}
              onChange={(event) => onInputChange(field.key, event.target.value)}
              className="h-11 w-full rounded-xl border border-border/70 bg-card px-3 text-center text-sm text-foreground outline-none transition-all focus:border-primary/45 focus:ring-2 focus:ring-primary/10"
              dir="ltr"
            />
            <label className="absolute -top-2.5 right-3 bg-card px-1.5 text-[10px] font-medium text-muted-foreground transition-all">
              {field.label}
            </label>
          </div>
        ))}
      </form>
    </motion.article>
  );
}

interface GuildFeesPropertyListSectionProps {
  items: GuildPropertyItem[];
  selectedId?: string | null;
  isLoading?: boolean;
  onCaseClick: (item: GuildPropertyItem) => void;
  onHelp: (title: string, description: string) => void;
}

export function GuildFeesPropertyListSection({
  items,
  selectedId,
  isLoading = false,
  onCaseClick,
  onHelp,
}: GuildFeesPropertyListSectionProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="soft-card mesh-panel overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
        <h2 className="text-sm font-bold text-foreground md:text-base">
          پرونده‌های زیرمجموعه
        </h2>
        <button
          type="button"
          onClick={() =>
            onHelp(
              "پرونده‌های زیرمجموعه",
              "با انتخاب هر پرونده، کد نوسازی آن در جستجو قرار می‌گیرد و اطلاعات فیش و عوارض صنفی دریافت می‌شود.",
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
          {isLoading && (
            <div className="rounded-lg border border-border/50 bg-background/70 px-3 py-2.5 text-sm text-muted-foreground">
              در حال دریافت پرونده‌ها...
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div className="rounded-lg border border-border/50 bg-background/70 px-3 py-2.5 text-sm text-muted-foreground">
              پرونده‌ای برای نمایش وجود ندارد.
            </div>
          )}

          {items.map((item) => {
            const isSelected = selectedId === item.id;
            const ItemIcon = item.type === "آپارتمان" ? Home : Store;

            return (
              <article
                key={item.id}
                onClick={() => onCaseClick(item)}
                className={`group cursor-pointer rounded-lg border px-3 py-3 text-sm transition-all hover:border-primary/40 hover:shadow-sm ${
                  isSelected
                    ? "border-primary/45 bg-primary/10"
                    : "border-border/50 bg-background/80"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
                        {item.description || item.ownerName}
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

const mergeColumns = (right: LabelValue[], left: LabelValue[]) => {
  const rows: LabelValue[] = [];
  const maxLength = Math.max(right.length, left.length);

  for (let index = 0; index < maxLength; index += 1) {
    if (right[index]) rows.push(right[index]);
    if (left[index]) rows.push(left[index]);
  }

  return rows;
};

function DataTable({
  rows,
}: {
  rows: LabelValue[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-card/40">
      <table className="min-w-[34rem] table-fixed text-right text-sm md:min-w-full">
        <thead className="bg-[var(--primary-soft)]/70 text-foreground">
          <tr>
            <th className="w-[38%] px-3 py-2.5 font-semibold">عنوان</th>
            <th className="px-3 py-2.5 font-semibold">مقدار</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {rows.map((item, index) => (
            <tr key={`${item.label}-${index}`} className="hover:bg-muted/30">
              <td className="break-words px-3 py-2.5 leading-7 text-muted-foreground">
                {item.label}
              </td>
              <td className="break-words px-3 py-2.5 leading-7 font-medium text-foreground">
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GuildFeesCurrentFeesSection({
  title = "عوارض صنفی جاری",
  right,
  left,
  items,
  isLoading = false,
  onExportExcel,
  onExportPdf,
}: {
  title?: string;
  right: LabelValue[];
  left: LabelValue[];
  items?: LabelValue[];
  isLoading?: boolean;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
}) {
  const rows = items ?? mergeColumns(right, left);
  const hasData = rows.length > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="soft-card mesh-panel overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3 md:px-5">
        <h2 className="text-sm font-bold text-foreground md:text-base">
          {title}
        </h2>
        {hasData && !isLoading && (onExportExcel || onExportPdf) && (
          <div className="flex flex-wrap items-center gap-2">
            {onExportExcel && (
              <button
                type="button"
                onClick={onExportExcel}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:text-emerald-300"
              >
                <Download className="h-4 w-4" />
                خروجی اکسل
              </button>
            )}
            {onExportPdf && (
              <button
                type="button"
                onClick={onExportPdf}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-sky-500/35 bg-sky-500/10 px-3 text-xs font-bold text-sky-700 transition-colors hover:bg-sky-500/15 dark:text-sky-300"
              >
                <FileText className="h-4 w-4" />
                خروجی پی دی اف
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-4 md:p-5">
        {isLoading ? (
          <div className="rounded-xl border border-border/70 bg-card/40 px-4 py-3 text-sm text-muted-foreground">
            در حال دریافت اطلاعات...
          </div>
        ) : hasData ? (
          <DataTable rows={rows} />
        ) : (
          <div className="rounded-xl border border-border/70 bg-card/40 px-4 py-3 text-sm text-muted-foreground">
            داده‌ای برای نمایش وجود ندارد.
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function GuildFeesOwnersSection({
  owners,
}: {
  owners: GuildOwnerItem[];
}) {
  return (
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
              <th className="px-3 py-2.5 text-right font-semibold">نام</th>
              <th className="px-3 py-2.5 text-right font-semibold">
                نام خانوادگی
              </th>
              <th className="px-3 py-2.5 text-right font-semibold">نوع مالک</th>
              <th className="px-3 py-2.5 text-right font-semibold">نام پدر</th>
              <th className="px-3 py-2.5 text-right font-semibold">محل صدور</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70 bg-card/40">
            {owners.length > 0 ? (
              owners.map((owner, index) => (
                <tr
                  key={owner.id || index}
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
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-5 text-center text-muted-foreground"
                >
                  مالکینی برای نمایش وجود ندارد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.article>
  );
}

export function GuildFeesEmptyState({ message }: { message?: string }) {
  return (
    <motion.article className="soft-card mesh-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
        <h2 className="text-sm font-bold text-foreground md:text-base">
          عوارض
        </h2>
        <FileText className="h-4 w-4 text-primary" />
      </div>
      <div className="p-4 md:p-5">
        <div className="rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {message ?? "ابتدا یک پرونده را انتخاب یا کد نوسازی را جستجو کنید."}
        </div>
      </div>
    </motion.article>
  );
}

export function GuildFeesMapSection({
  activeData,
}: {
  activeData: PropertyRecord | GuildPropertyItem | null;
}) {
  return (
    <motion.article className="soft-card mesh-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 md:px-5">
        <h2 className="text-sm font-bold text-foreground md:text-base">
          نقشه زمین (نمادین)
        </h2>
        <Building2 className="h-4 w-4 text-primary" />
      </div>
      <div className="p-4 md:p-5">
        <div className="relative h-[30rem] overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(145deg,#647257_0%,#7e8f6d_38%,#6a735f_100%)] md:h-[44rem]">
          {parcels.map((parcel) => (
            <motion.div
              key={parcel.id}
              whileHover={{
                scale: 1.03,
                filter: "brightness(1.1)",
                zIndex: 10,
              }}
              className={`group absolute flex cursor-pointer items-center justify-center rounded-sm border border-sky-900/25 transition-all ${parcel.tone}`}
              style={{
                top: parcel.top,
                right: parcel.right,
                width: parcel.width,
                height: parcel.height,
                transform: `rotate(${parcel.rotate}deg)`,
              }}
            >
              <span className="px-1 text-center text-[10px] font-bold text-sky-950 opacity-0 transition-opacity group-hover:opacity-100 md:text-xs">
                {parcel.title}
              </span>
            </motion.div>
          ))}

          {activeData && (
            <div className="absolute left-[44%] top-[58%] h-28 w-24 animate-pulse rounded-md border-2 border-dashed border-sky-600 bg-emerald-300/35 shadow-[0_0_0_6px_rgba(18,80,126,0.14)] backdrop-blur-[1px]" />
          )}

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
  );
}

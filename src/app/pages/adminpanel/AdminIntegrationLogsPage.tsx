import { AnimatePresence, motion } from "motion/react";
import {
  FileText,
  KeyRound,
  Loader2,
  RefreshCw,
  Send,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  fetchShahkarLogs,
  fetchSmsLogs,
  type ShahkarLog,
  type SmsLog,
} from "../../data/adminIntegrations";

type Message = { type: "success" | "error"; text: string } | null;

type Column<T> = {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
  dir?: "rtl" | "ltr";
  className?: string;
};

function cleanValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "-";
  }

  return String(value);
}

function formatDate(value: string | null | undefined) {
  const text = cleanValue(value);
  if (text === "-") return text;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function StatusBadge({ value }: { value: string | null | undefined }) {
  const label = cleanValue(value);
  const normalized = label.toLowerCase();
  const isSuccess =
    normalized === "true" ||
    normalized.includes("success") ||
    normalized.includes("matched") ||
    normalized.includes("sent") ||
    label.includes("موفق") ||
    label.includes("تطابق") ||
    label.includes("تایید") ||
    label.includes("ارسال");

  const isFailure =
    normalized === "false" ||
    normalized.includes("fail") ||
    normalized.includes("error") ||
    label.includes("ناموفق") ||
    label.includes("خطا");

  const colorClass = isSuccess
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
    : isFailure
      ? "border-destructive/20 bg-destructive/10 text-destructive"
      : "border-border bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex min-h-7 items-center justify-center rounded-full border px-2.5 text-xs font-bold ${colorClass}`}
    >
      {label}
    </span>
  );
}

function MessageLine({ message }: { message: Message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className={`text-xs font-medium ${
            message.type === "error" ? "text-destructive" : "text-emerald-600"
          }`}
        >
          {message.text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function LogsTable<T extends { id: string }>({
  columns,
  rows,
}: {
  columns: Column<T>[];
  rows: T[];
}) {
  return (
    <>
      <div className="grid gap-3 p-3 sm:p-4 md:hidden">
        {rows.map((row, rowIndex) => (
          <motion.article
            key={row.id || rowIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(rowIndex * 0.025, 0.2) }}
            className="min-w-0 rounded-xl border border-border bg-background/60 p-3"
          >
            

            <div className="grid gap-2">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="min-w-0 rounded-lg border border-border/70 bg-card px-3 py-2.5"
                >
                  <div className="mb-1 text-[11px] font-bold text-muted-foreground">
                    {column.label}
                  </div>
                  <div
                    dir={column.dir ?? "rtl"}
                    className={`min-w-0 whitespace-pre-wrap break-words text-sm leading-7 text-foreground ${
                      column.dir === "ltr" ? "font-mono text-xs" : ""
                    }`}
                  >
                    {column.render(row)}
                  </div>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] table-fixed border-separate border-spacing-0 text-sm xl:min-w-0">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-border bg-muted/60 px-3 py-3 text-right text-xs font-bold text-muted-foreground lg:px-4"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="group">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    dir={column.dir ?? "rtl"}
                    className={`min-w-0 border-b border-border px-3 py-3 align-top text-foreground group-last:border-b-0 lg:px-4 ${
                      column.className ?? ""
                    }`}
                  >
                    <div className="min-w-0 whitespace-pre-wrap break-words leading-7 text-right">
                      {column.render(row)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function IntegrationLogsPage<T extends { id: string }>({
  title,
  description,
  emptyText,
  icon,
  fetchLogs,
  columns,
}: {
  title: string;
  description: string;
  emptyText: string;
  icon: ReactNode;
  fetchLogs: (signal?: AbortSignal) => Promise<T[]>;
  columns: Column<T>[];
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<Message>(null);

  const loadLogs = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      try {
        setRows(await fetchLogs(signal));
        setMessage(null);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "دریافت گزارشات ناموفق بود.",
        });
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [fetchLogs],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadLogs(controller.signal);
    return () => controller.abort();
  }, [loadLogs]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-10 items-center rounded-xl border border-primary/25 bg-primary/10 px-3 text-xs font-bold text-primary">
            {rows.length} گزارش
          </span>
          <button
            type="button"
            onClick={() => void loadLogs()}
            disabled={isLoading}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            بروزرسانی
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              {icon}
            </div>
            <span className="font-bold text-foreground">لیست گزارش‌ها</span>
          </div>
          <MessageLine message={message} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <FileText className="mx-auto h-9 w-9 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">{emptyText}</p>
          </div>
        ) : (
          <LogsTable columns={columns} rows={rows} />
        )}
      </div>
    </div>
  );
}

export function AdminShahkarLogsPage() {
  return (
    <IntegrationLogsPage<ShahkarLog>
      title="گزارشات پنل شاهکار"
      description="نتیجه استعلام‌های شاهکار و خطاهای ثبت‌شده را مشاهده کنید."
      emptyText="هنوز گزارشی برای پنل شاهکار ثبت نشده است."
      icon={<KeyRound className="h-4 w-4 text-primary" />}
      fetchLogs={fetchShahkarLogs}
      columns={[
        {
          key: "mobile",
          label: "شماره موبایل",
          dir: "ltr",
          className: "font-mono text-xs",
          render: (item) => cleanValue(item.mobile),
        },
        {
          key: "nationalCode",
          label: "کد ملی",
          dir: "ltr",
          className: "font-mono text-xs",
          render: (item) => cleanValue(item.nationalCode),
        },
        {
          key: "isMatched",
          label: "وضعیت تطبیق",
          render: (item) => <StatusBadge value={item.isMatched} />,
        },
        {
          key: "errorMessage",
          label: "پیام خطا",
          render: (item) => cleanValue(item.errorMessage),
        },
      ]}
    />
  );
}

export function AdminSmsLogsPage() {
  return (
    <IntegrationLogsPage<SmsLog>
      title="گزارشات پنل SMS"
      description="پیامک‌های ارسال‌شده، وضعیت ارسال و خطاهای پنل پیامکی را مشاهده کنید."
      emptyText="هنوز گزارشی برای پنل پیامکی ثبت نشده است."
      icon={<Send className="h-4 w-4 text-primary" />}
      fetchLogs={fetchSmsLogs}
      columns={[
        {
          key: "mobile",
          label: "شماره موبایل",
          dir: "ltr",
          className: "font-mono text-xs",
          render: (item) => cleanValue(item.mobile),
        },
        {
          key: "message",
          label: "متن پیام",
          className: "leading-7",
          render: (item) => cleanValue(item.message),
        },
        {
          key: "sendDate",
          label: "تاریخ ارسال",
          dir: "ltr",
          className: "font-mono text-xs",
          render: (item) => formatDate(item.sendDate),
        },
        {
          key: "status",
          label: "وضعیت",
          render: (item) => <StatusBadge value={item.status} />,
        },
        {
          key: "errorMessage",
          label: "پیام خطا",
          render: (item) => cleanValue(item.errorMessage),
        },
      ]}
    />
  );
}

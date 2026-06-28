import { AnimatePresence, motion } from "motion/react";
import {
  KeyRound,
  Loader2,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  fetchShahkarSettings,
  fetchSmsPanelTypes,
  fetchSmsSettings,
  saveShahkarSettings,
  saveSmsSettings,
  type SmsPanelType,
  type ShahkarSettings,
  type SmsSettings,
} from "../../data/adminIntegrations";

const shahkarEmptyForm: ShahkarSettings = {
  id: "",
  url: "",
  token: "",
};

type SmsSettingsForm = Omit<SmsSettings, "type"> & { type: string };

const smsEmptyForm: SmsSettingsForm = {
  id: "",
  type: "",
  userName: "",
  password: "",
  systemNumber: "",
};

type Message = { type: "success" | "error"; text: string } | null;

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/50";

const textareaClass =
  "min-h-32 w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-7 text-foreground outline-none transition-colors focus:border-primary";

function Field({
  label,
  children,
  span,
}: {
  label: string;
  children: ReactNode;
  span?: "full";
}) {
  return (
    <label
      className={`flex min-w-0 flex-col gap-1.5 ${
        span === "full" ? "md:col-span-2" : ""
      }`}
    >
      <span className="text-[11px] font-bold text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
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

function CurrentSettingsTable({
  title,
  rows,
  isLoading,
  emptyText,
  icon,
}: {
  title: string;
  rows: { label: string; value: string | number | null | undefined }[];
  isLoading: boolean;
  emptyText: string;
  icon: ReactNode;
}) {
  const hasValue = rows.some(
    (row) => row.value !== null && row.value !== undefined && String(row.value) !== "",
  );

  return (
    <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
        <span className="font-bold text-foreground">{title}</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : !hasValue ? (
        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        <div className="overflow-x-auto p-5">
          <table className="w-full min-w-[520px] border-separate border-spacing-0 overflow-hidden rounded-xl border border-border text-sm">
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-b-0">
                  <th className="w-44 border-b border-border bg-muted/60 px-4 py-3 text-right text-xs font-bold text-muted-foreground last:border-b-0">
                    {row.label}
                  </th>
                  <td
                    className="border-b border-border px-4 py-3 text-left font-mono text-xs text-foreground last:border-b-0"
                    dir="ltr"
                  >
                    <span className="block max-w-3xl break-all">
                      {row.value === null || row.value === undefined || String(row.value) === ""
                        ? "-"
                        : row.value}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminShahkarPage() {
  const [form, setForm] = useState<ShahkarSettings>(shahkarEmptyForm);
  const [currentSettings, setCurrentSettings] =
    useState<ShahkarSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const loadSettings = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    try {
      setCurrentSettings(await fetchShahkarSettings(signal));
      setMessage(null);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "دریافت تنظیمات شاهکار ناموفق بود.",
      });
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadSettings(controller.signal);
    return () => controller.abort();
  }, [loadSettings]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await saveShahkarSettings({
        id: currentSettings?.id?.trim() ?? "",
        url: form.url.trim(),
        token: form.token.trim(),
      });
      setForm(shahkarEmptyForm);
      setMessage({ type: "success", text: "تنظیمات شاهکار با موفقیت ذخیره شد." });
      await loadSettings();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "ذخیره تنظیمات شاهکار ناموفق بود.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">پنل شاهکار</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            آدرس سرویس و توکن اتصال شاهکار را مدیریت کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadSettings()}
          disabled={isLoading}
          className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-border px-4 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          بروزرسانی
        </button>
      </div>

      <CurrentSettingsTable
        title="اطلاعات فعلی شاهکار"
        icon={<KeyRound className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
        emptyText="اطلاعاتی برای شاهکار دریافت نشد."
        rows={[
          { label: "آدرس سرویس", value: currentSettings?.url },
          { label: "توکن", value: currentSettings?.token },
        ]}
      />

      <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <KeyRound className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-foreground">ثبت اطلاعات جدید شاهکار</span>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="آدرس سرویس" span="full">
                <input
                  value={form.url}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, url: event.target.value }))
                  }
                  className={inputClass}
                  dir="ltr"
                />
              </Field>
              <Field label="توکن" span="full">
                <textarea
                  value={form.token}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      token: event.target.value,
                    }))
                  }
                  rows={4}
                  className={textareaClass}
                  dir="ltr"
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                ذخیره تنظیمات
              </button>
              <MessageLine message={message} />
            </div>
        </form>
      </div>
    </div>
  );
}

export function AdminSmsPage() {
  const [form, setForm] = useState<SmsSettingsForm>(smsEmptyForm);
  const [currentSettings, setCurrentSettings] = useState<SmsSettings | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [panelTypes, setPanelTypes] = useState<SmsPanelType[]>([]);
  const [arePanelTypesLoading, setArePanelTypesLoading] = useState(false);
  const [didLoadPanelTypes, setDidLoadPanelTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const loadSettings = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    try {
      setCurrentSettings(await fetchSmsSettings(signal));
      setMessage(null);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "دریافت تنظیمات پنل پیامکی ناموفق بود.",
      });
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadSettings(controller.signal);
    return () => controller.abort();
  }, [loadSettings]);

  const loadPanelTypes = useCallback(async () => {
    if (didLoadPanelTypes || arePanelTypesLoading) return;

    setArePanelTypesLoading(true);
    try {
      setPanelTypes(await fetchSmsPanelTypes());
      setDidLoadPanelTypes(true);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "دریافت نوع پنل پیامکی ناموفق بود.",
      });
    } finally {
      setArePanelTypesLoading(false);
    }
  }, [arePanelTypesLoading, didLoadPanelTypes]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      await saveSmsSettings({
        id: currentSettings?.id?.trim() ?? "",
        type: form.type.trim() === "" ? 0 : Number(form.type),
        userName: form.userName.trim(),
        password: form.password.trim(),
        systemNumber: form.systemNumber.trim(),
      });
      setForm(smsEmptyForm);
      setMessage({ type: "success", text: "تنظیمات پنل پیامکی با موفقیت ذخیره شد." });
      await loadSettings();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "ذخیره تنظیمات پنل پیامکی ناموفق بود.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPanelTypeLabel =
    panelTypes.find((panelType) => panelType.id === currentSettings?.type)
      ?.name ?? currentSettings?.type;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">پنل پیامکی</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            اطلاعات پنل پیامک و شماره سیستمی را مدیریت کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadSettings()}
          disabled={isLoading}
          className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-border px-4 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          بروزرسانی
        </button>
      </div>

      <CurrentSettingsTable
        title="اطلاعات فعلی پنل پیامکی"
        icon={<Send className="h-4 w-4 text-primary" />}
        isLoading={isLoading}
        emptyText="اطلاعاتی برای پنل پیامکی دریافت نشد."
        rows={[
          { label: "نوع پنل", value: currentPanelTypeLabel },
          { label: "نام کاربری", value: currentSettings?.userName },
          { label: "رمز عبور", value: currentSettings?.password },
          { label: "شماره سیستمی", value: currentSettings?.systemNumber },
        ]}
      />

      <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Send className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-foreground">ثبت اطلاعات جدید پنل پیامکی</span>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="نوع پنل">
                <select
                  value={form.type}
                  onFocus={() => void loadPanelTypes()}
                  onClick={() => void loadPanelTypes()}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value,
                    }))
                  }
                  className={`${inputClass} appearance-none disabled:cursor-not-allowed disabled:opacity-60`}
                  dir="ltr"
                  disabled={arePanelTypesLoading}
                >
                  <option value="">
                    {arePanelTypesLoading
                      ? "در حال دریافت نوع پنل..."
                      : "انتخاب نوع پنل"}
                  </option>
                  {panelTypes.map((panelType) => (
                    <option key={panelType.id} value={String(panelType.id)}>
                      {panelType.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="نام کاربری">
                <input
                  value={form.userName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      userName: event.target.value,
                    }))
                  }
                  className={inputClass}
                  dir="ltr"
                />
              </Field>
              <Field label="رمز عبور">
                <input
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  className={inputClass}
                  dir="ltr"
                />
              </Field>
              <Field label="شماره سیستمی">
                <input
                  value={form.systemNumber}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      systemNumber: event.target.value,
                    }))
                  }
                  className={inputClass}
                  dir="ltr"
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                ذخیره تنظیمات
              </button>
              <MessageLine message={message} />
            </div>
        </form>
      </div>
    </div>
  );
}

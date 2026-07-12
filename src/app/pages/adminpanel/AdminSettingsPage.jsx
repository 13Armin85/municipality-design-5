import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Building2,
  Eye,
  FileImage,
  FileText,
  Mail,
  Mailbox,
  MapPin,
  Phone,
  RefreshCw,
  Save,
} from "lucide-react";
import {
  emptySiteInformation,
  fetchAdminInformation,
  resolveInformationImageSrc,
  saveAdminInformation,
} from "../../data/siteInformation";

const fallbackLogoSrc = "/images/Amard Logo 01.JPG";

function toFormState(data) {
  return {
    ...emptySiteInformation,
    ...data,
    logo: data.logo ?? null,
    logoFile: null,
  };
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="space-y-1.5">
      <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({ dir, value, onChange, placeholder }) {
  return (
    <input
      dir={dir}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary"
    />
  );
}

function InformationPreview({ information, loading, onRefresh }) {
  const logoSrc = resolveInformationImageSrc(information.logo, fallbackLogoSrc);
  const items = [
    { label: "عنوان", value: information.title },
    { label: "تلفن", value: information.tel, dir: "ltr" },
    { label: "ایمیل", value: information.email, dir: "ltr" },
    {
      label: "کد پستی",
      value: information.postalCode,
      dir: "ltr",
      icon: Mailbox,
    },
    { label: "آدرس", value: information.address },
    { label: "نماد اعتماد", value: information.enamad || "ثبت نشده" },
  ];

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">مشاهده اطلاعات سازمان</h3>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          بروزرسانی
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
        <div className="flex h-36 w-full items-center justify-center rounded-2xl border border-border/70 bg-background p-4">
          <img
            src={logoSrc}
            alt={information.title || "لوگوی سازمان"}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border/60 bg-background/70 p-3"
            >
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {item.icon ? <item.icon className="h-3.5 w-3.5" /> : null}
                {item.label}
              </p>
              <p
                dir={item.dir}
                className="mt-1 break-words text-sm font-semibold leading-7"
              >
                {item.value || "-"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/60 bg-background/70 p-3">
        <p className="text-xs text-muted-foreground">توضیحات</p>
        <p className="mt-1 text-sm leading-7">
          {information.description || "-"}
        </p>
      </div>
    </section>
  );
}

export function SiteContentPage() {
  const [information, setInformation] = useState(emptySiteInformation);
  const [form, setForm] = useState(() => toFormState(emptySiteInformation));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  const loadInformation = async (signal) => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminInformation(signal);
      setInformation(data);
      setForm(toFormState(data));
    } catch (error) {
      if (error?.name !== "AbortError") {
        setError(error.message || "دریافت اطلاعات سازمان ناموفق بود.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadInformation(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!(form.logoFile instanceof File)) {
      setLogoPreview(resolveInformationImageSrc(form.logo, fallbackLogoSrc));
      return undefined;
    }

    const objectUrl = URL.createObjectURL(form.logoFile);
    setLogoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [form.logo, form.logoFile]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await saveAdminInformation(form);
      const data = await fetchAdminInformation(undefined);
      setInformation(data);
      setForm(toFormState(data));
      setMessage("اطلاعات سایت با موفقیت ذخیره شد.");
    } catch (error) {
      setError(error.message || "ذخیره اطلاعات سایت ناموفق بود.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground sm:text-xl">
          محتوای سایت
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          مدیریت اطلاعات هدر، فوتر و مشخصات سازمان
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600"
        >
          {message}
        </motion.div>
      )}

      <section className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">ویرایش اطلاعات سایت</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="عنوان سازمان" icon={Building2}>
              <TextInput
                value={form.title}
                onChange={(value) => updateForm("title", value)}
              />
            </Field>
            <Field label="تلفن" icon={Phone}>
              <TextInput
                dir="ltr"
                value={form.tel}
                onChange={(value) => updateForm("tel", value)}
              />
            </Field>
            <Field label="ایمیل" icon={Mail}>
              <TextInput
                dir="ltr"
                value={form.email}
                onChange={(value) => updateForm("email", value)}
              />
            </Field>
            <Field label="کد پستی" icon={Mailbox}>
              <TextInput
                dir="ltr"
                value={form.postalCode}
                onChange={(value) => updateForm("postalCode", value)}
              />
            </Field>
            <Field label="آدرس" icon={MapPin}>
              <TextInput
                value={form.address}
                onChange={(value) => updateForm("address", value)}
              />
            </Field>
            <Field label="نماد اعتماد" icon={FileText}>
              <TextInput
                value={form.enamad}
                onChange={(value) => updateForm("enamad", value)}
                placeholder="آدرس تصویر، base64 یا کد ثبت‌شده"
              />
            </Field>
          </div>

          <Field label="توضیحات" icon={FileText}>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              className="w-full resize-none rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm leading-7 outline-none transition-all focus:border-primary"
            />
          </Field>

          <Field label="لوگو" icon={FileImage}>
            <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
              <div className="flex h-24 w-full items-center justify-center rounded-xl border border-border/70 bg-background p-3">
                <img
                  src={logoPreview || fallbackLogoSrc}
                  alt={form.title || "لوگو"}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  updateForm("logoFile", event.target.files?.[0] ?? null)
                }
                className="h-fit w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none file:ml-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
              />
            </div>
          </Field>

          <button
            type="submit"
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            ذخیره تغییرات
          </button>
        </form>
      </section>

      <InformationPreview
        information={information}
        loading={loading}
        onRefresh={() => loadInformation(undefined)}
      />
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground sm:text-xl">
          تنظیمات عمومی
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          سایر تنظیمات مدیریتی از زیرمنوهای تنظیمات در دسترس هستند.
        </p>
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-6 text-sm leading-7 text-muted-foreground">
        برای ویرایش اطلاعات هدر و فوتر، از زیرمنوی «محتوای سایت» استفاده کنید.
      </div>
    </div>
  );
}

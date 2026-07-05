import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  CircleHelp,
  Loader2,
  Pencil,
  Power,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  changeFaqStatus,
  createFaq,
  deleteFaq,
  fetchAdminFaq,
  updateFaq,
  type FaqItem,
} from "../../data/faq";

const emptyForm = { title: "", description: "" };

export function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadItems = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    try {
      setItems(await fetchAdminFaq(signal, { force: true }));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "دریافت سوالات ثبت شده ناموفق بود.",
      });
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadItems(controller.signal);
    return () => controller.abort();
  }, [loadItems]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || !description) {
      setMessage({
        type: "error",
        text: "عنوان و توضیحات سوال متداول الزامی است.",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      if (editingId) {
        await updateFaq(editingId, { title, description });
      } else {
        await createFaq({ title, description });
      }

      setMessage({
        type: "success",
        text: editingId
          ? "سوال متداول با موفقیت ویرایش شد."
          : "سوال متداول با موفقیت ثبت شد.",
      });
      resetForm();
      await loadItems();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "ذخیره سوال متداول ناموفق بود.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item: FaqItem) => {
    if (!window.confirm(`سوال «${item.title}» حذف شود؟`)) return;

    setDeletingId(item.id);
    setMessage(null);
    try {
      await deleteFaq(item.id);
      if (editingId === item.id) resetForm();
      setMessage({ type: "success", text: "سوال متداول با موفقیت حذف شد." });
      await loadItems();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "حذف سوال متداول ناموفق بود.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (item: FaqItem) => {
    setStatusLoadingId(item.id);
    setMessage(null);
    try {
      await changeFaqStatus(item.id);
      setMessage({
        type: "success",
        text: item.isActive
          ? "سوال متداول غیرفعال شد و در صفحه اصلی نمایش داده نمی‌شود."
          : "سوال متداول فعال شد و در صفحه اصلی نمایش داده می‌شود.",
      });
      await loadItems();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "تغییر وضعیت سوال متداول ناموفق بود.",
      });
    } finally {
      setStatusLoadingId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            مدیریت سوالات متداول
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            سوالات قابل نمایش در آکاردیون صفحه اصلی را ثبت و مدیریت کنید.
          </p>
        </div>
        <span className="w-fit rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
          {items.length} سوال
        </span>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            {editingId ? (
              <Pencil className="h-4 w-4 text-primary" />
            ) : (
              <CircleHelp className="h-4 w-4 text-primary" />
            )}
          </div>
          <span className="font-bold text-foreground">
            {editingId ? "ویرایش سوال متداول" : "ثبت سوال متداول جدید"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground">
                عنوان
              </span>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="مثلا نحوه ثبت درخواست جدید"
                className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5 lg:col-span-2">
              <span className="text-[11px] font-bold text-muted-foreground">
                توضیحات
              </span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="پاسخ کامل سوال را وارد کنید"
                rows={5}
                className="min-h-32 rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-7 outline-none transition-colors focus:border-primary"
              />
            </label>
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
              {editingId ? "ذخیره تغییرات" : "ثبت سوال"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-bold text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
                انصراف
              </button>
            )}
            <AnimatePresence>
              {message && (
                <motion.p
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-xs font-medium ${
                    message.type === "error"
                      ? "text-destructive"
                      : "text-emerald-600"
                  }`}
                >
                  {message.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CircleHelp className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-foreground">سوالات ثبت شده</h3>
          </div>
          <button
            type="button"
            onClick={() => void loadItems()}
            disabled={isLoading}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-muted-foreground hover:bg-muted disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            بروزرسانی
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-10 text-center text-sm text-muted-foreground">
            هنوز سوال متداولی ثبت نشده است.
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-start gap-3 rounded-xl border border-border bg-background/50 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <CircleHelp className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-foreground">
                      {item.title || "بدون عنوان"}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.isActive
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {item.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-3 text-xs leading-6 text-muted-foreground">
                    {item.description || "بدون توضیحات"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => void handleToggleStatus(item)}
                    disabled={statusLoadingId === item.id}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors disabled:opacity-60 ${
                      item.isActive
                        ? "border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/15"
                        : "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/15"
                    }`}
                    aria-label={
                      item.isActive
                        ? `غیرفعال کردن ${item.title}`
                        : `فعال کردن ${item.title}`
                    }
                    title={item.isActive ? "غیرفعال کردن" : "فعال کردن"}
                  >
                    {statusLoadingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/5 text-primary hover:bg-primary/10"
                    aria-label={`ویرایش ${item.title}`}
                    title="ویرایش"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/15 disabled:opacity-60"
                    aria-label={`حذف ${item.title}`}
                    title="حذف"
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

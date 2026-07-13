import { AnimatePresence, motion } from "motion/react";
import {
  ImagePlus,
  Loader2,
  Pencil,
  Power,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  changeSliderStatus,
  createSlider,
  deleteSlider,
  fetchAdminSliders,
  updateSlider,
  type SliderItem,
} from "../../data/sliders";

const emptyForm = {
  picture: null as File | null,
  publishDateTime: "",
};

const inputClass =
  "h-11 rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary";

function isValidPersianDateTime(value: string) {
  const match = /^(\d{4})[/-](\d{2})[/-](\d{2})[ T](\d{2}):(\d{2})(?::\d{2})?$/.exec(
    value.trim(),
  );
  if (!match) return false;

  const [, , month, day, hour, minute] = match.map(Number);
  const maxDay = month <= 6 ? 31 : month <= 11 ? 30 : 30;

  return (
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= maxDay &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  );
}

export function AdminSlidersPage() {
  const [items, setItems] = useState<SliderItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const previewUrl = useMemo(() => {
    if (form.picture instanceof File) return URL.createObjectURL(form.picture);
    return currentImage;
  }, [currentImage, form.picture]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const loadItems = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    try {
      setItems(await fetchAdminSliders(signal));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "دریافت اسلایدرهای ثبت شده ناموفق بود.",
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
    setCurrentImage("");
  };

  const resolveManagementId = (item: SliderItem) => {
    if (item.managementId) return item.managementId;
    setMessage({
      type: "error",
      text: "شناسه این اسلایدر در پاسخ API وجود ندارد؛ عملیات مدیریتی بدون Id قابل انجام نیست.",
    });
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const publishDateTime = form.publishDateTime.trim();

    if (!publishDateTime || !isValidPersianDateTime(publishDateTime)) {
      setMessage({
        type: "error",
        text: "تاریخ انتشار باید با فرمت 1405/05/14 14:00 وارد شود.",
      });
      return;
    }

    if (!editingId && !(form.picture instanceof File)) {
      setMessage({
        type: "error",
        text: "برای افزودن اسلایدر جدید انتخاب تصویر الزامی است.",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (editingId) {
        await updateSlider({
          id: editingId,
          picture: form.picture,
          publishDateTime,
        });
      } else {
        await createSlider({
          picture: form.picture,
          publishDateTime,
        });
      }

      setMessage({
        type: "success",
        text: editingId
          ? "اسلایدر با موفقیت ویرایش شد."
          : "اسلایدر جدید با موفقیت ثبت شد.",
      });
      resetForm();
      await loadItems();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "ذخیره اسلایدر ناموفق بود.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: SliderItem) => {
    const managementId = resolveManagementId(item);
    if (!managementId) return;
    setEditingId(managementId);
    setForm({ picture: null, publishDateTime: item.publishDateTime });
    setCurrentImage(item.imageUrl);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item: SliderItem) => {
    const managementId = resolveManagementId(item);
    if (!managementId) return;
    setDeletingId(item.id);
    setMessage(null);
    try {
      await deleteSlider(managementId);
      if (editingId === item.id) resetForm();
      setMessage({ type: "success", text: "اسلایدر با موفقیت حذف شد." });
      await loadItems();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "حذف اسلایدر ناموفق بود.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (item: SliderItem) => {
    const managementId = resolveManagementId(item);
    if (!managementId) return;
    setStatusLoadingId(item.id);
    setMessage(null);
    try {
      await changeSliderStatus(managementId);
      setMessage({
        type: "success",
        text: item.isActive
          ? "اسلایدر غیرفعال شد و در صفحه اصلی نمایش داده نمی‌شود."
          : "اسلایدر فعال شد و در صفحه اصلی نمایش داده می‌شود.",
      });
      await loadItems();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "تغییر وضعیت اسلایدر ناموفق بود.",
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
            تنظیمات اسلایدر
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            تصاویر اسلایدر صفحه اصلی را ثبت، ویرایش و مدیریت کنید.
          </p>
        </div>
        <span className="w-fit rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
          {items.length} اسلایدر
        </span>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            {editingId ? (
              <Pencil className="h-4 w-4 text-primary" />
            ) : (
              <ImagePlus className="h-4 w-4 text-primary" />
            )}
          </div>
          <span className="font-bold text-foreground">
            {editingId ? "ویرایش اسلایدر" : "افزودن اسلایدر جدید"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-muted-foreground">
                  تاریخ انتشار
                </span>
                <input
                  dir="ltr"
                  value={form.publishDateTime}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      publishDateTime: event.target.value,
                    }))
                  }
                  placeholder="1405/05/14 14:00"
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-muted-foreground">
                  تصویر اسلایدر
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={Boolean(editingId)}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      picture: event.target.files?.[0] ?? null,
                    }))
                  }
                  className="h-fit rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none file:ml-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
            </div>

            <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-border bg-background/70 p-3">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="پیش‌نمایش اسلایدر"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="text-center text-xs text-muted-foreground">
                  <ImagePlus className="mx-auto mb-2 h-7 w-7" />
                  تصویری انتخاب نشده است
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingId ? "ذخیره تغییرات" : "افزودن"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted"
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
            <ImagePlus className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-foreground">اسلایدرهای ثبت شده</h3>
          </div>
          <button
            type="button"
            onClick={() => void loadItems()}
            disabled={isLoading}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
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
            هنوز اسلایدری ثبت نشده است.
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex flex-col gap-3 rounded-xl border border-border bg-background/50 p-3.5 sm:flex-row sm:items-center"
              >
                <img
                  src={item.imageUrl}
                  alt="اسلایدر"
                  className="h-24 w-full rounded-xl object-cover sm:w-36 sm:shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.isActive
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {item.publishDateTime || "-"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    disabled={statusLoadingId === item.id}
                    onClick={() => void handleToggleStatus(item)}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors disabled:opacity-60 ${
                      item.isActive
                        ? "border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/15"
                        : "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/15"
                    }`}
                    aria-label={
                      item.isActive ? "غیرفعال کردن اسلایدر" : "فعال کردن اسلایدر"
                    }
                    title={
                      item.isActive ? "غیرفعال کردن اسلایدر" : "فعال کردن اسلایدر"
                    }
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/5 text-primary transition-colors hover:bg-primary/10"
                    aria-label="ویرایش اسلایدر"
                    title="ویرایش"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 text-destructive transition-colors hover:bg-destructive/15 disabled:opacity-60"
                    aria-label="حذف اسلایدر"
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

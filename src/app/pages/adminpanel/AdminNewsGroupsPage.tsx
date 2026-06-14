import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  FolderPlus,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  createNewsGroup,
  deleteNewsGroup,
  fetchAdminNewsGroups,
  updateNewsGroup,
  type NewsGroup,
} from "../../data/newsGroups";

const emptyForm = { name: "", description: "" };

export function AdminNewsGroupsPage() {
  const [groups, setGroups] = useState<NewsGroup[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadGroups = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    try {
      setGroups(await fetchAdminNewsGroups(signal));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "دریافت دسته‌بندی‌ها ناموفق بود.",
      });
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadGroups(controller.signal);
    return () => controller.abort();
  }, [loadGroups]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setMessage({ type: "error", text: "نام دسته‌بندی الزامی است." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      if (editingId) {
        await updateNewsGroup(editingId, { name, description });
      } else {
        await createNewsGroup({ name, description });
      }
      setMessage({
        type: "success",
        text: editingId
          ? "دسته‌بندی با موفقیت ویرایش شد."
          : "دسته‌بندی با موفقیت ایجاد شد.",
      });
      resetForm();
      await loadGroups();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "ذخیره دسته‌بندی ناموفق بود.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (group: NewsGroup) => {
    setEditingId(group.id);
    setForm({ name: group.name, description: group.description ?? "" });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (group: NewsGroup) => {
    if (!window.confirm(`دسته‌بندی «${group.name}» حذف شود؟`)) return;

    setDeletingId(group.id);
    setMessage(null);
    try {
      await deleteNewsGroup(group.id);
      if (editingId === group.id) resetForm();
      setMessage({ type: "success", text: "دسته‌بندی با موفقیت حذف شد." });
      await loadGroups();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "حذف دسته‌بندی ناموفق بود.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            مدیریت دسته‌بندی‌های اخبار
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            دسته‌بندی‌های قابل استفاده در اخبار سایت را ایجاد و ویرایش کنید.
          </p>
        </div>
        <span className="w-fit rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
          {groups.length} دسته‌بندی
        </span>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            {editingId ? (
              <Pencil className="h-4 w-4 text-primary" />
            ) : (
              <FolderPlus className="h-4 w-4 text-primary" />
            )}
          </div>
          <span className="font-bold text-foreground">
            {editingId ? "ویرایش دسته‌بندی" : "ساخت دسته‌بندی جدید"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground">
                نام دسته‌بندی
              </span>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="مثلاً اطلاعیه"
                className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground">
                توضیحات
              </span>
              <input
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="توضیح کوتاه درباره دسته‌بندی"
                className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary"
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
              {editingId ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"}
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
            <Tags className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-foreground">دسته‌بندی‌های ثبت‌شده</h3>
          </div>
          <button
            type="button"
            onClick={() => void loadGroups()}
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
        ) : groups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-10 text-center text-sm text-muted-foreground">
            هنوز دسته‌بندی خبری ثبت نشده است.
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-start gap-3 rounded-xl border border-border bg-background/50 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Tags className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-foreground">{group.name}</h4>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        group.isActive
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {group.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">
                    {group.description || "بدون توضیحات"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(group)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/5 text-primary hover:bg-primary/10"
                    aria-label={`ویرایش ${group.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(group)}
                    disabled={deletingId === group.id}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/15 disabled:opacity-60"
                    aria-label={`حذف ${group.name}`}
                  >
                    {deletingId === group.id ? (
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

import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Edit3,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

function UserFormFields({ form, setForm, includeRole = true }) {
  return (
    <>
      {[
        {
          label: "نام و نام خانوادگی",
          key: "name",
          type: "text",
          placeholder: "مثلاً: رضا عباسی",
        },
        {
          label: "نام کاربری (کد ملی)",
          key: "username",
          type: "text",
          placeholder: "0012345678",
        },
        {
          label: "شماره تماس",
          key: "phone",
          type: "tel",
          placeholder: "09120000000",
        },
      ].map(({ label, key, type, placeholder }) => (
        <div key={key} className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">
            {label}
          </label>
          <input
            required
            type={type}
            placeholder={placeholder}
            value={form[key]}
            onChange={(event) =>
              setForm({ ...form, [key]: event.target.value })
            }
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      ))}

      {(includeRole || form.status) && (
        <div className={`grid gap-3 ${includeRole ? "grid-cols-2" : ""}`}>
          {includeRole && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                نقش
              </label>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value })
                }
                className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option>شهروند</option>
                <option>کارشناس</option>
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              وضعیت
            </label>
            <select
              value={form.status}
              onChange={(event) =>
                setForm({ ...form, status: event.target.value })
              }
              className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option>فعال</option>
              <option>غیرفعال</option>
              <option>تعلیق</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
}

export function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    role: "شهروند",
    status: "فعال",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.username) return;

    onAdd({
      ...form,
      id: Date.now(),
      joined: new Date().toLocaleDateString("fa-IR"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(event) => event.stopPropagation()}
        className="mx-4 w-full max-w-md rounded-3xl border border-border/70 bg-card p-5 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-foreground">افزودن کاربر جدید</h3>
              <p className="text-xs text-muted-foreground">
                مشخصات کاربر را وارد کنید
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <UserFormFields form={form} setForm={setForm} />

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary to-secondary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" />
              ثبت کاربر
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              انصراف
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function EditUserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(event) => event.stopPropagation()}
        className="mx-4 w-full max-w-md rounded-3xl border border-border/70 bg-card p-5 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Edit3 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-foreground">ویرایش کاربر</h3>
              <p className="text-xs text-muted-foreground">{user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <UserFormFields form={form} setForm={setForm} includeRole={false} />
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => onSave(form)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary to-secondary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Save className="h-4 w-4" />
            ذخیره تغییرات
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            انصراف
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DeleteConfirmModal({ user, onClose, onConfirm }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="mx-4 w-full max-w-sm rounded-3xl border border-border/70 bg-card p-6 text-center shadow-2xl"
      >
        <div className="mb-4 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Trash2 className="h-7 w-7" />
          </span>
        </div>
        <h3 className="mb-1 font-bold text-foreground">حذف کاربر</h3>
        <p className="mb-5 text-sm text-muted-foreground">
          آیا از حذف <strong className="text-foreground">{user.name}</strong>{" "}
          اطمینان دارید؟ این عمل قابل بازگشت نیست.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-white transition-all hover:bg-destructive/90 active:scale-[0.98]"
          >
            بله، حذف شود
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            انصراف
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

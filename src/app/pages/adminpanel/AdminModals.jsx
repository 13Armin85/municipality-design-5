import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  ChevronDown,
  Edit3,
  KeyRound,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

const inputClassName =
  "w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10";

const normalizeDigits = (value) =>
  String(value ?? "")
    .replace(/[\u06f0-\u06f9]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x06f0),
    )
    .replace(/[\u0660-\u0669]/g, (digit) =>
      String(digit.charCodeAt(0) - 0x0660),
    );

const onlyDigits = (value) => normalizeDigits(value).replace(/\D/g, "");

const isValidIranianNationalCode = (value) => {
  const code = onlyDigits(value);
  return /^\d{10}$/.test(code);
};

const isValidMobileNumber = (value) => /^09\d{9}$/.test(onlyDigits(value));

const cleanUserForm = (form) => ({
  ...form,
  name: form.name.trim(),
  family: form.family.trim(),
  userName: form.userName.trim(),
  nationalCode: onlyDigits(form.nationalCode),
  phoneNumber: onlyDigits(form.phoneNumber),
  roleId: form.roleId.trim(),
  email: form.email.trim(),
  address: form.address.trim(),
  birthDay: form.birthDay.trim(),
});

function Field({
  label,
  name,
  form,
  setForm,
  type = "text",
  placeholder,
  dir,
  inputMode,
  maxLength,
  required = true,
  normalizeValue = (value) => value,
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-muted-foreground">
        {label}
      </label>
      <input
        required={required}
        name={name}
        type={type}
        dir={dir}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        value={form[name]}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            [name]: normalizeValue(event.target.value),
          }))
        }
        className={inputClassName}
      />
    </div>
  );
}

function FileField({ label, name, setForm }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-muted-foreground">
        {label}
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            [name]: event.target.files?.[0] ?? null,
          }))
        }
        className={`${inputClassName} h-fit file:ml-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground`}
      />
    </div>
  );
}

function RolePickerModal({
  roles,
  selectedRoleId,
  loading,
  error,
  onReload,
  onSelect,
  onClose,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm"
      onClick={(event) => {
        event.stopPropagation();
        onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-4.5 w-4.5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-foreground">انتخاب نقش کاربر</h4>
              <p className="text-[11px] text-muted-foreground">
                دسترسی مناسب را انتخاب کنید
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن انتخاب نقش"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-3">
          {loading ? (
            <div className="flex min-h-36 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              در حال دریافت نقش‌ها...
            </div>
          ) : error ? (
            <div className="flex min-h-36 flex-col items-center justify-center gap-3 px-4 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <button
                type="button"
                onClick={onReload}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                تلاش مجدد
              </button>
            </div>
          ) : roles.length === 0 ? (
            <div className="flex min-h-36 items-center justify-center text-sm text-muted-foreground">
              نقشی برای انتخاب وجود ندارد.
            </div>
          ) : (
            <div className="space-y-2">
              {roles.map((role) => {
                const isSelected = role.id === selectedRoleId;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => onSelect(role)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-right transition-all ${
                      isSelected
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/70 bg-background text-foreground hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {role.name}
                      </span>
                      <span
                        className="block truncate font-mono text-[10px] text-muted-foreground"
                        dir="ltr"
                      >
                        {role.id}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RoleField({
  form,
  setForm,
  roles,
  rolesLoading,
  rolesError,
  onReloadRoles,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedRole = roles.find((role) => role.id === form.roleId);

  return (
    <div className="space-y-1 sm:col-span-2">
      <label className="text-[11px] font-medium text-muted-foreground">
        نقش کاربر
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex w-full items-center gap-3 rounded-xl border bg-background px-3 py-2.5 text-right text-sm outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
          form.roleId ? "border-primary/30" : "border-border/70"
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {rolesLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block truncate ${
              selectedRole ? "font-semibold text-foreground" : "text-muted-foreground"
            }`}
          >
            {selectedRole?.name ||
              (form.roleId ? "نقش فعلی کاربر" : "انتخاب نقش")}
          </span>
          {form.roleId && (
            <span
              className="block truncate font-mono text-[10px] text-muted-foreground"
              dir="ltr"
            >
              {form.roleId}
            </span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
      {isOpen && (
        <RolePickerModal
          roles={roles}
          selectedRoleId={form.roleId}
          loading={rolesLoading}
          error={rolesError}
          onReload={onReloadRoles}
          onClose={() => setIsOpen(false)}
          onSelect={(role) => {
            setForm((current) => ({ ...current, roleId: role.id }));
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ModalShell({ children, onClose, maxWidth = "max-w-xl" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(event) => event.stopPropagation()}
        className={`max-h-full w-full overflow-y-auto rounded-2xl border border-border/70 bg-card p-5 shadow-2xl ${maxWidth}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ModalHeader({ icon: Icon, title, subtitle, onClose }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-bold text-foreground">{title}</h3>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن"
        className="rounded-full p-1.5 transition-colors hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function SubmitButton({ loading, icon: Icon, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary to-secondary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      {children}
    </button>
  );
}

export function AddUserModal({
  onClose,
  onAdd,
  roles,
  rolesLoading,
  rolesError,
  onReloadRoles,
}) {
  const [form, setForm] = useState({
    name: "",
    family: "",
    userName: "",
    nationalCode: "",
    phoneNumber: "",
    password: "",
    repeatPassword: "",
    roleId: "",
    email: "",
    address: "",
    picture: null,
    birthDay: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanForm = cleanUserForm(form);

    if (!cleanForm.name || !cleanForm.family || !cleanForm.userName) {
      setError("نام، نام خانوادگی و نام کاربری را کامل وارد کنید.");
      return;
    }
    if (!isValidIranianNationalCode(cleanForm.nationalCode)) {
      setError("کد ملی باید دقیقاً ۱۰ رقم باشد.");
      return;
    }
    if (!isValidMobileNumber(cleanForm.phoneNumber)) {
      setError("شماره موبایل باید ۱۱ رقم و با 09 شروع شود.");
      return;
    }
    if (!cleanForm.roleId) {
      setError("لطفاً نقش کاربر را انتخاب کنید.");
      return;
    }
    if (form.password !== form.repeatPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onAdd({
        ...cleanForm,
        password: form.password,
        repeatPassword: form.repeatPassword,
      });
    } catch (requestError) {
      setError(requestError.message || "ثبت کاربر انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={loading ? undefined : onClose}>
      <ModalHeader
        icon={Plus}
        title="افزودن کاربر جدید"
        subtitle="مشخصات کاربر را وارد کنید"
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="نام" name="name" form={form} setForm={setForm} />
          <Field
            label="نام خانوادگی"
            name="family"
            form={form}
            setForm={setForm}
          />
          <Field
            label="نام کاربری"
            name="userName"
            form={form}
            setForm={setForm}
            dir="ltr"
          />
          <Field
            label="کد ملی"
            name="nationalCode"
            form={form}
            setForm={setForm}
            placeholder="0012345678"
            inputMode="numeric"
            maxLength={10}
            normalizeValue={onlyDigits}
          />
          <Field
            label="شماره تماس"
            name="phoneNumber"
            type="tel"
            form={form}
            setForm={setForm}
            placeholder="09120000000"
            inputMode="tel"
            maxLength={11}
            normalizeValue={onlyDigits}
          />
          <RoleField
            form={form}
            setForm={setForm}
            roles={roles}
            rolesLoading={rolesLoading}
            rolesError={rolesError}
            onReloadRoles={onReloadRoles}
          />
          <Field
            label="ایمیل"
            name="email"
            type="email"
            form={form}
            setForm={setForm}
            dir="ltr"
            required={false}
          />
          <Field
            label="تاریخ تولد"
            name="birthDay"
            form={form}
            setForm={setForm}
            placeholder="1400/01/01"
            dir="ltr"
            required={false}
          />
          <div className="sm:col-span-2">
            <Field
              label="آدرس"
              name="address"
              form={form}
              setForm={setForm}
              required={false}
            />
          </div>
          <div className="sm:col-span-2">
            <FileField label="تصویر کاربر" name="picture" setForm={setForm} />
          </div>
          <Field
            label="رمز عبور"
            name="password"
            type="password"
            form={form}
            setForm={setForm}
          />
          <Field
            label="تکرار رمز عبور"
            name="repeatPassword"
            type="password"
            form={form}
            setForm={setForm}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2 pt-2">
          <SubmitButton loading={loading} icon={CheckCircle2}>
            ثبت کاربر
          </SubmitButton>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            انصراف
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function EditUserModal({
  user,
  onClose,
  onSave,
  roles,
  rolesLoading,
  rolesError,
  onReloadRoles,
}) {
  const [form, setForm] = useState({
    id: user.id,
    name: user.name,
    family: user.family,
    userName: user.userName,
    nationalCode: user.nationalCode,
    phoneNumber: user.phoneNumber,
    roleId: user.roleId,
    email: user.email || "",
    address: user.address || "",
    picture: null,
    birthDay: user.birthDay || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanForm = cleanUserForm(form);

    if (!cleanForm.name || !cleanForm.family || !cleanForm.userName) {
      setError("نام، نام خانوادگی و نام کاربری را کامل وارد کنید.");
      return;
    }
    if (!isValidIranianNationalCode(cleanForm.nationalCode)) {
      setError("کد ملی باید دقیقاً ۱۰ رقم باشد.");
      return;
    }
    if (!isValidMobileNumber(cleanForm.phoneNumber)) {
      setError("شماره موبایل باید ۱۱ رقم و با 09 شروع شود.");
      return;
    }
    if (!cleanForm.roleId) {
      setError("لطفاً نقش کاربر را انتخاب کنید.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSave(cleanForm);
    } catch (requestError) {
      setError(requestError.message || "ویرایش کاربر انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={loading ? undefined : onClose}>
      <ModalHeader
        icon={Edit3}
        title="ویرایش کاربر"
        subtitle={`${user.name} ${user.family}`}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="نام" name="name" form={form} setForm={setForm} />
          <Field
            label="نام خانوادگی"
            name="family"
            form={form}
            setForm={setForm}
          />
          <Field
            label="نام کاربری"
            name="userName"
            form={form}
            setForm={setForm}
          />
          <Field
            label="کد ملی"
            name="nationalCode"
            form={form}
            setForm={setForm}
            inputMode="numeric"
            maxLength={10}
            normalizeValue={onlyDigits}
          />
          <Field
            label="شماره تماس"
            name="phoneNumber"
            type="tel"
            form={form}
            setForm={setForm}
            inputMode="tel"
            maxLength={11}
            normalizeValue={onlyDigits}
          />
          <RoleField
            form={form}
            setForm={setForm}
            roles={roles}
            rolesLoading={rolesLoading}
            rolesError={rolesError}
            onReloadRoles={onReloadRoles}
          />
          <Field
            label="ایمیل"
            name="email"
            type="email"
            form={form}
            setForm={setForm}
            dir="ltr"
            required={false}
          />
          <Field
            label="تاریخ تولد"
            name="birthDay"
            form={form}
            setForm={setForm}
            placeholder="1400/01/01"
            dir="ltr"
            required={false}
          />
          <div className="sm:col-span-2">
            <Field
              label="آدرس"
              name="address"
              form={form}
              setForm={setForm}
              required={false}
            />
          </div>
          <div className="sm:col-span-2">
            <FileField label="تصویر کاربر" name="picture" setForm={setForm} />
          </div>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2 pt-2">
          <SubmitButton loading={loading} icon={Save}>
            ذخیره تغییرات
          </SubmitButton>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            انصراف
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function ChangePasswordModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ password: "", repeatPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.repeatPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onSave({
        userId: user.id,
        password: form.password,
        repeatPassword: form.repeatPassword,
      });
    } catch (requestError) {
      setError(requestError.message || "تغییر رمز عبور انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={loading ? undefined : onClose} maxWidth="max-w-md">
      <ModalHeader
        icon={KeyRound}
        title="تغییر رمز عبور"
        subtitle={`${user.name} ${user.family}`}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field
          label="رمز عبور جدید"
          name="password"
          type="password"
          form={form}
          setForm={setForm}
        />
        <Field
          label="تکرار رمز عبور جدید"
          name="repeatPassword"
          type="password"
          form={form}
          setForm={setForm}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2 pt-2">
          <SubmitButton loading={loading} icon={KeyRound}>
            تغییر رمز عبور
          </SubmitButton>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            انصراف
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function DeleteConfirmModal({ user, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await onConfirm();
    } catch (requestError) {
      setError(requestError.message || "حذف کاربر انجام نشد.");
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={loading ? undefined : onClose} maxWidth="max-w-sm">
      <div className="mb-4 flex justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <Trash2 className="h-7 w-7" />
        </span>
      </div>
      <h3 className="mb-1 text-center font-bold text-foreground">حذف کاربر</h3>
      <p className="mb-5 text-center text-sm text-muted-foreground">
        آیا از حذف{" "}
        <strong className="text-foreground">
          {user.name} {user.family}
        </strong>{" "}
        اطمینان دارید؟ این عمل قابل بازگشت نیست.
      </p>
      {error && <p className="mb-3 text-center text-xs text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={handleConfirm}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-white transition-all hover:bg-destructive/90 active:scale-[0.98] disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          بله، حذف شود
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          انصراف
        </button>
      </div>
    </ModalShell>
  );
}

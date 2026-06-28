import { FormEvent, useState } from "react";
import { KeyRound, RefreshCw, UserCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { apiFetch } from "../../data/api";

const REGISTER_ENDPOINT = "/api/auth/register";
const DEFAULT_REGISTER_ROLE = "User";
const MODAL_PANEL_CLASS =
  "fixed inset-x-2 top-[calc(env(safe-area-inset-top)_+_4.75rem)] z-[90] mx-auto flex max-h-[calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom)_-_5.75rem)] w-[calc(100vw_-_1rem)] max-w-md flex-col overflow-y-auto overscroll-contain rounded-2xl border border-border/70 bg-card/95 p-4 shadow-[0_30px_80px_rgba(6,31,27,0.32)] backdrop-blur-xl sm:inset-x-4 sm:top-[calc(env(safe-area-inset-top)_+_5.25rem)] sm:max-h-none sm:w-[calc(100vw_-_2rem)] sm:overflow-visible sm:rounded-3xl sm:p-6";

const extractRegisterError = (data: any) => {
  if (!data) return "";

  if (typeof data === "string") return data;

  if (data.Message) return String(data.Message);
  if (data.message) return String(data.message);
  if (data.error) return String(data.error);

  const modelState = data.ModelState ?? data.modelState;
  if (modelState && typeof modelState === "object") {
    const messages = Object.values(modelState)
      .flat()
      .filter(Boolean)
      .map(String);

    if (messages.length) return messages.join(" ");
  }

  return "";
};

interface LoginModalProps {
  isOpen: boolean;
  loginType: "user" | "admin";
  username: string;
  password: string;
  loginError: string;
  loginLoading: boolean;
  onClose: () => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onForgotPassword: () => void;
}

export function LoginModal({
  isOpen,
  loginType,
  username,
  password,
  loginError,
  loginLoading,
  onClose,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}: LoginModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regNationalCode, setRegNationalCode] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState("");
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[85] bg-black/45 backdrop-blur-[2px]"
            aria-label="بستن فرم ورود"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="فرم ورود"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className={MODAL_PANEL_CLASS}
          >
            <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    loginType === "admin"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {loginType === "admin" ? (
                    <KeyRound className="h-5 w-5" />
                  ) : (
                    <UserCircle2 className="h-5 w-5" />
                  )}
                </span>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-foreground">
                    ورود به حساب کاربری
                  </h3>
                  <p className="text-[11px] leading-5 text-muted-foreground">
                    دسترسی به خدمات پرتال شهروند
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="shrink-0 rounded-full p-1 transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!isRegistering ? (
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="pr-1 text-[11px] font-medium text-muted-foreground">
                    نام کاربری
                  </label>
                  <input
                    value={username}
                    onChange={(e) => onUsernameChange(e.target.value)}
                    placeholder="مثال: 0012345678"
                    disabled={loginLoading}
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-medium text-muted-foreground">
                      رمز عبور
                    </label>
                    {/*
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      فراموشی رمز عبور؟
                    </button>
                    */}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="••••••••"
                    disabled={loginLoading}
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>

                {loginError ? (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                  >
                    {loginError}
                  </motion.p>
                ) : null}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      در حال ورود...
                    </>
                  ) : (
                    "ورود به حساب کاربری"
                  )}
                </button>
              </form>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setRegError("");
                  setRegSuccess("");

                  if (!regUsername.trim()) {
                    setRegError("نام کاربری را وارد کنید.");
                    return;
                  }
                  if (!/^\d{10}$/.test(regNationalCode)) {
                    setRegError("کد ملی باید ۱۰ رقم باشد.");
                    return;
                  }
                  if (!/^(09)\d{9}$/.test(regPhone)) {
                    setRegError("شماره موبایل معتبر نیست.");
                    return;
                  }
                  if (!regEmail.trim()) {
                    setRegError("ایمیل را وارد کنید.");
                    return;
                  }
                  if (
                    regEmail.trim() &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())
                  ) {
                    setRegError("ایمیل وارد شده معتبر نیست.");
                    return;
                  }
                  if (!regFirstName.trim() || !regLastName.trim()) {
                    setRegError("نام و نام خانوادگی را وارد کنید.");
                    return;
                  }
                  if (regPassword.length < 8) {
                    setRegError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
                    return;
                  }
                  if (regPassword !== regConfirmPassword) {
                    setRegError("رمز عبور و تکرار آن یکسان نیستند.");
                    return;
                  }

                  setRegLoading(true);
                  try {
                    const registerUsername = regUsername.trim();
                    const registerPassword = regPassword;
                    const response = await apiFetch(REGISTER_ENDPOINT, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                      body: JSON.stringify({
                        Name: regFirstName.trim(),
                        Family: regLastName.trim(),
                        NationalCode: regNationalCode.trim(),
                        PhoneNumber: regPhone.trim(),
                        Email: regEmail.trim(),
                        UserName: registerUsername,
                        Password: registerPassword,
                        RepeatPassword: regConfirmPassword,
                        Roles: [DEFAULT_REGISTER_ROLE],
                      }),
                    });

                    if (response.ok) {
                      setRegSuccess(
                        "ثبت نام با موفقیت انجام شد. لطفا وارد شوید.",
                      );
                      onUsernameChange(registerUsername);
                      onPasswordChange(registerPassword);
                      setRegUsername("");
                      setRegNationalCode("");
                      setRegPhone("");
                      setRegEmail("");
                      setRegFirstName("");
                      setRegLastName("");
                      setRegPassword("");
                      setRegConfirmPassword("");
                      setIsRegistering(false);
                    } else {
                      const data = await response.json().catch(() => null);
                      setRegError(
                        extractRegisterError(data) ||
                          "خطا در ثبت نام. لطفا مجددا تلاش کنید.",
                      );
                    }
                  } catch (err) {
                    setRegError("خطا در اتصال به سرور. لطفا دوباره تلاش کنید.");
                  } finally {
                    setRegLoading(false);
                  }
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="pr-1 text-[11px] font-medium text-muted-foreground">
                    نام کاربری
                  </label>
                  <input
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="مثال: 0012345678"
                    disabled={regLoading}
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="pr-1 text-[11px] font-medium text-muted-foreground">
                    کد ملی
                  </label>
                  <input
                    value={regNationalCode}
                    onChange={(e) => setRegNationalCode(e.target.value)}
                    placeholder="مثال: 0012345678"
                    disabled={regLoading}
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="pr-1 text-[11px] font-medium text-muted-foreground">
                    شماره موبایل
                  </label>
                  <input
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="09xxxxxxxxx"
                    disabled={regLoading}
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="pr-1 text-[11px] font-medium text-muted-foreground">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="example@email.com"
                    disabled={regLoading}
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                  <div className="space-y-1">
                    <label className="pr-1 text-[11px] font-medium text-muted-foreground">
                      نام
                    </label>
                    <input
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      disabled={regLoading}
                      className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="pr-1 text-[11px] font-medium text-muted-foreground">
                      نام خانوادگی
                    </label>
                    <input
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      disabled={regLoading}
                      className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="pr-1 text-[11px] font-medium text-muted-foreground">
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="حداقل ۸ کاراکتر"
                    disabled={regLoading}
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="pr-1 text-[11px] font-medium text-muted-foreground">
                    تکرار رمز عبور
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    disabled={regLoading}
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                  />
                </div>

                {regError ? (
                  <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {regError}
                  </p>
                ) : null}

                {regSuccess ? (
                  <p className="rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">
                    {regSuccess}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  {regLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      در حال ثبت‌نام...
                    </>
                  ) : (
                    "ثبت‌نام"
                  )}
                </button>
              </form>
            )}

            {regSuccess && !isRegistering ? (
              <p className="mt-3 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">
                {regSuccess}
              </p>
            ) : null}

            <div className="mt-3 text-center text-[13px]">
              {/*
              {!isRegistering ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setRegError("");
                    setRegSuccess("");
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  هنوز ثبت‌نام نکرده‌اید؟ ثبت‌نام
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-muted-foreground hover:underline"
                >
                  بازگشت به ورود
                </button>
              )}
              */}
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}

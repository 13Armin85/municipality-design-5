import { FormEvent, useState } from "react";
import { KeyRound, RefreshCw, UserCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
  const [regNationalCode, setRegNationalCode] = useState("");
  const [regPhone, setRegPhone] = useState("");
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
            className="fixed inset-x-3 top-[calc(env(safe-area-inset-top)+5.25rem)] z-[90] mx-auto w-full max-w-md rounded-3xl border border-border/70 bg-card/95 p-6 shadow-[0_30px_80px_rgba(6,31,27,0.32)] backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
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

                <div>
                  <h3 className="text-base font-bold text-foreground">
                    ورود به حساب کاربری
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    دسترسی به خدمات پرتال شهروند
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-full p-1 transition-colors hover:bg-muted"
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
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      فراموشی رمز عبور؟
                    </button>
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

                  if (!/^\d{10}$/.test(regNationalCode)) {
                    setRegError("کد ملی باید ۱۰ رقم باشد.");
                    return;
                  }
                  if (!/^(09)\d{9}$/.test(regPhone)) {
                    setRegError("شماره موبایل معتبر نیست.");
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
                    // Try to call register API if exists; otherwise simulate success
                    const response = await fetch("/api/auth/register", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        nationalCode: regNationalCode,
                        phone: regPhone,
                        firstName: regFirstName,
                        lastName: regLastName,
                        password: regPassword,
                      }),
                    });

                    if (response.ok) {
                      setRegSuccess(
                        "ثبت نام با موفقیت انجام شد. لطفا وارد شوید.",
                      );
                      // clear fields
                      setRegNationalCode("");
                      setRegPhone("");
                      setRegFirstName("");
                      setRegLastName("");
                      setRegPassword("");
                      setRegConfirmPassword("");
                      setIsRegistering(false);
                    } else {
                      const data = await response.json().catch(() => null);
                      setRegError(
                        data?.message ||
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

                <div className="grid grid-cols-2 gap-2">
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

            <div className="mt-3 text-center text-[13px]">
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
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}

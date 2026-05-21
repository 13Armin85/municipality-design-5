import { FormEvent } from "react";
import { KeyRound, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface LoginModalProps {
  isOpen: boolean;
  username: string;
  password: string;
  loginError: string;
  loginLoading: boolean;
  onClose: () => void;
  onOpenForgotPassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export function LoginModal({
  isOpen,
  username,
  password,
  loginError,
  loginLoading,
  onClose,
  onOpenForgotPassword,
  onSubmit,
  onUsernameChange,
  onPasswordChange,
}: LoginModalProps) {
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
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <KeyRound className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    ورود به پرتال شهروند
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    سطح دسترسی بر اساس حساب شما تعیین می‌شود
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 transition-colors hover:bg-muted"
                aria-label="بستن"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="pr-1 text-[11px] font-medium text-muted-foreground">
                  نام کاربری
                </label>
                <input
                  value={username}
                  onChange={(e) => onUsernameChange(e.target.value)}
                  placeholder="مثال: 0012345678"
                  autoComplete="username"
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
                    onClick={onOpenForgotPassword}
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
                  autoComplete="current-password"
                  disabled={loginLoading}
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                />
              </div>

              {loginError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                >
                  {loginError}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال ورود...
                  </>
                ) : (
                  "ورود به حساب کاربری"
                )}
              </button>
            </form>

            <div className="mt-4 rounded-xl bg-[var(--primary-soft)] px-3 py-2.5">
              <p className="text-center text-[11px] leading-5 text-muted-foreground">
                اگر حساب ادمین دارید با همین فرم وارد شوید — دسترسی شما به صورت
                خودکار تشخیص داده می‌شود.
              </p>
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}

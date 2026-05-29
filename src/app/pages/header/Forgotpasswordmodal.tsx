import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ClipboardEvent as ReactClipboardEvent,
  RefObject,
} from "react";
import {
  ArrowRight,
  CheckCheck,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Smartphone,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export type ForgotStep = "phone" | "otp" | "newPassword" | "success";
const MODAL_PANEL_CLASS =
  "fixed inset-x-2 top-[calc(env(safe-area-inset-top)_+_4.75rem)] z-[90] mx-auto flex max-h-[calc(100dvh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom)_-_5.75rem)] w-[calc(100vw_-_1rem)] max-w-md flex-col overflow-y-auto overscroll-contain rounded-2xl border border-border/70 bg-card/95 p-4 shadow-[0_30px_80px_rgba(6,31,27,0.32)] backdrop-blur-xl sm:inset-x-4 sm:top-[calc(env(safe-area-inset-top)_+_5.25rem)] sm:max-h-none sm:w-[calc(100vw_-_2rem)] sm:overflow-visible sm:rounded-3xl sm:p-6";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  step: ForgotStep;
  phone: string;
  otp: string[];
  newPassword: string;
  confirmPassword: string;
  error: string;
  loading: boolean;
  otpResendTimer: number;
  otpRefs: RefObject<(HTMLInputElement | null)[]>;
  onClose: () => void;
  onPhoneChange: (value: string) => void;
  onOtpInput: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, event: ReactKeyboardEvent<HTMLInputElement>) => void;
  onOtpPaste: (event: ReactClipboardEvent<HTMLInputElement>) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSendOtp: (event: FormEvent<HTMLFormElement>) => void;
  onVerifyOtp: (event: FormEvent<HTMLFormElement>) => void;
  onResendOtp: () => void;
  onSetNewPassword: (event: FormEvent<HTMLFormElement>) => void;
  onBackToLogin: () => void;
  onGoToOtpStep: () => void;
}

const STEPS: ForgotStep[] = ["phone", "otp", "newPassword"];

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function StepIndicator({ currentStep }: { currentStep: ForgotStep }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      {STEPS.map((step, idx) => {
        const currentIdx = STEPS.indexOf(currentStep);
        const isDone = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                isDone
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                    ? "bg-primary/15 text-primary ring-2 ring-primary/30"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isDone ? <CheckCheck className="h-3 w-3" /> : idx + 1}
            </div>
            {idx < 2 && (
              <div className={`h-px flex-1 transition-all ${isDone ? "bg-primary" : "bg-border/70"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ForgotPasswordModal({
  isOpen,
  step,
  phone,
  otp,
  newPassword,
  confirmPassword,
  error,
  loading,
  otpResendTimer,
  otpRefs,
  onClose,
  onPhoneChange,
  onOtpInput,
  onOtpKeyDown,
  onOtpPaste,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSendOtp,
  onVerifyOtp,
  onResendOtp,
  onSetNewPassword,
  onBackToLogin,
  onGoToOtpStep,
}: ForgotPasswordModalProps) {
  const stepSubtitle: Record<ForgotStep, string> = {
    phone: "شماره موبایل خود را وارد کنید",
    otp: `کد ارسال شده به ${phone}`,
    newPassword: "رمز عبور جدید تعیین کنید",
    success: "رمز عبور با موفقیت تغییر کرد",
  };

  const ErrorMessage = () =>
    error ? (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
      >
        {error}
      </motion.p>
    ) : null;

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
            aria-label="بستن فرم فراموشی رمز عبور"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="فراموشی رمز عبور"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className={MODAL_PANEL_CLASS}
          >
            {/* Header */}
            <div className="mb-5 flex shrink-0 items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Smartphone className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-foreground">بازیابی رمز عبور</h3>
                  <p className="break-words text-[11px] leading-5 text-muted-foreground">{stepSubtitle[step]}</p>
                </div>
              </div>
              <button onClick={onClose} className="shrink-0 rounded-full p-1 transition-colors hover:bg-muted" aria-label="بستن">
                <X className="h-4 w-4" />
              </button>
            </div>

            {step !== "success" && <StepIndicator currentStep={step} />}

            <AnimatePresence mode="wait">
              {step === "phone" && (
                <motion.form
                  key="phone-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={onSendOtp}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="pr-1 text-[11px] font-medium text-muted-foreground">شماره موبایل</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => onPhoneChange(e.target.value)}
                      placeholder="09xxxxxxxxx"
                      dir="ltr"
                      maxLength={11}
                      className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-center text-sm tracking-widest outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                    <p className="pr-1 text-[11px] text-muted-foreground">کد تایید به این شماره پیامک می‌شود</p>
                  </div>

                  <ErrorMessage />

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? (
                      <><RefreshCw className="h-4 w-4 animate-spin" />در حال ارسال...</>
                    ) : (
                      <>ارسال کد تایید<Smartphone className="h-4 w-4" /></>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="inline-flex w-full items-center justify-center gap-1.5 pt-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    بازگشت به صفحه ورود
                  </button>
                </motion.form>
              )}

              {step === "otp" && (
                <motion.form
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={onVerifyOtp}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <label className="block pr-1 text-[11px] font-medium text-muted-foreground">کد ۵ رقمی دریافتی</label>
                    <div className="grid grid-cols-5 gap-1.5 min-[360px]:gap-2" dir="ltr">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => onOtpInput(idx, e.target.value)}
                          onKeyDown={(e) => onOtpKeyDown(idx, e)}
                          onPaste={idx === 0 ? onOtpPaste : undefined}
                          className={`h-11 w-full min-w-0 rounded-xl border text-center text-base font-bold outline-none transition-all min-[360px]:h-12 min-[360px]:text-lg ${
                            digit
                              ? "border-primary bg-[var(--primary-soft)] text-primary"
                              : "border-border/70 bg-background text-foreground"
                          } focus:border-primary focus:ring-2 focus:ring-primary/10`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-1 pt-1">
                      {otpResendTimer > 0 ? (
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock3 className="h-3.5 w-3.5" />
                          ارسال مجدد تا
                          <span className="font-bold text-primary tabular-nums" dir="ltr">
                            {formatTimer(otpResendTimer)}
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={onResendOtp}
                          disabled={loading}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:underline disabled:opacity-50"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          ارسال مجدد کد
                        </button>
                      )}
                    </div>
                  </div>

                  <ErrorMessage />

                  <button
                    type="submit"
                    disabled={loading || otp.join("").length < 5}
                    className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? (
                      <><RefreshCw className="h-4 w-4 animate-spin" />در حال تایید...</>
                    ) : "تایید کد"}
                  </button>

                  <button
                    type="button"
                    onClick={onGoToOtpStep}
                    className="inline-flex w-full items-center justify-center gap-1.5 pt-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    تغییر شماره موبایل
                  </button>
                </motion.form>
              )}

              {step === "newPassword" && (
                <motion.form
                  key="newpassword-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={onSetNewPassword}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <label className="pr-1 text-[11px] font-medium text-muted-foreground">رمز عبور جدید</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => onNewPasswordChange(e.target.value)}
                      placeholder="حداقل ۸ کاراکتر"
                      className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="pr-1 text-[11px] font-medium text-muted-foreground">تکرار رمز عبور جدید</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => onConfirmPasswordChange(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {newPassword.length > 0 && (
                    <div className="flex items-center gap-1.5 px-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            newPassword.length >= (i + 1) * 3
                              ? newPassword.length >= 12
                                ? "bg-green-500"
                                : newPassword.length >= 9
                                  ? "bg-yellow-500"
                                  : "bg-orange-400"
                              : "bg-border/50"
                          }`}
                        />
                      ))}
                      <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                        {newPassword.length >= 12
                          ? "قوی"
                          : newPassword.length >= 9
                            ? "متوسط"
                            : newPassword.length >= 6
                              ? "ضعیف"
                              : "خیلی ضعیف"}
                      </span>
                    </div>
                  )}

                  <ErrorMessage />

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? (
                      <><RefreshCw className="h-4 w-4 animate-spin" />در حال ذخیره...</>
                    ) : "ذخیره رمز عبور جدید"}
                  </button>
                </motion.form>
              )}

              {step === "success" && (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col items-center gap-4 py-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </motion.div>

                  <div>
                    <h4 className="mb-1 text-base font-bold text-foreground">رمز عبور تغییر کرد!</h4>
                    <p className="text-sm leading-6 text-muted-foreground">
                      رمز عبور شما با موفقیت بازیابی شد. اکنون می‌توانید با رمز جدید وارد شوید.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="btn-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98]"
                  >
                    ورود به حساب کاربری
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}

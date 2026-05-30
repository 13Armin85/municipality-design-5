import {
  ClipboardEvent as ReactClipboardEvent,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CheckCircle2, Loader2, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface SahkarVerificationModalProps {
  isOpen: boolean;
  nationalCode: string;
  mobile: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

type VerificationStep = "phone" | "code" | "success";

export function SahkarVerificationModal({
  isOpen,
  nationalCode,
  mobile,
  onClose,
  onSuccess,
  onError,
}: SahkarVerificationModalProps) {
  const [step, setStep] = useState<VerificationStep>("phone");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Validation ──────────────────────────────────────────────────────────

  const validateNationalCode = (code: string): boolean => {
    const cleaned = code.replace(/\D/g, "").padStart(10, "0");
    return /^\d{10}$/.test(cleaned);
  };

  const validateMobileNumber = (phone: string): boolean => {
    return /^(09)\d{9}$/.test(phone.replace(/\D/g, ""));
  };

  const formatNationalCode = (code: string): string => {
    return code.replace(/\D/g, "").padStart(10, "0");
  };

  const formatMobile = (phone: string): string => {
    return phone.replace(/\D/g, "");
  };

  // ─── Phone verification ──────────────────────────────────────────────────

  const handleVerifyPhone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // اعتبارسنجی اطلاعات
    if (!validateNationalCode(nationalCode) || !validateMobileNumber(mobile)) {
      setError("اطلاعات کد ملی یا شماره تلفن معتبر نیستند.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("auth-token");
      const formattedNationalCode = formatNationalCode(nationalCode);
      const formattedMobile = formatMobile(mobile);

      const response = await fetch("/api/auth/shahkar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          NationalCode: formattedNationalCode,
          Mobile: formattedMobile,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(
          errorData.message ||
            "شماره تلفن با کد ملی مطابقت ندارد. لطفا اطلاعات خود را دوباره بررسی کنید.",
        );
        setLoading(false);
        return;
      }

      // Send SMS code
      const sendResponse = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          NationalCode: formattedNationalCode,
          Mobile: formattedMobile,
        }),
      });

      if (!sendResponse.ok) {
        setError("خطا در ارسال کد. لطفا دوباره تلاش کنید.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setStep("code");
      startResendTimer();
    } catch (err) {
      setError("خطا در اتصال به سرور. لطفا دوباره تلاش کنید.");
      setLoading(false);
    }
  };

  // ─── Code verification ──────────────────────────────────────────────────

  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const codeValue = code.join("");
    if (codeValue.length < 6) {
      setError("لطفا کد ۶ رقمی دریافت شده را وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("auth-token");
      const formattedNationalCode = formatNationalCode(nationalCode);
      const formattedMobile = formatMobile(mobile);

      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          NationalCode: formattedNationalCode,
          Mobile: formattedMobile,
          Code: codeValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(
          errorData.message || "کد وارد شده اشتباه است. لطفا مجددا تلاش کنید.",
        );
        setLoading(false);
        return;
      }

      setLoading(false);
      setStep("success");

      // Show success for 2 seconds then complete
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError("خطا در تایید کد. لطفا دوباره تلاش کنید.");
      setLoading(false);
    }
  };

  // ─── Timer and resend ────────────────────────────────────────────────────

  const startResendTimer = () => {
    setResendTimer(120);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setCode(["", "", "", "", "", ""]);
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("auth-token");
      const formattedNationalCode = formatNationalCode(nationalCode);
      const formattedMobile = formatMobile(mobile);

      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          NationalCode: formattedNationalCode,
          Mobile: formattedMobile,
        }),
      });

      if (!response.ok) {
        setError("خطا در ارسال کد. لطفا دوباره تلاش کنید.");
        setLoading(false);
        return;
      }

      setLoading(false);
      startResendTimer();
    } catch (err) {
      setError("خطا در اتصال به سرور. لطفا دوباره تلاش کنید.");
      setLoading(false);
    }
  };

  // ─── Code input handlers ────────────────────────────────────────────────

  const handleCodeInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (
    index: number,
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (event: ReactClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const newCode = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) newCode[i] = pasted[i];
    setCode(newCode);

    codeRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ─── Effects ────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setStep("phone");
      setCode(["", "", "", "", "", ""]);
      setError("");
      setLoading(false);
      setResendTimer(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen]);

  // ─── Format phone for display ────────────────────────────────────────────

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return `${cleaned.slice(0, 4)}****${cleaned.slice(-2)}`;
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <div className="py-6">
          <AnimatePresence mode="wait">
            {/* Phone verification step */}
            {step === "phone" && (
              <motion.form
                key="phone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleVerifyPhone}
                className="space-y-4"
              >
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    شماره تلفن ثبت شده
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <p className="font-medium">{formatPhoneDisplay(mobile)}</p>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      در حال تایید...
                    </>
                  ) : (
                    "تایید و ارسال کد"
                  )}
                </Button>
              </motion.form>
            )}

            {/* Code verification step */}
            {step === "code" && (
              <motion.form
                key="code"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleVerifyCode}
                className="space-y-4"
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    کد ۶ رقمی به شماره
                  </p>
                  <p className="mt-1 font-medium">
                    {formatPhoneDisplay(mobile)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ارسال شده است
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </motion.div>
                )}

                <div className="flex justify-center gap-2">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        codeRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeInput(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      onPaste={handleCodePaste}
                      className="h-12 w-10 text-center text-xl font-bold"
                      placeholder="•"
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={loading || code.join("").length < 6}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      در حال تایید...
                    </>
                  ) : (
                    "تایید کد"
                  )}
                </Button>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      درخواست دوباره ارسال کد در {resendTimer} ثانیه
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={loading}
                      className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                    >
                      ارسال دوباره کد
                    </button>
                  )}
                </div>
              </motion.form>
            )}

            {/* Success step */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </motion.div>
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    تایید هویت موفقیت‌آمیز!
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    درحال تکمیل ورود...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

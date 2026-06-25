import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Loader2, Phone } from "lucide-react";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  getApiErrorMessage,
  isApiSuccess,
  type ApiResponse,
} from "../../utils/apiResponseHandler";
import { dotNet10ApiFetch } from "../../data/api";

interface SahkarVerificationModalProps {
  isOpen: boolean;
  nationalCode: string;
  mobile: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

type VerificationStep = "phone" | "code" | "success";

const REQUEST_OTP_ENDPOINT = "/api/auth/request-otp";
const VERIFY_OTP_ENDPOINT = "/api/auth/verify-otp";
const CODE_LENGTH = 6;
const RESEND_SECONDS = 120;

const EMPTY_CODE = Array(CODE_LENGTH).fill("") as string[];

const MESSAGES = {
  invalidIdentity: "اطلاعات کد ملی یا شماره تلفن معتبر نیستند.",
  requestFailed: "خطا در ارسال کد. لطفا دوباره تلاش کنید.",
  connectionFailed: "خطا در اتصال به سرور. لطفا دوباره تلاش کنید.",
  invalidCodeLength: "لطفا کد ۶ رقمی دریافت شده را وارد کنید.",
  verifyFailed: "کد وارد شده اشتباه است. لطفا مجددا تلاش کنید.",
  verifying: "در حال تایید...",
  sendButton: "تایید و ارسال کد",
  verifyButton: "تایید کد",
  phoneLabel: "شماره تلفن ثبت شده",
  codeSentPrefix: "کد ۶ رقمی به شماره",
  codeSentSuffix: "ارسال شده است",
  resendCountdown: "درخواست دوباره ارسال کد در",
  resendButton: "ارسال دوباره کد",
  successTitle: "تایید هویت موفقیت‌آمیز",
  successDescription: "درحال تکمیل ورود...",
};

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const parseApiResponse = async (response: Response): Promise<ApiResponse> => {
  const text = await response.text().catch(() => "");
  if (!text.trim()) return {};

  try {
    return JSON.parse(text) as ApiResponse;
  } catch {
    return {};
  }
};

const isSuccessfulResponse = (data: ApiResponse) => {
  const isSuccess = data.IsSuccess ?? data.isSuccess;
  const isFailure = data.IsFailure ?? data.isFailure;

  if (isSuccess === undefined && isFailure === undefined) return true;
  return isApiSuccess(data);
};

const getAuthHeader = () => {
  const token = localStorage.getItem("auth-token")?.trim();
  if (!token) return {};

  return {
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };
};

const getResponseErrorMessage = (data: ApiResponse, fallback: string) => {
  if (
    data.Error?.Description ||
    data.error?.description ||
    data.error?.name
  ) {
    return getApiErrorMessage(data);
  }

  return fallback;
};

export function SahkarVerificationModal({
  isOpen,
  nationalCode,
  mobile,
  onClose,
  onSuccess,
  onError,
}: SahkarVerificationModalProps) {
  const [step, setStep] = useState<VerificationStep>("phone");
  const [code, setCode] = useState<string[]>(EMPTY_CODE);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showError = (message: string) => {
    setError(message);
    onError(message);
  };

  const validateNationalCode = (value: string) =>
    /^\d{10}$/.test(onlyDigits(value).padStart(10, "0"));

  const validateMobileNumber = (value: string) =>
    /^(09)\d{9}$/.test(onlyDigits(value));

  const formatNationalCode = (value: string) =>
    onlyDigits(value).padStart(10, "0");

  const formatMobile = (value: string) => onlyDigits(value);

  const startResendTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setResendTimer(RESEND_SECONDS);
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

  const requestOtp = async () => {
    const formattedNationalCode = formatNationalCode(nationalCode);
    const formattedMobile = formatMobile(mobile);

    const response = await dotNet10ApiFetch(REQUEST_OTP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        nationalCode: formattedNationalCode,
        mobile: formattedMobile,
      }),
    });

    const data = await parseApiResponse(response);
    if (!response.ok || !isSuccessfulResponse(data)) {
      throw new Error(getResponseErrorMessage(data, MESSAGES.requestFailed));
    }
  };

  const handleVerifyPhone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!validateNationalCode(nationalCode) || !validateMobileNumber(mobile)) {
      showError(MESSAGES.invalidIdentity);
      return;
    }

    setLoading(true);
    try {
      await requestOtp();
      setStep("code");
      startResendTimer();
    } catch (err) {
      showError(err instanceof Error ? err.message : MESSAGES.connectionFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const otp = code.join("");
    if (otp.length < CODE_LENGTH) {
      showError(MESSAGES.invalidCodeLength);
      return;
    }

    setLoading(true);
    try {
      const response = await dotNet10ApiFetch(VERIFY_OTP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          nationalCode: formatNationalCode(nationalCode),
          mobile: formatMobile(mobile),
          otp,
        }),
      });

      const data = await parseApiResponse(response);
      if (!response.ok || !isSuccessfulResponse(data)) {
        throw new Error(getResponseErrorMessage(data, MESSAGES.verifyFailed));
      }

      setStep("success");
      window.setTimeout(onSuccess, 1200);
    } catch (err) {
      showError(err instanceof Error ? err.message : MESSAGES.verifyFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setCode([...EMPTY_CODE]);
    setError("");
    setLoading(true);
    try {
      await requestOtp();
      startResendTimer();
    } catch (err) {
      showError(err instanceof Error ? err.message : MESSAGES.connectionFailed);
    } finally {
      setLoading(false);
    }
  };

  const focusHiddenInput = () => {
    hiddenInputRef.current?.focus();
  };

  const handleHiddenInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = onlyDigits(event.target.value).slice(0, CODE_LENGTH);
    const nextCode = [...EMPTY_CODE];
    for (let i = 0; i < digits.length; i++) nextCode[i] = digits[i];
    setCode(nextCode);
  };

  const handleHiddenKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Backspace") return;

    setCode((prev) => {
      const nextCode = [...prev];
      for (let i = CODE_LENGTH - 1; i >= 0; i--) {
        if (nextCode[i]) {
          nextCode[i] = "";
          break;
        }
      }
      return nextCode;
    });
    event.preventDefault();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen) return;

    setStep("phone");
    setCode([...EMPTY_CODE]);
    setError("");
    setLoading(false);
    setResendTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [isOpen]);

  useEffect(() => {
    if (step !== "code") return;

    const timeoutId = window.setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [step]);

  const formatPhoneDisplay = (value: string) => {
    const cleaned = onlyDigits(value);
    return `${cleaned.slice(0, 4)}****${cleaned.slice(-2)}`;
  };

  const enteredCode = code.join("");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-full max-w-md">
        <div className="py-6" dir="rtl">
          <AnimatePresence mode="wait">
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
                    {MESSAGES.phoneLabel}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <p className="font-medium">{formatPhoneDisplay(mobile)}</p>
                  </div>
                </div>

                {error && <ErrorMessage message={error} />}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      {MESSAGES.verifying}
                    </>
                  ) : (
                    MESSAGES.sendButton
                  )}
                </Button>
              </motion.form>
            )}

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
                    {MESSAGES.codeSentPrefix}
                  </p>
                  <p className="mt-1 font-medium">
                    {formatPhoneDisplay(mobile)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {MESSAGES.codeSentSuffix}
                  </p>
                </div>

                {error && <ErrorMessage message={error} />}

                <input
                  ref={hiddenInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={enteredCode}
                  onChange={handleHiddenInputChange}
                  onKeyDown={handleHiddenKeyDown}
                  className="sr-only"
                  maxLength={CODE_LENGTH}
                  aria-label="کد تایید"
                />

                <div
                  className="flex cursor-text justify-center gap-2"
                  dir="ltr"
                  onClick={focusHiddenInput}
                >
                  {code.map((digit, index) => {
                    const isCaret =
                      index === code.filter(Boolean).length &&
                      enteredCode.length < CODE_LENGTH;

                    return (
                      <div
                        key={index}
                        className={[
                          "flex h-12 w-10 select-none items-center justify-center rounded-md border text-xl font-bold transition-all",
                          digit
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-input bg-background text-muted-foreground",
                          isCaret ? "ring-2 ring-primary ring-offset-1" : "",
                        ].join(" ")}
                      >
                        {digit ||
                          (isCaret ? (
                            <span className="animate-pulse text-base text-primary">
                              |
                            </span>
                          ) : (
                            "•"
                          ))}
                      </div>
                    );
                  })}
                </div>

                <Button
                  type="submit"
                  disabled={loading || enteredCode.length < CODE_LENGTH}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      {MESSAGES.verifying}
                    </>
                  ) : (
                    MESSAGES.verifyButton
                  )}
                </Button>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {MESSAGES.resendCountdown} {resendTimer} ثانیه
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={loading}
                      className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                    >
                      {MESSAGES.resendButton}
                    </button>
                  )}
                </div>
              </motion.form>
            )}

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
                    {MESSAGES.successTitle}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {MESSAGES.successDescription}
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

function ErrorMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3"
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
      <p className="text-sm text-destructive">{message}</p>
    </motion.div>
  );
}

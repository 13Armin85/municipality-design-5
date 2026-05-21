import { AnimatePresence, motion } from "motion/react";
import { LogOut } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
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
            aria-label="بستن"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-4 top-1/2 z-[90] mx-auto w-full max-w-sm -translate-y-1/2 rounded-3xl border border-border/70 bg-card/95 p-6 shadow-[0_30px_80px_rgba(6,31,27,0.32)] backdrop-blur-xl"
          >
            <div className="mb-5 flex flex-col items-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <LogOut className="h-7 w-7" />
              </span>

              <div>
                <h3 className="text-base font-bold text-foreground">
                  خروج از حساب کاربری
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  آیا مطمئن هستید؟ پس از خروج باید مجدداً وارد شوید.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border/70 bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-destructive/90"
              >
                بله، خارج شو
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

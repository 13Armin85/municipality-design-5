import { Info, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface HelpModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export function HelpModal({
  isOpen,
  title,
  description,
  onClose,
}: HelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-4 sm:px-6">
              <h3 className="flex items-center gap-2 text-sm font-bold text-primary sm:text-base">
                <Info className="h-4 w-4 sm:h-5 sm:w-5" /> {title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <div className="p-5 text-sm leading-7 text-foreground/80 sm:p-6">
              {description}
            </div>
            <div className="px-5 py-4 text-left sm:px-6">
              <button
                onClick={onClose}
                className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg active:scale-95"
              >
                فهمیدم
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

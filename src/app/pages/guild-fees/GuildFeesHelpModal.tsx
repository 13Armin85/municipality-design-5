import { AnimatePresence, motion } from "motion/react";
import { Info, X } from "lucide-react";

interface GuildFeesHelpModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export function GuildFeesHelpModal({
  isOpen,
  title,
  description,
  onClose,
}: GuildFeesHelpModalProps) {
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
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-primary">
                <Info className="h-5 w-5" />
                {title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 text-sm leading-7 text-foreground/80">
              {description}
            </div>
            <div className="bg-muted/30 px-6 py-4 text-left">
              <button
                onClick={onClose}
                className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform active:scale-95"
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

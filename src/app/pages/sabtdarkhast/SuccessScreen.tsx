import { Check } from "lucide-react";
import { motion } from "motion/react";

export function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center space-y-6 py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
      >
        <Check className="h-12 w-12 text-emerald-600" />
      </motion.div>
      <div>
        <h2 className="mb-2 text-xl font-bold text-foreground">
          درخواست با موفقیت ثبت شد
        </h2>
      </div>
      <button
        onClick={onReset}
        className="rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-95"
      >
        درخواست جدید
      </button>
    </motion.div>
  );
}

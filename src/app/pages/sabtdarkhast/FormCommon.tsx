import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { motion } from "motion/react";

interface SelectionModalProps {
  title: string;
  items: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function SelectionModal({
  title,
  items,
  onSelect,
  onClose,
}: SelectionModalProps) {
  const [search, setSearch] = useState("");
  const filtered = items.filter((item) => item.includes(search));

  return (
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
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-4 pt-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو..."
            className="h-9 w-full rounded-xl border border-border/70 bg-muted/30 px-3 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>
        <div className="max-h-64 space-y-1 overflow-y-auto p-3">
          {filtered.map((item) => (
            <button
              key={item}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="w-full rounded-xl px-4 py-2.5 text-right text-sm font-medium transition-colors hover:bg-primary/8 hover:text-primary"
            >
              {item}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1 flex items-center gap-1 pr-1 text-[10px] text-destructive"
    >
      <AlertCircle className="h-3 w-3 flex-shrink-0" /> {msg}
    </motion.p>
  );
}

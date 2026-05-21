import { AnimatePresence } from "motion/react";
import { Calendar, Info, MoreHorizontal } from "lucide-react";
import { FormErrors } from "./types";
import { PersianDatePicker } from "./PersianDatePicker";
import { FieldError } from "./FormCommon";

interface HelpButtonProps {
  title: string;
  desc: string;
  onOpenHelp: (title: string, description: string) => void;
}

export function HelpButton({ title, desc, onOpenHelp }: HelpButtonProps) {
  return (
    <button
      onClick={() => onOpenHelp(title, desc)}
      className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 md:text-xs"
    >
      <Info className="h-3.5 w-3.5" /> راهنما
    </button>
  );
}

export function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-muted/60 px-4 py-2">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm font-bold text-foreground">{title}</span>
    </div>
  );
}

interface EditableFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  errorKey?: string;
  showErrors: boolean;
  errors: FormErrors;
  clearError: (errorKey: string) => void;
}

export function EditableField({
  label,
  required,
  value,
  onChange,
  type = "text",
  errorKey,
  showErrors,
  errors,
  clearError,
}: EditableFieldProps) {
  const hasError = !!(showErrors && errorKey && errors[errorKey]);
  return (
    <div data-has-error={hasError ? "true" : "false"}>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (errorKey && errors[errorKey]) clearError(errorKey);
          }}
          className={`h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none transition-colors ${hasError ? "border-destructive focus:border-destructive" : "border-border/70 focus:border-primary"}`}
        />
        <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
          {label}
          {required && <span className="mr-0.5 text-destructive">*</span>}
        </span>
      </div>
      {hasError && errorKey && <FieldError msg={errors[errorKey]} />}
    </div>
  );
}

interface SelectionFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  items: string[];
  title: string;
  errorKey?: string;
  showErrors: boolean;
  errors: FormErrors;
  clearError: (errorKey: string) => void;
  openSelection: (
    title: string,
    items: string[],
    onSelect: (value: string) => void,
  ) => void;
}

export function SelectionField({
  label,
  required,
  value,
  onChange,
  items,
  title,
  errorKey,
  showErrors,
  errors,
  clearError,
  openSelection,
}: SelectionFieldProps) {
  const hasError = !!(showErrors && errorKey && errors[errorKey]);
  return (
    <div data-has-error={hasError ? "true" : "false"}>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (errorKey && errors[errorKey]) clearError(errorKey);
          }}
          className={`h-10 w-full rounded-xl border bg-card px-3 pl-10 text-sm outline-none transition-colors ${hasError ? "border-destructive focus:border-destructive" : "border-border/70 focus:border-primary"}`}
        />
        <button
          type="button"
          onClick={() =>
            openSelection(title, items, (v) => {
              onChange(v);
              if (errorKey && errors[errorKey]) clearError(errorKey);
            })
          }
          className="absolute left-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          title="انتخاب از لیست"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
        <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
          {label}
          {required && <span className="mr-0.5 text-destructive">*</span>}
        </span>
      </div>
      {hasError && errorKey && <FieldError msg={errors[errorKey]} />}
    </div>
  );
}

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  pickerId: string;
  activeDatePicker: string | null;
  setActiveDatePicker: (pickerId: string | null) => void;
}

export function DateField({
  label,
  value,
  onChange,
  pickerId,
  activeDatePicker,
  setActiveDatePicker,
}: DateFieldProps) {
  const isOpen = activeDatePicker === pickerId;
  return (
    <div data-datepicker-container className="col-span-1">
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 pl-10 text-sm outline-none transition-colors focus:border-primary"
          placeholder="۱۴۰۳/۰۱/۰۱"
          readOnly
        />
        <button
          type="button"
          onClick={() => setActiveDatePicker(isOpen ? null : pickerId)}
          className={`absolute left-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg transition-colors ${isOpen ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}
        >
          <Calendar className="h-3.5 w-3.5" />
        </button>
        <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
          {label}
        </span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <PersianDatePicker
            value={value}
            onChange={(v) => onChange(v)}
            onClose={() => setActiveDatePicker(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

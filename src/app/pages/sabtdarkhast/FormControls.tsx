import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import { Calendar, Info, MoreHorizontal } from "lucide-react";
import { FormErrors } from "./types";
import {
  getCurrentJalaliDateString,
  PersianDatePicker,
} from "./PersianDatePicker";
import { FieldError } from "./FormCommon";

interface HelpButtonProps {
  title: string;
  desc: string;
  onOpenHelp: (title: string, description: string) => void;
}

export function HelpButton({ title, desc, onOpenHelp }: HelpButtonProps) {
  return (
    <button
      type="button"
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
  readOnly?: boolean;
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
  readOnly = false,
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
          readOnly={readOnly}
          onChange={(e) => {
            if (readOnly) return;
            onChange(e.target.value);
            if (errorKey && errors[errorKey]) clearError(errorKey);
          }}
          className={`h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none transition-colors ${
            readOnly
              ? "cursor-not-allowed text-muted-foreground"
              : ""
          } ${hasError ? "border-destructive focus:border-destructive" : "border-border/70 focus:border-primary"}`}
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
  const handleOpenSelection = () =>
    openSelection(title, items, (v) => {
      onChange(v);
      if (errorKey && errors[errorKey]) clearError(errorKey);
    });

  return (
    <div data-has-error={hasError ? "true" : "false"}>
      <div className="relative">
        <input
          value={value}
          readOnly
          onClick={handleOpenSelection}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleOpenSelection();
            }
          }}
          className={`h-10 w-full cursor-pointer rounded-xl border bg-card px-3 pl-10 text-sm outline-none transition-colors ${hasError ? "border-destructive focus:border-destructive" : "border-border/70 focus:border-primary"}`}
        />
        <button
          type="button"
          onClick={handleOpenSelection}
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
  const resolvedValue = value || getCurrentJalaliDateString();
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties | null>(
    null,
  );

  useEffect(() => {
    if (!value) onChange(getCurrentJalaliDateString());
  }, [onChange, value]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const field = fieldRef.current;
      if (!field) return;

      const rect = field.getBoundingClientRect();
      const pickerWidth = Math.max(rect.width, 288);
      const pickerHeight = 372;
      const gap = 6;
      const viewportPadding = 8;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const left = Math.min(
        Math.max(viewportPadding, rect.right - pickerWidth),
        viewportWidth - pickerWidth - viewportPadding,
      );
      const hasRoomBelow = rect.bottom + gap + pickerHeight <= viewportHeight;
      const top = hasRoomBelow
        ? rect.bottom + gap
        : Math.max(viewportPadding, rect.top - pickerHeight - gap);

      setPortalStyle({
        position: "fixed",
        top,
        left,
        width: pickerWidth,
        zIndex: 2147483647,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  const pickerPortal =
    isOpen && portalStyle && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            <div
              data-datepicker-container
              style={portalStyle}
              className="pointer-events-auto"
            >
              <PersianDatePicker
                value={resolvedValue}
                onChange={(v) => onChange(v)}
                onClose={() => setActiveDatePicker(null)}
              />
            </div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <div
      ref={fieldRef}
      data-datepicker-container
      className={`relative col-span-1 ${isOpen ? "z-[120]" : "z-0"}`}
    >
      <div className="relative">
        <input
          value={resolvedValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 pl-10 text-sm outline-none transition-colors focus:border-primary"
          placeholder="1403/01/01"
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
      {pickerPortal}
    </div>
  );
}

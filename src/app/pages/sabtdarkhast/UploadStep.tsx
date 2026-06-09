import { useState } from "react";
import {
  AlertCircle,
  Check,
  ClipboardList,
  FileText,
  ImageIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import type { LackDocumentItem } from "./types";

interface UploadStepProps {
  onBack: () => void;
  onSubmit: (files: File[]) => void;
  lackDocuments: LackDocumentItem[];
  lackDocumentsLoading: boolean;
  lackDocumentsError: string;
  uploadError: string;
  isSubmitting: boolean;
}

interface SelectedUploadFile {
  file: File;
  name: string;
  size: string;
  preview?: string;
}

const defaultDocTypes = [
  "سند مالکیت",
  "کارت ملی مالک",
  "نقشه ملک",
  "وکالت نامه (در صورت وجود)",
  "مدارک شرکت (برای متقاضی حقوقی)",
];

const mapFilesForUpload = (fileList: FileList | File[]) =>
  Array.from(fileList).map((file) => ({
    file,
    name: file.name,
    size: `${(file.size / 1024).toFixed(0)} KB`,
    preview: file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : undefined,
  }));

export function UploadStep({
  onBack,
  onSubmit,
  lackDocuments,
  lackDocumentsLoading,
  lackDocumentsError,
  uploadError,
  isSubmitting,
}: UploadStepProps) {
  const [files, setFiles] = useState<SelectedUploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles((prev) => [...prev, ...mapFilesForUpload(e.target.files!)]);
    setSubmitError(false);
  };

  const removeFile = (i: number) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    if (files.length === 0) {
      setSubmitError(true);
      return;
    }
    onSubmit(files.map((file) => file.file));
  };

  const requiredDocuments = lackDocuments.length
    ? lackDocuments.map((doc) => doc.title)
    : defaultDocTypes;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="space-y-5"
    >
      <motion.article className="soft-card mesh-panel">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <ClipboardList className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">مدارک مورد نیاز</h2>
        </div>
        <div className="space-y-2 p-4">
          {lackDocumentsLoading && (
            <p className="text-xs text-muted-foreground">
              در حال دریافت کسری مدارک...
            </p>
          )}

          {lackDocumentsError && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              {lackDocumentsError}
            </p>
          )}

          {!lackDocumentsLoading &&
            requiredDocuments.map((doc, i) => (
              <div
                key={`${doc}-${i}`}
                className="flex items-center gap-2 text-xs text-foreground/70"
              >
                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/50" />
                {doc}
              </div>
            ))}
        </div>
      </motion.article>

      <motion.article className="soft-card mesh-panel">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <Upload className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">آپلود فایل ها</h2>
        </div>
        <div className="space-y-4 p-4">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              setFiles((prev) => [
                ...prev,
                ...mapFilesForUpload(e.dataTransfer.files),
              ]);
              setSubmitError(false);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-all sm:p-8 ${
              isDragging
                ? "border-primary bg-primary/5"
                : submitError
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 sm:h-12 sm:w-12">
              <ImageIcon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                فایل را اینجا رها کنید
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                یا کلیک کنید برای انتخاب
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                PNG، JPG، PDF - حداکثر ۱۰ مگابایت
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {submitError && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              لطفا حداقل یک فایل بارگذاری کنید.
            </p>
          )}

          {uploadError && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" />
              {uploadError}
            </p>
          )}

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, i) => (
                <motion.div
                  key={`${file.name}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-3"
                >
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt=""
                      className="h-10 w-10 flex-shrink-0 rounded-lg border border-border/50 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {file.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="flex-shrink-0 rounded-lg p-1.5 text-destructive/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.article>

      <div className="flex flex-col items-stretch justify-start gap-3 pt-2 sm:flex-row sm:items-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4" />
            {isSubmitting ? "در حال ارسال..." : "ثبت نهایی"}
          </span>
        </button>
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-xl border border-border/60 bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          بازگشت
        </button>
      </div>
    </motion.div>
  );
}

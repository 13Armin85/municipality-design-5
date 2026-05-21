import { AnimatePresence, motion } from "motion/react";
import { Camera, LogOut, Trash2, UserCircle2 } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";
import { accountCards } from "./profileData";

interface ProfileSidebarProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handlePhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRemovePhoto: () => void;
  handleUploadClick: () => void;
  onLogoutClick: () => void;
  photoError: string | null;
  photoMessage: string | null;
  profileImage: string | null;
}

export function ProfileSidebar({
  fileInputRef,
  handlePhotoChange,
  handleRemovePhoto,
  handleUploadClick,
  onLogoutClick,
  photoError,
  photoMessage,
  profileImage,
}: ProfileSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="soft-card mesh-panel p-5 md:p-6"
    >
      <div className="mb-5 text-center">
        <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-[1.5rem] border border-border/80 bg-muted shadow-[0_16px_34px_rgba(4,20,17,0.16)]">
          {profileImage ? (
            <img
              src={profileImage}
              alt="عکس پروفایل کاربر"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <UserCircle2 className="h-16 w-16" />
            </div>
          )}

          <span className="absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/40 bg-background/85 text-primary shadow-sm">
            <Camera className="h-4 w-4" />
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-foreground">
          امیررضا محمدی
        </h3>

        <p className="text-sm text-muted-foreground">شهروند تایید شده</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <button
          type="button"
          onClick={handleUploadClick}
          className="btn-gradient rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          بارگذاری عکس
        </button>

        <button
          type="button"
          onClick={handleRemovePhoto}
          disabled={!profileImage}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--primary-soft)] disabled:pointer-events-none disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          حذف عکس
        </button>
      </div>

      <AnimatePresence mode="wait">
        {photoError && (
          <motion.p
            key={photoError}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            {photoError}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {photoMessage && (
          <motion.p
            key={photoMessage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 rounded-xl border border-primary/30 bg-[var(--primary-soft)] px-3 py-2 text-xs text-primary"
          >
            {photoMessage}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-5 space-y-2">
        {accountCards.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/70 p-3"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary">
              <item.icon className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{item.title}</p>
              <p className="truncate text-sm font-semibold text-foreground">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onLogoutClick}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/15"
      >
        <LogOut className="h-4 w-4" />
        خروج از حساب کاربری
      </button>
    </motion.aside>
  );
}

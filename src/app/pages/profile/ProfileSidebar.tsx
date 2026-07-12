import { motion } from "motion/react";
import { Camera, LogOut, UserCircle2 } from "lucide-react";

interface ProfileSidebarProps {
  onLogoutClick: () => void;
  profileImage: string | null;
  displayName?: string;
}

export function ProfileSidebar({
  onLogoutClick,
  profileImage,
  displayName,
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
          {displayName || "کاربر"}
        </h3>

        <p className="text-sm text-muted-foreground">شهروند</p>
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

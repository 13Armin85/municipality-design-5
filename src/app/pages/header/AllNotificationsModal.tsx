import { Bell, CheckCheck, Clock3, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Notification {
  id: string;
  title: string;
  description?: string;
  time: string;
  isRead?: boolean;
}

interface AllNotificationsModalProps {
  isOpen: boolean;
  notifications: Notification[];
  readNotificationIds: string[];
  unreadCount: number;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function AllNotificationsModal({
  isOpen,
  notifications,
  readNotificationIds,
  unreadCount,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: AllNotificationsModalProps) {
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
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-[2px]"
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="همه اعلان‌ها"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-2 top-[calc(env(safe-area-inset-top)+4.75rem)] z-[80] mx-auto flex h-[min(80vh,44rem)] w-[min(64rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-[0_30px_80px_rgba(6,31,27,0.32)] backdrop-blur-xl md:inset-x-6 md:top-24"
          >
            <div className="relative border-b border-border/70 px-4 py-4 sm:px-6">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/60 to-transparent" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-primary">
                    <Bell className="h-5 w-5" />
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-foreground sm:text-lg">
                      همه اعلان‌ها
                    </h3>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {unreadCount} اعلان خوانده‌نشده برای پیگیری دارید
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="header-action-btn h-9 w-9 min-w-9"
                  aria-label="بستن"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 sm:px-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-primary">
                <Bell className="h-3.5 w-3.5" />
                لیست کامل اعلان‌ها
              </span>

              <button
                type="button"
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-[var(--primary-soft)] disabled:pointer-events-none disabled:opacity-45"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                علامت‌گذاری همه
              </button>
            </div>

            <div className="grid flex-1 gap-3 overflow-y-auto p-3 sm:p-4">
              {notifications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-10 text-center text-sm text-muted-foreground">
                  اعلانی برای نمایش وجود ندارد.
                </div>
              ) : notifications.map((item) => {
                const isUnread =
                  !item.isRead && !readNotificationIds.includes(item.id);
                return (
                  <article
                    key={item.id}
                    className={`group rounded-2xl border border-border/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[var(--primary-soft)] ${
                      isUnread
                        ? "bg-[var(--primary-soft)]/65"
                        : "bg-background/70"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <p className="text-sm leading-6 text-foreground">
                        {item.title}
                      </p>
                      <span
                        className={`mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${
                          isUnread
                            ? "bg-primary shadow-[0_0_0_4px_var(--primary-soft)]"
                            : "bg-muted-foreground/45"
                        }`}
                      />
                    </div>
                    {item.description ? (
                      <p className="mb-2 line-clamp-2 text-xs leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}

                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        {item.time}
                      </span>
                      <button
                        type="button"
                        onClick={() => void onMarkAsRead(item.id)}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-background/80"
                      >
                        علامت گذاری به عنوان خوانده شده
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}

import { Bell, CheckCheck, Clock3, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { RefObject } from "react";

interface Notification {
  id: string;
  title: string;
  description?: string;
  time: string;
  isRead?: boolean;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  notifications: Notification[];
  readNotificationIds: string[];
  notificationsRef: RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onOpenAll: () => void;
}

export function NotificationsPanel({
  isOpen,
  notifications,
  readNotificationIds,
  notificationsRef,
  isMobile,
  onClose,
  onMarkAsRead,
  onOpenAll,
}: NotificationsPanelProps) {
  const panelClassName = isMobile
    ? "fixed inset-x-2 top-[calc(env(safe-area-inset-top)+4.75rem)] z-50 w-auto overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-[0_18px_42px_rgba(4,20,17,0.18)] backdrop-blur-xl"
    : "absolute left-0 right-auto top-full z-50 mt-3 w-[min(22rem,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-[0_18px_42px_rgba(4,20,17,0.18)] backdrop-blur-xl";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isMobile && (
            <motion.button
              type="button"
              aria-label="بستن پنل اعلان‌ها"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
            />
          )}

          <motion.div
            id="notifications-panel"
            ref={notificationsRef}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={panelClassName}
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <h3 className="text-sm font-bold text-foreground">اعلان‌ها</h3>
            </div>

            <div
              className={`overflow-y-auto p-2 ${
                isMobile ? "max-h-[56vh]" : "max-h-72"
              }`}
            >
              {notifications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-8 text-center text-sm text-muted-foreground">
                  اعلانی برای نمایش وجود ندارد.
                </div>
              ) : notifications.map((item) => {
                const isUnread =
                  !item.isRead && !readNotificationIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      void onMarkAsRead(item.id);
                      onClose();
                    }}
                    className={`w-full rounded-xl px-3 py-3 text-right mb-[5px] transition-colors hover:bg-[var(--primary-soft)] ${
                      isUnread ? "bg-[var(--primary-soft)]/60" : ""
                    }`}
                  >
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <p className="text-sm text-foreground">{item.title}</p>
                      {isUnread && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    {item.description ? (
                      <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-border/70 p-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAll();
                }}
                className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-[var(--primary-soft)]"
              >
                مشاهده همه اعلان‌ها
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

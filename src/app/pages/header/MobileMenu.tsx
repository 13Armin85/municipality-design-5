import { Bell, ChevronDown, UserCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { MouseEvent as ReactMouseEvent, useState } from "react";
import { Link } from "react-router";
import { type HeaderMenuItem } from "../../components/Header";

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: HeaderMenuItem[];
  activeMenuItem: string;
  isAuthenticated: boolean;
  unreadCount: number;
  onMenuItemClick: (href: string) => void;
  onNotificationsClick: () => void;
  onProfileClick: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
}

export function MobileMenu({
  isOpen,
  menuItems,
  activeMenuItem,
  isAuthenticated,
  unreadCount,
  onMenuItemClick,
  onNotificationsClick,
  onProfileClick,
}: MobileMenuProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleSubmenuToggle = (title: string) => {
    setOpenSubmenu((current) => (current === title ? null : title));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="container mx-auto mt-2 px-0 md:px-2 min-[1281px]:hidden"
        >
          <div className="nav-shell max-h-[calc(100dvh-6rem)] overflow-hidden">
            <nav className="flex max-h-[calc(100dvh-6rem)] flex-col gap-2 overflow-y-auto p-3 sm:p-4">
              {menuItems.map((item, index) => {
                const isActive = item.href === activeMenuItem;
                const hasChildren = Boolean(item.children?.length);
                const isSubmenuOpen = openSubmenu === item.title;

                if (hasChildren) {
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="overflow-hidden rounded-xl"
                    >
                      <button
                        type="button"
                        onClick={() => handleSubmenuToggle(item.title)}
                        className={`relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl px-4 py-3 text-right text-sm font-medium transition-all ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-foreground hover:text-primary"
                        }`}
                        aria-expanded={isSubmenuOpen}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="mobile-menu-active"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 34,
                            }}
                            className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-secondary"
                          />
                        )}
                        <span className="relative z-10">{item.title}</span>
                        <ChevronDown
                          className={`relative z-10 h-4 w-4 shrink-0 transition-transform ${
                            isSubmenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isSubmenuOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1 grid gap-1 rounded-xl border border-border/60 bg-background/55 p-1.5">
                              <a
                                href={item.href}
                                onClick={() => onMenuItemClick(item.href)}
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-[var(--primary-soft)]"
                              >
                                مشاهده بخش {item.title}
                              </a>
                              {item.children?.map((child) => (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  onClick={() => onMenuItemClick(child.href)}
                                  className="rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-[var(--primary-soft)] hover:text-primary"
                                >
                                  {child.title}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }

                return (
                  <motion.a
                    key={item.title}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onMenuItemClick(item.href)}
                    className={`relative overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="mobile-menu-active"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-secondary"
                      />
                    )}
                    <span className="relative z-10">{item.title}</span>
                  </motion.a>
                );
              })}

              <div className="grid grid-cols-1 gap-2 border-t border-border/70 pt-3 sm:grid-cols-2">
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={onNotificationsClick}
                    className="flex items-center justify-between gap-3 rounded-xl bg-[var(--primary-soft)] px-4 py-3 text-sm text-foreground transition-colors hover:bg-[var(--primary-soft-strong)]"
                  >
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <Bell className="h-4 w-4 shrink-0" />
                      <span>اعلان‌ها</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      {unreadCount}
                      {unreadCount > 0 && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </span>
                  </button>
                )}

                <Link
                  to="/profile"
                  onClick={onProfileClick}
                  className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-foreground transition-colors hover:bg-[var(--primary-soft)]"
                >
                  <UserCircle2 className="h-4 w-4" />
                  <span>پروفایل من</span>
                </Link>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

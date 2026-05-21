import { MouseEvent as ReactMouseEvent } from "react";
import { UserCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";
import { MenuItem } from "./types";

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  activeMenuItem: string;
  isAuthenticated: boolean;
  unreadCount: number;
  onMenuItemClick: (href: string) => void;
  onOpenNotifications: () => void;
  onProfileClick: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  closeMenu: () => void;
  closeNotifications: () => void;
}

export function MobileMenu({
  isOpen,
  menuItems,
  activeMenuItem,
  isAuthenticated,
  unreadCount,
  onMenuItemClick,
  onOpenNotifications,
  onProfileClick,
  closeMenu,
  closeNotifications,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="container mx-auto mt-2 px-0 md:px-2 lg:hidden"
        >
          <div className="nav-shell overflow-hidden">
            <nav className="flex flex-col gap-2 p-4">
              {menuItems.map((item, index) => {
                const isActive = item.href === activeMenuItem;
                return (
                  <motion.a
                    key={item.title}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onMenuItemClick(item.href)}
                    className={`relative overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive ? "text-primary-foreground" : "text-foreground hover:text-primary"}`}
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

              <div className="grid grid-cols-2 gap-2 pt-2">
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={onOpenNotifications}
                    className="flex items-center justify-between rounded-xl bg-[var(--primary-soft)] px-4 py-3 text-sm text-foreground transition-colors hover:bg-[var(--primary-soft-strong)]"
                  >
                    <span>اعلان‌ها</span>
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
                  onClick={(e) => {
                    closeMenu();
                    closeNotifications();
                    onProfileClick(e);
                  }}
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

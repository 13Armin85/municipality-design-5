import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { Link } from "react-router";

interface GuildFeesHeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function GuildFeesHeader({
  isDark,
  toggleTheme,
}: GuildFeesHeaderProps) {
  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
    >
      <div className="container mx-auto px-0 md:px-2 lg:px-6">
        <div className="nav-shell">
          <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
            <Link
              to="/"
              className="header-action-btn inline-flex items-center gap-2 px-3"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="text-sm">بازگشت </span>
            </Link>

            <div className="min-w-0 text-center">
              <h1 className="truncate text-sm font-bold text-foreground md:text-base">
                عوارض صنفی
              </h1>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="header-action-btn"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? "sun" : "moon"}
                  initial={{ opacity: 0, rotate: -18, scale: 0.9 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 18, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

import { ArrowRight, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

interface CommonHeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

interface FormHeaderProps extends CommonHeaderProps {
  isUploadStep: boolean;
  onBackToForm: () => void;
}

export function SabtdarkhastFormHeader({
  isDark,
  toggleTheme,
  isUploadStep,
  onBackToForm,
}: FormHeaderProps) {
  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
    >
      <div className="container mx-auto px-0 md:px-2 lg:px-6">
        <div className="nav-shell">
          <div className="flex h-14 items-center justify-between gap-2 px-3 sm:h-16 md:h-20 md:px-4">
            {isUploadStep ? (
              <button
                onClick={onBackToForm}
                className="header-action-btn inline-flex items-center gap-1.5 px-2 sm:px-3"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden text-sm sm:block">بازگشت</span>
              </button>
            ) : (
              <Link
                to="/"
                className="header-action-btn inline-flex items-center gap-1.5 px-2 sm:px-3"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden text-sm sm:block">بازگشت</span>
              </Link>
            )}
            <h1 className="truncate px-2 text-xs font-bold text-foreground sm:text-sm md:text-base">
              ثبت درخواست {isUploadStep && "— آپلود مدارک"}
            </h1>
            <button
              onClick={toggleTheme}
              className="header-action-btn flex-shrink-0"
            >
              {isDark ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export function SabtdarkhastSuccessHeader({
  isDark,
  toggleTheme,
}: CommonHeaderProps) {
  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
    >
      <div className="container mx-auto px-0 md:px-2 lg:px-6">
        <div className="nav-shell">
          <div className="flex h-14 items-center justify-between gap-2 px-3 sm:h-16 md:h-20 md:px-4">
            <div className="header-action-btn pointer-events-none inline-flex items-center gap-2 px-3 opacity-0">
              <ArrowRight className="h-4 w-4" />
            </div>
            <h1 className="text-sm font-bold text-foreground md:text-base">
              ثبت درخواست نوسازی
            </h1>
            <button onClick={toggleTheme} className="header-action-btn">
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

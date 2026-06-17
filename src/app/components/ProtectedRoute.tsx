import { ReactNode, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthModal } from "./AuthContext";
import { Header } from "./Header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AUTH_STORAGE_KEY } from "../utils/authStorage";

interface ProtectedRouteProps {
  children: ReactNode;
  isDark: boolean;
  toggleTheme: () => void;
}

export function ProtectedRoute({
  children,
  isDark,
  toggleTheme,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { setIsLoginModalOpen } = useAuthModal();
  const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === "true";

  if (!isAuthenticated) {
    const handleLoginClick = () => {
      setOpen(false);
      setIsLoginModalOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      navigate("/");
    };

    return (
      <>
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent>
            <DialogHeader className="text-right">
              <DialogTitle>برای وارد شدن ابتدا لاگین کنید</DialogTitle>
              <DialogDescription>
                برای استفاده از این خدمات نیاز به ورود دارید
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 flex-row-reverse pt-4">
              <Button
                onClick={handleLoginClick}
                className="flex-1 btn-gradient text-primary-foreground"
              >
                ورود
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                بازگشت به خانه
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return <>{children}</>;
}

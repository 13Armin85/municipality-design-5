export interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export type ForgotStep = "phone" | "otp" | "newPassword" | "success";

export interface MenuItem {
  title: string;
  href: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
}

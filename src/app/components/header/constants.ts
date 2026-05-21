import { MenuItem, NotificationItem } from "./types";

export const menuItems: MenuItem[] = [
  { title: "صفحه اصلی", href: "#home" },
  { title: "خدمات", href: "#services" },
  { title: "فعالیت‌ها", href: "#activities" },
  { title: "اخبار", href: "#news" },
  { title: "سوالات متداول", href: "#faq" },
  { title: "پشتیبانی", href: "#support" },
];

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "وضعیت پرونده PR-22318 به‌روزرسانی شد",
    time: "5 دقیقه پیش",
  },
  {
    id: "n2",
    title: "قبض عوارض نوسازی شما آماده پرداخت است",
    time: "1 ساعت پیش",
  },
  {
    id: "n3",
    title: "پاسخ تیکت #TK-1082 ثبت شد",
    time: "امروز، 10:15",
  },
];

export const API_BASE = "http://192.168.10.3:6300";
export const AUTH_STORAGE_KEY = "municipality-user-authenticated";
export const AUTH_TYPE_KEY = "municipality-user-type";
export const TOKEN_KEY = "municipality-auth-token";

import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  FileCheck2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export const PROFILE_IMAGE_STORAGE_KEY = "municipality-user-profile-image";
export const AUTH_STORAGE_KEY = "municipality-user-authenticated";

export const personalInfo = [
  { label: "نام و نام خانوادگی", value: "امیررضا محمدی" },
  { label: "کد ملی", value: "۱۲۳۴۵۶۷۸۹۰" },
  { label: "تاریخ تولد", value: "۱۳۷۶/۰۴/۱۸" },
  { label: "شماره پرونده شهروندی", value: "MRG-148229" },
  { label: "وضعیت حساب", value: "فعال و تایید شده" },
  { label: "تاریخ عضویت", value: "۱۴۰۱/۰۲/۰۹" },
];

export const contactInfo: Array<{
  icon: LucideIcon;
  label: string;
  value: string;
}> = [
  { icon: Phone, label: "شماره همراه", value: "۰۹۱۲۱۲۳۴۵۶۷" },
  { icon: Mail, label: "ایمیل", value: "amirreza.mohammadi@example.com" },
  {
    icon: MapPin,
    label: "نشانی",
    value: "مراغه، خیابان شهید بهشتی، کوچه فرهنگ، پلاک ۲۱",
  },
];

export const accountCards: Array<{
  title: string;
  value: string;
  icon: LucideIcon;
}> = [
  { title: "درخواست‌های فعال", value: "۴", icon: FileCheck2 },
  { title: "ابلاغیه‌های جدید", value: "۲", icon: BadgeCheck },
  { title: "واحد خدمت‌دهنده", value: "شهرداری مراغه", icon: Building2 },
];

export const properties = [
  {
    id: "p1",
    title: "آپارتمان مسکونی",
    code: "PR-24819",
    address: "مراغه، خیابان امام، کوچه گلستان ۳",
    area: "۱۴۵ متر",
    status: "فعال",
    usage: "مسکونی",
  },
  {
    id: "p2",
    title: "زمین شهری",
    code: "PR-77502",
    address: "مراغه، بلوار ولایت، فاز ۲",
    area: "۳۲۰ متر",
    status: "دارای بدهی",
    usage: "زمین",
  },
  {
    id: "p3",
    title: "واحد تجاری",
    code: "PR-91284",
    address: "مراغه، خیابان دانشسرا، مجتمع آفتاب",
    area: "۸۲ متر",
    status: "تایید شده",
    usage: "تجاری",
  },
];

export const timelineItems = [
  {
    id: "t1",
    title: "استعلام نوسازی ملک",
    subtitle: "در حال بررسی توسط واحد درآمد",
    time: "به‌روزرسانی: امروز، ۱۱:۲۰",
  },
  {
    id: "t2",
    title: "درخواست تمدید پروانه کسب",
    subtitle: "مدارک کامل دریافت شد",
    time: "به‌روزرسانی: دیروز، ۰۹:۴۸",
  },
  {
    id: "t3",
    title: "پرداخت عوارض سالیانه",
    subtitle: "پرداخت موفق و رسید صادر شد",
    time: "به‌روزرسانی: ۱۴۰۵/۰۲/۰۸",
  },
];

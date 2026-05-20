import {
  FilePlus2,
  Landmark,
  LayoutDashboard,
  MapPinOff,
  SearchCode,
  Store,
  type LucideIcon,
} from "lucide-react";

export type ServiceItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  href: string;
};

export const serviceItems: ServiceItem[] = [
  {
    id: "my-property",
    icon: LayoutDashboard,
    title: "املاک من",
    description: "مشاهده، انتخاب و مدیریت املاک ثبت‌شده",
    color: "from-primary to-secondary",
    href: "/my-property",
  },
  {
    id: "sabt-darkhast",
    icon: FilePlus2,
    title: "ثبت درخواست",
    description: "ارسال درخواست‌های شهری و پیگیری آن‌ها",
    color: "from-secondary to-primary",
    href: "/sabt-darkhast",
  },
  {
    id: "property-request",
    icon: SearchCode,
    title: "پیگیری درخواست‌ها",
    description: "بررسی وضعیت پرونده‌های در حال رسیدگی",
    color: "from-primary/95 to-secondary/85",
    href: "/property-request",
  },
  {
    id: "modern-toll",
    icon: Landmark,
    title: "عوارض نوسازی",
    description: "پرداخت، مشاهده و چاپ قبض عوارض",
    color: "from-secondary/95 to-primary/85",
    href: "/modern-toll",
  },
  {
    id: "guild-fees",
    icon: Store,
    title: "عوارض صنفی",
    description: "مدیریت عوارض واحدهای صنفی",
    color: "from-primary to-secondary/90",
    href: "/guild-fees",
  },
  {
    id: "property-inquiry",
    icon: MapPinOff,
    title: "وضعیت عقب‌نشینی ملک",
    description: "بررسی وضعیت عقب‌نشینی املاک",
    color: "from-secondary to-primary/90",
    href: "/property-inquiry",
  },
];

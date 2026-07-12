import {
  AlignLeft,
  CircleHelp,
  FileText,
  ImagePlus,
  KeyRound,
  Layout,
  // LayoutDashboard,
  Newspaper,
  Send,
  Settings,
  Tags,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

export const mockUsers = [
  {
    id: 1,
    name: "علی محمدی",
    username: "0012345678",
    phone: "09121234567",
    role: "شهروند",
    status: "فعال",
    joined: "1403/01/15",
  },
  {
    id: 2,
    name: "فاطمه رضایی",
    username: "0087654321",
    phone: "09361234567",
    role: "شهروند",
    status: "فعال",
    joined: "1403/02/08",
  },
  {
    id: 3,
    name: "محمد کریمی",
    username: "0045678901",
    phone: "09131234567",
    role: "کارشناس",
    status: "غیرفعال",
    joined: "1402/11/20",
  },
];

export const stats = [
  {
    label: "کل کاربران",
    value: "۱۲,۴۸۳",
    icon: Users,
    trend: "+۱۲٪",
    color: "from-primary to-secondary",
  },
  {
    label: "کاربران فعال",
    value: "۹,۲۱۴",
    icon: UserCheck,
    trend: "+۸٪",
    color: "from-emerald-500 to-teal-600",
  },
  {
    label: "کاربران جدید این ماه",
    value: "۳۴۷",
    icon: TrendingUp,
    trend: "+۲۳٪",
    color: "from-blue-500 to-indigo-600",
  },
  {
    label: "کاربران غیرفعال",
    value: "۱,۸۹۲",
    icon: UserX,
    trend: "-۵٪",
    color: "from-amber-500 to-orange-600",
  },
];

export const recentActivities = [
  {
    text: "کاربر جدید ثبت‌نام کرد",
    time: "۵ دقیقه پیش",
    type: "success",
  },
  {
    text: "پرونده PR-22318 به‌روزرسانی شد",
    time: "۱۵ دقیقه پیش",
    type: "info",
  },
  {
    text: "تیکت #TK-1082 پاسخ داده شد",
    time: "۳۰ دقیقه پیش",
    type: "success",
  },
  {
    text: "کاربر محمد کریمی غیرفعال شد",
    time: "۱ ساعت پیش",
    type: "warning",
  },
];

export const summaryItems = [
  { label: "نرخ فعال‌سازی", value: 73, color: "bg-emerald-500" },
  { label: "تیکت‌های باز", value: 45, color: "bg-primary" },
  { label: "رضایت کاربران", value: 89, color: "bg-blue-500" },
];

export const userStatusStyle = {
  فعال: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  غیرفعال: "bg-muted text-muted-foreground border-border",
  تعلیق: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  کارشناس: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

export const settingsTabs = [
  { id: "content", label: "محتوا و ظاهر", icon: Layout },
  { id: "footer", label: "ارتباطات و فوتر", icon: AlignLeft },
];

export const navItems = [
  // { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
  {
    id: "news-root",
    label: "خبر",
    icon: Newspaper,
    children: [
      {
        id: "news",
        label: "اخبار",
        icon: Newspaper,
      },
      {
        id: "news-groups",
        label: "دسته‌بندی‌های اخبار",
        icon: Tags,
      },
    ],
  },
  { id: "faq", label: "سوالات متداول", icon: CircleHelp },
  { id: "users", label: "مدیریت کاربران", icon: Users },
  {
    id: "settings-root",
    label: "تنظیمات",
    icon: Settings,
    children: [
      {
        id: "settings",
        label: "تنظیمات عمومی",
        icon: Settings,
      },
      {
        id: "site-content",
        label: "محتوای سایت",
        icon: Layout,
      },
      {
        id: "sliders",
        label: "تنظیمات اسلایدر",
        icon: ImagePlus,
      },
      {
        id: "shahkar",
        label: "پنل شاهکار",
        icon: KeyRound,
      },
      {
        id: "sms",
        label: "پنل پیامکی",
        icon: Send,
      },
    ],
  },
  {
    id: "reports-root",
    label: "گزارشات",
    icon: FileText,
    children: [
      {
        id: "shahkar-logs",
        label: "گزارشات شاهکار",
        icon: FileText,
      },
      {
        id: "sms-logs",
        label: "گزارشات پنل پیامکی",
        icon: FileText,
      },
    ],
  },
];

export const initialContentForm = {
  heroTitle: "شهرداری مراغه",
  heroSubtitle: "پرتال جامع خدمات اداری",
  aboutText:
    "شهرداری مراغه با هدف ارائه خدمات شهری به شهروندان گرامی این پرتال را راه‌اندازی نموده است.",
  sliderSpeed: "5000",
  showAnnouncement: true,
  announcementText: "پرداخت عوارض نوسازی با ۳۰ درصد تخفیف تا پایان ماه.",
  primaryColor: "#0d565a",
};

export const initialFooterForm = {
  address: "مراغه، خیابان امام خمینی، ساختمان شهرداری",
  phone: "۰۴۱-۳۷۲۲۰۰۰۰",
  email: "info@maragheh.ir",
  workingHours: "شنبه تا چهارشنبه ۷:۳۰ الی ۱۴:۳۰",
  instagram: "maragheh_mun",
  twitter: "maragheh_city",
  telegram: "maragheh_admin",
  copyrightText:
    "تمامی حقوق مادی و معنوی این سامانه متعلق به شهرداری مراغه می‌باشد.",
};

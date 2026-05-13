import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Building2,
  ShieldCheck,
  Sparkles,
  Edit3,
  Trash2,
  Search,
  Plus,
  X,
  Save,
  FileText,
  AlignLeft,
  ChevronLeft,
  TrendingUp,
  UserCheck,
  UserX,
  Calendar,
  Bell,
  CheckCircle2,
  XCircle,
  Globe,
  Layout,
  Image,
  Link,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Sun,
  Moon,
  Menu,
  Clock,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==================== MOCK DATA ====================
const mockUsers = [
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

const stats = [
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

// ==================== MODALS ====================

// --- ADD USER MODAL ---
function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    role: "شهروند",
    status: "فعال",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.username) return;

    const newUser = {
      ...form,
      id: Date.now(),
      joined: new Date().toLocaleDateString("fa-IR"),
    };

    onAdd(newUser);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-border/70 bg-card p-5 shadow-2xl mx-4"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-foreground">افزودن کاربر جدید</h3>
              <p className="text-xs text-muted-foreground">
                مشخصات کاربر را وارد کنید
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            {
              label: "نام و نام خانوادگی",
              key: "name",
              type: "text",
              placeholder: "مثلاً: رضا عباسی",
            },
            {
              label: "نام کاربری (کد ملی)",
              key: "username",
              type: "text",
              placeholder: "0012345678",
            },
            {
              label: "شماره تماس",
              key: "phone",
              type: "tel",
              placeholder: "09120000000",
            },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                {label}
              </label>
              <input
                required
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                نقش
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              >
                <option>شهروند</option>
                <option>کارشناس</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                وضعیت
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              >
                <option>فعال</option>
                <option>غیرفعال</option>
                <option>تعلیق</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary to-secondary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" />
              ثبت کاربر
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              انصراف
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// --- EDIT USER MODAL ---
function EditUserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-border/70 bg-card p-5 shadow-2xl mx-4"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Edit3 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-foreground">ویرایش کاربر</h3>
              <p className="text-xs text-muted-foreground">{user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { label: "نام و نام خانوادگی", key: "name", type: "text" },
            { label: "نام کاربری", key: "username", type: "text" },
            { label: "شماره تماس", key: "phone", type: "tel" },
          ].map(({ label, key, type }) => (
            <div key={key} className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              وضعیت
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            >
              <option>فعال</option>
              <option>غیرفعال</option>
              <option>تعلیق</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => onSave(form)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary to-secondary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Save className="h-4 w-4" />
            ذخیره تغییرات
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            انصراف
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- DELETE CONFIRM MODAL ---
function DeleteConfirmModal({ user, onClose, onConfirm }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-border/70 bg-card p-6 shadow-2xl text-center mx-4"
      >
        <div className="mb-4 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Trash2 className="h-7 w-7" />
          </span>
        </div>
        <h3 className="font-bold text-foreground mb-1">حذف کاربر</h3>
        <p className="text-sm text-muted-foreground mb-5">
          آیا از حذف <strong className="text-foreground">{user.name}</strong>{" "}
          اطمینان دارید؟ این عمل قابل بازگشت نیست.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98] hover:bg-destructive/90"
          >
            بله، حذف شود
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            انصراف
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== COMPONENTS ====================

function UserCard({ user, statusStyle, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-2xl border border-border/60 bg-card p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-bold text-primary">
            {user.name[0]}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground font-mono" dir="ltr">
              {user.phone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(user)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[user.role] || "bg-muted text-muted-foreground border-border"}`}
        >
          {user.role}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[user.status]}`}
        >
          {user.status === "فعال" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {user.status}
        </span>
        <span className="text-xs text-muted-foreground mr-auto">
          {user.joined}
        </span>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const today = new Date().toLocaleDateString("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const recentActivities = [
    { text: "کاربر جدید ثبت‌نام کرد", time: "۵ دقیقه پیش", type: "success" },
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

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            داشبورد مدیریت
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{today}</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary self-start sm:self-auto w-fit">
          <Sparkles className="h-3 w-3" />
          نسخه جدید فعال است
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
              >
                <stat.icon className="h-4 w-4" />
              </span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${stat.trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
              >
                {stat.trend}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground mb-0.5">
              {stat.value}
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-tight">
              {stat.label}
            </p>
            <div
              className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-l ${stat.color} opacity-60`}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-primary" />
            فعالیت‌های اخیر
          </h3>
          <div className="space-y-2">
            {recentActivities.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/50 transition-colors"
              >
                <span
                  className={`flex h-2 w-2 shrink-0 rounded-full ${item.type === "success" ? "bg-emerald-500" : item.type === "warning" ? "bg-amber-500" : "bg-blue-500"}`}
                />
                <p className="text-sm text-foreground flex-1 leading-relaxed">
                  {item.text}
                </p>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            خلاصه وضعیت
          </h3>
          <div className="space-y-4">
            {[
              { label: "نرخ فعال‌سازی", value: 73, color: "bg-emerald-500" },
              { label: "تیکت‌های باز", value: 45, color: "bg-primary" },
              { label: "رضایت کاربران", value: 89, color: "bg-blue-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-bold text-foreground">
                    {item.value}٪
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const filtered = users.filter(
    (u) =>
      u.name.includes(search) ||
      u.username.includes(search) ||
      u.phone.includes(search),
  );

  const handleAdd = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
    setShowAddModal(false);
  };

  const handleSave = (updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditUser(null);
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const statusStyle = {
    فعال: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    غیرفعال: "bg-muted text-muted-foreground border-border",
    تعلیق: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    کارشناس: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            مدیریت کاربران
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {users.length} کاربر در سیستم
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] self-start sm:self-auto w-fit"
        >
          <Plus className="h-4 w-4" />
          افزودن کاربر
        </button>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو بر اساس نام، کد ملی یا شماره..."
          className="w-full rounded-xl border border-border/70 bg-card pr-10 pl-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      <div className="hidden md:block rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 bg-muted/40">
                {[
                  "نام کاربر",
                  "نام کاربری",
                  "شماره تماس",
                  "نقش",
                  "وضعیت",
                  "تاریخ ثبت‌نام",
                  "عملیات",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-bold text-primary">
                          {user.name[0]}
                        </div>
                        <span className="font-medium text-foreground whitespace-nowrap">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-muted-foreground font-mono text-xs"
                      dir="ltr"
                    >
                      {user.username}
                    </td>
                    <td
                      className="px-4 py-3 text-muted-foreground font-mono text-xs"
                      dir="ltr"
                    >
                      {user.phone}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[user.role] || "bg-muted text-muted-foreground border-border"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[user.status]}`}
                      >
                        {user.status === "فعال" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {user.joined}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditUser(user)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteUser(user)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        <AnimatePresence>
          {filtered.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              statusStyle={statusStyle}
              onEdit={setEditUser}
              onDelete={setDeleteUser}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAdd}
          />
        )}
        {editUser && (
          <EditUserModal
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={handleSave}
          />
        )}
        {deleteUser && (
          <DeleteConfirmModal
            user={deleteUser}
            onClose={() => setDeleteUser(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("content");
  const [contentForm, setContentForm] = useState({
    heroTitle: "شهرداری مراغه",
    heroSubtitle: "پرتال جامع خدمات اداری",
    aboutText:
      "شهرداری مراغه با هدف ارائه خدمات شهری به شهروندان گرامی این پرتال را راه‌اندازی نموده است.",
    sliderSpeed: "5000",
    showAnnouncement: true,
    announcementText: "پرداخت عوارض نوسازی با ۳۰ درصد تخفیف تا پایان ماه.",
    primaryColor: "#0d565a",
  });

  const [footerForm, setFooterForm] = useState({
    address: "مراغه، خیابان امام خمینی، ساختمان شهرداری",
    phone: "۰۴۱-۳۷۲۲۰۰۰۰",
    email: "info@maragheh.ir",
    workingHours: "شنبه تا چهارشنبه ۷:۳۰ الی ۱۴:۳۰",
    instagram: "maragheh_mun",
    twitter: "maragheh_city",
    telegram: "maragheh_admin",
    copyrightText:
      "تمامی حقوق مادی و معنوی این سامانه متعلق به شهرداری مراغه می‌باشد.",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: "content", label: "محتوا و ظاهر", icon: Layout },
    { id: "footer", label: "ارتباطات و فوتر", icon: AlignLeft },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          تنظیمات
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          مدیریت محتوا و ظاهر پرتال
        </p>
      </div>

      <div className="flex gap-2 rounded-2xl border border-border/70 bg-card p-1.5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="settings-tab"
                className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-secondary shadow-lg shadow-primary/20"
              />
            )}
            <tab.icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "content" ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6 space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" /> عنوان اصلی هیرو
                </label>
                <input
                  value={contentForm.heroTitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      heroTitle: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" /> زیرعنوان هیرو
                </label>
                <input
                  value={contentForm.heroSubtitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      heroSubtitle: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" /> سرعت اسلایدر (میلی‌ثانیه)
                </label>
                <input
                  type="number"
                  value={contentForm.sliderSpeed}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sliderSpeed: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" /> رنگ سازمانی اصلی
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={contentForm.primaryColor}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        primaryColor: e.target.value,
                      })
                    }
                    className="h-10 w-16 rounded-lg border border-border bg-background p-1"
                  />
                  <input
                    value={contentForm.primaryColor}
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        primaryColor: e.target.value,
                      })
                    }
                    className="flex-1 rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                متن درباره ما (معرفی کوتاه)
              </label>
              <textarea
                rows={3}
                value={contentForm.aboutText}
                onChange={(e) =>
                  setContentForm({ ...contentForm, aboutText: e.target.value })
                }
                className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold">نوار اطلاعیه سایت</span>
                </div>
                <button
                  onClick={() =>
                    setContentForm({
                      ...contentForm,
                      showAnnouncement: !contentForm.showAnnouncement,
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-colors relative ${contentForm.showAnnouncement ? "bg-primary" : "bg-muted"}`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${contentForm.showAnnouncement ? "right-6" : "right-1"}`}
                  />
                </button>
              </div>
              {contentForm.showAnnouncement && (
                <input
                  value={contentForm.announcementText}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      announcementText: e.target.value,
                    })
                  }
                  placeholder="متن اطلاعیه را وارد کنید..."
                  className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="footer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-border/70 bg-card p-4 sm:p-6 space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> آدرس دقیق ساختمان
                </label>
                <input
                  value={footerForm.address}
                  onChange={(e) =>
                    setFooterForm({ ...footerForm, address: e.target.value })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> ساعات پاسخگویی
                </label>
                <input
                  value={footerForm.workingHours}
                  onChange={(e) =>
                    setFooterForm({
                      ...footerForm,
                      workingHours: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> شماره تماس مستقیم
                </label>
                <input
                  dir="ltr"
                  value={footerForm.phone}
                  onChange={(e) =>
                    setFooterForm({ ...footerForm, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> پست الکترونیک
                </label>
                <input
                  dir="ltr"
                  value={footerForm.email}
                  onChange={(e) =>
                    setFooterForm({ ...footerForm, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all font-mono"
                />
              </div>
            </div>

            <div className="border-t border-border/50 pt-5 space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Link className="h-4 w-4 text-primary" /> شبکه‌های اجتماعی
              </h4>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/20 p-2">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  <input
                    value={footerForm.instagram}
                    onChange={(e) =>
                      setFooterForm({
                        ...footerForm,
                        instagram: e.target.value,
                      })
                    }
                    placeholder="Instagram ID"
                    className="bg-transparent border-none text-xs outline-none w-full"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/20 p-2">
                  <Twitter className="h-4 w-4 text-blue-400" />
                  <input
                    value={footerForm.twitter}
                    onChange={(e) =>
                      setFooterForm({ ...footerForm, twitter: e.target.value })
                    }
                    placeholder="Twitter (X) ID"
                    className="bg-transparent border-none text-xs outline-none w-full"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/20 p-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <input
                    value={footerForm.telegram}
                    onChange={(e) =>
                      setFooterForm({ ...footerForm, telegram: e.target.value })
                    }
                    placeholder="Telegram ID"
                    className="bg-transparent border-none text-xs outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-medium text-muted-foreground">
                متن کپی‌رایت (انتهای صفحه)
              </label>
              <input
                value={footerForm.copyrightText}
                onChange={(e) =>
                  setFooterForm({
                    ...footerForm,
                    copyrightText: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          <Save className="h-4 w-4" /> ذخیره تغییرات
        </button>
        {saved && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium text-emerald-600"
          >
            تغییرات با موفقیت ذخیره شد
          </motion.span>
        )}
      </div>
    </div>
  );
}

// ==================== SIDEBAR ====================
const navItems = [
  { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
  { id: "users", label: "مدیریت کاربران", icon: Users },
  { id: "settings", label: "تنظیمات", icon: Settings },
];

// ==================== MAIN ADMIN PANEL ====================
export default function AdminPanel({ isDark, toggleTheme }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pageComponents = {
    dashboard: <Dashboard />,
    users: <UserManagement />,
    settings: <SettingsPage />,
  };

  const cssVars = isDark
    ? {
        "--background": "#0b1312",
        "--foreground": "#e8f4f3",
        "--card": "#111e1d",
        "--border": "rgba(13,150,140,0.15)",
        "--muted": "#1a2827",
        "--muted-foreground": "#6b9090",
        "--primary": "#0d9f9a",
        "--primary-foreground": "#ffffff",
        "--secondary": "#0b8080",
        "--destructive": "#ef4444",
      }
    : {
        "--background": "#f8fafc",
        "--foreground": "#0f1c1b",
        "--card": "#ffffff",
        "--border": "rgba(13,86,90,0.12)",
        "--muted": "#f1f5f4",
        "--muted-foreground": "#6b8080",
        "--primary": "#0d565a",
        "--primary-foreground": "#ffffff",
        "--secondary": "#0b6968",
        "--destructive": "#dc2626",
      };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen font-sans"
      style={{
        ...cssVars,
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; }
      `}</style>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 250 : 80 }}
        className={`fixed md:sticky top-0 right-0 z-50 h-screen flex flex-col border-l bg-card transition-all ${mobileSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="flex h-16 items-center gap-3 border-b px-4 shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
            <Building2 className="h-5 w-5" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-bold text-sm">پنل مدیریت</p>
              <p className="text-[10px] text-muted-foreground">شهرداری مراغه</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${activePage === item.id ? "text-white" : "text-muted-foreground hover:bg-muted"}`}
            >
              {activePage === item.id && (
                <motion.span
                  layoutId="active-bg"
                  className="absolute inset-0 rounded-xl bg-gradient-to-l from-primary to-secondary shadow-lg shadow-primary/20"
                />
              )}
              <item.icon className="relative z-10 h-5 w-5 shrink-0" />
              {sidebarOpen && (
                <span className="relative z-10">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* LOGOUT BUTTON - FIXED AT BOTTOM */}
        <div
          className="p-3 border-t mt-auto shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>خروج از پنل</span>}
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6 bg-card"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted"
            >
              <ChevronLeft
                className={`h-4 w-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
              />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-border"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-bold">
              {navItems.find((n) => n.id === activePage)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-md cursor-pointer">
              م
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {pageComponents[activePage]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

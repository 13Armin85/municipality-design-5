import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  Clock,
  FileText,
  Globe,
  Instagram,
  Link,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Save,
  Sparkles,
  Twitter,
} from "lucide-react";
import {
  initialContentForm,
  initialFooterForm,
  settingsTabs,
} from "./adminData";

function ContentSettingsForm({ contentForm, setContentForm }) {
  return (
    <motion.div
      key="content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6 rounded-2xl border border-border/70 bg-card p-4 sm:p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <FileText className="h-3.5 w-3.5" /> عنوان اصلی هیرو
          </label>
          <input
            value={contentForm.heroTitle}
            onChange={(event) =>
              setContentForm({ ...contentForm, heroTitle: event.target.value })
            }
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> زیرعنوان هیرو
          </label>
          <input
            value={contentForm.heroSubtitle}
            onChange={(event) =>
              setContentForm({
                ...contentForm,
                heroSubtitle: event.target.value,
              })
            }
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> سرعت اسلایدر (میلی‌ثانیه)
          </label>
          <input
            type="number"
            value={contentForm.sliderSpeed}
            onChange={(event) =>
              setContentForm({
                ...contentForm,
                sliderSpeed: event.target.value,
              })
            }
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Globe className="h-3.5 w-3.5" /> رنگ سازمانی اصلی
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={contentForm.primaryColor}
              onChange={(event) =>
                setContentForm({
                  ...contentForm,
                  primaryColor: event.target.value,
                })
              }
              className="h-10 w-16 rounded-lg border border-border bg-background p-1"
            />
            <input
              value={contentForm.primaryColor}
              onChange={(event) =>
                setContentForm({
                  ...contentForm,
                  primaryColor: event.target.value,
                })
              }
              className="flex-1 rounded-xl border border-border/70 bg-background px-3 py-2.5 font-mono text-sm outline-none transition-all focus:border-primary"
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
          onChange={(event) =>
            setContentForm({ ...contentForm, aboutText: event.target.value })
          }
          className="w-full resize-none rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary"
        />
      </div>

      <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
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
            className={`relative h-5 w-10 rounded-full transition-colors ${contentForm.showAnnouncement ? "bg-primary" : "bg-muted"}`}
          >
            <div
              className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${contentForm.showAnnouncement ? "right-6" : "right-1"}`}
            />
          </button>
        </div>

        {contentForm.showAnnouncement && (
          <input
            value={contentForm.announcementText}
            onChange={(event) =>
              setContentForm({
                ...contentForm,
                announcementText: event.target.value,
              })
            }
            placeholder="متن اطلاعیه را وارد کنید..."
            className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        )}
      </div>
    </motion.div>
  );
}

function FooterSettingsForm({ footerForm, setFooterForm }) {
  return (
    <motion.div
      key="footer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-6 rounded-2xl border border-border/70 bg-card p-4 sm:p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> آدرس دقیق ساختمان
          </label>
          <input
            value={footerForm.address}
            onChange={(event) =>
              setFooterForm({ ...footerForm, address: event.target.value })
            }
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> ساعات پاسخگویی
          </label>
          <input
            value={footerForm.workingHours}
            onChange={(event) =>
              setFooterForm({
                ...footerForm,
                workingHours: event.target.value,
              })
            }
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Phone className="h-3.5 w-3.5" /> شماره تماس مستقیم
          </label>
          <input
            dir="ltr"
            value={footerForm.phone}
            onChange={(event) =>
              setFooterForm({ ...footerForm, phone: event.target.value })
            }
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 font-mono text-sm outline-none transition-all focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Mail className="h-3.5 w-3.5" /> پست الکترونیک
          </label>
          <input
            dir="ltr"
            value={footerForm.email}
            onChange={(event) =>
              setFooterForm({ ...footerForm, email: event.target.value })
            }
            className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 font-mono text-sm outline-none transition-all focus:border-primary"
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-border/50 pt-5">
        <h4 className="flex items-center gap-2 text-sm font-bold">
          <Link className="h-4 w-4 text-primary" /> شبکه‌های اجتماعی
        </h4>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              key: "instagram",
              icon: Instagram,
              className: "text-pink-600",
              placeholder: "Instagram ID",
            },
            {
              key: "twitter",
              icon: Twitter,
              className: "text-blue-400",
              placeholder: "Twitter (X) ID",
            },
            {
              key: "telegram",
              icon: MessageSquare,
              className: "text-blue-500",
              placeholder: "Telegram ID",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/20 p-2"
            >
              <item.icon className={`h-4 w-4 ${item.className}`} />
              <input
                value={footerForm[item.key]}
                onChange={(event) =>
                  setFooterForm({
                    ...footerForm,
                    [item.key]: event.target.value,
                  })
                }
                placeholder={item.placeholder}
                className="w-full border-none bg-transparent text-xs outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 pt-2">
        <label className="text-xs font-medium text-muted-foreground">
          متن کپی‌رایت (انتهای صفحه)
        </label>
        <input
          value={footerForm.copyrightText}
          onChange={(event) =>
            setFooterForm({
              ...footerForm,
              copyrightText: event.target.value,
            })
          }
          className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-all focus:border-primary"
        />
      </div>
    </motion.div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("content");
  const [contentForm, setContentForm] = useState(initialContentForm);
  const [footerForm, setFooterForm] = useState(initialFooterForm);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground sm:text-xl">
          تنظیمات عمومی
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          مدیریت محتوا و ظاهر پرتال
        </p>
      </div>

      <div className="flex w-fit gap-2 rounded-2xl border border-border/70 bg-card p-1.5">
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all sm:px-4 ${activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
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
          <ContentSettingsForm
            contentForm={contentForm}
            setContentForm={setContentForm}
          />
        ) : (
          <FooterSettingsForm
            footerForm={footerForm}
            setFooterForm={setFooterForm}
          />
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

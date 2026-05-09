import { motion } from 'motion/react';
import { LifeBuoy, MessageCircleMore, Plus, TicketCheck, SendHorizonal } from 'lucide-react';

const tickets = [
  { id: '#TK-1082', title: 'مشکل در مشاهده جزئیات ملک', date: '1405/02/16', status: 'در حال بررسی' },
  { id: '#TK-1074', title: 'درخواست اصلاح اطلاعات هویتی', date: '1405/02/14', status: 'پاسخ داده شده' },
  { id: '#TK-1061', title: 'خطا در مرحله پرداخت', date: '1405/02/10', status: 'بسته شده' },
];

function statusStyle(status: string) {
  if (status === 'در حال بررسی') return 'bg-[var(--primary-soft)] text-primary';
  if (status === 'پاسخ داده شده') return 'bg-muted text-foreground';
  return 'bg-muted text-muted-foreground';
}

export function SupportSection() {
  return (
    <section id="support" className="py-12 md:py-20 bg-muted/30 section-decor">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="section-chip mb-3">مرکز پاسخگویی</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground mb-3 md:mb-4">پشتیبانی و ثبت تیکت</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            برای هرگونه خطا، درخواست یا ابهام، تیکت ثبت کنید تا کارشناسان پشتیبانی سریع پیگیری کنند
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="xl:col-span-3 soft-card mesh-panel p-5 md:p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-primary flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-foreground">ثبت تیکت جدید</h3>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ticket-subject" className="block text-sm text-foreground mb-2">موضوع</label>
                  <input
                    id="ticket-subject"
                    type="text"
                    placeholder="مثال: مشکل در پرداخت"
                    className="w-full h-11 rounded-xl border border-border bg-input-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label htmlFor="ticket-service" className="block text-sm text-foreground mb-2">بخش مرتبط</label>
                  <select
                    id="ticket-service"
                    className="w-full h-11 rounded-xl border border-border bg-input-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option>خدمات املاک</option>
                    <option>پرداخت عوارض</option>
                    <option>پروفایل کاربر</option>
                    <option>سایر موارد</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="ticket-message" className="block text-sm text-foreground mb-2">توضیحات</label>
                <textarea
                  id="ticket-message"
                  rows={5}
                  placeholder="شرح مشکل یا درخواست خود را بنویسید..."
                  className="w-full rounded-xl border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  className="btn-gradient h-11 px-5 rounded-xl text-primary-foreground text-sm font-semibold shadow-lg transition-all inline-flex items-center justify-center gap-2"
                >
                  ثبت تیکت
                  <SendHorizonal className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="h-11 px-5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-[var(--primary-soft)] transition-colors"
                >
                  پیش‌نویس
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="xl:col-span-2 soft-card p-5 md:p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-primary flex items-center justify-center">
                <TicketCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-foreground">تیکت‌های اخیر</h3>
            </div>

            <div className="space-y-3 mb-5">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-border bg-background p-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">{ticket.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-lg ${statusStyle(ticket.status)}`}>{ticket.status}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">{ticket.date}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
              <div className="rounded-xl bg-[var(--primary-soft)] p-3 flex items-center gap-3">
                <LifeBuoy className="w-4 h-4 text-primary" />
                <span className="text-xs md:text-sm text-foreground">پشتیبانی تلفنی: 137</span>
              </div>
              <div className="rounded-xl bg-muted p-3 flex items-center gap-3">
                <MessageCircleMore className="w-4 h-4 text-foreground" />
                <span className="text-xs md:text-sm text-foreground">چت آنلاین: 8 تا 16</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

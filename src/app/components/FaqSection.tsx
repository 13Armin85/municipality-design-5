import { motion } from 'motion/react';
import { ArrowUpLeft, CircleHelp, FileText, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const faqItems = [
  {
    id: 'faq-1',
    question: 'چطور درخواست جدید ثبت کنم؟',
    answer:
      'از بخش «خدمات شهری» گزینه «ثبت درخواست» را انتخاب کنید. پس از تکمیل فرم، یک کد پیگیری برای شما ثبت می‌شود و می‌توانید وضعیت رسیدگی را در داشبورد مشاهده کنید.',
  },
  {
    id: 'faq-2',
    question: 'پیگیری پرونده از چه طریقی انجام می‌شود؟',
    answer:
      'در بخش «فعالیت‌ها» آخرین وضعیت پرونده‌ها نمایش داده می‌شود. همچنین تغییرات مهم از طریق اعلان داخل پنل کاربری برای شما ارسال خواهد شد.',
  },
  {
    id: 'faq-3',
    question: 'اگر پرداخت ناموفق باشد چه کنم؟',
    answer:
      'ابتدا سوابق پرداخت را بررسی کنید. اگر مبلغ کسر شده ولی وضعیت ناموفق بود، یک تیکت پشتیبانی با شماره تراکنش ثبت کنید تا کارشناسان مالی بررسی و نتیجه را اعلام کنند.',
  },
  {
    id: 'faq-4',
    question: 'چگونه اطلاعات هویتی یا ملک را اصلاح کنم؟',
    answer:
      'از طریق بخش «پشتیبانی و ثبت تیکت» موضوع «اصلاح اطلاعات» را انتخاب و مدارک لازم را بارگذاری کنید. درخواست شما پس از بررسی، در همان پنل قابل پیگیری است.',
  },
  {
    id: 'faq-5',
    question: 'ساعات پاسخ‌گویی پشتیبانی چه زمانی است؟',
    answer:
      'پشتیبانی آنلاین در ساعات اداری فعال است و برای موارد فوری می‌توانید با سامانه 137 تماس بگیرید. پاسخ هر تیکت هم در اولین چرخه کاری ثبت می‌شود.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="bg-background py-12 section-decor md:py-20">
      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center md:mb-14"
        >
          <span className="section-chip mb-3">راهنمای خدمات</span>
          <h2 className="mb-3 text-2xl font-black text-foreground md:mb-4 md:text-3xl lg:text-4xl">سوالات متداول</h2>
          <p className="mx-auto max-w-2xl px-4 text-sm text-muted-foreground md:text-base">
            پاسخ رایج‌ترین سوالات شهروندان برای ثبت درخواست، پیگیری پرونده و استفاده از خدمات الکترونیک
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel h-fit p-5 md:p-6 lg:col-span-2"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-primary">
                <CircleHelp className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-foreground md:text-lg">نیاز به راهنمایی بیشتر دارید؟</h3>
            </div>
            <p className="mb-4 text-sm leading-7 text-muted-foreground md:text-base">
              اگر پاسخ سوال خود را در این بخش پیدا نکردید، از طریق مرکز پشتیبانی تیکت ثبت کنید تا کارشناسان
              راهنمایی تخصصی ارائه دهند.
            </p>
            <div className="rounded-xl bg-[var(--primary-soft)] p-3 text-sm text-foreground">
              <div className="mb-1 flex items-center gap-2 font-semibold text-primary">
                <LifeBuoy className="h-4 w-4" />
                <span>پشتیبانی شهرداری</span>
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">
                پاسخ‌گویی تلفنی: 137 | پیگیری آنلاین از داخل پنل کاربری
              </p>
            </div>
            <Link
              to="/about"
              className="btn-gradient mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white md:text-base"
            >
              <FileText className="h-4 w-4 md:h-5 md:w-5" />
              مشاهده راهنمای کامل 
              <ArrowUpLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card p-4 md:p-6 lg:col-span-3"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-border/70">
                  <AccordionTrigger className="py-4 text-right text-sm font-semibold text-foreground hover:no-underline data-[state=open]:text-primary md:text-base">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-7 text-muted-foreground md:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

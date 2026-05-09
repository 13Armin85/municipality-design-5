import { Building2, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    services: ['ثبت درخواست', 'پیگیری درخواست', 'عوارض نوسازی', 'استعلام ملک'],
    support: ['راهنما', 'سوالات متداول', 'پشتیبانی', 'تماس با ما'],
    legal: ['قوانین و مقررات', 'حریم خصوصی', 'شرایط استفاده', 'درباره ما'],
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary text-primary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(255,255,255,0.2),transparent_34%)]" />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/14 border border-white/24">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">شهرداری مراغه</h3>
                <p className="text-sm text-white/80">پرتال خدمات شهری</p>
              </div>
            </div>

            <p className="text-sm text-white/90 leading-relaxed mb-6">
              ارائه خدمات الکترونیک شهری با هدف تسهیل دسترسی شهروندان و ارتقای کیفیت خدمات اداری
            </p>

            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/12 hover:bg-white/20 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/12 hover:bg-white/20 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/12 hover:bg-white/20 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 md:mb-6">خدمات</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/85 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 md:mb-6">پشتیبانی</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/85 hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 md:mb-6">ارتباط با ما</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/90">137 - 09140077804</p>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/90">info@maragheh.ir</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/90">مراغه، بلوار شهید بهشتی</p>
                  <p className="text-sm text-white/70 mt-1">کدپستی: 918377804</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/80 text-center md:text-right">
              © 1405 شهرداری مراغه. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/80">
              {footerLinks.legal.map((item) => (
                <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

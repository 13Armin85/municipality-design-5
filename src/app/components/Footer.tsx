import { Building2, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    services: [
      'ثبت درخواست',
      'پیگیری درخواست',
      'عوارض نوسازی',
      'نقشه املاک',
    ],
    support: [
      'راهنما',
      'سوالات متداول',
      'پشتیبانی',
      'تماس با ما',
    ],
    legal: [
      'قوانین و مقررات',
      'حریم خصوصی',
      'شرایط استفاده',
      'درباره ما',
    ],
  };

  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">شهرداری مراغه</h3>
                <p className="text-sm text-white/70">پورتال خدمات شهری</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              ارائه خدمات الکترونیک شهری با هدف تسهیل در دسترسی شهروندان و بهبود کیفیت زندگی شهری
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 md:mb-6">خدمات</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 md:mb-6">پشتیبانی</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 md:mb-6">ارتباط با ما</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80">۱۳۷ - ۰۹۱۴۰۰۷۷۸۰۴</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80">info@maragheh.ir</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80">مراغه، بلوار شهید بهشتی</p>
                  <p className="text-sm text-white/60 mt-1">کدپستی: ۹۱۸۳۷۷۸۰۴</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/70 text-center md:text-right">
              © ۱۴۰۳ شهرداری مراغه. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/70">
              <a href="#" className="hover:text-white transition-colors">
                حریم خصوصی
              </a>
              <a href="#" className="hover:text-white transition-colors">
                شرایط استفاده
              </a>
              <a href="#" className="hover:text-white transition-colors">
                نقشه سایت
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

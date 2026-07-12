import { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Mail,
  Mailbox,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router";
import { serviceItems } from "../data/services";
import {
  emptySiteInformation,
  fetchFooterInformation,
  resolveInformationImageSrc,
  type SiteInformation,
} from "../data/siteInformation";

const fallbackLogoSrc = "/images/Amard Logo 01.JPG";
const fallbackEnamadLogoSrc = "/images/enamad-logo.svg";

const fallbackFooterInformation: SiteInformation = {
  ...emptySiteInformation,
  title: "شرکت تحلیلگران آمارد",
  tel: "011-43270941-3",
  email: "info@amardco.com",
  address: "مازندران، آمل، بلوار آزادگان، نبش آزادگان 12، ساختمان آمارد",
  postalCode: "4613673420",
  description:
    "شرکت نرم افزاری تحلیلگران آمارد با هدف فعالیت در زمینه طراحی و تولید نرم افزار بنیان گذاشته شد و طراحی و تولید نرم افزارهای کاربردی را به عنوان فعالیت اصلی خود دنبال نموده است.",
};

export function Footer() {
  const [information, setInformation] = useState<SiteInformation>(
    fallbackFooterInformation,
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchFooterInformation(controller.signal)
      .then((data) => {
        setInformation({
          ...fallbackFooterInformation,
          ...data,
          title: data.title || fallbackFooterInformation.title,
          logo: data.logo ?? null,
        });
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  const footerLinks = {
    support: [
      { label: "راهنما", href: "/guide" },
      { label: "سوالات متداول", href: "/faq" },
      { label: "پشتیبانی", href: "/support" },
      { label: "تماس با ما", href: "/contact" },
    ],
    legal: ["قوانین و مقررات", "حریم خصوصی", "شرایط استفاده", "درباره ما"],
  };

  const logoSrc = resolveInformationImageSrc(information.logo, fallbackLogoSrc);
  const enamadSrc = resolveInformationImageSrc(
    information.enamad,
    fallbackEnamadLogoSrc,
  );

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#0d1f24] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(67,150,182,0.18),transparent_36%)]" />
      <div className="container relative z-10 mx-auto px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden p-2">
                <img
                  src={logoSrc}
                  alt={information.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="text-base font-bold leading-7">
                {information.title}
              </h3>
            </div>
            <p className="mb-6 text-sm leading-7 text-white/90">
              {information.description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/12 transition-colors hover:bg-white/20"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/12 transition-colors hover:bg-white/20"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/12 transition-colors hover:bg-white/20"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-bold md:mb-6">خدمات</h4>
            <ul className="space-y-3">
              {serviceItems.map((service) => (
                <li key={service.title}>
                  <Link
                    to={service.href}
                    className="text-sm text-white/85 transition-colors hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold md:mb-6">پشتیبانی</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold md:mb-6">ارتباط با ما</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm text-white/90" dir="ltr">
                  {information.tel}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm text-white/90">{information.email}</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm leading-7 text-white/90">
                    {information.address}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mailbox className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm text-white/90" dir="ltr">
                  {information.postalCode}
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/16 pt-8">
          <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
            <div className="flex w-full flex-col items-center gap-4 md:w-auto md:items-start">
              {(information.enamad || fallbackEnamadLogoSrc) && (
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-white/24 bg-white p-3 shadow-xl shadow-black/15 md:h-36 md:w-36">
                  <img
                    src={enamadSrc}
                    alt="نماد اعتماد الکترونیکی"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col items-center gap-4 md:items-end">
              <p className="text-center text-sm text-white/80 md:text-right">
                © 1405 {information.title}. تمامی حقوق محفوظ است.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80 md:justify-end">
                {footerLinks.legal.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="transition-colors hover:text-white"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

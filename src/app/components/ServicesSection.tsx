import { motion } from "framer-motion"; // یا 'motion/react' بسته به نسخه نصب شده شما
import { Link } from "react-router";
import { ArrowUpLeft } from "lucide-react";
import { serviceItems } from "../data/services";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="section-decor bg-background py-12 md:py-20"
    >
      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center md:mb-16"
        >
          <span className="section-chip mb-3">دسترسی سریع</span>
          <h2 className="mb-3 text-2xl font-black text-foreground md:mb-4 md:text-3xl lg:text-4xl">
            خدمات شهری
          </h2>
          <p className="mx-auto max-w-2xl px-4 text-sm text-muted-foreground md:text-base">
            تمامی خدمات الکترونیک اداری در یک نمای متمرکز، ساده و استاندارد
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {serviceItems.map((service, index) => {
            const serviceBody = (
              <div className="soft-card soft-card-hover mesh-panel relative h-full overflow-hidden p-5 md:p-6">
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l ${service.color}`}
                />
                <div className="absolute -bottom-14 -left-14 h-28 w-28 rounded-full bg-[var(--primary-soft)] blur-2xl transition-transform duration-500 group-hover:scale-150" />

                <div className="relative z-10">
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg md:h-16 md:w-16 ${service.color}`}
                  >
                    <service.icon className="h-7 w-7 text-white md:h-8 md:w-8" />
                  </div>

                  <h3 className="mb-2 text-base font-bold text-foreground md:text-lg">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-xs leading-relaxed text-muted-foreground md:text-sm">
                    {service.description}
                  </p>

                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary md:text-sm">
                    ورود به خدمت
                    <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            );

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group"
              >
                {service.href ? (
                  <Link to={service.href} className="block h-full">
                    {serviceBody}
                  </Link>
                ) : (
                  serviceBody
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

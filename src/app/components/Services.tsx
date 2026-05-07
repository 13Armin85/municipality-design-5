import {
  Home,
  FileText,
  Building2,
  ShoppingCart,
  MapPin,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";

interface ServicesProps {
  isDark: boolean;
}

const services = [
  {
    icon: Home,
    title: "املاک من",
    desc: "مشاهده و مدیریت اطلاعات املاک ثبت‌شده",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "ثبت درخواست",
    desc: "ارسال درخواست‌ها و پیگیری وضعیت آنها",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Building2,
    title: "پیگیری درخواست‌ها",
    desc: "مشاهده وضعیت و تاریخچه درخواست‌های ثبت‌شده",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: ShoppingCart,
    title: "عوارض نوسازی",
    desc: "پرداخت و استعلام عوارض نوسازی",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: ShoppingCart,
    title: "عوارض صنفی",
    desc: "مدیریت و پرداخت عوارض صنفی",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: MapPin,
    title: "وضعیت عقب نشینی ملک",
    desc: "استعلام وضعیت عقب نشینی و خط ساختمانی",
    color: "from-cyan-500 to-blue-500",
  },
];

export function Services({ isDark }: ServicesProps) {
  return (
    <section className={`py-20 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`text-3xl md:text-4xl mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            خدمات شهروندی
          </h2>
          <p
            className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            دسترسی سریع به تمامی خدمات شهری در یک پلتفرم
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group relative rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                isDark
                  ? "bg-slate-800 border border-slate-700 hover:border-slate-600 hover:shadow-2xl "
                  : "bg-white border border-gray-200 hover:border-blue-200 hover:shadow-2xl "
              }`}
            >
              {/* Gradient Glow Effect */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${service.color} blur-xl -z-10`}
                style={{ filter: "blur(20px)" }}
              />

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${service.color} shadow-lg`}
              >
                <service.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3
                className={`text-xl mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {service.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {service.desc}
              </p>

              {/* Arrow indicator */}
              <div
                className={`mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-blue-400" : "text-blue-600"}`}
              >
                <span className="text-sm">مشاهده جزئیات</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

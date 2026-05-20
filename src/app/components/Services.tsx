import { ArrowUpLeft } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { serviceItems } from "../data/services";

interface ServicesProps {
  isDark: boolean;
}

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
          {serviceItems.map((service, index) => (
            <motion.div
              key={service.id}
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
                {service.description}
              </p>

              {/* Arrow indicator */}
              <div
                className={`mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-blue-400" : "text-blue-600"}`}
              >
                <Link to={service.href} className="inline-flex items-center gap-2">
                  <span className="text-sm">مشاهده جزئیات</span>
                  <ArrowUpLeft className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

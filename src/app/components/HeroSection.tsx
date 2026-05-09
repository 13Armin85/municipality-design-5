import { motion } from 'motion/react';
import { ArrowLeft, Search, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section
      id="home"
      className="hero-surface hero-grid relative min-h-[calc(100vh-4rem)] overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.18),transparent_34%),radial-gradient(circle_at_84%_82%,rgba(255,255,255,0.1),transparent_30%)]" />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 -right-20 h-64 w-64 rounded-full bg-white/12 blur-3xl"
      />

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-xs text-white md:text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              درگاه یکپارچه خدمات الکترونیک شهرداری
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mb-5 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            خدمات شهری مراغه
            <span className="block bg-gradient-to-l from-white to-white/75 bg-clip-text text-transparent">
              سریع، امن و شفاف
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg"
          >
            ثبت درخواست، پیگیری پرونده، استعلام ملک و پرداخت عوارض را در یک تجربه اداری ساده و استاندارد انجام دهید.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gradient inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white md:px-8 md:py-4 md:text-base"
            >
              ورود به خدمات
              <ArrowLeft className="h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md md:px-8 md:py-4 md:text-base"
            >
              استعلام سریع ملک
              <Search className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent md:h-24" />
    </section>
  );
}
import { motion } from 'motion/react';
import { Map, MapPin, Search, Layers } from 'lucide-react';
import { useState } from 'react';

export function MapSection() {
  const [activeLayer, setActiveLayer] = useState('all');

  const layers = [
    { id: 'all', label: 'همه املاک', count: '۱۲,۳۴۵' },
    { id: 'residential', label: 'مسکونی', count: '۸,۲۳۴' },
    { id: 'commercial', label: 'تجاری', count: '۲,۴۵۶' },
    { id: 'industrial', label: 'صنعتی', count: '۱,۶۵۵' },
  ];

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">نقشه زمین‌های مردم</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            مشاهده و استعلام آنلاین موقعیت و اطلاعات املاک شهری
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-4"
            >
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">لایه‌های نقشه</h3>
                </div>

                <div className="space-y-2">
                  {layers.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`w-full text-right px-4 py-3 rounded-xl transition-all ${
                        activeLayer === layer.id
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-muted hover:bg-muted/70 text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{layer.label}</span>
                        <span className="text-xs opacity-75">{layer.count}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="جستجوی ملک..."
                      className="w-full pr-10 pl-4 py-3 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="relative bg-card rounded-2xl overflow-hidden border border-border shadow-xl aspect-[16/10] md:aspect-[16/9]">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Map className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-2">نقشه تعاملی املاک</p>
                    <p className="text-xs md:text-sm text-muted-foreground/70">برای مشاهده جزئیات روی املاک کلیک کنید</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 md:py-3 bg-white/90 backdrop-blur-sm text-primary rounded-xl font-medium shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>موقعیت من</span>
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 md:py-3 bg-white/90 backdrop-blur-sm text-primary rounded-xl font-medium shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Search className="w-4 h-4" />
                      <span>استعلام ملک</span>
                    </div>
                  </motion.button>
                </div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                  <div className="text-xs text-muted-foreground mb-1">تعداد املاک نمایش داده شده</div>
                  <div className="text-lg md:text-xl font-bold text-primary">
                    {layers.find(l => l.id === activeLayer)?.count}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

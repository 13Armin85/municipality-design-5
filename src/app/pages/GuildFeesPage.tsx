import { type FormEvent, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  findPropertyByCodes,
  type MockProperty,
  type RenewalCodeKey,
  type RenewalCodes,
} from "../data/properties";
import { useSelectedProperty } from "../hooks/useSelectedProperty";
import { GuildFeesHeader } from "./guild-fees/GuildFeesHeader";
import { GuildFeesHelpModal } from "./guild-fees/GuildFeesHelpModal";
import {
  GuildFeesCurrentFeesSection,
  GuildFeesEmptyState,
  GuildFeesMapSection,
  GuildFeesOwnersSection,
  GuildFeesPropertyListSection,
  GuildFeesSearchSection,
} from "./guild-fees/GuildFeesSections";

interface GuildFeesPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function GuildFeesPage({ isDark, toggleTheme }: GuildFeesPageProps) {
  const { selectedProperty, selectProperty } = useSelectedProperty();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  // استیت‌های مربوط به جستجو و داده‌های فعال
  const [searchInputs, setSearchInputs] = useState<RenewalCodes>(
    selectedProperty.codes,
  );
  const [activeData, setActiveData] = useState<MockProperty | null>(
    selectedProperty,
  );

  useEffect(() => {
    setSearchInputs(selectedProperty.codes);
    setActiveData(selectedProperty);
  }, [selectedProperty]);

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  // وقتی روی یک ملک از لیست کلیک می‌شود
  const handleCaseClick = (item: MockProperty) => {
    setSearchInputs(item.codes);
    setActiveData(item);
    selectProperty(item.id);
  };

  // عملیات جستجو
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const result = findPropertyByCodes(searchInputs);
    setActiveData(result || null);
    if (result) selectProperty(result.id);
  };

  const handleInputChange = (key: RenewalCodeKey, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <GuildFeesHelpModal
        isOpen={isModalOpen}
        title={modalContent.title}
        description={modalContent.description}
        onClose={() => setIsModalOpen(false)}
      />

      <GuildFeesHeader isDark={isDark} toggleTheme={toggleTheme} />

      <section className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-6xl px-0 md:px-2 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-4 rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm"
          >
            لطفا پس از انتخاب ملک، کدهای بخش جستجو را تکمیل کرده و دکمه جستجو را
            فشار دهید.
          </motion.div>

          <div className="space-y-4 md:space-y-5">
            <GuildFeesSearchSection
              onHelp={handleOpenHelp}
              onInputChange={handleInputChange}
              onSubmit={handleSearch}
              searchInputs={searchInputs}
            />

            <GuildFeesPropertyListSection
              onCaseClick={handleCaseClick}
              onHelp={handleOpenHelp}
            />

            {/* بخش عوارض جاری - نمایش در صورت وجود دیتا */}
            {activeData && (
              <>
                <GuildFeesCurrentFeesSection activeData={activeData} />
                <GuildFeesOwnersSection activeData={activeData} />
              </>
            )}

            {!activeData && <GuildFeesEmptyState />}

            <GuildFeesMapSection activeData={activeData} />
          </div>
        </div>
      </section>
    </>
  );
}

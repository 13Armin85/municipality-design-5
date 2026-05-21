import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  findPropertyByCodes,
  propertyItems,
  type MockProperty,
  type RenewalCodes,
} from "../data/properties";
import { useSelectedProperty } from "../hooks/useSelectedProperty";
import { SelectionModal } from "./sabtdarkhast/FormCommon";
import { HelpModal } from "./sabtdarkhast/HelpModal";
import {
  SabtdarkhastFormHeader,
  SabtdarkhastSuccessHeader,
} from "./sabtdarkhast/PageHeaders";
import { SabtdarkhastFormPrimary } from "./sabtdarkhast/SabtdarkhastFormPrimary";
import { SabtdarkhastFormSecondary } from "./sabtdarkhast/SabtdarkhastFormSecondary";
import { SuccessScreen } from "./sabtdarkhast/SuccessScreen";
import { UploadStep } from "./sabtdarkhast/UploadStep";
import {
  ApplicantFormState,
  ComplementaryFormState,
  FormErrors,
  HelpModalContent,
  OwnerFormState,
  RequestFormState,
  SabtDarkhastPageProps,
  SelectionModalState,
  StepState,
} from "./sabtdarkhast/types";

export function SabtDarkhastPage({
  isDark,
  toggleTheme,
}: SabtDarkhastPageProps) {
  const { selectedProperty, selectProperty } = useSelectedProperty();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<HelpModalContent>({
    title: "",
    description: "",
  });

  const [selectionModal, setSelectionModal] = useState<SelectionModalState>({
    open: false,
    title: "",
    items: [],
    onSelect: () => {},
  });

  const [activeDatePicker, setActiveDatePicker] = useState<string | null>(null);
  const [step, setStep] = useState<StepState>("form");
  const [searchValues, setSearchValues] = useState<RenewalCodes>(
    selectedProperty.codes,
  );
  const [activeProperty, setActiveProperty] = useState<MockProperty | null>(
    selectedProperty,
  );
  const [vakadari, setVakadari] = useState("");

  const [ownerForm, setOwnerForm] = useState<OwnerFormState>({
    nationalId: selectedProperty.owner.nationalId,
    name: selectedProperty.owner.name,
    phone: selectedProperty.owner.phone,
    postalCode: selectedProperty.owner.postalCode,
    address: selectedProperty.owner.address,
  });
  const [requestForm, setRequestForm] = useState<RequestFormState>({
    id: selectedProperty.registration.request.id,
    type: selectedProperty.registration.request.type,
    applicantType: selectedProperty.registration.request.applicantType,
  });
  const [applicantForm, setApplicantForm] = useState<ApplicantFormState>({
    nationalId: selectedProperty.owner.nationalId,
    name: selectedProperty.owner.name,
    phone: selectedProperty.owner.phone,
  });
  const [complementaryForm, setComplementaryForm] =
    useState<ComplementaryFormState>({
      letterNo: selectedProperty.registration.complementary.letterNo,
      letterDate: selectedProperty.registration.complementary.letterDate,
      secretNo: selectedProperty.registration.complementary.secretNo,
      secretDate: selectedProperty.registration.complementary.secretDate,
      office: selectedProperty.registration.complementary.office,
    });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  const clearError = (errorKey: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!ownerForm.nationalId.trim()) newErrors["owner.nationalId"] = "این فیلد اجباری است";
    if (!ownerForm.name.trim()) newErrors["owner.name"] = "این فیلد اجباری است";
    if (!ownerForm.phone.trim()) newErrors["owner.phone"] = "این فیلد اجباری است";
    if (!requestForm.id.trim()) newErrors["request.id"] = "این فیلد اجباری است";
    if (!requestForm.type.trim()) newErrors["request.type"] = "این فیلد اجباری است";
    if (!requestForm.applicantType.trim()) newErrors["request.applicantType"] = "این فیلد اجباری است";
    if (!applicantForm.nationalId.trim()) newErrors["applicant.nationalId"] = "این فیلد اجباری است";
    if (!applicantForm.name.trim()) newErrors["applicant.name"] = "این فیلد اجباری است";
    if (!applicantForm.phone.trim()) newErrors["applicant.phone"] = "این فیلد اجباری است";
    return newErrors;
  };

  const applyPropertyToPage = (property: MockProperty) => {
    setActiveProperty(property);
    setOwnerForm({
      nationalId: property.owner.nationalId,
      name: property.owner.name,
      phone: property.owner.phone,
      postalCode: property.owner.postalCode,
      address: property.owner.address,
    });
    setRequestForm({
      id: property.registration.request.id,
      type: property.registration.request.type,
      applicantType: property.registration.request.applicantType,
    });
    setApplicantForm({
      nationalId: property.owner.nationalId,
      name: property.owner.name,
      phone: property.owner.phone,
    });
    setComplementaryForm({
      letterNo: property.registration.complementary.letterNo,
      letterDate: property.registration.complementary.letterDate,
      secretNo: property.registration.complementary.secretNo,
      secretDate: property.registration.complementary.secretDate,
      office: property.registration.complementary.office,
    });
    setErrors({});
    setShowErrors(false);
  };

  useEffect(() => {
    setSearchValues(selectedProperty.codes);
    applyPropertyToPage(selectedProperty);
  }, [selectedProperty]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-datepicker-container]")) {
        setActiveDatePicker(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleContinue = () => {
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setShowErrors(true);
      const firstErrEl = document.querySelector("[data-has-error='true']");
      firstErrEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setShowErrors(false);
    setStep("upload");
  };

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  const handleSelectProperty = (propertyId: string) => {
    const selected = propertyItems.find((item) => item.id === propertyId);
    if (!selected) return;
    setSearchValues(selected.codes);
    applyPropertyToPage(selected);
    selectProperty(selected.id);
  };

  const handleSearch = () => {
    const found = findPropertyByCodes(searchValues);
    if (found) {
      applyPropertyToPage(found);
      selectProperty(found.id);
    } else {
      alert("ملکی با این مشخصات یافت نشد.");
      setActiveProperty(null);
    }
  };

  const openSelection = (
    title: string,
    items: string[],
    onSelect: (value: string) => void,
  ) => {
    setSelectionModal({ open: true, title, items, onSelect });
  };

  if (step === "success") {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-background text-foreground transition-colors duration-300"
      >
        <SabtdarkhastSuccessHeader isDark={isDark} toggleTheme={toggleTheme} />
        <main className="section-decor px-3 pb-12 pt-20 sm:pt-24 md:pb-20 md:pt-28 lg:px-6">
          <div className="container mx-auto max-w-6xl">
            <SuccessScreen
              onReset={() => {
                setStep("form");
                applyPropertyToPage(selectedProperty);
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
    >
      <HelpModal
        isOpen={isModalOpen}
        title={modalContent.title}
        description={modalContent.description}
        onClose={() => setIsModalOpen(false)}
      />

      <AnimatePresence>
        {selectionModal.open && (
          <SelectionModal
            title={selectionModal.title}
            items={selectionModal.items}
            onSelect={selectionModal.onSelect}
            onClose={() =>
              setSelectionModal((prev) => ({ ...prev, open: false }))
            }
          />
        )}
      </AnimatePresence>

      <SabtdarkhastFormHeader
        isDark={isDark}
        toggleTheme={toggleTheme}
        isUploadStep={step === "upload"}
        onBackToForm={() => setStep("form")}
      />

      <main className="section-decor px-2 pb-12 pt-20 sm:px-3 sm:pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-6xl space-y-5">
          <AnimatePresence mode="wait">
            {step === "upload" ? (
              <UploadStep
                key="upload"
                onBack={() => setStep("form")}
                onSubmit={() => setStep("success")}
              />
            ) : (
              <motion.div
                key="form"
                className="space-y-5"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: 30 }}
              >
                <SabtdarkhastFormPrimary
                  showErrors={showErrors}
                  errors={errors}
                  searchValues={searchValues}
                  ownerForm={ownerForm}
                  requestForm={requestForm}
                  applicantForm={applicantForm}
                  complementaryForm={complementaryForm}
                  vakadari={vakadari}
                  activeDatePicker={activeDatePicker}
                  onOpenHelp={handleOpenHelp}
                  onSearch={handleSearch}
                  onSearchValuesChange={setSearchValues}
                  onSelectPropertyById={handleSelectProperty}
                  setOwnerForm={setOwnerForm}
                  setRequestForm={setRequestForm}
                  setApplicantForm={setApplicantForm}
                  setComplementaryForm={setComplementaryForm}
                  setVakadari={setVakadari}
                  setActiveDatePicker={setActiveDatePicker}
                  clearError={clearError}
                  openSelection={openSelection}
                  onContinue={handleContinue}
                />
                <SabtdarkhastFormSecondary activeProperty={activeProperty} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

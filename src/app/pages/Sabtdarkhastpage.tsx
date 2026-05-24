import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  areRenewalCodesEqual,
  getDefaultProperty,
  type MockProperty,
  type RenewalCodes,
} from "../data/properties";
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
  const [propertyItems, setPropertyItems] = useState<MockProperty[]>([]);
  const defaultProperty = getDefaultProperty();
  const selectedProperty = propertyItems[0] ?? defaultProperty;

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
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const nationalCode = localStorage.getItem("user-national-code");

        if (!token || !nationalCode) return;

        const response = await fetch(
          `/api/file?nationalCode=${encodeURIComponent(nationalCode)}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) return;

        const data = await response.json();

        const rawList = Array.isArray(data)
          ? data
          : (data.items ?? data.data ?? data.files ?? []);

        const base = getDefaultProperty();

        const mapped: MockProperty[] = rawList.map(
          (item: any, index: number) => {
            const codeParts = String(item.codeN ?? "0-0-0-0-0-0-0").split("-");

            const ownerName =
              item.FullName ??
              item.tvItems?.[0]?.Text?.split(" - ").pop()?.trim() ??
              "—";

            return {
              ...base,
              id: String(item.Id ?? item.shop ?? index),
              rowNumber: String(index + 1),
              fullCode: item.codeN ?? base.fullCode,
              ownerName,
              description:
                item.tvItems?.[0]?.Text?.trim() ??
                item.codeN ??
                base.description,

              codes: {
                region: codeParts[0] ?? "0",
                neighborhood: codeParts[1] ?? "0",
                block: codeParts[2] ?? "0",
                property: codeParts[3] ?? "0",
                building: codeParts[4] ?? "0",
                apartment: codeParts[5] ?? "0",
                guild: codeParts[6] ?? "0",
              },

              owner: {
                ...base.owner,
                name: ownerName,
                nationalId: nationalCode,
                phone: item.MelkVm?.tel ?? "",
                postalCode: item.MelkVm?.codeposti ?? "",
                address: item.MelkVm?.address ?? "",
              },
            };
          },
        );

        if (mapped.length > 0) {
          setPropertyItems(mapped);
          setSearchValues(mapped[0].codes);
          applyPropertyToPage(mapped[0]);
        }
      } catch {
        //
      }
    };

    fetchProperties();
  }, []);

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

  const clearError = (errorKey: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!ownerForm.nationalId.trim())
      newErrors["owner.nationalId"] = "این فیلد اجباری است";

    if (!ownerForm.name.trim()) newErrors["owner.name"] = "این فیلد اجباری است";

    if (!ownerForm.phone.trim())
      newErrors["owner.phone"] = "این فیلد اجباری است";

    if (!requestForm.id.trim()) newErrors["request.id"] = "این فیلد اجباری است";

    if (!requestForm.type.trim())
      newErrors["request.type"] = "این فیلد اجباری است";

    if (!requestForm.applicantType.trim())
      newErrors["request.applicantType"] = "این فیلد اجباری است";

    if (!applicantForm.nationalId.trim())
      newErrors["applicant.nationalId"] = "این فیلد اجباری است";

    if (!applicantForm.name.trim())
      newErrors["applicant.name"] = "این فیلد اجباری است";

    if (!applicantForm.phone.trim())
      newErrors["applicant.phone"] = "این فیلد اجباری است";

    return newErrors;
  };

  const handleSearch = () => {
    const found = propertyItems.find((property) =>
      areRenewalCodesEqual(property.codes, searchValues),
    );

    if (found) {
      applyPropertyToPage(found);
    } else {
      alert("ملکی با این مشخصات یافت نشد.");
      setActiveProperty(null);
    }
  };

  const handleSelectProperty = (propertyId: string) => {
    const selected = propertyItems.find((item) => item.id === propertyId);

    if (!selected) return;

    setSearchValues(selected.codes);
    applyPropertyToPage(selected);
  };

  const handleContinue = () => {
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setShowErrors(true);

      document.querySelector("[data-has-error='true']")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

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

  const openSelection = (
    title: string,
    items: string[],
    onSelect: (value: string) => void,
  ) =>
    setSelectionModal({
      open: true,
      title,
      items,
      onSelect,
    });

  if (step === "success") {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-background text-foreground transition-colors duration-300"
      >
        <SabtdarkhastSuccessHeader isDark={isDark} toggleTheme={toggleTheme} />

        <main className="section-decor px-3 pb-12 pt-20 sm:pt-24 md:pb-20 md:pt-28 lg:px-6">
          <div className="container mx-auto max-w-6xl">
            <SuccessScreen onReset={() => setStep("form")} />
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
              setSelectionModal((prev) => ({
                ...prev,
                open: false,
              }))
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
                  propertyItems={propertyItems}
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

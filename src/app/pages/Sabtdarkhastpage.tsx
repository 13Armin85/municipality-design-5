import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  areRenewalCodesEqual,
  type MockProperty,
  type RenewalCodes,
} from "../data/properties";
import {
  isApiSuccess,
  getApiErrorMessage,
  getApiValue,
  type ApiResponse,
} from "../utils/apiResponseHandler";
import { type PropertyItem, type PropertyTreeItem } from "../components/PropertyTreeList";
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

const extractOptions = (data: any): string[] => {
  const list = Array.isArray(data)
    ? data
    : (data?.items ?? data?.data ?? data?.result ?? data?.results ?? []);

  if (!Array.isArray(list)) return [];

  return list
    .map((item) => {
      if (typeof item === "string") return item;

      return (
        item?.title ??
        item?.name ??
        item?.text ??
        item?.label ??
        item?.value ??
        item?.TypeName ??
        item?.typeName ??
        item?.ApplicantType ??
        item?.OfficeName ??
        item?.GardeshKar ??
        item?.sharh ??
        null
      );
    })
    .filter((item): item is string => Boolean(item))
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, self) => self.indexOf(item) === index);
};

const emptyProperty: MockProperty = {
  id: "",
  rowNumber: "",
  fullCode: "",
  type: "",
  ownerName: "",
  description: "",
  codes: {
    region: "",
    neighborhood: "",
    block: "",
    property: "",
    building: "",
    apartment: "",
    guild: "",
  },
  owner: {
    firstName: "",
    lastName: "",
    name: "",
    nationalId: "",
    phone: "",
    postalCode: "",
    address: "",
    ownerType: "",
    fatherName: "",
    birthPlace: "",
    issuePlace: "",
  },
  owners: [],
  toll: {
    fees: {
      right: [],
      left: [],
    },
    history: [],
  },
  guildFees: {
    title: "",
    type: "",
    feeInfo: {
      right: [],
      left: [],
    },
  },
  inquiry: {
    retraction: {
      originalArea: "",
      reformedArea: "",
      remainingArea: "",
      description: "",
    },
    dimensions: [],
  },
  requestTracking: {
    requests: [],
    details: [],
  },
  registration: {
    request: { id: "", type: "", applicantType: "" },
    complementary: {
      letterNo: "",
      letterDate: "",
      secretNo: "",
      secretDate: "",
      office: "",
      desc: "",
    },
    buyer: {
      name: "",
      nationalId: "",
      phone: "",
      share: "",
    },
    prevRequests: [],
    map: { area: "" },
  },
};

export function SabtDarkhastPage({
  isDark,
  toggleTheme,
}: SabtDarkhastPageProps) {
  const [propertyItems, setPropertyItems] = useState<MockProperty[]>([]);
  const selectedProperty = propertyItems[0] ?? emptyProperty;

  const [isModalOpen, setIsModalOpen] = useState(false);
  // ✅ داده‌های سلکشن‌مودال رو اینجا مدیریت کن
  const [requestTypeItems, setRequestTypeItems] = useState<string[]>([]);
  const [applicantTypeItems, setApplicantTypeItems] = useState<string[]>([]);
  const [officeItems, setOfficeItems] = useState<string[]>([]);

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

  // ✅ داده‌های سلکشن را از اول فچ کن - قبل از اینکه صفحه رندر شود
  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const shop = localStorage.getItem("shop") ?? selectedProperty.id;

        const requestTypeUrl = `/api/request/type?shop=${encodeURIComponent(shop)}`;

        const [requestTypeRes, applicantTypeRes, officeRes] = await Promise.all(
          [
            fetch(requestTypeUrl, {
              headers: {
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            }),
            fetch("/api/request/applicant", {
              headers: {
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            }),
            fetch("/api/request/office", {
              headers: {
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            }),
          ],
        );

        if (requestTypeRes.ok) {
          const requestTypeData: ApiResponse = await requestTypeRes.json();
          if (isApiSuccess(requestTypeData)) {
            const extracted = extractOptions(getApiValue(requestTypeData));
            setRequestTypeItems(extracted);
          }
        }

        if (applicantTypeRes.ok) {
          const applicantTypeData: ApiResponse = await applicantTypeRes.json();
          if (isApiSuccess(applicantTypeData)) {
            const extracted = extractOptions(getApiValue(applicantTypeData));
            setApplicantTypeItems(extracted);
          }
        }

        if (officeRes.ok) {
          const officeData: ApiResponse = await officeRes.json();
          if (isApiSuccess(officeData)) {
            const extracted = extractOptions(getApiValue(officeData));
            setOfficeItems(extracted);
          }
        }
      } catch (error) {
        console.error("Error fetching select options:", error);
      }
    };

    fetchSelectOptions();
  }, [selectedProperty.id]);

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

        const data: ApiResponse = await response.json();

        if (!isApiSuccess(data)) return;

        const fileValue = getApiValue(data);
        const rawList = Array.isArray(fileValue)
          ? fileValue
          : (fileValue.items ?? fileValue.data ?? fileValue.files ?? []);

        const base = emptyProperty;

        const mapped: MockProperty[] = rawList.map(
          (item: any, index: number) => {
            const codeParts = String(item.codeN ?? "0-0-0-0-0-0-0").split("-");

            const ownerName = item.FullName ?? "—";

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
          setActiveProperty(null);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
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

  const handlePropertyTreeSelect = (property: PropertyItem, treeItem: PropertyTreeItem) => {
    const codes: RenewalCodes = {
      region: "",
      neighborhood: "",
      block: "",
      property: "",
      building: "",
      apartment: "",
      guild: "",
    };
    
    // Parse the fullCode to extract codes
    const parts = treeItem.fullCode.split("-").map(p => p.trim()).filter(Boolean);
    if (parts.length >= 7) {
      codes.region = parts[0];
      codes.neighborhood = parts[1];
      codes.block = parts[2];
      codes.property = parts[3];
      codes.building = parts[4];
      codes.apartment = parts[5];
      codes.guild = parts[6];
    }
    
    // Find matching property in propertyItems
    const matchedProperty = propertyItems.find(p => 
      p.fullCode === treeItem.fullCode || p.id === treeItem.id
    );
    
    if (matchedProperty) {
      applyPropertyToPage(matchedProperty);
      setSearchValues(codes);
    }
  };

  // ✅ بهتر شده: داده‌ها رو چک کن قبل از باز کردن مودال
  const openSelection = (
    title: string,
    items: string[],
    onSelect: (value: string) => void,
  ) => {
    // اگر items خالی یا undefined بود
    const safeItems = Array.isArray(items) && items.length > 0 ? items : [];

    if (safeItems.length === 0) {
      console.warn(`هیچ داده‌ای برای ${title} موجود نیست`);
      return;
    }

    console.log("Opening selection modal with:", {
      title,
      itemCount: safeItems.length,
      items: safeItems,
    });

    setSelectionModal({
      open: true,
      title,
      items: safeItems,
      onSelect,
    });
  };

  const closeSelectionModal = () => {
    setSelectionModal((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleSelectionConfirm = (value: string) => {
    selectionModal.onSelect(value);
    closeSelectionModal();
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

      {/* ✅ بهتر شده: SelectionModal رو مستقیم رندر کن */}
      <AnimatePresence mode="wait">
        {selectionModal.open && (
          <SelectionModal
            key="selection-modal"
            title={selectionModal.title}
            items={selectionModal.items}
            onSelect={handleSelectionConfirm}
            onClose={closeSelectionModal}
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
                  // ✅ داده‌های سلکشن رو پاس کن
                  requestTypeItems={requestTypeItems}
                  applicantTypeItems={applicantTypeItems}
                  officeItems={officeItems}
                  onOpenHelp={handleOpenHelp}
                  onSearch={handleSearch}
                  onSearchValuesChange={setSearchValues}
                  onPropertyTreeSelect={handlePropertyTreeSelect}
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

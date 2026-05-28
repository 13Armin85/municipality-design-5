import { motion } from "motion/react";
import {
  AlertCircle,
  Building2,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  FileText,
  Search,
  User,
} from "lucide-react";
import {
  areRenewalCodesEqual,
  guildCodeFields,
  type MockProperty,
  type RenewalCodes,
} from "../../data/properties";
import {
  DateField,
  EditableField,
  HelpButton,
  SectionHeader,
  SelectionField,
} from "./FormControls";
import {
  ApplicantFormState,
  ComplementaryFormState,
  FormErrors,
  OwnerFormState,
  RequestFormState,
} from "./types";

interface SabtdarkhastFormPrimaryProps {
  propertyItems: MockProperty[];
  showErrors: boolean;
  errors: FormErrors;
  searchValues: RenewalCodes;
  ownerForm: OwnerFormState;
  requestForm: RequestFormState;
  applicantForm: ApplicantFormState;
  complementaryForm: ComplementaryFormState;
  vakadari: string;
  activeDatePicker: string | null;
  requestTypeItems: string[];
  applicantTypeItems: string[];
  officeItems: string[];
  onOpenHelp: (title: string, description: string) => void;
  onSearch: () => void;
  onSearchValuesChange: (values: RenewalCodes) => void;
  onSelectPropertyById: (propertyId: string) => void;
  setOwnerForm: (value: OwnerFormState) => void;
  setRequestForm: (value: RequestFormState) => void;
  setApplicantForm: (value: ApplicantFormState) => void;
  setComplementaryForm: (value: ComplementaryFormState) => void;
  setVakadari: (value: string) => void;
  setActiveDatePicker: (value: string | null) => void;
  clearError: (errorKey: string) => void;
  openSelection: (
    title: string,
    items: string[],
    onSelect: (value: string) => void,
  ) => void;
  onContinue: () => void;
}

export function SabtdarkhastFormPrimary({
  propertyItems,
  showErrors,
  errors,
  searchValues,
  ownerForm,
  requestForm,
  applicantForm,
  complementaryForm,
  vakadari,
  activeDatePicker,
  requestTypeItems,
  applicantTypeItems,
  officeItems,
  onOpenHelp,
  onSearch,
  onSearchValuesChange,
  onSelectPropertyById,
  setOwnerForm,
  setRequestForm,
  setApplicantForm,
  setComplementaryForm,
  setVakadari,
  setActiveDatePicker,
  clearError,
  openSelection,
  onContinue,
}: SabtdarkhastFormPrimaryProps) {
  return (
    <>
      {showErrors && Object.keys(errors).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          لطفاً فیلدهای اجباری مشخص شده را تکمیل کنید.
        </motion.div>
      )}

      <div className="rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-right text-xs text-primary md:text-sm">
        کاربر گرامی، لطفاً پس از انتخاب ملک خود از لیست "پرونده‌های زیر مجموعه"
        دکمه جستجو را بفشارید.
      </div>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="soft-card mesh-panel overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">جستجو</h2>
          </div>
          <HelpButton
            title="جستجو"
            desc="کد نوسازی را وارد کنید یا از لیست زیر مجموعه انتخاب کنید."
            onOpenHelp={onOpenHelp}
          />
        </div>
        <div className="p-3 sm:p-4">
          <button
            onClick={onSearch}
            className="mb-3 flex h-10 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 sm:hidden"
          >
            <Search className="ml-1.5 h-4 w-4" /> جستجو
          </button>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-8">
            <button
              onClick={onSearch}
              className="hidden h-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 md:flex"
            >
              <Search className="ml-1.5 h-4 w-4" /> جستجو
            </button>
            {guildCodeFields.map((field) => (
              <div key={field.key} className="relative">
                <input
                  value={searchValues[field.key]}
                  onChange={(e) =>
                    onSearchValuesChange({
                      ...searchValues,
                      [field.key]: e.target.value,
                    } as RenewalCodes)
                  }
                  className="h-10 w-full rounded-xl border border-border/70 bg-card px-2 text-center text-xs font-medium outline-none transition-colors focus:border-primary sm:h-11 sm:text-sm"
                />
                <span className="absolute -top-2 right-2 bg-card px-1 text-[8px] text-muted-foreground sm:text-[9px]">
                  {field.label}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={onSearch}
            className="mt-2 hidden h-10 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 sm:flex md:hidden"
          >
            <Search className="ml-1.5 h-4 w-4" /> جستجو
          </button>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="soft-card mesh-panel"
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold">پرونده های زیر مجموعه</h2>
          </div>
          <HelpButton
            title="زیر مجموعه"
            desc="لیست املاک شما. با کلیک بر روی هر کدام، کدهای نوسازی در بخش جستجو درج می‌شود."
            onOpenHelp={onOpenHelp}
          />
        </div>
        <div className="space-y-2 p-3 sm:p-4">
          {propertyItems.map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectPropertyById(prop.id)}
              className={`group flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition-all sm:p-3 ${areRenewalCodesEqual(searchValues, prop.codes) ? "border-primary bg-primary/5" : "border-border/70 bg-card/50 hover:border-primary/40"}`}
            >
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div
                  className={`h-2.5 w-2.5 flex-shrink-0 rounded-full sm:h-3 sm:w-3 ${areRenewalCodesEqual(searchValues, prop.codes) ? "bg-primary animate-pulse" : "bg-orange-400"}`}
                />
                <span className="truncate text-[11px] font-medium sm:text-xs md:text-sm">
                  {Object.values(prop.codes).join("-")} (ملک) —{" "}
                  {prop.owner.name}
                </span>
              </div>
              <ChevronLeft className="mr-1 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1 sm:h-4 sm:w-4" />
            </div>
          ))}
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="soft-card mesh-panel overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold">ثبت درخواست</h2>
          </div>
        </div>

        <div className="space-y-6 p-3 sm:space-y-8 sm:p-4">
          <div>
            <SectionHeader icon={User} title="اطلاعات مالک" />
            <div className="grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2 md:grid-cols-4">
              <div className="col-span-1 flex items-center gap-4 text-xs text-muted-foreground sm:col-span-2 md:col-span-4">
                <label className="flex cursor-pointer items-center gap-1.5">
                  <input
                    type="radio"
                    name="malek-type"
                    className="accent-primary"
                  />{" "}
                  کد ملی
                </label>
                <label className="flex cursor-pointer items-center gap-1.5">
                  <input
                    type="radio"
                    name="malek-type"
                    defaultChecked
                    className="accent-primary"
                  />{" "}
                  شناسه ملی
                </label>
              </div>
              <EditableField
                label="شناسه ملی"
                required
                value={ownerForm.nationalId}
                onChange={(v) => setOwnerForm({ ...ownerForm, nationalId: v })}
                errorKey="owner.nationalId"
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
              />
              <EditableField
                label="نام مالک"
                required
                value={ownerForm.name}
                onChange={(v) => setOwnerForm({ ...ownerForm, name: v })}
                errorKey="owner.name"
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
              />
              <EditableField
                label="شماره همراه"
                required
                value={ownerForm.phone}
                onChange={(v) => setOwnerForm({ ...ownerForm, phone: v })}
                errorKey="owner.phone"
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
              />
              <EditableField
                label="کد پستی"
                value={ownerForm.postalCode}
                onChange={(v) => setOwnerForm({ ...ownerForm, postalCode: v })}
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
              />
              <div className="relative col-span-1 sm:col-span-2 md:col-span-4">
                <input
                  value={ownerForm.address}
                  onChange={(e) =>
                    setOwnerForm({ ...ownerForm, address: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-border/70 bg-card px-3 text-sm outline-none transition-colors focus:border-primary"
                />
                <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
                  نشانی مالک
                </span>
              </div>
            </div>
          </div>

          <div>
            <SectionHeader icon={ClipboardList} title="اطلاعات درخواست" />
            <div className="grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2 md:grid-cols-3">
              <EditableField
                label="شماره درخواست"
                required
                value={requestForm.id}
                onChange={(v) => setRequestForm({ ...requestForm, id: v })}
                errorKey="request.id"
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
              />
              <SelectionField
                label="نوع درخواست"
                required
                value={requestForm.type}
                onChange={(v) => setRequestForm({ ...requestForm, type: v })}
                items={requestTypeItems}
                title="انتخاب نوع درخواست"
                errorKey="request.type"
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
                openSelection={openSelection}
              />
              <SelectionField
                label="نوع متقاضی"
                required
                value={requestForm.applicantType}
                onChange={(v) =>
                  setRequestForm({ ...requestForm, applicantType: v })
                }
                items={applicantTypeItems}
                title="انتخاب نوع متقاضی"
                errorKey="request.applicantType"
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
                openSelection={openSelection}
              />
            </div>
          </div>

          <div>
            <SectionHeader icon={User} title="اطلاعات متقاضی" />
            <div className="grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2 md:grid-cols-4">
              <EditableField
                label="شناسه ملی"
                required
                value={applicantForm.nationalId}
                onChange={(v) =>
                  setApplicantForm({ ...applicantForm, nationalId: v })
                }
                errorKey="applicant.nationalId"
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
              />
              <EditableField
                label="نام متقاضی"
                required
                value={applicantForm.name}
                onChange={(v) =>
                  setApplicantForm({ ...applicantForm, name: v })
                }
                errorKey="applicant.name"
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
              />
              <EditableField
                label="شماره همراه"
                required
                value={applicantForm.phone}
                onChange={(v) =>
                  setApplicantForm({ ...applicantForm, phone: v })
                }
                errorKey="applicant.phone"
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
              />
              <div className="relative">
                <select
                  value={vakadari}
                  onChange={(e) => setVakadari(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-border/70 bg-card px-3 text-sm outline-none"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="1">مالک</option>
                  <option value="2">مستأجر</option>
                  <option value="3">وکیل</option>
                </select>
                <span className="absolute -top-2.5 right-3 bg-card px-1 text-[10px] text-muted-foreground">
                  نوع واگذاری
                </span>
                <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div>
            <SectionHeader icon={Building2} title="اطلاعات تکمیلی" />
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2">
                <EditableField
                  label="شماره نامه"
                  value={complementaryForm.letterNo}
                  onChange={(v) =>
                    setComplementaryForm({ ...complementaryForm, letterNo: v })
                  }
                  showErrors={showErrors}
                  errors={errors}
                  clearError={clearError}
                />
                <DateField
                  label="تاریخ نامه"
                  value={complementaryForm.letterDate}
                  onChange={(v) =>
                    setComplementaryForm({
                      ...complementaryForm,
                      letterDate: v,
                    })
                  }
                  pickerId="letterDate"
                  activeDatePicker={activeDatePicker}
                  setActiveDatePicker={setActiveDatePicker}
                />
              </div>
              <div className="grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2">
                <EditableField
                  label="شماره دبیرخانه"
                  value={complementaryForm.secretNo}
                  onChange={(v) =>
                    setComplementaryForm({ ...complementaryForm, secretNo: v })
                  }
                  showErrors={showErrors}
                  errors={errors}
                  clearError={clearError}
                />
                <DateField
                  label="تاریخ دبیرخانه"
                  value={complementaryForm.secretDate}
                  onChange={(v) =>
                    setComplementaryForm({
                      ...complementaryForm,
                      secretDate: v,
                    })
                  }
                  pickerId="secretDate"
                  activeDatePicker={activeDatePicker}
                  setActiveDatePicker={setActiveDatePicker}
                />
              </div>
              <SelectionField
                label="اداره استعلام کننده"
                value={complementaryForm.office}
                onChange={(v) =>
                  setComplementaryForm({ ...complementaryForm, office: v })
                }
                items={officeItems}
                title="انتخاب اداره استعلام کننده"
                showErrors={showErrors}
                errors={errors}
                clearError={clearError}
                openSelection={openSelection}
              />
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-start gap-3 border-t border-border/50 pt-2 sm:flex-row sm:items-center">
            <button
              onClick={onContinue}
              className="rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-95"
            >
              ادامه
            </button>
            <button className="rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-2.5 text-sm font-semibold text-destructive transition-all active:scale-95">
              انصراف
            </button>
          </div>
        </div>
      </motion.article>
    </>
  );
}

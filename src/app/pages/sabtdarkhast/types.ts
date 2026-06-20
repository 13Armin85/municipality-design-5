import type { PropertyRecord, RenewalCodes } from "../../data/properties";

export interface SabtDarkhastPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export type StepState = "form" | "upload" | "success";

export interface OwnerFormState {
  identityType: "1" | "2";
  nationalId: string;
  name: string;
  phone: string;
  postalCode: string;
  address: string;
}

export interface RequestFormState {
  id: string;
  type: string;
  applicantType: string;
}

export interface LookupOption {
  label: string;
  code: string;
}

export interface LackDocumentItem {
  id: string;
  title: string;
  description: string;
  isDefense: boolean;
}

export interface ApplicantFormState {
  identityType: "1" | "2";
  nationalId: string;
  name: string;
  phone: string;
  postalCode: string;
  address: string;
}

export interface ComplementaryFormState {
  letterNo: string;
  letterDate: string;
  secretNo: string;
  secretDate: string;
  office: string;
  desc: string;
}

export interface BuyerFormState {
  identityType: "1" | "2";
  nationalId: string;
  name: string;
  phone: string;
  transferShare: string;
  totalTransferShare: string;
}

export interface SelectionModalState {
  open: boolean;
  title: string;
  items: string[];
  onSelect: (value: string) => void;
}

export interface HelpModalContent {
  title: string;
  description: string;
}

export type FormErrors = Record<string, string>;

export interface SearchSectionState {
  searchValues: RenewalCodes;
  activeProperty: PropertyRecord | null;
}

import type { MockProperty, RenewalCodes } from "../../data/properties";

export interface SabtDarkhastPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export type StepState = "form" | "upload" | "success";

export interface OwnerFormState {
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

export interface ApplicantFormState {
  nationalId: string;
  name: string;
  phone: string;
}

export interface ComplementaryFormState {
  letterNo: string;
  letterDate: string;
  secretNo: string;
  secretDate: string;
  office: string;
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
  activeProperty: MockProperty | null;
}

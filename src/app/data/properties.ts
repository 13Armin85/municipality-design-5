export const renewalCodeKeys = [
  "region",
  "neighborhood",
  "block",
  "property",
  "building",
  "apartment",
  "guild",
] as const;

export type RenewalCodeKey = (typeof renewalCodeKeys)[number];
export type RenewalCodes = Record<RenewalCodeKey, string>;

export type LabelValue = {
  label: string;
  value: string;
};

export type PropertyRecord = {
  id: string;
  rowNumber: string;
  fullCode: string;
  type: string;
  ownerName: string;
  description: string;
  codes: RenewalCodes;
  owner: {
    firstName: string;
    lastName: string;
    name: string;
    nationalId: string;
    phone: string;
    postalCode: string;
    address: string;
    ownerType: string;
    fatherName: string;
    birthPlace: string;
    issuePlace: string;
  };
  owners: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    ownerType: string;
    fatherName: string;
    birthPlace: string;
    issuePlace: string;
  }[];
  toll: {
    fees: {
      right: LabelValue[];
      left: LabelValue[];
    };
    history: { id: number; date: string; amount: string; status: string }[];
  };
  guildFees: {
    title: string;
    type: string;
    feeInfo: {
      right: LabelValue[];
      left: LabelValue[];
    };
  };
  inquiry: {
    retraction: {
      originalArea: string;
      reformedArea: string;
      remainingArea: string;
      description: string;
    };
    dimensions: {
      dir: string;
      type: string;
      name: string;
      sideExist: string;
      edgeExist: string;
    }[];
  };
  requestTracking: {
    requests: { code: string; title: string; status: string; date: string }[];
    details: LabelValue[];
  };
  registration: {
    request: { id: string; type: string; applicantType: string };
    complementary: {
      letterNo: string;
      letterDate: string;
      secretNo: string;
      secretDate: string;
      office: string;
      desc: string;
    };
    buyer: {
      name: string;
      nationalId: string;
      phone: string;
      share: string;
    };
    prevRequests: { id: string; date: string; status: string }[];
    map: { area: string };
  };
};

export const renewalCodeLabels: Record<RenewalCodeKey, string> = {
  region: "منطقه",
  neighborhood: "محله",
  block: "بلوک",
  property: "ملک",
  building: "ساختمان",
  apartment: "آپارتمان",
  guild: "صنفی",
};

export const guildCodeFields = [...renewalCodeKeys].reverse().map((key) => ({
  key,
  label: renewalCodeLabels[key],
}));

export const selectedPropertyStorageKey = "municipality-selected-property-id";
export const selectedPropertyRenewalCodeStorageKey =
  "municipality-selected-property-renewal-code";

export const normalizeRenewalCode = (code: string | null | undefined) => {
  if (!code) return "";

  return code
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[^\d]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const getStoredPropertyId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(selectedPropertyStorageKey);
};

export const getSelectedPropertyFullCode = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(selectedPropertyRenewalCodeStorageKey);
};

export const persistSelectedProperty = (
  propertyId: string,
  fullCode?: string,
) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(selectedPropertyStorageKey, propertyId);
  if (fullCode) {
    localStorage.setItem(selectedPropertyRenewalCodeStorageKey, fullCode);
  }

  window.dispatchEvent(
    new CustomEvent("municipality-selected-property-change", {
      detail: propertyId,
    }),
  );
};

export const persistSelectedPropertyByFullCode = (
  fullCode: string,
  propertyId?: string,
) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(selectedPropertyRenewalCodeStorageKey, fullCode);
  if (propertyId) {
    localStorage.setItem(selectedPropertyStorageKey, propertyId);
  }

  window.dispatchEvent(
    new CustomEvent("municipality-selected-property-change", {
      detail: propertyId ?? fullCode,
    }),
  );
};

export const areRenewalCodesEqual = (a: RenewalCodes, b: RenewalCodes) =>
  renewalCodeKeys.every((key) => a[key] === b[key]);

export const getRenewalCodeValues = (codes: RenewalCodes) =>
  renewalCodeKeys.map((key) => codes[key]);

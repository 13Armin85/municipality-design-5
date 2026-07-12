import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  areRenewalCodesEqual,
  getSelectedPropertyFullCode,
  type PropertyRecord,
  type RenewalCodes,
  normalizeRenewalCode,
  renewalCodeKeys,
  selectedPropertyStorageKey,
} from "../data/properties";
import {
  isApiSuccess,
  getApiErrorMessage,
  getApiValue,
  normalizeApiResponse,
  type ApiResponse,
} from "../utils/apiResponseHandler";
import { apiFetch, dotNet10ApiFetch } from "../data/api";
import { type PropertyItem, type PropertyTreeItem } from "../components/PropertyTreeList";
import { flattenApiPropertyFiles } from "../data/propertyFiles";
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
  BuyerFormState,
  ComplementaryFormState,
  FormErrors,
  HelpModalContent,
  LackDocumentItem,
  LookupOption,
  OwnerFormState,
  RequestFormState,
  SabtDarkhastPageProps,
  SelectionModalState,
  StepState,
} from "./sabtdarkhast/types";

export interface RegisteredRequestRow {
  id: string;
  date: string;
  status: string;
  title: string;
}

const normalizeDigits = (value: unknown) =>
  String(value ?? "")
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const match = normalizeDigits(value).match(/-?\d+(\.\d+)?/);
  if (!match) return null;

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
};

const getLookupValue = (item: any, keys: string[]) => {
  if (!item || typeof item !== "object") return undefined;

  for (const key of keys) {
    const value = item[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return value;
    }
  }

  return undefined;
};

const getRawList = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  const list =
    data.items ??
    data.Items ??
    data.data ??
    data.Data ??
    data.result ??
    data.Result ??
    data.results ??
    data.Results ??
    data.files ??
    data.Files;

  if (Array.isArray(list)) return list;
  if (list && typeof list === "object") return [list];
  return [];
};

const commonLabelKeys = [
  "title",
  "Title",
  "name",
  "Name",
  "text",
  "Text",
  "label",
  "Label",
  "sharh",
  "Sharh",
  "GardeshKar",
];

const commonCodeKeys = [
  "C_GardeshKar",
  "c_GardeshKar",
  "gardeshKarCode",
  "GardeshKarCode",
  "kodfarei",
  "KodFarei",
  "kodFarei",
  "Kodfarei",
  "id",
  "Id",
  "ID",
  "code",
  "Code",
  "CodeId",
  "codeId",
  "key",
  "Key",
  "value",
  "Value",
  "c",
  "C",
];

const extractLookupOptions = (
  data: any,
  labelKeys: string[],
  codeKeys: string[],
): LookupOption[] => {
  const list = getRawList(data);
  const seen = new Set<string>();

  return list
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return {
          label: String(item).trim(),
          code: String(toNumber(item) ?? ""),
        };
      }

      const label = String(
        getLookupValue(item, [...labelKeys, ...commonLabelKeys]) ?? "",
      ).trim();
      const code = getLookupValue(item, [...codeKeys, ...commonCodeKeys]);

      return {
        label,
        code: String(code ?? toNumber(label) ?? ""),
      };
    })
    .filter((item) => item.label)
    .filter((item) => {
      const normalized = item.label.trim();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
};

const getLookupCode = (options: LookupOption[], selectedLabel: string) => {
  const normalizedSelected = selectedLabel.trim();
  const selected = options.find(
    (option) =>
      option.label.trim() === normalizedSelected ||
      option.code.trim() === normalizedSelected,
  );

  return toNumber(selected?.code) ?? toNumber(selectedLabel);
};

const normalizeAuthToken = (token: string | null) =>
  String(token ?? "")
    .trim()
    .replace(/^Bearer\s+/i, "")
    .trim();

const getAuthHeaders = (token: string | null, contentType?: string) => {
  const authToken = normalizeAuthToken(token);

  return {
    Accept: "application/json",
    ...(contentType ? { "Content-Type": contentType } : {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
};

const readApiResponse = async (
  response: Response,
  fallbackError: string,
): Promise<ApiResponse> => {
  const raw = await response.json().catch(() => null);
  const data = normalizeApiResponse(raw);

  if (!response.ok) {
    throw new Error(isApiSuccess(data) ? fallbackError : getApiErrorMessage(data));
  }

  if (!isApiSuccess(data)) {
    throw new Error(getApiErrorMessage(data));
  }

  return data;
};

const requestTypeLabelKeys = ["GardeshKar", "noedarkhast", "NoeDarkhast", "requestTitle"];
const requestTypeCodeKeys = ["C_GardeshKar", "c_GardeshKar", "c_noedarkhast", "C_NoeDarkhast", "requestTypeId"];
const applicantTypeLabelKeys = ["sharh", "Sharh", "noemot", "NoeMot", "ApplicantType"];
const applicantTypeCodeKeys = ["kodfarei", "KodFarei", "c_noemot", "C_NoeMot", "applicantTypeId"];
const officeLabelKeys = ["sharh", "Sharh", "sahebname", "SahebName", "OfficeName"];
const officeCodeKeys = ["kodfarei", "KodFarei", "C_Estelam", "c_estelam", "officeId"];

const agreementTypeLabels: Record<string, string> = {
  "1": "مالک",
  "2": "مستاجر",
  "3": "وکیل",
};

const getAgreementTypeLabel = (value: string) =>
  agreementTypeLabels[value] ?? value;

const emptyProperty: PropertyRecord = {
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

const getListFromApiValue = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  const nestedValue = value.Value ?? value.value;
  if (Array.isArray(nestedValue)) return nestedValue;

  const nestedList = value.data ?? value.items ?? value.files ?? value.result;
  if (Array.isArray(nestedList)) return nestedList;
  if (nestedList && typeof nestedList === "object") return [nestedList];

  return [value];
};

const mapApiResponseToLackDocuments = (data: any): LackDocumentItem[] =>
  getListFromApiValue(data).map((item: any, index: number) => {
    const title =
      firstText(
        item.title,
        item.Title,
        item.name,
        item.Name,
        item.documentTitle,
        item.DocumentTitle,
        item.madarek,
        item.Madarek,
        item.sharh,
        item.Sharh,
        item.tozihat,
        item.Tozihat,
      ) || `مدرک ${index + 1}`;

    return {
      id: firstText(item.id, item.Id, item.code, item.Code, index + 1),
      title,
      description: firstText(
        item.description,
        item.Description,
        item.tozihat,
        item.Tozihat,
        item.comment,
        item.Comment,
      ),
      isDefense: Boolean(item.IsDefense ?? item.isDefense ?? item.defense),
    };
  });

const getDefectIsDefense = (data: any): boolean => {
  const list = getListFromApiValue(data);
  const values = list.length ? list : [data];

  return values.some((item: any) => {
    if (typeof item === "boolean") return item;
    if (typeof item === "number") return item === 1;
    if (typeof item === "string") {
      const normalized = item.trim().toLowerCase();
      return (
        normalized === "true" ||
        normalized === "1" ||
        normalized.includes("دفاع")
      );
    }

    if (!item || typeof item !== "object") return false;

    return Boolean(
      item.IsDefense ??
        item.isDefense ??
        item.IsDefence ??
        item.isDefence ??
        item.defense ??
        item.defence ??
        item.isDefectDefense,
    );
  });
};

const formatRequestDate = (date: any): string => {
  if (!date) return "—";

  if (typeof date === "number" && date.toString().length === 8) {
    const dateStr = date.toString();
    return `${dateStr.substring(0, 4)}/${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`;
  }

  return String(date);
};

const mapApiResponseToRegisteredRequests = (
  data: any,
): RegisteredRequestRow[] =>
  getListFromApiValue(data).map((item: any, index: number) => ({
    id: String(item.shodarkhast ?? item.requestId ?? item.id ?? index + 1),
    date: formatRequestDate(
      item.date_rooz ?? item.date ?? item.createDate ?? item.createdAt,
    ),
    status: String(item.vaziatErja ?? item.statusTitle ?? item.status ?? "—"),
    title: String(
      item.noedarkhast ?? item.requestTitle ?? item.title ?? item.subject ?? "—",
    ),
  }));

const buildCodeFromValues = (values: RenewalCodes) =>
  renewalCodeKeys.map((key) => values[key].trim()).join("-");

const buildValuesFromCode = (code: string): RenewalCodes => {
  const parts = code.split("-").map((part) => part.trim());
  return {
    region: parts[0] ?? "",
    neighborhood: parts[1] ?? "",
    block: parts[2] ?? "",
    property: parts[3] ?? "",
    building: parts[4] ?? "",
    apartment: parts[5] ?? "",
    guild: parts[6] ?? "",
  };
};

const getTextValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const firstDefined = (...values: unknown[]) =>
  values.find(
    (value) =>
      value !== null && value !== undefined && String(value).trim() !== "",
  );

const firstText = (...values: unknown[]) =>
  values.map(getTextValue).find(Boolean) ?? "";

const getIdentityTypeFromValue = (value: unknown): "1" | "2" => {
  const digitCount = normalizeDigits(value).replace(/\D/g, "").length;
  return digitCount > 10 ? "2" : "1";
};

const resolveIdentityType = (
  typeValue: unknown,
  identityValue: unknown,
): "1" | "2" => {
  const normalizedType = normalizeDigits(typeValue).replace(/\D/g, "");
  if (normalizedType === "1" || normalizedType === "2") {
    return normalizedType;
  }

  const typeText = getTextValue(typeValue).toLowerCase();
  if (
    typeText.includes("national") ||
    typeText.includes("meli") ||
    typeText.includes("کد")
  ) {
    return "1";
  }
  if (typeText.includes("legal") || typeText.includes("شناسه")) {
    return "2";
  }

  return getIdentityTypeFromValue(identityValue);
};

const firstObject = (...values: any[]) =>
  values.find((value) => value && typeof value === "object" && !Array.isArray(value));

const getFileShopValue = (item: any) =>
  firstDefined(
    item.shop,
    item.Shop,
    item.shopId,
    item.ShopId,
    item.malekId,
    item.MalekId,
    item.Id,
    item.id,
  );

const getFileCodeNodeTreeValue = (item: any) =>
  firstDefined(item.codeTree, item.CodeTree, item.codeNodeTree, item.CodeNodeTree);

const getUploadShopValue = (value: any) =>
  firstText(
    value?.shop,
    value?.Shop,
    value?.shopId,
    value?.ShopId,
    value?.malekId,
    value?.MalekId,
    value?.raw?.shop,
    value?.raw?.Shop,
    value?.raw?.shopId,
    value?.raw?.ShopId,
    value?.raw?.malekId,
    value?.raw?.MalekId,
    value?.id,
    value?.Id,
  );

const getUploadCodeNodeTreeValue = (value: any) =>
  firstText(
    value?.codeNodeTree,
    value?.CodeNodeTree,
    value?.codeTree,
    value?.CodeTree,
    value?.raw?.codeNodeTree,
    value?.raw?.CodeNodeTree,
    value?.raw?.codeTree,
    value?.raw?.CodeTree,
  );

const isOwnerApplicantType = (value: string) => value.trim().includes("مالک");

const getRequestNumberFromApiValue = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return String(
    value.shodarkhast ??
      value.requestId ??
      value.requestNo ??
      value.requestNumber ??
      value.id ??
      value.code ??
      "",
  );
};

export function SabtDarkhastPage({
  isDark,
  toggleTheme,
}: SabtDarkhastPageProps) {
  const [propertyItems, setPropertyItems] = useState<PropertyRecord[]>([]);
  const selectedProperty = propertyItems[0] ?? emptyProperty;

  const [isModalOpen, setIsModalOpen] = useState(false);
  // ✅ داده‌های سلکشن‌مودال رو اینجا مدیریت کن
  const [requestTypeItems, setRequestTypeItems] = useState<string[]>([]);
  const [applicantTypeItems, setApplicantTypeItems] = useState<string[]>([]);
  const [officeItems, setOfficeItems] = useState<string[]>([]);
  const [requestTypeOptions, setRequestTypeOptions] = useState<LookupOption[]>(
    [],
  );
  const [applicantTypeOptions, setApplicantTypeOptions] = useState<
    LookupOption[]
  >([]);
  const [officeOptions, setOfficeOptions] = useState<LookupOption[]>([]);
  const [registeredRequests, setRegisteredRequests] = useState<
    RegisteredRequestRow[]
  >([]);
  const [registeredRequestsLoading, setRegisteredRequestsLoading] =
    useState(false);
  const [registeredRequestsError, setRegisteredRequestsError] = useState("");
  const [requestSubmitError, setRequestSubmitError] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [lackDocuments, setLackDocuments] = useState<LackDocumentItem[]>([]);
  const [lackDocumentsLoading, setLackDocumentsLoading] = useState(false);
  const [lackDocumentsError, setLackDocumentsError] = useState("");
  const [defectIsDefense, setDefectIsDefense] = useState(false);
  const [registeredRequestId, setRegisteredRequestId] = useState("");
  const [selectedTreeItemId, setSelectedTreeItemId] = useState("");
  const [selectedShopValue, setSelectedShopValue] = useState("");
  const [selectedCodeNodeTree, setSelectedCodeNodeTree] = useState("");

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

  const [activeProperty, setActiveProperty] = useState<PropertyRecord | null>(
    selectedProperty,
  );

  const [vakadari, setVakadari] = useState("");

  const [ownerForm, setOwnerForm] = useState<OwnerFormState>({
    identityType: getIdentityTypeFromValue(selectedProperty.owner.nationalId),
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
    identityType: getIdentityTypeFromValue(selectedProperty.owner.nationalId),
    nationalId: selectedProperty.owner.nationalId,
    name: selectedProperty.owner.name,
    phone: selectedProperty.owner.phone,
    postalCode: selectedProperty.owner.postalCode,
    address: selectedProperty.owner.address,
  });

  const [complementaryForm, setComplementaryForm] =
    useState<ComplementaryFormState>({
      letterNo: selectedProperty.registration.complementary.letterNo,
      letterDate: selectedProperty.registration.complementary.letterDate,
      secretNo: selectedProperty.registration.complementary.secretNo,
      secretDate: selectedProperty.registration.complementary.secretDate,
      office: selectedProperty.registration.complementary.office,
      desc: selectedProperty.registration.complementary.desc,
    });

  const [buyerForm, setBuyerForm] = useState<BuyerFormState>({
    identityType: getIdentityTypeFromValue(
      selectedProperty.registration.buyer.nationalId,
    ),
    nationalId: selectedProperty.registration.buyer.nationalId,
    name: selectedProperty.registration.buyer.name,
    phone: selectedProperty.registration.buyer.phone,
    transferShare: selectedProperty.registration.buyer.share,
    totalTransferShare: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  const fetchRegisteredRequests = async (codeNosazi: string) => {
    const cleanCode = codeNosazi.trim();

    if (!cleanCode || cleanCode === "------") {
      setRegisteredRequests([]);
      setRegisteredRequestsError("");
      return;
    }

    setRegisteredRequestsLoading(true);
    setRegisteredRequestsError("");

    try {
      const token = normalizeAuthToken(localStorage.getItem("auth-token"));

      const response = await apiFetch(
        `/api/request?codeNosazi=${encodeURIComponent(cleanCode)}`,
        {
          method: "GET",
          headers: getAuthHeaders(token),
        },
      );

      if (!response.ok) {
        throw new Error("خطا در دریافت درخواست های ثبت شده.");
      }

      const data: ApiResponse = await response.json();

      if (!isApiSuccess(data)) {
        throw new Error(getApiErrorMessage(data));
      }

      setRegisteredRequests(
        mapApiResponseToRegisteredRequests(getApiValue(data)),
      );
    } catch (error) {
      setRegisteredRequests([]);
      setRegisteredRequestsError(
        error instanceof Error
          ? error.message
          : "خطا در دریافت درخواست های ثبت شده.",
      );
    } finally {
      setRegisteredRequestsLoading(false);
    }
  };

  const fetchNewRequestNumber = async () => {
    try {
      const token = normalizeAuthToken(localStorage.getItem("auth-token"));
      const response = await apiFetch("/api/request/new", {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت شماره درخواست جدید.");
      }

      const data: ApiResponse = await response.json();

      if (!isApiSuccess(data)) {
        throw new Error(getApiErrorMessage(data));
      }

      const requestNumber = getRequestNumberFromApiValue(getApiValue(data));

      if (requestNumber) {
        setRequestForm((prev) => ({ ...prev, id: requestNumber }));
        clearError("request.id");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        "request.id":
          error instanceof Error
            ? error.message
            : "خطا در دریافت شماره درخواست جدید.",
      }));
      setShowErrors(true);
    }
  };

  const applyFileCheckDataToForm = (rawValue: any, codeNosazi: string) => {
    const record = getListFromApiValue(rawValue)[0] ?? rawValue ?? {};
    const ownerList = [
      ...getListFromApiValue(record?.owners),
      ...getListFromApiValue(record?.Owners),
      ...getListFromApiValue(record?.malekin),
      ...getListFromApiValue(record?.Malekin),
    ];
    const ownerSource =
      firstObject(
        record?.owner,
        record?.Owner,
        record?.malek,
        record?.Malek,
        record?.melkVm,
        record?.MelkVm,
        ownerList[0],
      ) ?? record;
    const applicantSource =
      firstObject(
        record?.applicant,
        record?.Applicant,
        record?.motaghazi,
        record?.Motaghazi,
        record?.moteghazi,
        record?.Moteghazi,
      ) ?? record;

    const ownerFirstName = firstText(
      ownerSource.Name,
      ownerSource.name,
      ownerSource.firstName,
      ownerSource.FirstName,
    );
    const ownerLastName = firstText(
      ownerSource.Family,
      ownerSource.family,
      ownerSource.lastName,
      ownerSource.LastName,
    );
    const ownerNationalId = firstText(
      ownerSource.NationalCode,
      ownerSource.nationalCode,
      ownerSource.CodeMeli,
      ownerSource.codeMeli,
      ownerSource.ShenaseMeli,
      ownerSource.shenaseMeli,
      record.NationalCode,
      record.nationalCode,
      record.CodeMeli,
      record.codeMeli,
      record.ShenaseMeli,
      record.shenaseMeli,
    );
    const ownerName =
      firstText(
        ownerSource.FullName,
        ownerSource.fullName,
        ownerSource.Malek_Name,
        ownerSource.malek_Name,
        ownerSource.MalekName,
        ownerSource.malekName,
        ownerSource.Nam_malek,
        ownerSource.nam_malek,
        ownerSource.ownerName,
        ownerSource.OwnerName,
        ownerSource.moteghazi,
        ownerSource.Moteghazi,
        ownerSource.name,
        ownerSource.Name,
        record.Malek_Name,
        record.malek_Name,
        record.MalekName,
        record.malekName,
        record.Nam_malek,
        record.nam_malek,
        record.ownerName,
        record.OwnerName,
        record.moteghazi,
        record.Moteghazi,
      ) || [ownerFirstName, ownerLastName].filter(Boolean).join(" ");
    const ownerPhone = firstText(
      ownerSource.Mobile,
      ownerSource.mobile,
      ownerSource.Phone,
      ownerSource.phone,
      ownerSource.mob,
      ownerSource.tel,
      record.Mobile,
      record.mobile,
      record.Phone,
      record.phone,
      record.mob,
    );
    const ownerPostalCode = firstText(
      ownerSource.PostalCode,
      ownerSource.postalCode,
      ownerSource.codeposti,
      ownerSource.CodePosti,
      record.PostalCode,
      record.postalCode,
      record.codeposti,
    );
    const ownerAddress = firstText(
      ownerSource.Address,
      ownerSource.address,
      ownerSource.Address_Malek,
      ownerSource.address_Malek,
      record.Address,
      record.address,
      record.Address_Malek,
      record.address_Malek,
    );
    const applicantNationalId = firstText(
      applicantSource.applicantNationalCode,
      applicantSource.ApplicantNationalCode,
      applicantSource.NationalCode,
      applicantSource.nationalCode,
      applicantSource.CodeMeli,
      applicantSource.codeMeli,
      applicantSource.ShenaseMeli,
      applicantSource.shenaseMeli,
      record.applicantNationalCode,
      record.ApplicantNationalCode,
    );
    const applicantName = firstText(
      applicantSource.moteghazi,
      applicantSource.Moteghazi,
      applicantSource.FullName,
      applicantSource.fullName,
      applicantSource.name,
      record.moteghazi,
      record.Moteghazi,
    );
    const applicantPhone = firstText(
      applicantSource.applicantMobile,
      applicantSource.ApplicantMobile,
      applicantSource.Mobile,
      applicantSource.mobile,
      applicantSource.Phone,
      applicantSource.phone,
      record.applicantMobile,
      record.ApplicantMobile,
    );
    const applicantPostalCode = firstText(
      applicantSource.applicantPostalcode,
      applicantSource.ApplicantPostalcode,
      applicantSource.postalCode,
      applicantSource.PostalCode,
      record.applicantPostalcode,
      record.ApplicantPostalcode,
    );
    const applicantAddress = firstText(
      applicantSource.applicantAddress,
      applicantSource.ApplicantAddress,
      applicantSource.address,
      applicantSource.Address,
      record.applicantAddress,
      record.ApplicantAddress,
    );
    const buyerSource =
      firstObject(record?.buyer, record?.Buyer, record?.kharidar, record?.Kharidar) ??
      record;
    const buyerNationalId = firstText(
      buyerSource.BuyerNationalCode,
      buyerSource.buyerNationalCode,
      buyerSource.NationalCode,
      buyerSource.nationalCode,
      record.BuyerNationalCode,
      record.buyerNationalCode,
    );
    const buyerName = firstText(
      buyerSource.kharidar,
      buyerSource.Kharidar,
      buyerSource.name,
      buyerSource.Name,
      record.kharidar,
      record.Kharidar,
    );
    const buyerPhone = firstText(
      buyerSource.BuyerMobile,
      buyerSource.buyerMobile,
      buyerSource.Mobile,
      buyerSource.mobile,
      buyerSource.Phone,
      buyerSource.phone,
      record.BuyerMobile,
      record.buyerMobile,
    );

    setOwnerForm((prev) => ({
      identityType: ownerNationalId
        ? resolveIdentityType(
            firstText(ownerSource.MeliType, ownerSource.meliType, record.MeliType),
            ownerNationalId,
          )
        : prev.identityType,
      nationalId: ownerNationalId || prev.nationalId,
      name: ownerName || prev.name,
      phone: ownerPhone || prev.phone,
      postalCode: ownerPostalCode || prev.postalCode,
      address: ownerAddress || prev.address,
    }));

    setApplicantForm((prev) => {
      const nextNationalId = applicantNationalId || ownerNationalId || prev.nationalId;
      return {
        identityType: nextNationalId
          ? resolveIdentityType(
              firstText(
                applicantSource.applicantMeliType,
                applicantSource.ApplicantMeliType,
                applicantSource.MeliType,
                applicantSource.meliType,
                record.applicantMeliType,
              ),
              nextNationalId,
            )
          : prev.identityType,
        nationalId: nextNationalId,
        name: applicantName || ownerName || prev.name,
        phone: applicantPhone || ownerPhone || prev.phone,
        postalCode: applicantPostalCode || ownerPostalCode || prev.postalCode,
        address: applicantAddress || ownerAddress || prev.address,
      };
    });

    setRequestForm((prev) => ({
      id:
        prev.id ||
        firstText(record.shodarkhast, record.requestId, record.requestNo, record.id),
      type:
        firstText(record.noedarkhast, record.NoeDarkhast, record.requestTitle) ||
        prev.type,
      applicantType:
        firstText(record.noemot, record.NoeMot, record.applicantType) ||
        prev.applicantType,
    }));

    setComplementaryForm((prev) => ({
      letterNo: firstText(record.shonaame, record.letterNo, record.LetterNo) || prev.letterNo,
      letterDate:
        firstText(record.strtarikhnaame, record.letterDate, record.LetterDate) ||
        prev.letterDate,
      secretNo: firstText(record.showdabir, record.secretNo, record.SecretNo) || prev.secretNo,
      secretDate:
        firstText(record.strtarikhdabir, record.secretDate, record.SecretDate) ||
        prev.secretDate,
      office: firstText(record.sahebname, record.SahebName, record.office) || prev.office,
      desc: firstText(record.tozihat, record.Tozihat, record.desc, record.description) || prev.desc,
    }));

    setBuyerForm((prev) => ({
      identityType: buyerNationalId
        ? resolveIdentityType(
            firstText(
              buyerSource.BuyerMeliType,
              buyerSource.buyerMeliType,
              record.BuyerMeliType,
              record.buyerMeliType,
            ),
            buyerNationalId,
          )
        : prev.identityType,
      nationalId: buyerNationalId || prev.nationalId,
      name: buyerName || prev.name,
      phone: buyerPhone || prev.phone,
      transferShare:
        firstText(
          record.SahmeMoredeEnteghal,
          record.sahmeMoredeEnteghal,
          buyerSource.SahmeMoredeEnteghal,
        ) || prev.transferShare,
      totalTransferShare:
        firstText(
          record.SahmeKolleMoredeEnteghal,
          record.sahmeKolleMoredeEnteghal,
          buyerSource.SahmeKolleMoredeEnteghal,
        ) || prev.totalTransferShare,
    }));

    const shop = firstText(
      record.shop,
      record.Shop,
      record.shopId,
      record.ShopId,
      record.malekId,
      record.MalekId,
      ownerSource.shop,
      ownerSource.Shop,
    );

    setActiveProperty((prev) => {
      const current = prev ?? emptyProperty;
      return {
        ...current,
        id: shop || current.id,
        fullCode: codeNosazi || current.fullCode,
        ownerName: ownerName || current.ownerName,
        owner: {
          ...current.owner,
          firstName: ownerFirstName || current.owner.firstName,
          lastName: ownerLastName || current.owner.lastName,
          name: ownerName || current.owner.name,
          nationalId: ownerNationalId || current.owner.nationalId,
          phone: ownerPhone || current.owner.phone,
          postalCode: ownerPostalCode || current.owner.postalCode,
          address: ownerAddress || current.owner.address,
        },
      };
    });
  };

  const fetchFileCheckData = async (codeNosazi: string) => {
    const cleanCode = codeNosazi.trim();
    if (!cleanCode || cleanCode === "------") return;

    try {
      const token = normalizeAuthToken(localStorage.getItem("auth-token"));
      const response = await apiFetch(
        `/api/file/check?codeNosazi=${encodeURIComponent(cleanCode)}`,
        {
          method: "GET",
          cache: "no-store",
          headers: getAuthHeaders(token),
        },
      );
      const data = normalizeApiResponse(await response.json().catch(() => null));

      if (!response.ok) {
        throw new Error(getApiErrorMessage(data));
      }

      if (!isApiSuccess(data)) {
        throw new Error(getApiErrorMessage(data));
      }

      applyFileCheckDataToForm(getApiValue(data), cleanCode);
      setRequestSubmitError("");
    } catch (error) {
      setRequestSubmitError(
        error instanceof Error ? error.message : "خطا در دریافت اطلاعات پرونده.",
      );
    }
  };

  const applyPropertyToPage = (property: PropertyRecord) => {
    setActiveProperty(property);
    setSelectedShopValue(getUploadShopValue(property));
    setSelectedCodeNodeTree(getUploadCodeNodeTreeValue(property));

    setOwnerForm({
      identityType: getIdentityTypeFromValue(property.owner.nationalId),
      nationalId: property.owner.nationalId,
      name: property.owner.name,
      phone: property.owner.phone,
      postalCode: property.owner.postalCode,
      address: property.owner.address,
    });

    setRequestForm((prev) => ({
      id: prev.id || property.registration.request.id,
      type: property.registration.request.type,
      applicantType: property.registration.request.applicantType,
    }));

    setApplicantForm({
      identityType: getIdentityTypeFromValue(property.owner.nationalId),
      nationalId: property.owner.nationalId,
      name: property.owner.name,
      phone: property.owner.phone,
      postalCode: property.owner.postalCode,
      address: property.owner.address,
    });

    setComplementaryForm({
      letterNo: property.registration.complementary.letterNo,
      letterDate: property.registration.complementary.letterDate,
      secretNo: property.registration.complementary.secretNo,
      secretDate: property.registration.complementary.secretDate,
      office: property.registration.complementary.office,
      desc: property.registration.complementary.desc,
    });

    setBuyerForm({
      identityType: getIdentityTypeFromValue(property.registration.buyer.nationalId),
      nationalId: property.registration.buyer.nationalId,
      name: property.registration.buyer.name,
      phone: property.registration.buyer.phone,
      transferShare: property.registration.buyer.share,
      totalTransferShare: "",
    });

    setErrors({});
    setShowErrors(false);
    setRequestSubmitError("");
    setUploadError("");
  };

  useEffect(() => {
    void fetchNewRequestNumber();
  }, []);

  // ✅ داده‌های سلکشن را از اول فچ کن - قبل از اینکه صفحه رندر شود
  useEffect(() => {
    if (isOwnerApplicantType(requestForm.applicantType)) {
      setApplicantForm((prev) => {
        if (
          prev.identityType === ownerForm.identityType &&
          prev.nationalId === ownerForm.nationalId &&
          prev.name === ownerForm.name &&
          prev.phone === ownerForm.phone &&
          prev.postalCode === ownerForm.postalCode &&
          prev.address === ownerForm.address
        ) {
          return prev;
        }

        return {
          identityType: ownerForm.identityType,
          nationalId: ownerForm.nationalId,
          name: ownerForm.name,
          phone: ownerForm.phone,
          postalCode: ownerForm.postalCode,
          address: ownerForm.address,
        };
      });
    }
  }, [
    ownerForm.name,
    ownerForm.nationalId,
    ownerForm.phone,
    ownerForm.postalCode,
    ownerForm.address,
    ownerForm.identityType,
    requestForm.applicantType,
  ]);

  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const token = normalizeAuthToken(localStorage.getItem("auth-token"));
        const shop =
          activeProperty?.id ||
          selectedProperty.id ||
          localStorage.getItem("shop") ||
          "";

        const requestTypeUrl = `/api/request/type?shop=${encodeURIComponent(shop)}`;

        const [requestTypeRes, applicantTypeRes, officeRes] = await Promise.all(
          [
            apiFetch(requestTypeUrl, {
              headers: getAuthHeaders(token),
            }),
            apiFetch("/api/request/applicant", {
              headers: getAuthHeaders(token),
            }),
            apiFetch("/api/request/office", {
              headers: getAuthHeaders(token),
            }),
          ],
        );

        if (requestTypeRes.ok) {
          const requestTypeData: ApiResponse = await requestTypeRes.json();
          if (isApiSuccess(requestTypeData)) {
            const extracted = extractLookupOptions(
              getApiValue(requestTypeData),
              requestTypeLabelKeys,
              requestTypeCodeKeys,
            );
            setRequestTypeOptions(extracted);
            setRequestTypeItems(extracted.map((item) => item.label));
          }
        }

        if (applicantTypeRes.ok) {
          const applicantTypeData: ApiResponse = await applicantTypeRes.json();
          if (isApiSuccess(applicantTypeData)) {
            const extracted = extractLookupOptions(
              getApiValue(applicantTypeData),
              applicantTypeLabelKeys,
              applicantTypeCodeKeys,
            );
            setApplicantTypeOptions(extracted);
            setApplicantTypeItems(extracted.map((item) => item.label));
          }
        }

        if (officeRes.ok) {
          const officeData: ApiResponse = await officeRes.json();
          if (isApiSuccess(officeData)) {
            const extracted = extractLookupOptions(
              getApiValue(officeData),
              officeLabelKeys,
              officeCodeKeys,
            );
            setOfficeOptions(extracted);
            setOfficeItems(extracted.map((item) => item.label));
          }
        }
      } catch {}
    };

    fetchSelectOptions();
  }, [activeProperty?.id, selectedProperty.id]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = normalizeAuthToken(localStorage.getItem("auth-token"));
        const nationalCode = localStorage.getItem("user-national-code");

        if (!token || !nationalCode) return;

        const response = await dotNet10ApiFetch(
          `/api/Files/${encodeURIComponent(nationalCode)}`,
          {
            cache: "no-store",
            headers: getAuthHeaders(token),
          },
        );

        if (!response.ok) return;

        const data: ApiResponse = await response.json();

        if (!isApiSuccess(data)) return;

        const rawList = flattenApiPropertyFiles(getListFromApiValue(getApiValue(data)));

        const base = emptyProperty;

        const mapped: PropertyRecord[] = rawList.map(
          (item: any, index: number) => {
            const fileShop = getFileShopValue(item);
            const codeNodeTree = firstText(getFileCodeNodeTreeValue(item));
            const fullCode = firstText(
              item.codeN,
              item.CodeN,
              item.fullCode,
              item.codeNosazi,
              item.CodeNosazi,
              base.fullCode,
            );
            const codeParts = String(fullCode || "0-0-0-0-0-0-0").split("-");
            const ownerFirstName = firstText(
              item.Name,
              item.firstName,
              item.owner?.firstName,
              item.MelkVm?.Name,
            );
            const ownerLastName = firstText(
              item.Family,
              item.lastName,
              item.owner?.lastName,
              item.MelkVm?.Family,
            );
            const resolvedOwnerName =
              firstText(
                item.FullName,
                item.fullName,
                item.Malek_Name,
                item.malek_Name,
                item.MalekName,
                item.malekName,
                item.Nam_malek,
                item.nam_malek,
                item.ownerName,
                item.owner?.name,
                item.owner?.Malek_Name,
                item.owner?.MalekName,
                item.MelkVm?.FullName,
                item.MelkVm?.Malek_Name,
                item.MelkVm?.MalekName,
                item.MelkVm?.ownerName,
              ) ||
              [ownerFirstName, ownerLastName].filter(Boolean).join(" ") ||
              "—";

            const ownerName = item.FullName ?? "—";

            const mappedRecord: PropertyRecord = {
              ...base,
              id: String(fileShop ?? ""),
              rowNumber: String(index + 1),
              fullCode,
              ownerName: resolvedOwnerName,
              description:
                item.tvItems?.[0]?.Text?.trim() ||
                fullCode ||
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
                firstName: ownerFirstName,
                lastName: ownerLastName,
                name: resolvedOwnerName,
                nationalId: firstText(
                  item.NationalCode,
                  item.nationalCode,
                  item.CodeMeli,
                  item.codeMeli,
                  item.ShenaseMeli,
                  item.shenaseMeli,
                  item.owner?.nationalId,
                  item.owner?.NationalCode,
                  item.owner?.nationalCode,
                  item.owner?.CodeMeli,
                  item.owner?.codeMeli,
                  item.MelkVm?.NationalCode,
                  item.MelkVm?.nationalCode,
                  item.MelkVm?.CodeMeli,
                  item.MelkVm?.codeMeli,
                  nationalCode,
                ),
                phone: firstText(
                  item.Mobile,
                  item.mobile,
                  item.Phone,
                  item.phone,
                  item.mob,
                  item.tel,
                  item.owner?.phone,
                  item.owner?.mob,
                  item.MelkVm?.mobile,
                  item.MelkVm?.mob,
                  item.MelkVm?.tel,
                  item.MelkVm?.phone,
                ),
                postalCode: firstText(
                  item.PostalCode,
                  item.postalCode,
                  item.codeposti,
                  item.CodePosti,
                  item.owner?.postalCode,
                  item.owner?.codeposti,
                  item.owner?.CodePosti,
                  item.MelkVm?.codeposti,
                  item.MelkVm?.CodePosti,
                  item.MelkVm?.postalCode,
                ),
                address: firstText(
                  item.Address,
                  item.address,
                  item.Address_Malek,
                  item.address_Malek,
                  item.owner?.address,
                  item.owner?.Address_Malek,
                  item.owner?.address_Malek,
                  item.MelkVm?.address,
                  item.MelkVm?.Address_Malek,
                  item.MelkVm?.address_Malek,
                ),
                ownerType: firstText(
                  item.NoeMalek,
                  item.ownerType,
                  item.owner?.ownerType,
                  item.MelkVm?.NoeMalek,
                ),
                fatherName: firstText(
                  item.Father,
                  item.fatherName,
                  item.owner?.fatherName,
                  item.MelkVm?.Father,
                ),
                birthPlace: firstText(
                  item.BirthPlace,
                  item.birthPlace,
                  item.owner?.birthPlace,
                  item.MelkVm?.BirthPlace,
                ),
                issuePlace: firstText(
                  item.Sodor,
                  item.issuePlace,
                  item.owner?.issuePlace,
                  item.MelkVm?.Sodor,
                ),
              },
            };

            return Object.assign(mappedRecord, {
              shop: String(fileShop ?? ""),
              codeNodeTree,
              raw: item,
            });
          },
        );

        if (mapped.length > 0) {
          const storedFullCode = getSelectedPropertyFullCode();
          const matchedStoredProperty = storedFullCode
            ? mapped.find(
                (property) =>
                  normalizeRenewalCode(property.fullCode) ===
                  normalizeRenewalCode(storedFullCode),
              )
            : null;
          const propertyToSelect = matchedStoredProperty ?? mapped[0];
          const codeToSelect = storedFullCode || propertyToSelect.fullCode;

          setPropertyItems(mapped);
          setSelectedTreeItemId(
            localStorage.getItem(selectedPropertyStorageKey) ??
              propertyToSelect.id,
          );
          setSearchValues(
            matchedStoredProperty
              ? propertyToSelect.codes
              : buildValuesFromCode(codeToSelect),
          );
          applyPropertyToPage(propertyToSelect);
          void fetchFileCheckData(codeToSelect);
          void fetchRegisteredRequests(codeToSelect);
        }
      } catch {}
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
    const codeNosazi = buildCodeFromValues(searchValues);
    const found = propertyItems.find((property) =>
      areRenewalCodesEqual(property.codes, searchValues),
    );

    if (found) {
      applyPropertyToPage(found);
      setSelectedTreeItemId(found.id);
      void fetchFileCheckData(
        found.fullCode || buildCodeFromValues(found.codes),
      );
      void fetchRegisteredRequests(
        found.fullCode || buildCodeFromValues(found.codes),
      );
    } else {
      setActiveProperty({
        ...emptyProperty,
        fullCode: codeNosazi,
        codes: searchValues,
      });
      setSelectedTreeItemId("");
      setSelectedShopValue("");
      setSelectedCodeNodeTree("");
      setRegisteredRequests([]);
      setRegisteredRequestsError("");
      void fetchFileCheckData(codeNosazi);
      void fetchRegisteredRequests(codeNosazi);
    }
  };

  const getCurrentCodeNosazi = () =>
    activeProperty?.fullCode || buildCodeFromValues(searchValues);

  const getCurrentShopValue = () =>
    selectedShopValue ||
    getUploadShopValue(activeProperty) ||
    getUploadShopValue(selectedProperty) ||
    activeProperty?.id ||
    selectedProperty.id ||
    localStorage.getItem("shop") ||
    selectedTreeItemId;

  const getCurrentShopNumber = () => toNumber(getCurrentShopValue());

  const getCurrentCodeNodeTree = () =>
    selectedCodeNodeTree ||
    getUploadCodeNodeTreeValue(activeProperty) ||
    getUploadCodeNodeTreeValue(selectedProperty) ||
    localStorage.getItem(selectedPropertyStorageKey) ||
    selectedTreeItemId ||
    "";

  const getMeliType = (identityType: "1" | "2") => identityType;

  const buildRequestPayload = () => {
    const requestTypeCode = getLookupCode(requestTypeOptions, requestForm.type);
    const applicantTypeCode = getLookupCode(
      applicantTypeOptions,
      requestForm.applicantType,
    );
    const officeCode = getLookupCode(officeOptions, complementaryForm.office);
    const agreementTypeCode = toNumber(vakadari) ?? 0;

    return {
      shop: getCurrentShopNumber() ?? 0,
      c_nosazi: getCurrentCodeNosazi(),
      MeliType: getMeliType(ownerForm.identityType),
      NationalCode: ownerForm.nationalId.trim(),
      Malek_Name: ownerForm.name.trim(),
      mob: ownerForm.phone.trim(),
      codeposti: ownerForm.postalCode.trim(),
      Address_Malek: ownerForm.address.trim(),
      shodarkhast: toNumber(requestForm.id) ?? 0,
      noedarkhast: requestForm.type.trim(),
      c_noedarkhast: requestTypeCode ?? 0,
      noemot: requestForm.applicantType.trim(),
      c_noemot: applicantTypeCode ?? 0,
      applicantMeliType: getMeliType(applicantForm.identityType),
      applicantNationalCode: applicantForm.nationalId.trim(),
      moteghazi: applicantForm.name.trim(),
      applicantMobile: applicantForm.phone.trim(),
      AgreementType: getAgreementTypeLabel(vakadari),
      C_AgreementType: agreementTypeCode,
      applicantPostalcode: applicantForm.postalCode.trim(),
      applicantAddress: applicantForm.address.trim(),
      shonaame: complementaryForm.letterNo.trim(),
      strtarikhnaame: complementaryForm.letterDate.trim(),
      showdabir: complementaryForm.secretNo.trim(),
      strtarikhdabir: complementaryForm.secretDate.trim(),
      sahebname: complementaryForm.office.trim(),
      C_Estelam: officeCode ?? 0,
      tozihat: complementaryForm.desc.trim(),
      BuyerMeliType: buyerForm.nationalId.trim()
        ? getMeliType(buyerForm.identityType)
        : "",
      BuyerNationalCode: buyerForm.nationalId.trim(),
      kharidar: buyerForm.name.trim(),
      BuyerMobile: buyerForm.phone.trim(),
      SahmeMoredeEnteghal: toNumber(buyerForm.transferShare) ?? 0,
      SahmeKolleMoredeEnteghal: toNumber(buyerForm.totalTransferShare) ?? 0,
    };
  };

  const fetchLackDocuments = async (requestId: string) => {
    const shod = toNumber(requestId);

    if (!shod) {
      setLackDocuments([]);
      setLackDocumentsError("شماره درخواست برای دریافت کسری مدارک معتبر نیست.");
      return [];
    }

    setLackDocumentsLoading(true);
    setLackDocumentsError("");

    try {
      const token = normalizeAuthToken(localStorage.getItem("auth-token"));
      const response = await apiFetch(
        `/api/request/Lack?shod=${encodeURIComponent(String(shod))}`,
        {
          method: "GET",
          headers: getAuthHeaders(token),
        },
      );
      const data = await readApiResponse(
        response,
        "خطا در دریافت کسری مدارک.",
      );

      const documents = mapApiResponseToLackDocuments(getApiValue(data));
      setLackDocuments(documents);
      return documents;
    } catch (error) {
      setLackDocuments([]);
      setLackDocumentsError(
        error instanceof Error ? error.message : "خطا در دریافت کسری مدارک.",
      );
      return [];
    } finally {
      setLackDocumentsLoading(false);
    }
  };

  const fetchDefectStatus = async (requestId: string) => {
    const id = toNumber(requestId);

    if (!id) {
      setDefectIsDefense(false);
      return false;
    }

    const token = normalizeAuthToken(localStorage.getItem("auth-token"));
    const response = await apiFetch(
      `/api/request/Defect?id=${encodeURIComponent(String(id))}`,
      {
        method: "GET",
        headers: getAuthHeaders(token),
      },
    );
    const data = await readApiResponse(response, "خطا در دریافت وضعیت نقص مدارک.");
    const isDefense = getDefectIsDefense(getApiValue(data));

    setDefectIsDefense(isDefense);
    return isDefense;
  };

  const prepareUploadRequirements = async () => {
    return { documents: [] as LackDocumentItem[], isDefense: false };
  };

  const handleContinue = async () => {
    const nextErrors = validateForm();
    const payload = buildRequestPayload();

    if (!payload.shop) {
      setRequestSubmitError("شناسه پرونده برای ثبت درخواست معتبر نیست.");
      setShowErrors(true);
      return;
    }

    if (!payload.shodarkhast) {
      nextErrors["request.id"] = "شماره درخواست معتبر نیست";
    }
    if (!payload.c_noedarkhast) {
      nextErrors["request.type"] = "کد نوع درخواست معتبر نیست";
    }
    if (!payload.c_noemot) {
      nextErrors["request.applicantType"] = "کد نوع متقاضی معتبر نیست";
    }
    if (complementaryForm.office.trim() && !payload.C_Estelam) {
      nextErrors["complementary.office"] = "کد اداره استعلام کننده معتبر نیست";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setShowErrors(true);
      setRequestSubmitError("");

      document.querySelector("[data-has-error='true']")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    setErrors({});
    setShowErrors(false);
    setRequestSubmitError("");
    setIsSubmittingRequest(true);

    try {
      const token = normalizeAuthToken(localStorage.getItem("auth-token"));
      if (!token) throw new Error("توکن احراز هویت یافت نشد.");

      const response = await apiFetch("/api/request", {
        method: "POST",
        headers: getAuthHeaders(token, "application/json"),
        body: JSON.stringify(payload),
      });
      const data = await readApiResponse(response, "خطا در ثبت درخواست.");
      const createdRequestId =
        getRequestNumberFromApiValue(getApiValue(data)) ||
        String(payload.shodarkhast);

      setRegisteredRequestId(createdRequestId);
      setRequestForm((prev) => ({ ...prev, id: createdRequestId }));
      setLackDocuments([]);
      setLackDocumentsError("");
      setDefectIsDefense(false);
      setUploadError("");
      setStep("upload");
    } catch (error) {
      setRequestSubmitError(
        error instanceof Error ? error.message : "خطا در ثبت درخواست.",
      );
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleUploadSubmit = async (files: File[]) => {
    const token = normalizeAuthToken(localStorage.getItem("auth-token"));
    const shod = toNumber(registeredRequestId || requestForm.id);
    const shop = getCurrentShopNumber();
    const codeN = getCurrentCodeNosazi();
    const codeNodeTree = getCurrentCodeNodeTree();

    if (!token) {
      setUploadError("توکن احراز هویت یافت نشد.");
      return;
    }

    if (!shod || !shop || !codeN || !codeNodeTree) {
      setUploadError("اطلاعات پرونده برای آپلود مدارک کامل نیست.");
      return;
    }

    setUploadError("");
    setIsUploadingFiles(true);

    try {
      const isDefense =
        defectIsDefense ||
        lackDocuments.some((doc) => doc.isDefense);

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("Shop", String(shop));
        formData.append("Shod", String(shod));
        formData.append("CodeN", codeN);
        formData.append("CodeNodeTree", codeNodeTree);
        formData.append("IsDefense", String(isDefense));

        const response = await apiFetch("/api/archive/upload", {
          method: "POST",
          headers: getAuthHeaders(token),
          body: formData,
        });

        await readApiResponse(response, "خطا در آپلود مدارک.");
      }

      setStep("success");
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "خطا در آپلود مدارک.",
      );
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  const handlePropertyTreeSelect = (property: PropertyItem, treeItem: PropertyTreeItem) => {
    setSelectedTreeItemId(treeItem.id);
    setSelectedShopValue(
      getUploadShopValue(treeItem) ||
        getUploadShopValue(property) ||
        treeItem.id ||
        property.id,
    );
    setSelectedCodeNodeTree(
      getUploadCodeNodeTreeValue(treeItem) ||
        getUploadCodeNodeTreeValue(property),
    );
    setRegisteredRequestId("");
    setLackDocuments([]);
    setLackDocumentsError("");
    setDefectIsDefense(false);
    setUploadError("");

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
    const selectedFullCode = treeItem.fullCode || property.fullCode;
    const parts = selectedFullCode.split("-").map(p => p.trim()).filter(Boolean);
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
      normalizeRenewalCode(p.fullCode) === normalizeRenewalCode(selectedFullCode) ||
      p.id === property.id ||
      p.id === treeItem.id
    );
    
    if (matchedProperty) {
      applyPropertyToPage(matchedProperty);
      setSearchValues(codes);
      void fetchFileCheckData(
        selectedFullCode ||
          matchedProperty.fullCode ||
          buildCodeFromValues(codes),
      );
      void fetchRegisteredRequests(
        selectedFullCode ||
          matchedProperty.fullCode ||
          buildCodeFromValues(codes),
      );
    } else {
      const fallbackBase = activeProperty ?? selectedProperty;

      setActiveProperty({
        ...fallbackBase,
        id: property.id || fallbackBase.id,
        fullCode: selectedFullCode || fallbackBase.fullCode,
        description: property.description || fallbackBase.description,
      });
      setSearchValues(codes);
      void fetchFileCheckData(selectedFullCode || buildCodeFromValues(codes));
      void fetchRegisteredRequests(selectedFullCode || buildCodeFromValues(codes));
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
      return;
    }

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
                onSubmit={handleUploadSubmit}
                lackDocuments={lackDocuments}
                lackDocumentsLoading={lackDocumentsLoading}
                lackDocumentsError={lackDocumentsError}
                uploadError={uploadError}
                isSubmitting={isUploadingFiles}
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
                  buyerForm={buyerForm}
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
                  setBuyerForm={setBuyerForm}
                  setVakadari={setVakadari}
                  setActiveDatePicker={setActiveDatePicker}
                  clearError={clearError}
                  openSelection={openSelection}
                  onContinue={handleContinue}
                  submitError={requestSubmitError}
                  isSubmitting={isSubmittingRequest}
                />

                <SabtdarkhastFormSecondary
                  activeProperty={activeProperty}
                  requests={registeredRequests}
                  loading={registeredRequestsLoading}
                  error={registeredRequestsError}
                  onOpenHelp={handleOpenHelp}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

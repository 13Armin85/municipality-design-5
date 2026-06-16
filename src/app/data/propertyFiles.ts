import { dotNet10ApiFetch } from "./api";
import {
  getApiValue,
  isApiSuccess,
  type ApiResponse,
} from "../utils/apiResponseHandler";

export interface PropertyTreeItem {
  id: string;
  text: string;
  fullCode: string;
  items: PropertyTreeItem[];
  shop?: string;
  codeTree?: string;
  type?: string;
  raw?: any;
}

export interface PropertyItem {
  id: string;
  fullCode: string;
  description: string;
  treeItems: PropertyTreeItem[];
  shop?: string;
  codeTree?: string;
  type?: string;
  raw?: any;
}

const getTextValue = (value: unknown) =>
  value === null || value === undefined ? "" : String(value).trim();

const firstText = (...values: unknown[]) =>
  values.map(getTextValue).find(Boolean) ?? "";

const firstDefined = (...values: unknown[]) =>
  values.find(
    (value) =>
      value !== null && value !== undefined && String(value).trim() !== "",
  );

const decodeJwtPayload = (token: string | null) => {
  const rawPayload = token?.replace(/^Bearer\s+/i, "").split(".")[1];
  if (!rawPayload) return null;

  try {
    const base64 = rawPayload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
};

export const getCurrentUserNationalCode = (token?: string | null) => {
  if (typeof window === "undefined") return "";

  const storedCode = localStorage.getItem("user-national-code");
  if (storedCode?.trim()) return storedCode.trim();

  const payload = decodeJwtPayload(token ?? localStorage.getItem("auth-token"));
  const claimValue = firstText(
    payload?.NationalCode,
    payload?.nationalCode,
    payload?.national_code,
    payload?.CodeMeli,
    payload?.codeMeli,
    payload?.[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nationalcode"
    ],
  );

  if (claimValue) {
    localStorage.setItem("user-national-code", claimValue);
  }

  return claimValue;
};

export async function fetchCurrentUserPropertyFiles(
  token?: string | null,
): Promise<ApiResponse> {
  const authToken =
    token ??
    (typeof window !== "undefined" ? localStorage.getItem("auth-token") : "");
  const nationalCode = getCurrentUserNationalCode(authToken);

  if (!authToken) {
    throw new Error("Missing auth token");
  }

  if (!nationalCode) {
    throw new Error("Missing national code");
  }

  const response = await dotNet10ApiFetch(
    `/api/Files/${encodeURIComponent(nationalCode)}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: authToken.startsWith("Bearer ")
          ? authToken
          : `Bearer ${authToken}`,
      },
    },
  );

  if (response.status === 404) {
    return { isSuccess: true, isFailure: false, value: [] };
  }

  if (!response.ok) {
    throw new Error("Failed to fetch property files");
  }

  return response.json();
}

export const getPropertyFileList = (data: ApiResponse | any): any[] => {
  const value = isApiSuccess(data) ? getApiValue(data) : data;

  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  const nestedValue = value.Value ?? value.value;
  if (Array.isArray(nestedValue)) return nestedValue;

  const nestedList =
    value.items ??
    value.Items ??
    value.data ??
    value.Data ??
    value.files ??
    value.Files ??
    value.result ??
    value.Result ??
    value.results ??
    value.Results;

  if (Array.isArray(nestedList)) return nestedList;
  if (nestedList && typeof nestedList === "object") return [nestedList];

  return [value];
};

export const getPropertyFullCode = (item: any) =>
  firstText(
    item?.codeNosazi,
    item?.CodeNosazi,
    item?.codeN,
    item?.CodeN,
    item?.fullCode,
    item?.FullCode,
  );

export const getPropertyShop = (item: any) =>
  firstDefined(
    item?.shop,
    item?.Shop,
    item?.shopId,
    item?.ShopId,
    item?.malekId,
    item?.MalekId,
    item?.id,
    item?.Id,
  );

export const getPropertyCodeTree = (item: any) =>
  firstDefined(item?.codeTree, item?.CodeTree, item?.codeNodeTree, item?.CodeNodeTree);

const getTreeNodeCode = (text = "") => text.split(" - ")[0]?.trim() ?? "";

export const mapApiFileToTreeItem = (
  item: any,
  index = 0,
  fallbackCode = "",
): PropertyTreeItem => {
  const fullCode =
    getPropertyFullCode(item) ||
    getTreeNodeCode(item?.Text ?? item?.text) ||
    fallbackCode;
  const type = firstText(item?.type, item?.Type);
  const legacyText = firstText(item?.Text, item?.text);
  const text = legacyText || [fullCode, type].filter(Boolean).join(" - ") || "-";
  const shop = getPropertyShop(item);
  const codeTree = getPropertyCodeTree(item);
  const children = item?.children ?? item?.Children ?? item?.Items ?? item?.items;

  return {
    id: String(shop ?? item?.Id ?? item?.id ?? `${fullCode || "node"}-${index}`),
    text,
    fullCode,
    items: (Array.isArray(children) ? children : []).map(
      (child, childIndex) => mapApiFileToTreeItem(child, childIndex, fullCode),
    ),
    shop: shop === undefined ? undefined : String(shop),
    codeTree: codeTree === undefined ? undefined : String(codeTree),
    type,
    raw: item,
  };
};

export const mapApiFilesToTreeProperties = (rawList: any[]): PropertyItem[] =>
  rawList.map((item, index) => {
    const node = mapApiFileToTreeItem(item, index);
    return {
      id: node.shop ?? node.id,
      fullCode: node.fullCode || "-",
      description: node.text || node.fullCode || "-",
      treeItems: [node],
      shop: node.shop,
      codeTree: node.codeTree,
      type: node.type,
      raw: item,
    };
  });

export const flattenApiPropertyFiles = (rawList: any[]): any[] => {
  const result: any[] = [];

  const visit = (item: any) => {
    const fullCode = getPropertyFullCode(item);
    const shop = getPropertyShop(item);

    result.push({
      ...item,
      codeN: item?.codeN ?? item?.CodeN ?? fullCode,
      fullCode: item?.fullCode ?? item?.FullCode ?? fullCode,
      shop: item?.shop ?? item?.Shop ?? shop,
    });

    const children = item?.children ?? item?.Children ?? item?.Items ?? item?.items;
    if (Array.isArray(children)) children.forEach(visit);
  };

  rawList.forEach(visit);
  return result;
};

export const flattenTreeProperties = (
  properties: PropertyItem[],
): PropertyTreeItem[] => {
  const result: PropertyTreeItem[] = [];

  const visit = (node: PropertyTreeItem) => {
    result.push(node);
    node.items.forEach(visit);
  };

  properties.forEach((property) => property.treeItems.forEach(visit));
  return result;
};

export const getInitialExpandedTreeIds = (items: PropertyTreeItem[]) => {
  const ids: string[] = [];

  const collectExpandedParents = (node: PropertyTreeItem) => {
    if (node.items.length > 0) ids.push(node.id);
    node.items.forEach(collectExpandedParents);
  };

  items.forEach(collectExpandedParents);
  return ids;
};

export const findTreeItemByFullCode = (
  items: PropertyTreeItem[],
  fullCode: string,
  normalizeCode: (code: string | null | undefined) => string,
): PropertyTreeItem | null => {
  const normalizedCode = normalizeCode(fullCode);

  for (const item of items) {
    if (normalizeCode(item.fullCode) === normalizedCode) return item;

    const childMatch = findTreeItemByFullCode(item.items, fullCode, normalizeCode);
    if (childMatch) return childMatch;
  }

  return null;
};

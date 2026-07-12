import { dotNet10ApiFetch } from "./api";
import { AUTH_TOKEN_KEY } from "../utils/authStorage";

export interface AdminUser {
  id: string;
  name: string;
  family: string;
  nationalCode: string;
  phoneNumber: string;
  userName: string;
  isActive: boolean;
  roleId: string;
  roleName: string;
  email: string;
  address: string;
  picture: string;
  birthDay: string;
}

export interface AdminRole {
  id: string;
  name: string;
}

export interface CreateAdminUser {
  name: string;
  family: string;
  userName: string;
  nationalCode: string;
  phoneNumber: string;
  password: string;
  repeatPassword: string;
  roleId: string;
  email?: string;
  address?: string;
  picture?: File | null;
  birthDay?: string;
}

export interface UpdateAdminUser {
  id: string;
  name: string;
  family: string;
  phoneNumber: string;
  nationalCode: string;
  userName: string;
  roleId: string;
  email?: string;
  address?: string;
  picture?: File | null;
  birthDay?: string;
}

export interface ChangeAdminUserPassword {
  userId: string;
  password: string;
  repeatPassword: string;
}

type ApiEnvelope<T = unknown> = {
  isSuccess?: boolean;
  IsSuccess?: boolean;
  isFailure?: boolean;
  IsFailure?: boolean;
  code?: string;
  name?: string;
  message?: string;
  Message?: string;
  error?: { code?: string; name?: string; description?: string };
  Error?: { Code?: string; Name?: string; Description?: string };
  errors?: unknown;
  Errors?: unknown;
  modelState?: unknown;
  ModelState?: unknown;
  value?: T;
  Value?: T;
};

type RawAdminUser = Partial<AdminUser> & {
  Id?: string;
  Name?: string;
  Family?: string;
  NationalCode?: string;
  PhoneNumber?: string;
  UserName?: string;
  IsActive?: boolean;
  RoleId?: string;
  RoleName?: string;
  Email?: string | null;
  Address?: string | null;
  Picture?: string | null;
  BirthDay?: string | null;
};

type RawAdminRole = Partial<AdminRole> & {
  Id?: string;
  Name?: string;
};

const USERS_ENDPOINT = "/api/admin/users";
const USER_ROLES_ENDPOINT = "/api/admin/users/roles";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)?.replace(/^Bearer\s+/i, "");

  return {
    Accept: "application/json, text/plain, */*",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function collectMessages(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectMessages);

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(
      collectMessages,
    );
  }

  return [];
}

function getErrorMessage(data: ApiEnvelope, fallback: string) {
  const messages = [
    data.name,
    data.message,
    data.Message,
    data.error?.name,
    data.error?.description,
    data.Error?.Name,
    data.Error?.Description,
    ...collectMessages(data.errors),
    ...collectMessages(data.Errors),
    ...collectMessages(data.modelState),
    ...collectMessages(data.ModelState),
  ].filter(Boolean);

  return messages.length > 0 ? messages.join(" ") : fallback;
}

function normalizeAdminUser(user: RawAdminUser): AdminUser {
  return {
    id: user.id ?? user.Id ?? "",
    name: user.name ?? user.Name ?? "",
    family: user.family ?? user.Family ?? "",
    nationalCode: user.nationalCode ?? user.NationalCode ?? "",
    phoneNumber: user.phoneNumber ?? user.PhoneNumber ?? "",
    userName: user.userName ?? user.UserName ?? "",
    isActive: user.isActive ?? user.IsActive ?? false,
    roleId: user.roleId ?? user.RoleId ?? "",
    roleName: user.roleName ?? user.RoleName ?? "",
    email: user.email ?? user.Email ?? "",
    address: user.address ?? user.Address ?? "",
    picture: user.picture ?? user.Picture ?? "",
    birthDay: user.birthDay ?? user.BirthDay ?? "",
  };
}

function normalizeAdminRole(role: RawAdminRole): AdminRole {
  return {
    id: role.id ?? role.Id ?? "",
    name: role.name ?? role.Name ?? "",
  };
}

async function parseResponse<T>(response: Response): Promise<ApiEnvelope<T>> {
  const text = await response.text();
  let data: ApiEnvelope<T> = {};

  if (text) {
    try {
      data = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      if (!response.ok) {
        throw new Error(text);
      }
    }
  }

  const isSuccess = data.isSuccess ?? data.IsSuccess;
  const isFailure = data.isFailure ?? data.IsFailure;
  if (!response.ok || isSuccess === false || (isSuccess !== true && isFailure === true)) {
    throw new Error(getErrorMessage(data, "انجام عملیات کاربران با خطا مواجه شد."));
  }

  return data;
}

function appendFormValue(
  formData: FormData,
  key: string,
  value: string | File | null | undefined,
) {
  if (typeof File !== "undefined" && value instanceof File) {
    if (value.size > 0) formData.append(key, value, value.name);
    return;
  }

  if (value !== undefined && value !== null) {
    formData.append(key, String(value));
  }
}

function toCreateAdminUserFormData(user: CreateAdminUser) {
  const formData = new FormData();

  appendFormValue(formData, "Name", user.name);
  appendFormValue(formData, "Family", user.family);
  appendFormValue(formData, "UserName", user.userName);
  appendFormValue(formData, "NationalCode", user.nationalCode);
  appendFormValue(formData, "PhoneNumber", user.phoneNumber);
  appendFormValue(formData, "Password", user.password);
  appendFormValue(formData, "RepeatPassword", user.repeatPassword);
  appendFormValue(formData, "RoleId", user.roleId);
  appendFormValue(formData, "Email", user.email);
  appendFormValue(formData, "Address", user.address);
  appendFormValue(formData, "Picture", user.picture);
  appendFormValue(formData, "BirthDay", user.birthDay);

  return formData;
}

function toUpdateAdminUserFormData(user: UpdateAdminUser) {
  const formData = new FormData();

  appendFormValue(formData, "Id", user.id);
  appendFormValue(formData, "Name", user.name);
  appendFormValue(formData, "Family", user.family);
  appendFormValue(formData, "PhoneNumber", user.phoneNumber);
  appendFormValue(formData, "NationalCode", user.nationalCode);
  appendFormValue(formData, "UserName", user.userName);
  appendFormValue(formData, "RoleId", user.roleId);
  appendFormValue(formData, "Email", user.email);
  appendFormValue(formData, "Address", user.address);
  appendFormValue(formData, "Picture", user.picture);
  appendFormValue(formData, "BirthDay", user.birthDay);

  return formData;
}

export async function fetchAdminUsers(
  signal?: AbortSignal,
): Promise<AdminUser[]> {
  const response = await dotNet10ApiFetch(USERS_ENDPOINT, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await parseResponse<RawAdminUser[]>(response);
  return (data.value ?? data.Value ?? []).map(normalizeAdminUser);
}

export async function fetchAdminRoles(
  signal?: AbortSignal,
): Promise<AdminRole[]> {
  const response = await dotNet10ApiFetch(USER_ROLES_ENDPOINT, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await parseResponse<RawAdminRole[]>(response);
  return (data.value ?? data.Value ?? []).map(normalizeAdminRole);
}

export async function createAdminUser(
  user: CreateAdminUser,
): Promise<void> {
  const response = await dotNet10ApiFetch(USERS_ENDPOINT, {
    method: "POST",
    headers: getAuthHeaders(),
    body: toCreateAdminUserFormData(user),
  });
  await parseResponse(response);
}

export async function updateAdminUser(
  user: UpdateAdminUser,
): Promise<void> {
  const response = await dotNet10ApiFetch(USERS_ENDPOINT, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: toUpdateAdminUserFormData(user),
  });
  await parseResponse(response);
}

export async function deleteAdminUser(userId: string): Promise<void> {
  const response = await dotNet10ApiFetch(
    `${USERS_ENDPOINT}/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );
  await parseResponse(response);
}

export async function changeAdminUserPassword(
  input: ChangeAdminUserPassword,
): Promise<void> {
  const response = await dotNet10ApiFetch(`${USERS_ENDPOINT}/change-password`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  await parseResponse(response);
}

export async function changeAdminUserStatus(user: AdminUser): Promise<void> {
  const response = await dotNet10ApiFetch(
    `${USERS_ENDPOINT}/${encodeURIComponent(user.id)}/status`,
    {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: "{}",
    },
  );
  await parseResponse(response);
}

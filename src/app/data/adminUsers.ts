import { dotNet10ApiFetch } from "./api";

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
}

export interface UpdateAdminUser {
  id: string;
  name: string;
  family: string;
  phoneNumber: string;
  nationalCode: string;
  userName: string;
  roleId: string;
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
  error?: { code?: string; name?: string; description?: string };
  Error?: { Description?: string };
  value?: T;
  Value?: T;
};

const USERS_ENDPOINT = "/api/Users";
const USER_ROLES_ENDPOINT = "/api/Users/roles";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("auth-token")?.replace(/^Bearer\s+/i, "");

  return {
    Accept: "text/plain",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  if (!response.ok || isFailure === true || isSuccess === false) {
    throw new Error(
      data.error?.name ||
        data.error?.description ||
        data.Error?.Description ||
        "انجام عملیات کاربران با خطا مواجه شد.",
    );
  }

  return data;
}

function appendFields(
  formData: FormData,
  fields: Record<string, string>,
): FormData {
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
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
  const data = await parseResponse<AdminUser[]>(response);
  return data.value ?? data.Value ?? [];
}

export async function fetchAdminRoles(
  signal?: AbortSignal,
): Promise<AdminRole[]> {
  const response = await dotNet10ApiFetch(USER_ROLES_ENDPOINT, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });
  const data = await parseResponse<AdminRole[]>(response);
  return data.value ?? data.Value ?? [];
}

export async function createAdminUser(
  user: CreateAdminUser,
): Promise<void> {
  const body = appendFields(new FormData(), {
    Name: user.name,
    Family: user.family,
    UserName: user.userName,
    NationalCode: user.nationalCode,
    PhoneNumber: user.phoneNumber,
    Password: user.password,
    RepeatPassword: user.repeatPassword,
    RoleId: user.roleId,
  });

  const response = await dotNet10ApiFetch(USERS_ENDPOINT, {
    method: "POST",
    headers: getAuthHeaders(),
    body,
  });
  await parseResponse(response);
}

export async function updateAdminUser(
  user: UpdateAdminUser,
): Promise<void> {
  const body = appendFields(new FormData(), {
    Id: user.id,
    Name: user.name,
    Family: user.family,
    PhoneNumber: user.phoneNumber,
    NationalCode: user.nationalCode,
    UserName: user.userName,
    RoleId: user.roleId,
  });

  const response = await dotNet10ApiFetch(USERS_ENDPOINT, {
    method: "PUT",
    headers: getAuthHeaders(),
    body,
  });
  await parseResponse(response);
}

export async function deleteAdminUser(userId: string): Promise<void> {
  const body = appendFields(new FormData(), { UserId: userId });
  const response = await dotNet10ApiFetch(USERS_ENDPOINT, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body,
  });
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

export async function changeAdminUserStatus(userId: string): Promise<void> {
  const response = await dotNet10ApiFetch(`${USERS_ENDPOINT}/change-status`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: userId }),
  });
  await parseResponse(response);
}

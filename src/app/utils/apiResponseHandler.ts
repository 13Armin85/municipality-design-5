/**
 * استاندارد API Response Handler
 * تمام API ها باید این فرمت را برگردانند:
 * {
 *   "IsSuccess": boolean,
 *   "IsFailure": boolean,
 *   "Error": {
 *     "Description": string,
 *     "Type": number
 *   },
 *   "Value": any (optional)
 * }
 */

export interface ApiError {
  Description: string;
  Type: number;
}

export interface ApiResponse<T = any> {
  IsSuccess?: boolean;
  IsFailure?: boolean;
  isSuccess?: boolean;
  isFailure?: boolean;
  Error?: ApiError;
  error?: {
    code?: string;
    name?: string;
    description?: string;
  };
  Value?: T;
  value?: T;
}

/**
 * چک کردن موفقیت‌آمیز بودن پاسخ API
 */
export const isApiSuccess = (response: ApiResponse): boolean => {
  const isSuccess = response.IsSuccess ?? response.isSuccess;
  const isFailure = response.IsFailure ?? response.isFailure;

  return isSuccess === true && isFailure === false;
};

/**
 * دریافت پیام خطا از پاسخ API
 */
export const getApiErrorMessage = (response: ApiResponse): string => {
  if (response.Error?.Description) {
    return response.Error.Description;
  }
  if (response.error?.description) {
    return response.error.description;
  }
  if (response.error?.name) {
    return response.error.name;
  }
  return "خطای نامعلوم از سرور";
};

/**
 * دریافت مقدار از پاسخ API
 */
export const getApiValue = <T = any>(response: ApiResponse): T | null => {
  return response.Value ?? response.value ?? null;
};

/**
 * تبدیل پاسخ‌های قدیمی (بدون IsSuccess) به فرمت جدید
 * این تابع برای عکس‌السیری استفاده می‌شود
 */
export const normalizeApiResponse = (data: any): ApiResponse => {
  // اگر فرمت جدید است، برگردان
  if (
    typeof data === "object" &&
    ("IsSuccess" in data ||
      "IsFailure" in data ||
      "isSuccess" in data ||
      "isFailure" in data)
  ) {
    return data;
  }

  // اگر data یک array است، آن را در Value قرار بده
  if (Array.isArray(data)) {
    return {
      IsSuccess: true,
      IsFailure: false,
      Value: data,
    };
  }

  // اگر data یک object است و success field دارد
  if (typeof data === "object" && data !== null) {
    if (data.success === true) {
      return {
        IsSuccess: true,
        IsFailure: false,
        Value: data,
      };
    }
    if (data.success === false) {
      return {
        IsSuccess: false,
        IsFailure: true,
        Error: {
          Description: data.message || "خطای نامعلوم از سرور",
          Type: 0,
        },
      };
    }
  }

  // برای موارد دیگر، فرض کن موفق است
  return {
    IsSuccess: true,
    IsFailure: false,
    Value: data,
  };
};

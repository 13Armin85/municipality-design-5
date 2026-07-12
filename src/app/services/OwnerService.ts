import { apiFetch, dotNet10ApiFetch } from "../data/api";
import {
  getApiValue,
  normalizeApiResponse,  
} from "../utils/apiResponseHandler";

export class OwnerService {
  private cache = new Map<string, string>();

  private normalizeAuthToken(token: string | null) {
    return String(token ?? "")
      .trim()
      .replace(/^Bearer\s+/i, "")
      .trim();
  }

  private getAuthHeaders(token: string | null, contentType?: string) {
    const authToken = this.normalizeAuthToken(token);

    return {
      Accept: "application/json",
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
  }

  async getOwnerName(codeNosazi: string): Promise<string> {
    if (!codeNosazi) return "";

    // ===== Cache =====
    const cached = this.cache.get(codeNosazi);
    if (cached !== undefined) {
      return cached;
    }

    try {
      const token = localStorage.getItem("auth-token");

      const response = await apiFetch(
        `/api/file/check?codeNosazi=${encodeURIComponent(codeNosazi)}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(token),
        }
      );

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات");
      }

      const json = await response.json();

      const value = getApiValue(json);

      const ownerName =
        value?.Malek_Name?.trim() ??
        value?.malek_Name?.trim() ??
        value?.ownerName?.trim() ??
        "";

      // ذخیره در Cache
      this.cache.set(codeNosazi, ownerName);

      return ownerName;
    } catch {
      return "";
    }
  }

  clearCache() {
    this.cache.clear();
  }

  remove(codeNosazi: string) {
    this.cache.delete(codeNosazi);
  }
}

export const ownerService = new OwnerService();

// src/data/retreat.ts

export interface RetreatAreaData {
  originalArea: number;
  reformedArea: number;
  remainingArea: number;
}

export interface RetreatDimension {
  dir: string;
  type: string;
  name: string;
  sideExist: string | number;
  edgeExist: string | number;
}

const normalizeText = (value: unknown, fallback = "—") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();

  return text.length ? text : fallback;
};

/**
 * GET /api/retreat/area
 */
export const fetchRetreatArea = async (
  codeNosazi: string,
  token: string,
): Promise<RetreatAreaData | null> => {
  try {
    const response = await fetch(
      `/api/retreat/area?codeNosazi=${encodeURIComponent(codeNosazi)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("خطا در دریافت وضعیت عقب نشینی");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("پاسخ نامعتبر");
    }

    return {
      originalArea: result.data?.masahat_s ?? 0,
      reformedArea: result.data?.masahat_e ?? 0,
      remainingArea: result.data?.masahat_b ?? 0,
    };
  } catch (err) {
    console.error("fetchRetreatArea error:", err);
    return null;
  }
};

/**
 * GET /api/retreat/directions
 */
export const fetchRetreatDirections = async (
  codeNosazi: string,
  token: string,
): Promise<RetreatDimension[]> => {
  try {
    const response = await fetch(
      `/api/retreat/directions?codeNosazi=${encodeURIComponent(codeNosazi)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("خطا در دریافت جهات");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("پاسخ نامعتبر");
    }

    const list = Array.isArray(result.data) ? result.data : [];

    return list.map((item: any) => ({
      dir: normalizeText(item.jahat_m),
      type: normalizeText(item.noe_m),
      name: normalizeText(item.name_m),
      sideExist: item.tolzel_s || item.tolzel || item.arz_m || "—",
      edgeExist: item.tolbar_s || item.tolbar || "—",
    }));
  } catch (err) {
    console.error("fetchRetreatDirections error:", err);
    return [];
  }
};

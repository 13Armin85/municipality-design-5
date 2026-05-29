// src/data/Useretreatdata.ts

import { useCallback, useState } from "react";

import {
  fetchRetreatArea,
  fetchRetreatDirections,
  type RetreatAreaData,
  type RetreatDimension,
} from "./retreat";

export interface RetreatData {
  area: RetreatAreaData | null;
  directions: RetreatDimension[];
}

interface UseRetreatDataResult {
  data: RetreatData | null;
  loading: boolean;
  error: string | null;
  refetch: (codeNosazi: string, token: string) => Promise<void>;
  reset: () => void;
}

export const useRetreatData = (): UseRetreatDataResult => {
  const [data, setData] = useState<RetreatData | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (codeNosazi: string, token: string) => {
    if (!codeNosazi.trim()) {
      setError("کد نوسازی الزامی است");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // فقط این دو endpoint
      const [area, directions] = await Promise.all([
        fetchRetreatArea(codeNosazi, token),

        fetchRetreatDirections(codeNosazi, token),
      ]);

      setData({
        area,
        directions,
      });
    } catch (err) {
      console.error(err);

      setError("خطا در دریافت اطلاعات عقب نشینی");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
  };
};

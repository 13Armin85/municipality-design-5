import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, MapPin } from "lucide-react";
import {
  getSelectedPropertyFullCode,
  normalizeRenewalCode,
  persistSelectedPropertyByFullCode,
} from "../data/properties";
import {
  getApiErrorMessage,
  getApiValue,
  isApiSuccess,
  type ApiResponse,
} from "../utils/apiResponseHandler";
import {
  fetchJsonWithCache,
  propertyFileCacheKey,
} from "../utils/requestCache";

export interface PropertyTreeItem {
  id: string;
  text: string;
  fullCode: string;
  items: PropertyTreeItem[];
}

export interface PropertyItem {
  id: string;
  fullCode: string;
  description: string;
  treeItems: PropertyTreeItem[];
}

const getTreeNodeCode = (text = "") => text.split(" - ")[0]?.trim() ?? "";

const mapTreeItems = (
  items: any[] | undefined,
  fallbackCode = "",
): PropertyTreeItem[] =>
  (Array.isArray(items) ? items : []).map((item, index) => {
    const text = String(item.Text ?? item.text ?? "").trim();
    const fullCode = getTreeNodeCode(text) || fallbackCode;

    return {
      id: String(item.Id ?? item.id ?? `${fullCode || "node"}-${index}`),
      text: text || fullCode || "-",
      fullCode,
      items: mapTreeItems(item.Items ?? item.items, fullCode),
    };
  });

const getInitialExpandedTreeIds = (items: PropertyTreeItem[]) => {
  const ids: string[] = [];

  const collectExpandedParents = (node: PropertyTreeItem) => {
    if (node.items.length > 0) {
      ids.push(node.id);
    }

    node.items.forEach(collectExpandedParents);
  };

  items.forEach(collectExpandedParents);
  return ids;
};

const fetchPropertyFile = async (
  nationalCode: string,
  token: string,
): Promise<ApiResponse> => {
  const response = await fetch(
    `/api/file?nationalCode=${encodeURIComponent(nationalCode)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status === 404) {
    return { IsSuccess: true, IsFailure: false, Value: [] };
  }

  if (!response.ok) {
    throw new Error("خطا در دریافت اطلاعات املاک.");
  }

  return response.json();
};

interface PropertyTreeListProps {
  onPropertySelect?: (property: PropertyItem, treeItem: PropertyTreeItem) => void;
  selectedPropertyFullCode?: string | null;
  showMap?: boolean;
  compact?: boolean;
}

export function PropertyTreeList({
  onPropertySelect,
  selectedPropertyFullCode,
  showMap = false,
  compact = false,
}: PropertyTreeListProps) {
  const [propertyItems, setPropertyItems] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTreeItemCode, setSelectedTreeItemCode] = useState<string | null>(
    () => selectedPropertyFullCode ?? getSelectedPropertyFullCode(),
  );
  const [expandedTreeIds, setExpandedTreeIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isMapOpen, setIsMapOpen] = useState(showMap);

  const handleSelectTreeItem = (
    property: PropertyItem,
    treeItem: PropertyTreeItem,
  ) => {
    const hasChildren = treeItem.items.length > 0;

    if (hasChildren) {
      setExpandedTreeIds((prev) => {
        const next = new Set(prev);

        if (next.has(treeItem.id)) {
          next.delete(treeItem.id);
        } else {
          next.add(treeItem.id);
        }

        return next;
      });
    }

    const selectedCode = treeItem.fullCode || property.fullCode;
    setSelectedTreeItemCode(selectedCode);
    persistSelectedPropertyByFullCode(selectedCode, treeItem.id);

    if (onPropertySelect) {
      onPropertySelect(
        {
          ...property,
          id: treeItem.id,
          fullCode: treeItem.fullCode || property.fullCode,
          description: treeItem.text || property.description,
        },
        treeItem,
      );
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("auth-token");
        const nationalCode = localStorage.getItem("user-national-code");

        if (!token) {
          setError("توکن احراز هویت یافت نشد. لطفا دوباره وارد شوید.");
          setLoading(false);
          return;
        }

        if (!nationalCode) {
          setError("کد ملی یافت نشد. لطفا دوباره وارد شوید.");
          setLoading(false);
          return;
        }

        const data = await fetchJsonWithCache<ApiResponse>(
          propertyFileCacheKey(nationalCode),
          () => fetchPropertyFile(nationalCode, token),
          /*
            const response = await fetch(
          `/api/file?nationalCode=${encodeURIComponent(nationalCode)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError("دسترسی غیرمجاز. لطفا دوباره وارد شوید.");
          } else if (response.status === 404) {
            setPropertyItems([]);
          } else {
            setError("خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید.");
          }
          setLoading(false);
          return;
        }

            return response.json();
          },
          */
        );

        if (!isApiSuccess(data)) {
          setError(getApiErrorMessage(data));
          setLoading(false);
          return;
        }

        const fileValue = getApiValue(data);
        const rawList = Array.isArray(fileValue)
          ? fileValue
          : (fileValue.items ?? fileValue.data ?? fileValue.files ?? []);

        const mapped: PropertyItem[] = rawList.map(
          (item: any, index: number) => ({
            id: String(item.Id ?? item.shop ?? index),
            fullCode: item.codeN ?? "—",
            treeItems: mapTreeItems(item.tvItems, item.codeN),
            description:
              item.tvItems?.[0]?.Text?.trim() ??
              item.codeN ??
              "بدون توضیحات",
          }),
        );

        setPropertyItems(mapped);
        setExpandedTreeIds(
          new Set(
            mapped.flatMap((property) =>
              getInitialExpandedTreeIds(property.treeItems).slice(0, 1),
            ),
          ),
        );
      } catch {
        setError("خطا در اتصال به سرور. لطفا دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    setSelectedTreeItemCode(
      selectedPropertyFullCode ?? getSelectedPropertyFullCode(),
    );
  }, [selectedPropertyFullCode]);

  useEffect(() => {
    const handleSelectionChange = () => {
      setSelectedTreeItemCode(getSelectedPropertyFullCode());
    };

    window.addEventListener(
      "municipality-selected-property-change",
      handleSelectionChange,
    );
    window.addEventListener("storage", handleSelectionChange);

    return () => {
      window.removeEventListener(
        "municipality-selected-property-change",
        handleSelectionChange,
      );
      window.removeEventListener("storage", handleSelectionChange);
    };
  }, []);

  const renderTreeItems = (
    property: PropertyItem,
    items: PropertyTreeItem[],
    depth = 0,
  ) =>
    items.map((treeItem) => {
      const hasChildren = treeItem.items.length > 0;
      const isExpanded = expandedTreeIds.has(treeItem.id);
      const isSelected =
        normalizeRenewalCode(selectedTreeItemCode) ===
        normalizeRenewalCode(treeItem.fullCode || property.fullCode);

      return (
        <div key={`${property.id}-${treeItem.id}`} className="space-y-2">
          <button
            type="button"
            onClick={() => handleSelectTreeItem(property, treeItem)}
            className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border px-2 py-1.5 text-right transition-all active:scale-[0.99] ${compact ? "text-xs" : "text-sm"} ${
              isSelected
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border/70 bg-card/60 hover:border-primary/40 hover:bg-muted/20"
            }`}
            style={{ paddingRight: `${8 + depth * 16}px` }}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                  hasChildren
                    ? "border-primary/30 bg-[var(--primary-soft)] text-primary"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                }`}
              >
                {hasChildren ? (
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      isExpanded ? "" : "rotate-90"
                    }`}
                  />
                ) : (
                  <MapPin className="h-3 w-3" />
                )}
              </span>
              <span
                className={`min-w-0 leading-5 ${compact ? "text-xs" : "text-sm"} ${
                  isSelected
                    ? "font-semibold text-foreground"
                    : "font-medium text-foreground/80"
                }`}
              >
                {treeItem.text}
              </span>
            </span>
            {isSelected && (
              <span className="shrink-0 rounded-md bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground">
                انتخاب شده
              </span>
            )}
          </button>

          <AnimatePresence initial={false}>
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-r border-border/70 pr-2"
              >
                <div className="space-y-1.5 py-1">
                  {renderTreeItems(property, treeItem.items, depth + 1)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <span className="text-sm">در حال بارگذاری املاک...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (propertyItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <MapPin className="mb-2 h-8 w-8 opacity-30" />
        <p className="text-sm">هیچ ملکی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {propertyItems.map((property) => (
        <div
          key={property.id}
          className="rounded-xl border border-border/60 bg-background/40 p-2"
        >
          <div className="mb-2 flex items-center justify-between border-b border-border/50 pb-2">
            <span className="text-xs font-bold text-foreground">
              {property.fullCode}
            </span>
          </div>
          <div className="space-y-1.5">
            {property.treeItems.length > 0
              ? renderTreeItems(property, property.treeItems)
              : renderTreeItems(property, [
                  {
                    id: property.id,
                    text: property.description,
                    fullCode: property.fullCode,
                    items: [],
                  },
                ])}
          </div>
        </div>
      ))}
    </div>
  );
}

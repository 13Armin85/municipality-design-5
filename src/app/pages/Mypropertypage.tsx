import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Info,
  MapPin,
  Minus,
  Plus,
  Moon,
  Sun,
  Trash2,
  X,
  Home,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { persistSelectedPropertyByFullCode, getStoredPropertyId, findPropertyByFullCode } from "../data/properties";
import {
  isApiSuccess,
  getApiErrorMessage,
  getApiValue,
  type ApiResponse,
} from "../utils/apiResponseHandler";

interface MyPropertyPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

interface PropertyItem {
  id: string;
  fullCode: string;
  description: string;
  treeItems: PropertyTreeItem[];
}

interface PropertyTreeItem {
  id: string;
  text: string;
  fullCode: string;
  items: PropertyTreeItem[];
}

const decodeToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const getTreeNodeCode = (text = "") => text.split(" - ")[0]?.trim() ?? "";

const mapTreeItems = (items: any[] | undefined, fallbackCode = ""): PropertyTreeItem[] =>
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

export function MyPropertyPage({ isDark, toggleTheme }: MyPropertyPageProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(
    null,
  );
  const [expandedTreeIds, setExpandedTreeIds] = useState<Set<string>>(
    () => new Set(),
  );

  const [propertyItems, setPropertyItems] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNoPropertyError, setShowNoPropertyError] = useState(false);

  const handleSelectProperty = (property: PropertyItem) => {
    setSelectedPropertyId(property.id);
    setSelectedProperty(property);
    persistSelectedPropertyByFullCode(property.fullCode);
    setIsMapOpen(true);
  };

  const handlePerformAction = () => {
    // Check if a property is selected
    const storedId = getStoredPropertyId();
    const storedProperty = findPropertyByFullCode(storedId);
    
    if (!storedProperty && propertyItems.length === 0) {
      // No properties exist - show error
      setShowNoPropertyError(true);
      return;
    }
    
    if (!storedProperty && propertyItems.length > 0) {
      // Properties exist but none selected - select first one
      const firstProperty = propertyItems[0];
      if (firstProperty.treeItems.length > 0) {
        handleSelectTreeItem(firstProperty, firstProperty.treeItems[0]);
      } else {
        handleSelectProperty(firstProperty);
      }
    }
    
    // Navigate to services section or stay on page with property selected
    // For now, we'll navigate to the services section on the home page
    navigate("/#services");
  };

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

    handleSelectProperty({
      ...property,
      id: treeItem.id,
      fullCode: treeItem.fullCode || property.fullCode,
      description: treeItem.text || property.description,
    });
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("auth-token");
        const nationalCode = localStorage.getItem("user-national-code");

        if (!token) {
          setError("توکن احراز هویت یافت نشد. لطفاً دوباره وارد شوید.");
          setLoading(false);
          return;
        }

        if (!nationalCode) {
          setError("کد ملی یافت نشد. لطفاً دوباره وارد شوید.");
          setLoading(false);
          return;
        }

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
            setError("دسترسی غیرمجاز. لطفاً دوباره وارد شوید.");
          } else if (response.status === 404) {
            setPropertyItems([]);
          } else {
            setError("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.");
          }
          setLoading(false);
          return;
        }

        const data: ApiResponse = await response.json();

        if (!isApiSuccess(data)) {
          setError(getApiErrorMessage(data));
          setLoading(false);
          return;
        }

        const fileValue = getApiValue(data);
        // سازگاری با ساختارهای مختلف پاسخ API
        const rawList = Array.isArray(fileValue)
          ? fileValue
          : (fileValue.items ?? fileValue.data ?? fileValue.files ?? []);

        const mapped: PropertyItem[] = rawList.map(
          (item: any, index: number) => ({
            id: String(item.Id ?? item.shop ?? index),
            fullCode: item.codeN ?? "—",
            treeItems: mapTreeItems(item.tvItems, item.codeN),
            description:
              item.tvItems?.[0]?.Text?.trim() ?? item.codeN ?? "بدون توضیحات",
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
        setError("خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const renderTreeItems = (
    property: PropertyItem,
    items: PropertyTreeItem[],
    depth = 0,
  ) =>
    items.map((treeItem) => {
      const hasChildren = treeItem.items.length > 0;
      const isExpanded = expandedTreeIds.has(treeItem.id);
      const isSelected = selectedPropertyId === treeItem.id;

      return (
        <div key={`${property.id}-${treeItem.id}`} className="space-y-2">
          <button
            type="button"
            onClick={() => handleSelectTreeItem(property, treeItem)}
            className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-right transition-all active:scale-[0.99] ${
              isSelected
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border/70 bg-card/60 hover:border-primary/40 hover:bg-muted/20"
            }`}
            style={{ paddingRight: `${12 + depth * 22}px` }}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                  hasChildren
                    ? "border-primary/30 bg-[var(--primary-soft)] text-primary"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                }`}
              >
                {hasChildren ? (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isExpanded ? "" : "rotate-90"
                    }`}
                  />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </span>
              <span
                className={`min-w-0 text-xs leading-6 md:text-sm ${
                  isSelected
                    ? "font-semibold text-foreground"
                    : "font-medium text-foreground/80"
                }`}
              >
                {treeItem.text}
              </span>
            </span>
            <span
              className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isSelected ? (
                <>&#1575;&#1606;&#1578;&#1582;&#1575;&#1576; &#1588;&#1583;&#1607;</>
              ) : (
                <>&#1575;&#1606;&#1578;&#1582;&#1575;&#1576;</>
              )}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-r border-border/70 pr-3"
              >
                <div className="space-y-2 py-1">
                  {renderTreeItems(property, treeItem.items, depth + 1)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
    >
      {/* مودال راهنما */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                <h3 className="flex items-center gap-2 text-base font-bold text-primary">
                  <Info className="h-5 w-5" />
                  راهنما
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 text-sm leading-7 text-foreground/80">
                در این بخش لیست املاک ثبت‌شده شما نمایش داده می‌شود. با کلیک روی
                آیکون نقشه می‌توانید موقعیت ملک را روی نقشه مشاهده کنید.
              </div>
              <div className="px-6 py-4 text-left">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform active:scale-95"
                >
                  فهمیدم
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* هدر */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
      >
        <div className="container mx-auto px-0 md:px-2 lg:px-6">
          <div className="nav-shell bg-card border border-border/50 rounded-2xl shadow-sm">
            <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
              <button
                onClick={handlePerformAction}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow transition-transform active:scale-95 hover:bg-primary/90"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden text-sm md:block">انجام عملیات</span>
              </button>

              <h1 className="text-sm font-bold text-foreground md:text-base">
                املاک من
              </h1>

              <div className="flex items-center gap-1.5 md:gap-3 flex-row-reverse">
                <button
                  onClick={toggleTheme}
                  className="header-action-btn flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 md:py-2 text-xs font-bold text-primary-foreground shadow transition-transform active:scale-95"
                >
                  <Info className="h-3.5 w-3.5" />
                  راهنما
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6 bg-background">
        <div className="container mx-auto max-w-6xl space-y-5">
          {/* حالت لودینگ */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">در حال دریافت اطلاعات املاک...</p>
            </div>
          )}

          {/* حالت خطا */}
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* حالت خالی */}
          {!loading && !error && propertyItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground"
            >
              <MapPin className="h-10 w-10 opacity-30" />
              <p className="text-sm">هیچ ملکی برای این کد ملی یافت نشد.</p>
            </motion.div>
          )}

          {/* Error message for no property selected */}
          <AnimatePresence>
            {showNoPropertyError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">پرونده‌ای یافت نشد</p>
                    <p>پرونده شما در شهروندیار یافت نشد؛ لطفا جهت ثبت اطلاعات به شهرداری منطقه موردنظر خود مراجعه کنید.</p>
                  </div>
                  <button
                    onClick={() => setShowNoPropertyError(false)}
                    className="mr-auto shrink-0 rounded-full p-1 hover:bg-destructive/20 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* جدول املاک */}
          {!loading && !error && propertyItems.length > 0 && (
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="soft-card bg-card border border-border/50 rounded-2xl overflow-hidden"
            >
              <div className="space-y-3 p-4">
                {propertyItems.map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-border/60 bg-background/40 p-3"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
                      <span className="text-xs font-bold text-foreground md:text-sm">
                        {property.fullCode}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                        {property.treeItems.length} &#1585;&#1740;&#1588;&#1607;
                      </span>
                    </div>
                    <div className="space-y-2">
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
                  </motion.div>
                ))}
              </div>
              <div className="hidden">
                <table className="w-full text-right text-xs md:text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/60">
                      <th className="px-4 py-3 font-semibold text-foreground/80 text-right">
                        کد نوسازی
                      </th>
                      <th className="px-4 py-3 font-semibold text-foreground/80 text-right">
                        توضیحات
                      </th>
                      <th className="px-4 py-3 font-semibold text-foreground/80 text-center w-36">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyItems.map((property, i) => {
                      const isSelected = selectedPropertyId === property.id;

                      return (
                        <motion.tr
                          key={property.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`border-b border-r-4 transition-colors ${
                            isSelected
                              ? "border-b-primary/25 border-r-primary bg-primary/10"
                              : "border-b-border/40 border-r-transparent hover:bg-muted/10"
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{property.fullCode}</span>
                            </div>
                          </td>
                          <td
                            className={`px-4 py-3 leading-6 text-xs ${
                              isSelected
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {property.description}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleSelectProperty(property)}
                              className={`inline-flex h-9 min-w-28 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all active:scale-95 shadow-sm ${
                                isSelected
                                  ? "bg-primary text-primary-foreground shadow-primary/25"
                                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                              }`}
                            >
                              <MapPin className="h-4 w-4" />
                              {isSelected ? "انتخاب شده" : "انتخاب ملک"}
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.article>
          )}

          {/* نقشه */}
          <AnimatePresence>
            {isMapOpen && selectedProperty && (
              <motion.article
                key="map"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 6 }}
                transition={{ duration: 0.3 }}
                className="soft-card bg-card border border-border/50 rounded-2xl relative h-[480px] overflow-hidden group"
              >
                <div className="absolute inset-0 bg-slate-700">
                  <div className="h-full w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/40 select-none">
                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p className="text-xs">نقشه در حال بارگذاری...</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card transition-colors text-foreground">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card transition-colors text-foreground">
                    <Minus className="h-4 w-4" />
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/90 shadow-lg hover:bg-card transition-colors text-foreground">
                    <Home className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => setIsMapOpen(false)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/90 text-white shadow-lg hover:bg-destructive transition-colors z-10"
                  title="بستن نقشه"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="absolute bottom-4 left-4 rounded-md bg-card/80 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur-sm z-10">
                  m 50
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

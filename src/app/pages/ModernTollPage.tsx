import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Home,
  Info,
  Minus,
  Plus,
  Search,
  Moon,
  Sun,
  Trash2,
  X,
  Layers,
  FileText,
  Users,
  Receipt,
  History,
} from "lucide-react";
import { Link } from "react-router";
import {
  guildCodeFields,
  type RenewalCodeKey,
  type RenewalCodes,
  getSelectedPropertyFullCode,
  normalizeRenewalCode,
} from "../data/properties";
import {
  isApiSuccess,
  getApiErrorMessage,
  getApiValue,
  type ApiResponse,
} from "../utils/apiResponseHandler";
import { PropertyTreeList, type PropertyItem as TreePropertyItem, type PropertyTreeItem } from "../components/PropertyTreeList";

interface LocalPropertyItem {
  id: string;
  fullCode: string;
  ownerName: string;
  description: string;
  codes: RenewalCodes;
}

interface OwnerItem {
  id: string;
  firstName: string;
  lastName: string;
  ownerType: string;
  fatherName: string;
  birthPlace: string;
}

interface LabelValue {
  label: string;
  value: string;
}

interface HistoryItem {
  id: string;
  date: string;
  amount: string;
  status: string;
}

interface ModernTollPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function ModernTollPage({ isDark, toggleTheme }: ModernTollPageProps) {
  const [propertyItems, setPropertyItems] = useState<LocalPropertyItem[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<LocalPropertyItem | null>(
    null,
  );
  const [owners, setOwners] = useState<OwnerItem[]>([]);
  const [feesRight, setFeesRight] = useState<LabelValue[]>([]);
  const [feesLeft, setFeesLeft] = useState<LabelValue[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  // وضعیت فیلدهای ورودی جستجو
  const [searchInputs, setSearchInputs] = useState<RenewalCodes>({
    region: "",
    neighborhood: "",
    block: "",
    property: "",
    building: "",
    apartment: "",
    guild: "",
  });

  const [error, setError] = useState("");

  const token = localStorage.getItem("auth-token");

  const normalizeCode = (code = ""): string => {
    const segments = code
      .split("-")
      .map((part) => part.trim())
      .filter((part) => part !== "");

    const normalized = segments.length > 7 ? segments.slice(-7) : [...segments];
    while (normalized.length < 7) {
      normalized.push("");
    }
    return normalized.join("-");
  };

  const splitCode = (code = ""): RenewalCodes => {
    const parts = normalizeCode(code).split("-");
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

  const codeNosazi = normalizeCode(
    `${searchInputs.region}-${searchInputs.neighborhood}-${searchInputs.block}-${searchInputs.property}-${searchInputs.building}-${searchInputs.apartment}-${searchInputs.guild}`,
  );

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  // هندلر تغییر مقادیر ورودی
  const handleInputChange = (key: RenewalCodeKey, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [key]: value }));
  };

  const loadRenovationData = async (propertyId: string, code: string) => {
    if (!token) return;
    try {
      const normalizedCode = normalizeCode(code);
      const [renovationRes, recordsRes, ownersRes] = await Promise.all([
        fetch(
          `/api/renovation?malekId=${encodeURIComponent(propertyId)}&codeNosazi=${encodeURIComponent(normalizedCode)}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        ),
        fetch(
          `/api/renovation/records?malekId=${encodeURIComponent(propertyId)}&codeNosazi=${encodeURIComponent(normalizedCode)}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        ),
        fetch(`/api/owners?codeNosazi=${encodeURIComponent(normalizedCode)}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const renovationData: ApiResponse = renovationRes.ok
        ? await renovationRes.json()
        : { IsSuccess: false, IsFailure: true };
      const recordsData: ApiResponse = recordsRes.ok
        ? await recordsRes.json()
        : { IsSuccess: false, IsFailure: true };
      const ownersData: ApiResponse = ownersRes.ok
        ? await ownersRes.json()
        : { IsSuccess: false, IsFailure: true };

      const renovationValue = isApiSuccess(renovationData)
        ? getApiValue(renovationData)
        : {};
      const recordsValue = isApiSuccess(recordsData)
        ? getApiValue(recordsData)
        : [];
      const ownersValue = isApiSuccess(ownersData)
        ? getApiValue(ownersData)
        : null;

      const feeList = Array.isArray(renovationValue)
        ? renovationValue
        : (renovationValue.items ?? renovationValue.data ?? []);
      const feePairs: LabelValue[] = feeList.map((item: any) => ({
        label: item.title ?? item.label ?? item.key ?? "—",
        value: String(item.value ?? item.text ?? "—"),
      }));
      setFeesRight(feePairs.filter((_: unknown, i: number) => i % 2 === 0));
      setFeesLeft(feePairs.filter((_: unknown, i: number) => i % 2 === 1));

      const rawRecords = Array.isArray(recordsValue)
        ? recordsValue
        : (recordsValue.items ?? recordsValue.data ?? []);
      setHistoryItems(
        rawRecords.map((item: any, index: number) => ({
          id: String(item.id ?? index + 1),
          date: item.date ?? item.tarikh ?? "—",
          amount: String(item.amount ?? item.mablagh ?? "—"),
          status: item.status ?? "—",
        })),
      );

      const rawOwners = Array.isArray(ownersValue)
        ? ownersValue
        : Array.isArray(ownersValue?.items)
          ? ownersValue.items
          : Array.isArray(ownersValue?.data)
            ? ownersValue.data
            : Array.isArray(renovationValue.owners)
              ? renovationValue.owners
              : renovationValue.owner
                ? [renovationValue.owner]
                : [];
      setOwners(
        rawOwners.map((owner: any, index: number) => ({
          id: String(owner.Id ?? owner.id ?? index + 1),
          firstName: owner.Name ?? owner.firstName ?? owner.name ?? "—",
          lastName: owner.Family ?? owner.lastName ?? "—",
          ownerType: owner.NoeMalek ?? owner.ownerType ?? "—",
          fatherName: owner.Father ?? owner.fatherName ?? "—",
          birthPlace:
            owner.Sodor ?? owner.birthPlace ?? owner.issuePlace ?? "—",
        })),
      );
    } catch (error) {
      console.error("خطا در دریافت اطلاعات نوسازی:", error);
    }
  };

  // هندلر کلیک روی یک ملک از لیست زیرمجموعه
  const selectPropertyFromList = (property: LocalPropertyItem) => {
    setSearchInputs(property.codes);
    setSelectedProperty(property);
    setOwners([]);
    setFeesRight([]);
    setFeesLeft([]);
    setHistoryItems([]);
    setError("");
  };

  const handlePropertyTreeSelect = (property: TreePropertyItem, treeItem: PropertyTreeItem) => {
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
    const parts = treeItem.fullCode.split("-").map(p => p.trim()).filter(Boolean);
    if (parts.length >= 7) {
      codes.region = parts[0];
      codes.neighborhood = parts[1];
      codes.block = parts[2];
      codes.property = parts[3];
      codes.building = parts[4];
      codes.apartment = parts[5];
      codes.guild = parts[6];
    }
    
    const prop: LocalPropertyItem = {
      id: treeItem.id,
      fullCode: treeItem.fullCode,
      ownerName: property.description,
      description: treeItem.text,
      codes: codes,
    };
    
    selectPropertyFromList(prop);
    void loadRenovationData(prop.id, prop.fullCode);
  };

  useEffect(() => {
    const loadProperties = async () => {
      const nationalCode = localStorage.getItem("user-national-code");
      if (!token || !nationalCode) return;
      try {
        const response = await fetch(
          `/api/file?nationalCode=${encodeURIComponent(nationalCode)}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) return;
        const data: ApiResponse = await response.json();

        if (!isApiSuccess(data)) return;

        const fileValue = getApiValue(data);
        const rawList = Array.isArray(fileValue)
          ? fileValue
          : (fileValue.items ?? fileValue.data ?? fileValue.files ?? []);
        const mapped: LocalPropertyItem[] = rawList.map(
          (item: any, index: number) => {
            const cleanedCode = normalizeCode(
              item.codeN ?? item.fullCode ?? "",
            );
            return {
              id: String(item.Id ?? item.shop ?? index + 1),
              fullCode: cleanedCode || "—",
              ownerName: item.ownerName ?? item.tvItems?.[0]?.Text ?? "—",
              description:
                item.tvItems?.[0]?.Text?.trim() ?? item.codeN ?? "بدون توضیحات",
              codes: splitCode(cleanedCode),
            };
          },
        );
        setPropertyItems(mapped);

        // انتخاب خودکار آیتم اول - تلاش برای بازیابی ملک انتخاب شده از localStorage
        if (mapped.length > 0) {
          // Try to restore previously selected property from localStorage
          const storedFullCode = getSelectedPropertyFullCode();
          let selectedProp: LocalPropertyItem | null = null;
          
          if (storedFullCode) {
            const normalizedStoredCode = normalizeRenewalCode(storedFullCode);
            // Find matching property by fullCode
            selectedProp = mapped.find(item => 
              normalizeRenewalCode(item.fullCode) === normalizedStoredCode
            ) ?? null;
          }
          
          // If no stored property found, use the first one
          const propertyToSelect = selectedProp ?? mapped[0];
          setSelectedProperty(propertyToSelect);
          setSearchInputs(propertyToSelect.codes);
          void loadRenovationData(propertyToSelect.id, propertyToSelect.fullCode);
        }
      } catch (err) {
        console.error("Failed to load properties", err);
      }
    };
    void loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSearch = async () => {
    if (!selectedProperty) return;
    setError("");
    setOwners([]);
    setFeesRight([]);
    setFeesLeft([]);
    setHistoryItems([]);
    try {
      await loadRenovationData(selectedProperty.id, codeNosazi);
    } catch {
      setError("خطا در دریافت اطلاعات نوسازی.");
    }
  };

  const HelpButton = ({ title, desc }: { title: string; desc: string }) => (
    <button
      onClick={() => handleOpenHelp(title, desc)}
      className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 md:text-xs"
    >
      <Info className="h-3.5 w-3.5" /> راهنما
    </button>
  );

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
                  {modalContent.title}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 text-sm leading-7 text-foreground/80">
                {modalContent.description}
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
          <div className="nav-shell">
            <div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4">
              <Link
                to="/"
                className="header-action-btn inline-flex items-center gap-2 px-3"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden text-sm md:block">بازگشت</span>
              </Link>
              <h1 className="text-sm font-bold text-foreground md:text-base">
                عوارض نوسازی
              </h1>
              <button onClick={toggleTheme} className="header-action-btn">
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="section-decor px-3 pb-12 pt-10 md:pb-20 md:pt-10 lg:px-6">
        <div className="container mx-auto max-w-6xl space-y-5">
          <div className="rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm">
            کاربر گرامی، لطفاً پس از انتخاب ملک خود دکمه جستجو را بزنید.
          </div>

          {/* بخش جستجو */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">جستجو</h2>
              </div>
              <HelpButton
                title="جستجو"
                desc="کد نوسازی ۷ بخشی خود را وارد کنید."
              />
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-8">
              <button
                onClick={handleSearch}
                className="flex h-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/20"
              >
                <Search className="ml-1.5 h-4 w-4" /> جستجو
              </button>

              {guildCodeFields.map((field) => (
                <div key={field.key} className="relative">
                  <input
                    value={searchInputs[field.key]}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-border/70 bg-card px-2 text-center text-sm font-medium outline-none focus:border-primary transition-colors"
                    dir="ltr"
                  />
                  <span className="absolute -top-2 right-3 bg-card px-1 text-[9px] text-muted-foreground">
                    {field.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.article>

          {/* Property Tree List */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  پرونده‌های زیرمجموعه
                </h2>
              </div>
              <HelpButton
                title="زیرمجموعه"
                desc="لیست املاک شما در این بخش نمایش داده می‌شود."
              />
            </div>
            <div className="p-4">
              <PropertyTreeList
                onPropertySelect={handlePropertyTreeSelect}
                compact
              />
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">مالکین</h2>
              </div>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-right text-[11px] md:text-xs">
                <thead>
                  <tr className="bg-[var(--primary-soft)] text-primary">
                    <th className="border border-border/50 p-2 text-center">
                      #
                    </th>
                    <th className="border border-border/50 p-2">نام</th>
                    <th className="border border-border/50 p-2">
                      نام خانوادگی
                    </th>
                    <th className="border border-border/50 p-2">نوع مالک</th>
                    <th className="border border-border/50 p-2">نام پدر</th>
                    <th className="border border-border/50 p-2">محل صدور</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map((owner, i) => (
                    <tr key={i} className="transition-colors hover:bg-muted/30">
                      <td className="border border-border/50 p-2 text-center font-bold">
                        {owner.id}
                      </td>
                      <td className="border border-border/50 p-2">
                        {owner.firstName}
                      </td>
                      <td className="border border-border/50 p-2">
                        {owner.lastName}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.ownerType}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.fatherName}
                      </td>
                      <td className="border border-border/50 p-2 text-muted-foreground">
                        {owner.birthPlace}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-muted-foreground"
                      >
                        ابتدا جستجو کنید
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.article>

          {/* عوارض نوسازی جاری */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  عوارض نوسازی جاری
                </h2>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-0 md:grid-cols-2">
                <div className="space-y-0">
                  {(feesRight.length
                    ? feesRight
                    : Array(9).fill({ label: "—", value: "—" })
                  ).map((field, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-border/30 py-2.5 text-xs md:text-sm"
                    >
                      <span className="text-muted-foreground">
                        {field.label} :
                      </span>
                      <span className="font-medium text-foreground/80">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-0">
                  {(feesLeft.length
                    ? feesLeft
                    : Array(9).fill({ label: "—", value: "—" })
                  ).map((field, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-border/30 py-2.5 text-xs md:text-sm"
                    >
                      <span className="text-muted-foreground">
                        {field.label} :
                      </span>
                      <span className="font-medium text-foreground/80">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {selectedProperty && (
                <div className="mt-5 flex justify-start">
                  <button className="flex items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-destructive/20 transition-all hover:bg-destructive/90 active:scale-95">
                    <FileText className="h-4 w-4" /> دریافت فیش
                  </button>
                </div>
              )}
            </div>
          </motion.article>

          {/* سوابق نوسازی */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel"
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  سوابق نوسازی جاری
                </h2>
              </div>
            </div>
            <div className="p-4">
              {historyItems.length > 0 ? (
                <div className="space-y-2">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between rounded-lg border p-3 text-xs"
                    >
                      <span>تاریخ: {item.date}</span>
                      <span>مبلغ: {item.amount}</span>
                      <span className="text-emerald-500">{item.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-xs text-destructive">
                  موردی برای نمایش وجود ندارد.
                </div>
              )}
              {error && (
                <div className="mt-3 text-xs text-destructive">{error}</div>
              )}
            </div>
          </motion.article>

          {/* نقشه */}
          <motion.article
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="soft-card mesh-panel relative h-[400px] overflow-hidden group"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="absolute inset-0 bg-blue-900/20 z-10" />
              <img
                src="/map-placeholder.jpg"
                alt="Map"
                className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
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
            <button className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/90 text-white shadow-lg hover:bg-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.article>
        </div>
      </main>
    </div>
  );
}

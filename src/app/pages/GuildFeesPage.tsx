import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { type RenewalCodeKey, type RenewalCodes } from "../data/properties";
import {
  isApiSuccess,
  getApiErrorMessage,
  getApiValue,
  type ApiResponse,
} from "../utils/apiResponseHandler";
import { GuildFeesHeader } from "./guild-fees/GuildFeesHeader";
import { GuildFeesHelpModal } from "./guild-fees/GuildFeesHelpModal";
import {
  GuildFeesCurrentFeesSection,
  GuildFeesEmptyState,
  GuildFeesMapSection,
  GuildFeesPropertyListSection,
  GuildFeesSearchSection,
  type GuildPropertyItem,
  type LabelValue,
} from "./guild-fees/GuildFeesSections";

interface GuildFeesPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const emptyCodes: RenewalCodes = {
  region: "",
  neighborhood: "",
  block: "",
  property: "",
  building: "",
  apartment: "",
  guild: "",
};

const keyLabels: Record<string, string> = {
  Id: "شناسه",
  id: "شناسه",
  shop: "شماره پرونده",
  Shop: "شماره پرونده",
  jobCode: "کد شغل",
  JobCode: "کد شغل",
  codeN: "کد نوسازی",
  codeNosazi: "کد نوسازی",
  fullCode: "کد نوسازی",
  ownerName: "مالک",
  Name: "نام",
  Family: "نام خانوادگی",
  Father: "نام پدر",
  Sodor: "محل صدور",
  NoeMalek: "نوع مالک",
  address: "آدرس",
  Address: "آدرس",
  amount: "مبلغ",
  Amount: "مبلغ",
  price: "مبلغ",
  Price: "مبلغ",
  total: "جمع کل",
  Total: "جمع کل",
  date: "تاریخ",
  Date: "تاریخ",
  status: "وضعیت",
  Status: "وضعیت",
  Motesadi: "متصدی",
  ShoghlType: "نوع شغل",
  CurrentPrice: "مبلغ جاری",
  DelayedPrice: "مبلغ معوقه",
  EndDate: "تا سال",
  Jobcode: "کد شغل",
  jobcode: "کد شغل",
  StartDate: "از سال",
  TotalPrice: "مبلغ کل",
  TotalPriceFarsi: "مبلغ به حروف",
};

const normalizeDigits = (value: unknown = "") =>
  String(value ?? "").replace(/[۰-۹٠-٩]/g, (digit) => {
    const fa = "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);
    if (fa >= 0) return String(fa);
    return String("٠١٢٣٤٥٦٧٨٩".indexOf(digit));
  });

const normalizeCode = (code: unknown = "") =>
  normalizeDigits(code)
    .replace(/[^\d]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const splitCode = (code: unknown = ""): RenewalCodes => {
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

const buildCodeFromInputs = (codes: RenewalCodes) =>
  normalizeCode(
    [
      codes.region,
      codes.neighborhood,
      codes.block,
      codes.property,
      codes.building,
      codes.apartment,
      codes.guild,
    ].join("-"),
  );

const unwrapList = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const key of ["items", "data", "result", "results", "list", "rows"]) {
    if (Array.isArray(data[key])) return data[key];
  }
  for (const key of ["data", "result"]) {
    if (data[key] && typeof data[key] === "object") return [data[key]];
  }
  return [data];
};

const firstDefined = (...values: unknown[]) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toDisplay = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "—";
    }
  }
  return String(value);
};

const toPairs = (data: any): LabelValue[] => {
  const source = Array.isArray(data) ? data[0] : data;
  if (!source || typeof source !== "object") return [];

  if (Array.isArray(source.items)) {
    return source.items.map((item: any, index: number) => ({
      label: toDisplay(item.title ?? item.label ?? item.key ?? index + 1),
      value: toDisplay(item.value ?? item.text ?? item.amount ?? item),
    }));
  }

  return Object.entries(source)
    .filter(([, value]) => typeof value !== "object" || value === null)
    .map(([key, value]) => ({
      label: keyLabels[key] ?? key,
      value: toDisplay(value),
    }));
};

const splitPairs = (pairs: LabelValue[]) => ({
  right: pairs.filter((_, index) => index % 2 === 0),
  left: pairs.filter((_, index) => index % 2 === 1),
});

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth-token");
};

const getAuthHeaders = (token: string) => ({
  Accept: "application/json",
  Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
});

const mapFileItem = (item: any, index: number): GuildPropertyItem => {
  const fullCode = normalizeCode(
    item.codeN ?? item.fullCode ?? item.codeNosazi,
  );
  return {
    id: String(item.Id ?? item.id ?? item.shop ?? index + 1),
    fullCode: fullCode || "—",
    ownerName: toDisplay(
      item.ownerName ??
        item.malekName ??
        item.tvItems?.[0]?.Text?.trim() ??
        item.Name,
    ),
    type: toDisplay(item.type ?? item.fileType ?? item.noeMelk ?? "صنفی"),
    codes: splitCode(fullCode),
    shop: firstDefined(item.shop, item.Shop, item.Id, item.id)?.toString(),
    jobCode: firstDefined(
      item.jobCode,
      item.JobCode,
      item.job,
      item.Job,
    )?.toString(),
  };
};

const extractGuildParams = (
  selectedCase: GuildPropertyItem | null,
  guildData: any,
) => {
  const firstGuild = unwrapList(guildData)[0] ?? {};
  return {
    shop: firstDefined(
      selectedCase?.shop,
      firstGuild.shop,
      firstGuild.Shop,
      firstGuild.Id,
      firstGuild.id,
    )?.toString(),
    jobCode: firstDefined(
      selectedCase?.jobCode,
      firstGuild.jobCode,
      firstGuild.JobCode,
      firstGuild.Jobcode,
      firstGuild.jobcode,
      firstGuild.job,
      firstGuild.Job,
    )?.toString(),
  };
};

export function GuildFeesPage({ isDark, toggleTheme }: GuildFeesPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });
  const [searchInputs, setSearchInputs] = useState<RenewalCodes>(emptyCodes);
  const [cases, setCases] = useState<GuildPropertyItem[]>([]);
  const [selectedCase, setSelectedCase] = useState<GuildPropertyItem | null>(
    null,
  );
  const [receiptPairs, setReceiptPairs] = useState<LabelValue[]>([]);
  const [taxPairs, setTaxPairs] = useState<LabelValue[]>([]);
  const [isCasesLoading, setIsCasesLoading] = useState(false);
  const [isGuildLoading, setIsGuildLoading] = useState(false);
  const [error, setError] = useState("");

  const receiptColumns = useMemo(
    () => splitPairs(receiptPairs),
    [receiptPairs],
  );
  const taxColumns = useMemo(() => splitPairs(taxPairs), [taxPairs]);

  const handleOpenHelp = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  const loadGuildData = async (
    codeNosazi: string,
    currentCase: GuildPropertyItem | null,
  ) => {
    const token = getAuthToken();

    if (!token) {
      setError("برای دریافت اطلاعات عوارض صنفی ابتدا وارد حساب کاربری شوید.");
      return;
    }

    setIsGuildLoading(true);
    setError("");
    setReceiptPairs([]);
    setTaxPairs([]);

    try {
      const normalizedCode = normalizeCode(codeNosazi);
      const guildResponse = await fetch(
        `/api/guilds?codeNosazi=${encodeURIComponent(normalizedCode)}`,
        {
          method: "GET",
          headers: getAuthHeaders(token),
        },
      );

      if (!guildResponse.ok) {
        throw new Error("guilds request failed");
      }

      const guildData: ApiResponse = await guildResponse.json();

      if (!isApiSuccess(guildData)) {
        throw new Error(getApiErrorMessage(guildData));
      }

      const guildValue = getApiValue(guildData);
      const receiptData = unwrapList(guildValue);
      setReceiptPairs(toPairs(receiptData));

      const { shop, jobCode } = extractGuildParams(currentCase, guildValue);

      if (shop && jobCode) {
        const taxResponse = await fetch(
          `/api/guilds/tax?shop=${encodeURIComponent(shop)}&jobCode=${encodeURIComponent(jobCode)}`,
          {
            method: "GET",
            headers: getAuthHeaders(token),
          },
        );

        if (taxResponse.ok) {
          const taxData: ApiResponse = await taxResponse.json();
          if (isApiSuccess(taxData)) {
            const taxValue = getApiValue(taxData);
            setTaxPairs(toPairs(unwrapList(taxValue)));
          } else {
            setError("فیش دریافت شد، اما دریافت عوارض صنفی با خطا مواجه شد.");
          }
        } else {
          setError("فیش دریافت شد، اما دریافت عوارض صنفی با خطا مواجه شد.");
        }
      } else {
        setError(
          "برای دریافت عوارض صنفی، مقدار shop و jobCode در پاسخ فیش پیدا نشد.",
        );
      }
    } catch (err) {
      console.error("Failed to load guild fees", err);
      setError("خطا در دریافت اطلاعات فیش و عوارض صنفی.");
    } finally {
      setIsGuildLoading(false);
    }
  };

  useEffect(() => {
    const loadCases = async () => {
      const token = getAuthToken();
      const nationalCode =
        typeof window !== "undefined"
          ? localStorage.getItem("user-national-code")
          : null;

      if (!token || !nationalCode) return;

      setIsCasesLoading(true);
      try {
        const response = await fetch(
          `/api/file?nationalCode=${encodeURIComponent(nationalCode)}`,
          {
            method: "GET",
            headers: getAuthHeaders(token),
          },
        );

        if (!response.ok) return;

        const data: ApiResponse = await response.json();

        if (!isApiSuccess(data)) {
          setError(getApiErrorMessage(data));
          return;
        }

        const fileValue = getApiValue(data);
        const mapped = unwrapList(fileValue).map(mapFileItem);
        setCases(mapped);
        if (mapped[0]) {
          setSelectedCase(mapped[0]);
          setSearchInputs(mapped[0].codes);
        }
      } catch (err) {
        console.error("Failed to load guild cases", err);
        setError("خطا در دریافت پرونده‌های زیرمجموعه.");
      } finally {
        setIsCasesLoading(false);
      }
    };

    void loadCases();
  }, []);

  const handleCaseClick = (item: GuildPropertyItem) => {
    setSearchInputs(item.codes);
    setSelectedCase(item);
    setReceiptPairs([]);
    setTaxPairs([]);
    setError("");
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const code = buildCodeFromInputs(searchInputs);
    const matchedCase =
      cases.find((item) => normalizeCode(item.fullCode) === code) ?? null;
    setSelectedCase(matchedCase);
    void loadGuildData(code, matchedCase);
  };

  const handleInputChange = (key: RenewalCodeKey, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [key]: normalizeDigits(value) }));
  };

  const hasGuildData = receiptPairs.length > 0 || taxPairs.length > 0;

  return (
    <>
      <GuildFeesHelpModal
        isOpen={isModalOpen}
        title={modalContent.title}
        description={modalContent.description}
        onClose={() => setIsModalOpen(false)}
      />

      <GuildFeesHeader isDark={isDark} toggleTheme={toggleTheme} />

      <section className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6">
        <div className="container mx-auto max-w-6xl px-0 md:px-2 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-4 rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm"
          >
            پس از انتخاب پرونده یا ورود کد نوسازی، فیش اصناف و عوارض صنفی از
            سرویس شهرداری دریافت می‌شود.
          </motion.div>

          <div className="space-y-4 md:space-y-5">
            <GuildFeesSearchSection
              isLoading={isGuildLoading}
              onHelp={handleOpenHelp}
              onInputChange={handleInputChange}
              onSubmit={handleSearch}
              searchInputs={searchInputs}
            />

            <GuildFeesPropertyListSection
              items={cases}
              selectedId={selectedCase?.id}
              isLoading={isCasesLoading}
              onCaseClick={handleCaseClick}
              onHelp={handleOpenHelp}
            />

            {error && (
              <div className="rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {hasGuildData || isGuildLoading ? (
              <>
                <GuildFeesCurrentFeesSection
                  title="فیش اصناف"
                  right={receiptColumns.right}
                  left={receiptColumns.left}
                  isLoading={isGuildLoading}
                />
                <GuildFeesCurrentFeesSection
                  title="عوارض صنفی جاری"
                  right={taxColumns.right}
                  left={taxColumns.left}
                  isLoading={isGuildLoading}
                />
              </>
            ) : (
              <GuildFeesEmptyState />
            )}

            <GuildFeesMapSection activeData={selectedCase} />
          </div>
        </div>
      </section>
    </>
  );
}

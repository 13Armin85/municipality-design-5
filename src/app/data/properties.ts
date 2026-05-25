export const renewalCodeKeys = [
  "region",
  "neighborhood",
  "block",
  "property",
  "building",
  "apartment",
  "guild",
] as const;

export type RenewalCodeKey = (typeof renewalCodeKeys)[number];
export type RenewalCodes = Record<RenewalCodeKey, string>;

export const renewalCodeLabels: Record<RenewalCodeKey, string> = {
  region: "منطقه",
  neighborhood: "محله",
  block: "بلوک",
  property: "ملک",
  building: "ساختمان",
  apartment: "آپارتمان",
  guild: "صنفی",
};

export const guildCodeFields = [
  { label: "صنفی", key: "guild" },
  { label: "آپارتمان", key: "apartment" },
  { label: "ساختمان", key: "building" },
  { label: "ملک", key: "property" },
  { label: "بلوک", key: "block" },
  { label: "محله", key: "neighborhood" },
  { label: "منطقه", key: "region" },
] as const;

type LabelValue = {
  label: string;
  value: string;
};

export type MockProperty = {
  id: string;
  rowNumber: string;
  fullCode: string;
  type: string;
  ownerName: string;
  description: string;
  codes: RenewalCodes;
  owner: {
    firstName: string;
    lastName: string;
    name: string;
    nationalId: string;
    phone: string;
    postalCode: string;
    address: string;
    ownerType: string;
    fatherName: string;
    birthPlace: string;
    issuePlace: string;
  };
  owners: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    ownerType: string;
    fatherName: string;
    birthPlace: string;
    issuePlace: string;
  }[];
  toll: {
    fees: {
      right: LabelValue[];
      left: LabelValue[];
    };
    history: { id: number; date: string; amount: string; status: string }[];
  };
  guildFees: {
    title: string;
    type: string;
    feeInfo: {
      right: LabelValue[];
      left: LabelValue[];
    };
  };
  inquiry: {
    retraction: {
      originalArea: string;
      reformedArea: string;
      remainingArea: string;
      description: string;
    };
    dimensions: {
      dir: string;
      type: string;
      name: string;
      sideExist: string;
      edgeExist: string;
    }[];
  };
  requestTracking: {
    requests: { code: string; title: string; status: string; date: string }[];
    details: LabelValue[];
  };
  registration: {
    request: { id: string; type: string; applicantType: string };
    complementary: {
      letterNo: string;
      letterDate: string;
      secretNo: string;
      secretDate: string;
      office: string;
      desc: string;
    };
    buyer: {
      name: string;
      nationalId: string;
      phone: string;
      share: string;
    };
    prevRequests: { id: string; date: string; status: string }[];
    map: { area: string };
  };
};

export const propertyItems: MockProperty[] = [
  {
    id: "property-1",
    rowNumber: "۱",
    fullCode: "۷-۱۰۴-۳۷-۴۴-۰-۰-۰",
    type: "ملک",
    ownerName: "بهرام حضرتی",
    description:
      "شماره پرونده: ۸۸۵۴۲، وضعیت ملک: سکونت، مساحت طبق سند: ۲۰۴۹ متر، پلاک ثبتی: ۴۴، آدرس: خیابان آزادی، کوچه اخلاص، پلاک ۴۴",
    codes: {
      region: "7",
      neighborhood: "104",
      block: "37",
      property: "44",
      building: "0",
      apartment: "0",
      guild: "0",
    },
    owner: {
      firstName: "بهرام",
      lastName: "حضرتی",
      name: "بهرام حضرتی",
      nationalId: "1234567890",
      phone: "09121234567",
      postalCode: "1112223334",
      address: "مراغه، خیابان آزادی، کوچه اخلاص، پلاک ۴۴",
      ownerType: "حقیقی",
      fatherName: "علی",
      birthPlace: "مراغه",
      issuePlace: "مراغه",
    },
    owners: [
      {
        id: "۱",
        firstName: "بهرام",
        lastName: "حضرتی",
        name: "بهرام حضرتی",
        ownerType: "حقیقی",
        fatherName: "علی",
        birthPlace: "مراغه",
        issuePlace: "مراغه",
      },
    ],
    toll: {
      fees: {
        right: [
          { label: "نام مالک", value: "بهرام حضرتی" },
          { label: "از سال", value: "۱۴۰۱" },
          { label: "شماره فیش", value: "۸۸۵۴۲" },
          { label: "خوش‌حسابی", value: "۴۵۰,۰۰۰" },
          { label: "معافیت", value: "۰" },
          { label: "آتش‌نشانی", value: "۱۲,۰۰۰" },
          { label: "ارزش افزوده", value: "۹۰,۰۰۰" },
          { label: "خدمات", value: "۱۵۰,۰۰۰" },
          { label: "مبلغ قابل پرداخت", value: "۲,۴۵۰,۰۰۰" },
        ],
        left: [
          { label: "آدرس مالک", value: "خیابان آزادی، کوچه اخلاص" },
          { label: "تا سال", value: "۱۴۰۳" },
          { label: "سهم مالک", value: "۶ دانگ" },
          { label: "خدمات معوقه", value: "۰" },
          { label: "بدحسابی", value: "۰" },
          { label: "آموزش و پرورش", value: "۵,۰۰۰" },
          { label: "عوارض", value: "۱,۸۰۰,۰۰۰" },
          { label: "بدهی معوقه", value: "۳۴۰,۰۰۰" },
          {
            label: "مبلغ به حروف",
            value: "دو میلیون و چهارصد و پنجاه هزار تومان",
          },
        ],
      },
      history: [
        {
          id: 1,
          date: "1402/05/12",
          amount: "1,200,000",
          status: "پرداخت شده",
        },
      ],
    },
    guildFees: {
      title: "۷-۱۰۴-۳۷-۴۴-۰-۰-۰",
      type: "ملک",
      feeInfo: {
        right: [
          { label: "نام متصدی", value: "بهرام حضرتی" },
          { label: "از تاریخ", value: "1402/01/01" },
          { label: "مبلغ جاری", value: "4,500,000 ریال" },
          { label: "مبلغ به حروف", value: "چهارصد و پنجاه هزار تومان" },
        ],
        left: [
          { label: "نوع شغل", value: "خدمات ساختمانی" },
          { label: "تا تاریخ", value: "1402/12/29" },
          { label: "مبلغ قسط", value: "1,125,000 ریال" },
          { label: "آدرس", value: "خیابان آزادی، پلاک ۴۴" },
        ],
      },
    },
    inquiry: {
      retraction: {
        originalArea: "۲۰۴۹",
        reformedArea: "۱۲۵",
        remainingArea: "۱۹۲۴",
        description:
          "اصلاحی شمالی: ۱.۲ متر | اصلاحی غربی: ۰.۸ متر | کد طرح: TR-1044",
      },
      dimensions: [
        {
          dir: "شمال",
          type: "کوچه",
          name: "اخلاص",
          sideExist: "۱۰.۲۰",
          edgeExist: "۱۰.۲۰",
        },
        {
          dir: "شرق",
          type: "خیابان",
          name: "شهید سلیمانی",
          sideExist: "۲۱.۴۰",
          edgeExist: "۲۱.۴۰",
        },
        {
          dir: "جنوب",
          type: "کوچه",
          name: "گلستان",
          sideExist: "۱۰.۱۰",
          edgeExist: "۱۰.۱۰",
        },
        {
          dir: "غرب",
          type: "پلاک مجاور",
          name: "پلاک ۴۲",
          sideExist: "۲۱.۳۵",
          edgeExist: "۲۱.۳۵",
        },
      ],
    },
    requestTracking: {
      requests: [
        {
          code: "RQ-1405-112",
          title: "درخواست مفاصاحساب",
          status: "در حال بررسی",
          date: "1405/02/21",
        },
      ],
      details: [
        { label: "آخرین مرحله", value: "ارجاع به کارشناس" },
        { label: "نوع درخواست", value: "مفاصاحساب نوسازی" },
        { label: "شناسه پیگیری", value: "TRK-889134" },
        { label: "مهلت پاسخ", value: "۳ روز کاری" },
      ],
    },
    registration: {
      request: { id: "REQ-101", type: "نوسازی", applicantType: "حقیقی" },
      complementary: {
        letterNo: "۱/الف/۱۲۳",
        letterDate: "1402/05/10",
        secretNo: "۹۸۷۶",
        secretDate: "1402/05/12",
        office: "شهرداری منطقه ۱",
        desc: "درخواست اولویت‌دار",
      },
      buyer: {
        name: "فاطمه محرم پور",
        nationalId: "0987654321",
        phone: "09350001122",
        share: "۳ دانگ",
      },
      prevRequests: [
        { id: "۸۷۷۶", date: "1401/11/02", status: "مختومه" },
        { id: "۸۸۱۰", date: "1402/01/18", status: "در حال بررسی" },
      ],
      map: { area: "2049.00" },
    },
  },
  {
    id: "property-2",
    rowNumber: "۲",
    fullCode: "۴-۰۳۲-۱۸-۷۸-۱-۳-۵",
    type: "صنفی",
    ownerName: "شرکت تجارت آراد",
    description:
      "شماره پرونده: ۷۷۱۹۰، وضعیت ملک: تجاری، مساحت طبق سند: ۱۵۰ متر، پلاک ثبتی: ۷۸، آدرس: بلوار امام، مجتمع آراد، واحد ۳",
    codes: {
      region: "4",
      neighborhood: "032",
      block: "18",
      property: "78",
      building: "1",
      apartment: "3",
      guild: "5",
    },
    owner: {
      firstName: "آراد",
      lastName: "تجارت",
      name: "شرکت تجارت آراد",
      nationalId: "14001234567",
      phone: "04135556677",
      postalCode: "5159912345",
      address: "مراغه، بلوار امام، مجتمع آراد، واحد ۳",
      ownerType: "حقوقی",
      fatherName: "-",
      birthPlace: "مراغه",
      issuePlace: "مراغه",
    },
    owners: [
      {
        id: "۱",
        firstName: "آراد",
        lastName: "تجارت",
        name: "شرکت تجارت آراد",
        ownerType: "حقوقی",
        fatherName: "-",
        birthPlace: "مراغه",
        issuePlace: "مراغه",
      },
      {
        id: "۲",
        firstName: "مهدی",
        lastName: "رحیمی",
        name: "مهدی رحیمی",
        ownerType: "حقیقی",
        fatherName: "کریم",
        birthPlace: "تبریز",
        issuePlace: "تبریز",
      },
    ],
    toll: {
      fees: {
        right: [
          { label: "نام مالک", value: "شرکت تجارت آراد" },
          { label: "از سال", value: "۱۴۰۰" },
          { label: "شماره فیش", value: "۷۷۱۹۰" },
          { label: "خوش‌حسابی", value: "۰" },
          { label: "معافیت", value: "۰" },
          { label: "آتش‌نشانی", value: "۴۵,۰۰۰" },
          { label: "ارزش افزوده", value: "۲۴۰,۰۰۰" },
          { label: "خدمات", value: "۲۲۰,۰۰۰" },
          { label: "مبلغ قابل پرداخت", value: "۳,۸۶۰,۰۰۰" },
        ],
        left: [
          { label: "آدرس مالک", value: "بلوار امام، مجتمع آراد" },
          { label: "تا سال", value: "۱۴۰۳" },
          { label: "سهم مالک", value: "۶ دانگ" },
          { label: "خدمات معوقه", value: "۴۵۰,۰۰۰" },
          { label: "بدحسابی", value: "۱۲۰,۰۰۰" },
          { label: "آموزش و پرورش", value: "۱۸,۰۰۰" },
          { label: "عوارض", value: "۲,۴۵۰,۰۰۰" },
          { label: "بدهی معوقه", value: "۱,۰۴۰,۰۰۰" },
          {
            label: "مبلغ به حروف",
            value: "سه میلیون و هشتصد و شصت هزار تومان",
          },
        ],
      },
      history: [
        {
          id: 1,
          date: "1402/03/10",
          amount: "2,000,000",
          status: "پرداخت شده",
        },
        {
          id: 2,
          date: "1402/09/18",
          amount: "1,500,000",
          status: "پرداخت شده",
        },
      ],
    },
    guildFees: {
      title: "۴-۰۳۲-۱۸-۷۸-۱-۳-۵",
      type: "صنفی",
      feeInfo: {
        right: [
          { label: "نام متصدی", value: "مهدی رحیمی" },
          { label: "از تاریخ", value: "1402/01/01" },
          { label: "مبلغ جاری", value: "9,800,000 ریال" },
          { label: "مبلغ به حروف", value: "نهصد و هشتاد هزار تومان" },
        ],
        left: [
          { label: "نوع شغل", value: "فروش لوازم الکترونیکی" },
          { label: "تا تاریخ", value: "1402/12/29" },
          { label: "مبلغ قسط", value: "2,450,000 ریال" },
          { label: "آدرس", value: "بلوار امام، مجتمع آراد، واحد ۳" },
        ],
      },
    },
    inquiry: {
      retraction: {
        originalArea: "۱۵۰",
        reformedArea: "۰",
        remainingArea: "۱۵۰",
        description: "بدون اصلاحی | کد طرح: CM-3278",
      },
      dimensions: [
        {
          dir: "شمال",
          type: "راهرو",
          name: "عمومی",
          sideExist: "۸.۰۰",
          edgeExist: "۸.۰۰",
        },
        {
          dir: "شرق",
          type: "واحد مجاور",
          name: "واحد ۴",
          sideExist: "۱۸.۷۵",
          edgeExist: "۱۸.۷۵",
        },
        {
          dir: "جنوب",
          type: "بلوار",
          name: "امام",
          sideExist: "۸.۱۰",
          edgeExist: "۸.۱۰",
        },
        {
          dir: "غرب",
          type: "واحد مجاور",
          name: "واحد ۲",
          sideExist: "۱۸.۶۰",
          edgeExist: "۱۸.۶۰",
        },
      ],
    },
    requestTracking: {
      requests: [
        {
          code: "RQ-1405-240",
          title: "استعلام پرونده",
          status: "تکمیل مدارک",
          date: "1405/01/30",
        },
      ],
      details: [
        { label: "آخرین مرحله", value: "در انتظار بارگذاری فایل" },
        { label: "نوع درخواست", value: "استعلام ملک صنفی" },
        { label: "شناسه پیگیری", value: "TRK-514220" },
        { label: "مهلت پاسخ", value: "۲ روز کاری" },
      ],
    },
    registration: {
      request: { id: "REQ-202", type: "پایان کار", applicantType: "حقوقی" },
      complementary: {
        letterNo: "۲/ب/۴۵۶",
        letterDate: "1403/01/15",
        secretNo: "۵۵۴۴",
        secretDate: "1403/01/16",
        office: "سازمان نوسازی",
        desc: "",
      },
      buyer: { name: "-", nationalId: "-", phone: "-", share: "-" },
      prevRequests: [{ id: "۹۹۸۸", date: "1401/12/20", status: "بایگانی شده" }],
      map: { area: "150.20" },
    },
  },
];

export const selectedPropertyStorageKey = "municipality-selected-property-id";

export const getDefaultProperty = () => propertyItems[0];

export const findPropertyById = (id: string | null | undefined) =>
  propertyItems.find((property) => property.id === id) ?? getDefaultProperty();

export const findPropertyByFullCode = (fullCode: string | null | undefined) =>
  propertyItems.find((property) => property.fullCode === fullCode);

export const getStoredPropertyId = () => {
  if (typeof window === "undefined") return getDefaultProperty().id;
  return (
    localStorage.getItem(selectedPropertyStorageKey) ?? getDefaultProperty().id
  );
};

export const getStoredProperty = () => findPropertyById(getStoredPropertyId());

export const persistSelectedProperty = (propertyId: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(selectedPropertyStorageKey, propertyId);
  window.dispatchEvent(
    new CustomEvent("municipality-selected-property-change", {
      detail: propertyId,
    }),
  );
};

export const areRenewalCodesEqual = (a: RenewalCodes, b: RenewalCodes) =>
  renewalCodeKeys.every((key) => a[key] === b[key]);

export const findPropertyByCodes = (codes: RenewalCodes) =>
  propertyItems.find((property) => areRenewalCodesEqual(property.codes, codes));

export const getRenewalCodeValues = (codes: RenewalCodes) =>
  renewalCodeKeys.map((key) => codes[key]);

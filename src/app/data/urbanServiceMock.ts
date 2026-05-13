export const searchLabels = ["منطقه", "محله", "بلوک", "ملک", "ساختمان", "آپارتمان", "صنفی"] as const;

export type UrbanPropertyMock = {
  id: string;
  type: string;
  owner: string;
  fields: string[];
  address: string;
  trackingCode: string;
};

export const urbanPropertiesMock: UrbanPropertyMock[] = [
  { id: "۷-۱۰۴-۲۷-۴۴-۰-۰-۰", type: "ملک", owner: "بهرام حضرتی", fields: ["7","104","27","44","0","0","0"], address: "مشهد، سجاد، کوچه ۱۲", trackingCode: "TRK-104400" },
  { id: "۷-۱۰۴-۲۷-۴۴-۱-۲-۰", type: "آپارتمان", owner: "مهسا حضرتی", fields: ["7","104","27","44","1","2","0"], address: "مشهد، سجاد، ساختمان نگین، واحد ۲", trackingCode: "TRK-104412" },
  { id: "۱-۷۰۱-۵-۵۶-۰-۰-۰", type: "ملک", owner: "احمد عزیزی", fields: ["1","701","5","56","0","0","0"], address: "مشهد، الهیه، نبش کوچه ۵۶", trackingCode: "TRK-701560" },
];

export interface GISConfig {
  layersURL: {
    melk: string;
  };
}

export async function getGISConfig(): Promise<GISConfig> {
  const response = await fetch("/MapServices/Config", {
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error("خطا در دریافت تنظیمات GIS");
  }

  return response.json();
}
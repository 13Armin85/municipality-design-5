// API endpoints for Retreat (عقب نشینی) status
// Swagger Endpoint: /api/retreat
// This handles the retreat/rollback status for properties

export interface RetreatResponse {
  success: boolean;
  data: RetreatData;
}

export interface RetreatData {
  originalArea: string;
  reformedArea: string;
  remainingArea: string;
  description: string;
  dimensions: RetreatDimension[];
}

export interface RetreatDimension {
  dir: string; // جهت (North, East, South, West)
  type: string; // نوع (Street, Lane, Adjacent Property, Corridor, etc.)
  name: string; // نام
  sideExist: string; // ضلع موجود
  edgeExist: string; // لبه موجود
}

// Sub-endpoints:
// GET /api/retreat - Get retreat status data
//   Query Parameters:
//     - codeNosazi (string, required): Property code
//   Headers:
//     - Authorization: Bearer <token>
//   Response: RetreatResponse

// GET /api/retreat/area - Get retreat area information
//   Query Parameters:
//     - codeNosazi (string, required): Property code
//   Headers:
//     - Authorization: Bearer <token>
//   Response: { success: boolean; data: { originalArea, reformedArea, remainingArea } }

// GET /api/retreat/directions - Get retreat directions/dimensions
//   Query Parameters:
//     - codeNosazi (string, required): Property code
//   Headers:
//     - Authorization: Bearer <token>
//   Response: { success: boolean; data: RetreatDimension[] }

/**
 * Fetch retreat status data
 * Retrieves complete retreat information including area and dimensions
 */
export const fetchRetreatData = async (
  codeNosazi: string,
  token: string,
): Promise<RetreatData | null> => {
  try {
    const response = await fetch(
      `/api/retreat?codeNosazi=${encodeURIComponent(codeNosazi)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch retreat data");
    }

    const data: RetreatResponse = await response.json();

    if (data.success) {
      return data.data;
    }

    throw new Error("API returned unsuccessful response");
  } catch (error) {
    console.error("Error fetching retreat data:", error);
    return null;
  }
};

/**
 * Fetch retreat area information
 * Retrieves original area, reformed area, and remaining area
 */
export const fetchRetreatArea = async (
  codeNosazi: string,
  token: string,
): Promise<{
  originalArea: string;
  reformedArea: string;
  remainingArea: string;
} | null> => {
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
      throw new Error("Failed to fetch retreat area data");
    }

    const data = await response.json();

    if (data.success) {
      return data.data;
    }

    throw new Error("API returned unsuccessful response");
  } catch (error) {
    console.error("Error fetching retreat area:", error);
    return null;
  }
};

/**
 * Fetch retreat directions/dimensions
 * Retrieves dimension information for all sides of the property
 */
export const fetchRetreatDirections = async (
  codeNosazi: string,
  token: string,
): Promise<RetreatDimension[] | null> => {
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
      throw new Error("Failed to fetch retreat directions");
    }

    const data = await response.json();

    if (data.success) {
      return data.data;
    }

    throw new Error("API returned unsuccessful response");
  } catch (error) {
    console.error("Error fetching retreat directions:", error);
    return null;
  }
};

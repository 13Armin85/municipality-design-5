import { useEffect, useMemo, useState } from "react";
import {
  findPropertyById,
  getStoredPropertyId,
  persistSelectedProperty,
} from "../data/properties";

export function useSelectedProperty() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(getStoredPropertyId);

  useEffect(() => {
    const handleChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSelectedPropertyId(customEvent.detail ?? getStoredPropertyId());
    };

    const handleStorage = () => setSelectedPropertyId(getStoredPropertyId());

    window.addEventListener("municipality-selected-property-change", handleChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "municipality-selected-property-change",
        handleChange,
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const selectedProperty = useMemo(
    () => findPropertyById(selectedPropertyId),
    [selectedPropertyId],
  );

  const selectProperty = (propertyId: string) => {
    persistSelectedProperty(propertyId);
    setSelectedPropertyId(propertyId);
  };

  return { selectedProperty, selectedPropertyId, selectProperty };
}

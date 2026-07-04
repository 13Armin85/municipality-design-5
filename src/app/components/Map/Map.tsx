import { useEffect, useRef } from "react";

import { ArcGISMap } from "@/app/gis/ArcGISMap";

export default function Map() {

    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (!mapRef.current) return;

        const map = new ArcGISMap(mapRef.current);

        return () => {
            map.destroy();
        };

    }, []);

    return (
        <div
            ref={mapRef}
            className="w-full h-full"
        />
    );

}
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

//import { GISMap } from "@/app/gis/GISMap";
import { GISMap } from "../../gis/GISMap";
import { MapHandle } from "./types";

const Map = forwardRef<MapHandle>((props, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const arcgisMap = useRef<GISMap | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    arcgisMap.current = new GISMap();
    arcgisMap.current.initialize(mapRef.current);

    return () => {
      arcgisMap.current?.destroy();
    };
  }, []);

//   useImperativeHandle(ref, () => ({
//     async findParcel(code: string) {
//         console.log("Map.tsx ->", code);
//         return await arcgisMap.current?.findParcel(code);
//     },
//   }));
   useImperativeHandle(ref, () => ({
        async selectMelkByCodeNosazi(code: string) {            
            return await arcgisMap.current?.selectMelkByCodeNosazi(code);
        },

        async highlightMelkByCodeNosazi(codes: string[]) {
            return await arcgisMap.current?.highlightMelkByCodeNosazi(codes);
        },
    }));

  return <div ref={mapRef} className="w-full h-full" />;
});

export default Map;
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

   useImperativeHandle(ref, () => ({
        async selectMelkByCodeNosazi(code: string) {            
            return await arcgisMap.current?.selectMelkByCodeNosazi(code);
        },

        async highlightMelkByCodeNosazi(codes: string[]) {
            return await arcgisMap.current?.highlightMelkByCodeNosazi(codes);
        },
        clearGraphics(){
            return arcgisMap.current?.clearGraphics();
        },
        goHome(){
          return arcgisMap.current?.goHome();
        },
        zoomIn(){
          return arcgisMap.current?.zoomIn();
        },
        zoomOut(){
          return arcgisMap.current?.zoomOut();
        },
        toggleBasemap(){
          return arcgisMap.current?.toggleBasemap();
        }
    }));

  return <div ref={mapRef} className="w-full h-full" />;
});

export default Map;
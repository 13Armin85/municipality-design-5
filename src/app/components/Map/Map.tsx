import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

//import { GISMap } from "@/app/gis/GISMap";
import { GISMap } from "../../gis/GISMap";
import { MapHandle } from "./types";

interface MapProps {
  autoSelectCode?: string | null;
}

const Map = forwardRef<MapHandle, MapProps>(({ autoSelectCode }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const arcgisMap = useRef<GISMap | null>(null);
  const mapReady = useRef<Promise<void> | null>(null);
  const hasAutoSelected = useRef(false);
  const autoSelectAttempt = useRef(0);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new GISMap();
    arcgisMap.current = map;
    mapReady.current = map.initialize(mapRef.current);

    return () => {
      map.destroy();

      if (arcgisMap.current === map) {
        arcgisMap.current = null;
        mapReady.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const code = autoSelectCode?.trim();
    const ready = mapReady.current;

    if (!code || !ready || hasAutoSelected.current) return;

    hasAutoSelected.current = true;
    const attempt = ++autoSelectAttempt.current;

    void ready
      .then(() => {
        if (autoSelectAttempt.current === attempt) {
          return arcgisMap.current?.selectMelkByCodeNosazi(code);
        }
      })
      .catch(() => {
        if (autoSelectAttempt.current === attempt) {
          hasAutoSelected.current = false;
        }
      });

    return () => {
      if (autoSelectAttempt.current === attempt) {
        autoSelectAttempt.current += 1;
        hasAutoSelected.current = false;
      }
    };
  }, [autoSelectCode]);

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

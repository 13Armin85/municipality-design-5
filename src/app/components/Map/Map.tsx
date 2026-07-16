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

type AutoSelectStatus = "idle" | "pending" | "done";

const Map = forwardRef<MapHandle, MapProps>(({ autoSelectCode }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const arcgisMap = useRef<GISMap | null>(null);
  const mapReady = useRef<Promise<void> | null>(null);
  const mapGeneration = useRef(0);
  const autoSelectStatus = useRef<AutoSelectStatus>("idle");

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new GISMap();
    const generation = ++mapGeneration.current;
    arcgisMap.current = map;
    mapReady.current = map.initialize(mapRef.current);
    autoSelectStatus.current = "idle";

    return () => {
      if (mapGeneration.current === generation) {
        mapGeneration.current += 1;
        autoSelectStatus.current = "idle";
      }

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
    const map = arcgisMap.current;

    if (!code || !ready || !map || autoSelectStatus.current !== "idle") {
      return;
    }

    autoSelectStatus.current = "pending";
    const generation = mapGeneration.current;

    void ready
      .then(async () => {
        if (
          mapGeneration.current !== generation ||
          arcgisMap.current !== map ||
          autoSelectStatus.current !== "pending"
        ) {
          return;
        }

        await map.selectMelkByCodeNosazi(code);

        if (mapGeneration.current === generation) {
          autoSelectStatus.current = "done";
        }
      })
      .catch(() => {
        if (mapGeneration.current === generation) {
          autoSelectStatus.current = "idle";
        }
      });
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

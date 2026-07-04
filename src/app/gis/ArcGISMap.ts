import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

export class ArcGISMap {

    private map: EsriMap;
    private view: MapView;

    constructor(container: HTMLDivElement) {

        this.map = new EsriMap({
            basemap: "osm"
        });

        this.view = new MapView({
            container,
            map: this.map,
            center: [52.3566, 36.4609],
            zoom: 16
        });
        this.view.ui.remove("attribution");
    }

    destroy() {
        this.view.destroy();
    }

}
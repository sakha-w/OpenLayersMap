import { useEffect, useRef, useState } from "react";
import 'ol/ol.css';
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import Map from "ol/Map";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
import { Style, Circle, Fill, Stroke } from "ol/style";

interface Marker {
  lat: number;
  lon: number;
}

interface OpenLayerMapProps {
  markers: Marker[];
}

const OpenLayerMap = ({ markers }: OpenLayerMapProps) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [olMap, setOlMap] = useState<Map | null>(null);
  const [vectorSource] = useState(new VectorSource());

  useEffect(() => {
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: '#ff0000' }),
          stroke: new Stroke({ color: '#ffffff', width: 2 }),
        }),
      }),
    });

    const map = new Map({
      target: mapElementRef.current as HTMLElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    setOlMap(map);

    return () => {
      map.setTarget(undefined);
    };
  }, [vectorSource]);

  useEffect(() => {
    if (olMap && markers.length > 0) {
      // Clear existing markers
      vectorSource.clear();

      // Add new markers
      markers.forEach((marker) => {
        const coordinate = fromLonLat([marker.lon, marker.lat]);
        const feature = new Feature({
          geometry: new Point(coordinate),
        });
        vectorSource.addFeature(feature);
      });

      // Center map on the last marker
      const lastMarker = markers[markers.length - 1];
      const lastCoordinate = fromLonLat([lastMarker.lon, lastMarker.lat]);
      olMap.getView().animate({
        center: lastCoordinate,
        zoom: 12,
        duration: 1000,
      });
    }
  }, [markers, olMap, vectorSource]);

  return <div ref={mapElementRef} className="map" style={{ width: '100%', height: '100%' }}></div>;
};

export default OpenLayerMap;
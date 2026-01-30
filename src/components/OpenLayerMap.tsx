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
import { fromLonLat, toLonLat } from "ol/proj";
import { Style, Circle, Fill, Stroke } from "ol/style";

/**
 * Struktur data marker
 * Menyimpan koordinat latitude dan longitude
 */
interface Marker {
  /** Latitude dalam Decimal Degrees */
  lat: number;

  /** Longitude dalam Decimal Degrees */
  lon: number;
}

/**
 * Props untuk komponen OpenLayerMap
 */
interface OpenLayerMapProps {
  /** Daftar marker yang akan ditampilkan pada peta */
  markers: Marker[];
  
  /** Callback saat peta diklik, mengembalikan koordinat lat/lon */
  onMapClick?: (lat: number, lon: number) => void;
}

/**
 * Komponen peta berbasis OpenLayers
 * Menampilkan marker berdasarkan koordinat latitude dan longitude
 */
const OpenLayerMap = ({ markers, onMapClick }: OpenLayerMapProps) => {
  /**
   * Referensi ke elemen DOM tempat peta OpenLayers dirender
   */
  const mapElementRef = useRef<HTMLDivElement>(null);

  /**
   * Instance OpenLayers Map
   */
  const [olMap, setOlMap] = useState<Map | null>(null);

  /**
   * Vector source untuk menyimpan feature marker
   * Dibuat sekali dan dipertahankan sepanjang lifecycle komponen
   */
  const [vectorSource] = useState(new VectorSource());

  /**
   * Effect untuk inisialisasi peta OpenLayers
   * Akan dijalankan sekali saat komponen pertama kali dirender
   */
  useEffect(() => {
    /**
     * Layer vektor untuk marker
     * Menggunakan Circle style sebagai simbol marker
     */
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

    /**
     * Inisialisasi instance Map OpenLayers
     */
    const map = new Map({
      target: mapElementRef.current as HTMLElement,
      layers: [
        /**
         * Base layer menggunakan OpenStreetMap
         */
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

    /**
     * Simpan instance map ke state
     */
    setOlMap(map);

    /**
     * Event listener untuk mendeteksi klik pada peta
     * Mengkonversi koordinat klik ke lon/lat dan memanggil callback
     */
    map.on('click', (event) => {
      if (onMapClick) {
        const coordinate = event.coordinate;
        const [lon, lat] = toLonLat(coordinate);
        onMapClick(lat, lon);
      }
    });

    /**
     * Cleanup saat komponen di-unmount
     * Melepas target map dari DOM
     */
    return () => {
      map.setTarget(undefined);
    };
  }, [vectorSource, onMapClick]);

  /**
   * Effect untuk memperbarui marker pada peta
   * Akan dijalankan setiap kali data markers berubah
   */
  useEffect(() => {
    if (olMap && markers.length > 0) {
      /**
       * Menghapus marker lama sebelum menambahkan marker baru
       */
      vectorSource.clear();

      /**
       * Menambahkan marker baru ke vector source
       */
      markers.forEach((marker) => {
        /**
         * Konversi koordinat lon/lat ke sistem proyeksi peta
         */
        const coordinate = fromLonLat([marker.lon, marker.lat]);

        /**
         * Membuat feature point untuk marker
         */
        const feature = new Feature({
          geometry: new Point(coordinate),
        });

        vectorSource.addFeature(feature);
      });

      /**
       * Memusatkan peta ke marker terakhir
       * dengan animasi zoom
       */
      const lastMarker = markers[markers.length - 1];
      const lastCoordinate = fromLonLat([lastMarker.lon, lastMarker.lat]);

      olMap.getView().animate({
        center: lastCoordinate,
        zoom: 12,
        duration: 1000,
      });
    }
  }, [markers, olMap, vectorSource]);

  /**
   * Elemen container peta
   * Ukuran peta mengikuti parent container
   */
  return (
    <div
      ref={mapElementRef}
      className="map"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default OpenLayerMap;

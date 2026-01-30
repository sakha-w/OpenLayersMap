import { useState } from 'react';
import './App.css';
import OpenLayerMap from './components/OpenLayerMap';
import CoordinateModal from './components/CoordinateModal';

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
 * Komponen utama aplikasi
 * Mengelola state global marker dan modal input koordinat
 */
function App() {
  /**
   * State untuk mengontrol visibilitas modal input koordinat
   */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * State untuk menyimpan daftar marker yang ditampilkan di peta
   */
  const [markers, setMarkers] = useState<Marker[]>([]);
  
  /**
   * State untuk menyimpan koordinat dari klik peta
   */
  const [clickedCoordinate, setClickedCoordinate] = useState<{ lat: number; lon: number } | null>(null);

  /**
   * Handler saat peta diklik
   * Membuka modal dan mengisi koordinat awal
   */
  const handleMapClick = (lat: number, lon: number) => {
    setClickedCoordinate({ lat, lon });
    setIsModalOpen(true);
  };
  
  /**
   * Handler untuk menambahkan marker baru ke state
   * @param lat Latitude dalam Decimal Degrees
   * @param lon Longitude dalam Decimal Degrees
   */
  const handleAddMarker = (lat: number, lon: number) => {
    setMarkers([...markers, { lat, lon }]);
  };
  
  /**
   * Handler untuk menutup modal
   * Reset clicked coordinate saat modal ditutup
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClickedCoordinate(null);
  };

  return (
    /**
     * Container utama aplikasi
     * Mengisi seluruh viewport browser
     */
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Komponen peta OpenLayers dengan handler klik */}
      <OpenLayerMap markers={markers} onMapClick={handleMapClick} />
      
      {/* Tombol untuk membuka modal input koordinat */}
      <button
        className="add-coordinate-btn"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Ikon tombol */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="button-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
          />
        </svg>
        Add Coordinate
      </button>

      {/* Modal input koordinat dengan koordinat awal dari klik peta */}
      <CoordinateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddMarker={handleAddMarker}
        initialLat={clickedCoordinate?.lat}
        initialLon={clickedCoordinate?.lon}
      />
    </div>
  );
}

export default App;

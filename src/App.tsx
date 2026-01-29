import { useState } from 'react';
import './App.css';
import OpenLayerMap from './components/OpenLayerMap';
import CoordinateModal from './components/CoordinateModal';

interface Marker {
  lat: number;
  lon: number;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markers, setMarkers] = useState<Marker[]>([]);

  const handleAddMarker = (lat: number, lon: number) => {
    setMarkers([...markers, { lat, lon }]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <OpenLayerMap markers={markers} />
      
      <button
        className="add-coordinate-btn"
        onClick={() => setIsModalOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="button-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
        </svg>
        Add Coordinate
      </button>

      <CoordinateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMarker={handleAddMarker}
      />
    </div>
  );
}

export default App;

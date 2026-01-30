import { render } from '@testing-library/react';
import OpenLayerMap from '../components/OpenLayerMap';

/**
 * =====================================================
 * Mock OpenLayers modules
 * =====================================================
 *
 * OpenLayers sangat bergantung pada:
 * - DOM API (canvas)
 * - WebGL
 * - internal state yang tidak tersedia di JSDOM
 *
 * Oleh karena itu, seluruh modul OpenLayers di-mock
 * agar:
 * 1. Test tidak error
 * 2. Fokus test hanya ke behavior React component
 * 3. Tidak tergantung implementasi OpenLayers
 */

/**
 * Mock Map instance
 * Digunakan untuk mencegah error saat:
 * - setTarget()
 * - getView().animate()
 * - on() untuk event listener
 */
jest.mock('ol/Map', () => {
  return jest.fn().mockImplementation(() => ({
    setTarget: jest.fn(),
    getView: jest.fn(() => ({
      animate: jest.fn(),
    })),
    on: jest.fn(),
  }));
});

/**
 * Mock View
 * View hanya diperlukan saat inisialisasi map
 */
jest.mock('ol/View', () => {
  return jest.fn().mockImplementation(() => ({}));
});

/**
 * Mock TileLayer (base map layer)
 */
jest.mock('ol/layer/Tile', () => {
  return jest.fn().mockImplementation(() => ({}));
});

/**
 * Mock VectorLayer (layer marker)
 */
jest.mock('ol/layer/Vector', () => {
  return jest.fn().mockImplementation(() => ({}));
});

/**
 * Mock OpenStreetMap source
 */
jest.mock('ol/source/OSM', () => {
  return jest.fn().mockImplementation(() => ({}));
});

/**
 * Mock VectorSource
 * Digunakan untuk menambahkan dan menghapus marker
 */
jest.mock('ol/source/Vector', () => {
  return jest.fn().mockImplementation(() => ({
    clear: jest.fn(),
    addFeature: jest.fn(),
  }));
});

/**
 * Mock Feature
 * Digunakan untuk merepresentasikan marker
 */
jest.mock('ol', () => ({
  Feature: jest.fn().mockImplementation(() => ({})),
}));

/**
 * Mock Point geometry
 */
jest.mock('ol/geom', () => ({
  Point: jest.fn().mockImplementation(() => ({})),
}));

/**
 * Mock fungsi proyeksi koordinat
 * fromLonLat dan toLonLat dikembalikan apa adanya
 */
jest.mock('ol/proj', () => ({
  fromLonLat: jest.fn((coords) => coords),
  toLonLat: jest.fn((coords) => coords),
}));

/**
 * Mock style marker
 * Digunakan agar OpenLayers tidak mencoba render canvas asli
 */
jest.mock('ol/style', () => ({
  Style: jest.fn().mockImplementation(() => ({})),
  Circle: jest.fn().mockImplementation(() => ({})),
  Fill: jest.fn().mockImplementation(() => ({})),
  Stroke: jest.fn().mockImplementation(() => ({})),
}));

/**
 * =====================================================
 * Test Suite: OpenLayerMap
 * =====================================================
 */
describe('OpenLayerMap', () => {

  /**
   * Test dasar:
   * memastikan container map dirender ke DOM
   */
  it('should render map container', () => {
    const { container } = render(<OpenLayerMap markers={[]} />);
    const mapElement = container.querySelector('.map');
    
    expect(mapElement).toBeInTheDocument();
  });

  /**
   * Map harus bisa di-render meskipun markers kosong
   */
  it('should initialize with empty markers', () => {
    const { container } = render(<OpenLayerMap markers={[]} />);
    
    expect(container.querySelector('.map')).toBeInTheDocument();
  });

  /**
   * Komponen harus menerima props markers tanpa error
   */
  it('should accept markers prop', () => {
    const markers = [
      { lat: 48.8575, lon: 2.3514 },
      { lat: -6.2088, lon: 106.8456 },
    ];
    
    const { container } = render(<OpenLayerMap markers={markers} />);
    
    expect(container.querySelector('.map')).toBeInTheDocument();
  });

  /**
   * Test perubahan props:
   * memastikan komponen tidak crash saat markers diperbarui
   */
  it('should update when markers change', () => {
    const { rerender } = render(<OpenLayerMap markers={[]} />);
    
    const newMarkers = [{ lat: 4.5709, lon: -74.2973 }];
    rerender(<OpenLayerMap markers={newMarkers} />);
    
    // Jika sampai sini tanpa error, test dianggap berhasil
    expect(true).toBe(true);
  });

  /**
   * Komponen harus mampu menangani banyak marker
   */
  it('should handle multiple markers', () => {
    const markers = [
      { lat: 48.8575, lon: 2.3514 },    // Paris
      { lat: -6.2088, lon: 106.8456 },  // Jakarta
      { lat: 4.5709, lon: -74.2973 },   // Bogotá
    ];
    
    const { container } = render(<OpenLayerMap markers={markers} />);
    
    expect(container.querySelector('.map')).toBeInTheDocument();
  });

  /**
   * Map container harus memiliki style ukuran penuh
   */
  it('should have proper styling', () => {
    const { container } = render(<OpenLayerMap markers={[]} />);
    const mapElement = container.querySelector('.map') as HTMLElement;
    
    expect(mapElement).toHaveStyle({ width: '100%', height: '100%' });
  });
});

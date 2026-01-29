import { render } from '@testing-library/react';
import OpenLayerMap from '../components/OpenLayerMap';

// Mock OpenLayers modules
jest.mock('ol/Map', () => {
  return jest.fn().mockImplementation(() => ({
    setTarget: jest.fn(),
    getView: jest.fn(() => ({
      animate: jest.fn(),
    })),
  }));
});

jest.mock('ol/View', () => {
  return jest.fn().mockImplementation(() => ({}));
});

jest.mock('ol/layer/Tile', () => {
  return jest.fn().mockImplementation(() => ({}));
});

jest.mock('ol/layer/Vector', () => {
  return jest.fn().mockImplementation(() => ({}));
});

jest.mock('ol/source/OSM', () => {
  return jest.fn().mockImplementation(() => ({}));
});

jest.mock('ol/source/Vector', () => {
  return jest.fn().mockImplementation(() => ({
    clear: jest.fn(),
    addFeature: jest.fn(),
  }));
});

jest.mock('ol', () => ({
  Feature: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('ol/geom', () => ({
  Point: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('ol/proj', () => ({
  fromLonLat: jest.fn((coords) => coords),
}));

jest.mock('ol/style', () => ({
  Style: jest.fn().mockImplementation(() => ({})),
  Circle: jest.fn().mockImplementation(() => ({})),
  Fill: jest.fn().mockImplementation(() => ({})),
  Stroke: jest.fn().mockImplementation(() => ({})),
}));

describe('OpenLayerMap', () => {
  it('should render map container', () => {
    const { container } = render(<OpenLayerMap markers={[]} />);
    const mapElement = container.querySelector('.map');
    
    expect(mapElement).toBeInTheDocument();
  });

  it('should initialize with empty markers', () => {
    const { container } = render(<OpenLayerMap markers={[]} />);
    
    expect(container.querySelector('.map')).toBeInTheDocument();
  });

  it('should accept markers prop', () => {
    const markers = [
      { lat: 48.8575, lon: 2.3514 },
      { lat: -6.2088, lon: 106.8456 },
    ];
    
    const { container } = render(<OpenLayerMap markers={markers} />);
    
    expect(container.querySelector('.map')).toBeInTheDocument();
  });

  it('should update when markers change', () => {
    const { rerender } = render(<OpenLayerMap markers={[]} />);
    
    const newMarkers = [{ lat: 4.5709, lon: -74.2973 }];
    rerender(<OpenLayerMap markers={newMarkers} />);
    
    // Component should not throw error
    expect(true).toBe(true);
  });

  it('should handle multiple markers', () => {
    const markers = [
      { lat: 48.8575, lon: 2.3514 },    // Paris
      { lat: -6.2088, lon: 106.8456 },  // Jakarta
      { lat: 4.5709, lon: -74.2973 },   // Bogotá
    ];
    
    const { container } = render(<OpenLayerMap markers={markers} />);
    
    expect(container.querySelector('.map')).toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(<OpenLayerMap markers={[]} />);
    const mapElement = container.querySelector('.map') as HTMLElement;
    
    expect(mapElement).toHaveStyle({ width: '100%', height: '100%' });
  });
});

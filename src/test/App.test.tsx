import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

/**
 * =====================================================
 * Mock Components
 * =====================================================
 *
 * App bergantung pada OpenLayerMap dan CoordinateModal.
 * Kedua komponen ini:
 * - Kompleks
 * - Bergantung pada API browser / OpenLayers
 *
 * Pada test App, kita TIDAK menguji implementasi detail
 * dari komponen tersebut, hanya interaksi level App.
 */

/**
 * Mock OpenLayerMap
 * Diganti dengan komponen sederhana agar:
 * - Test lebih cepat
 * - Tidak tergantung OpenLayers
 */
jest.mock('../components/OpenLayerMap', () => {
  return function MockOpenLayerMap() {
    return <div data-testid="mock-map">Map Component</div>;
  };
});

/**
 * Mock CoordinateModal
 * Meniru perilaku dasar:
 * - Render jika isOpen = true
 * - Tutup modal via onClose
 */
jest.mock('../components/CoordinateModal', () => {
  return function MockCoordinateModal({ isOpen, onClose }: any) {
    if (!isOpen) return null;

    return (
      <div data-testid="mock-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    );
  };
});

/**
 * =====================================================
 * Test Suite: App
 * =====================================================
 *
 * Test ini memverifikasi:
 * - Render awal aplikasi
 * - Interaksi tombol Add Coordinate
 * - Perilaku buka & tutup modal
 */

describe('App', () => {

  /**
   * Aplikasi harus menampilkan peta dan tombol Add Coordinate
   */
  it('should render the app with map and button', () => {
    render(<App />);
    
    expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    expect(screen.getByText('Add Coordinate')).toBeInTheDocument();
  });

  /**
   * Klik tombol Add Coordinate harus membuka modal
   */
  it('should open modal when button is clicked', () => {
    render(<App />);
    
    const addButton = screen.getByText('Add Coordinate');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  /**
   * Modal harus bisa ditutup melalui callback onClose
   */
  it('should close modal when close is triggered', () => {
    render(<App />);
    
    // Buka modal
    fireEvent.click(screen.getByText('Add Coordinate'));
    
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    
    // Tutup modal
    fireEvent.click(screen.getByText('Close Modal'));
    
    expect(
      screen.queryByTestId('mock-modal')
    ).not.toBeInTheDocument();
  });

  /**
   * Tombol Add Coordinate harus memiliki ikon SVG
   */
  it('should display the add coordinate button with icon', () => {
    render(<App />);
    
    const button = screen.getByText('Add Coordinate').closest('button');
    
    expect(button).toBeInTheDocument();
    expect(button?.querySelector('svg')).toBeInTheDocument();
  });
});

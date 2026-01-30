import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CoordinateModal from '../components/CoordinateModal';

/**
 * =====================================================
 * Test Suite: CoordinateModal
 * =====================================================
 *
 * Test ini memverifikasi:
 * - Perilaku modal (open / close)
 * - Pergantian format koordinat (DD ↔ DMS)
 * - Input dan validasi koordinat
 * - Konversi dan submit data ke parent component
 */

describe('CoordinateModal', () => {
  /**
   * Mock callback untuk menutup modal
   */
  const mockOnClose = jest.fn();

  /**
   * Mock callback untuk menambahkan marker ke peta
   */
  const mockOnAddMarker = jest.fn();

  /**
   * Reset semua mock sebelum setiap test
   * agar tidak saling memengaruhi
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Modal tidak boleh dirender jika isOpen = false
   */
  it('should not render when isOpen is false', () => {
    render(
      <CoordinateModal
        isOpen={false}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    expect(
      screen.queryByText('Add Coordinate Marker')
    ).not.toBeInTheDocument();
  });

  /**
   * Modal harus muncul jika isOpen = true
   */
  it('should render when isOpen is true', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    expect(
      screen.getByText('Add Coordinate Marker')
    ).toBeInTheDocument();
  });

  /**
   * Klik tombol close harus memanggil onClose
   */
  it('should close modal when close button is clicked', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  /**
   * User harus bisa berpindah format koordinat
   * antara DD dan DMS
   */
  it('should switch between DD and DMS formats', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    const dmsButton = screen.getByText('DMS Format');
    const ddButton = screen.getByText('DD Format');
    
    // Secara default format DD aktif
    expect(ddButton).toHaveClass('active');
    
    // Berpindah ke DMS
    fireEvent.click(dmsButton);
    expect(dmsButton).toHaveClass('active');
    
    // Kembali ke DD
    fireEvent.click(ddButton);
    expect(ddButton).toHaveClass('active');
  });

  /**
   * Pastikan input DD tampil dengan benar
   */
  it('should display DD format inputs correctly', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    expect(
      screen.getByText('Latitude (Decimal Degrees)')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Longitude (Decimal Degrees)')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('48.8575')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('2.3514')
    ).toBeInTheDocument();
  });

  /**
   * Pastikan input DMS tampil saat format diubah
   */
  it('should display DMS format inputs correctly', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    // Ubah format ke DMS
    fireEvent.click(screen.getByText('DMS Format'));
    
    expect(screen.getAllByText('Degrees').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Minutes').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Seconds').length).toBeGreaterThan(0);
  });

  /**
   * Submit koordinat DD harus mengirim nilai
   * latitude dan longitude yang benar
   */
  it('should submit DD coordinates correctly', async () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    const latInput = screen.getByPlaceholderText('48.8575');
    const lonInput = screen.getByPlaceholderText('2.3514');
    const selects = screen.getAllByRole('combobox');
    const lonSelect = selects[1];
    
    fireEvent.change(latInput, { target: { value: '4.5709' } });
    fireEvent.change(lonInput, { target: { value: '74.2973' } });
    fireEvent.change(lonSelect, { target: { value: 'W' } });
    
    fireEvent.click(screen.getByText('Add Marker'));
    
    await waitFor(() => {
      expect(mockOnAddMarker).toHaveBeenCalledWith(4.5709, -74.2973);
    });
  });

  /**
   * Konversi DD ke DMS harus berpindah format
   */
  it('should convert DD to DMS correctly', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    fireEvent.change(
      screen.getByPlaceholderText('48.8575'),
      { target: { value: '48.8575' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('2.3514'),
      { target: { value: '2.3514' } }
    );
    
    fireEvent.click(screen.getByText(/Convert to DMS/i));
    
    // Format DMS harus aktif
    expect(screen.getByText('DMS Format')).toHaveClass('active');
  });

  /**
   * Tombol clear harus mengosongkan seluruh input
   */
  it('should clear form when clear button is clicked', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    const latInput = screen.getByPlaceholderText('48.8575') as HTMLInputElement;
    const lonInput = screen.getByPlaceholderText('2.3514') as HTMLInputElement;
    
    fireEvent.change(latInput, { target: { value: '4.5709' } });
    fireEvent.change(lonInput, { target: { value: '74.2973' } });
    
    expect(latInput.value).toBe('4.5709');
    expect(lonInput.value).toBe('74.2973');
    
    fireEvent.click(screen.getByText('Clear'));
    
    expect(latInput.value).toBe('');
    expect(lonInput.value).toBe('');
  });

  /**
   * Perubahan arah (N/S/E/W) harus tersimpan dengan benar
   */
  it('should handle direction changes correctly', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    const selects = screen.getAllByRole('combobox');
    const latSelect = selects[0];
    const lonSelect = selects[1];
    
    fireEvent.change(latSelect, { target: { value: 'S' } });
    fireEvent.change(lonSelect, { target: { value: 'W' } });
    
    expect(latSelect).toHaveValue('S');
    expect(lonSelect).toHaveValue('W');
  });

  /**
   * Form tidak boleh disubmit jika input wajib kosong
   */
  it('should validate required fields', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    fireEvent.click(screen.getByText('Add Marker'));
    
    expect(mockOnAddMarker).not.toHaveBeenCalled();
  });
});

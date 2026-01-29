import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CoordinateModal from '../components/CoordinateModal';

describe('CoordinateModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAddMarker = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <CoordinateModal
        isOpen={false}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    expect(screen.queryByText('Add Coordinate Marker')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    expect(screen.getByText('Add Coordinate Marker')).toBeInTheDocument();
  });

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
    
    // Initially DD should be active
    expect(ddButton).toHaveClass('active');
    
    // Switch to DMS
    fireEvent.click(dmsButton);
    expect(dmsButton).toHaveClass('active');
    
    // Switch back to DD
    fireEvent.click(ddButton);
    expect(ddButton).toHaveClass('active');
  });

  it('should display DD format inputs correctly', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    expect(screen.getByText('Latitude (Decimal Degrees)')).toBeInTheDocument();
    expect(screen.getByText('Longitude (Decimal Degrees)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('48.8575')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('2.3514')).toBeInTheDocument();
  });

  it('should display DMS format inputs correctly', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    // Switch to DMS
    const dmsButton = screen.getByText('DMS Format');
    fireEvent.click(dmsButton);
    
    expect(screen.getAllByText('Degrees').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Minutes').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Seconds').length).toBeGreaterThan(0);
  });

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
    
    const submitButton = screen.getByText('Add Marker');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAddMarker).toHaveBeenCalledWith(4.5709, -74.2973);
    });
  });

  it('should convert DD to DMS correctly', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    const latInput = screen.getByPlaceholderText('48.8575');
    const lonInput = screen.getByPlaceholderText('2.3514');
    
    fireEvent.change(latInput, { target: { value: '48.8575' } });
    fireEvent.change(lonInput, { target: { value: '2.3514' } });
    
    const convertButton = screen.getByText(/Convert to DMS/i);
    fireEvent.click(convertButton);
    
    // Check if DMS format is now active
    const dmsButton = screen.getByText('DMS Format');
    expect(dmsButton).toHaveClass('active');
  });

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
    
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    
    expect(latInput.value).toBe('');
    expect(lonInput.value).toBe('');
  });

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

  it('should validate required fields', () => {
    render(
      <CoordinateModal
        isOpen={true}
        onClose={mockOnClose}
        onAddMarker={mockOnAddMarker}
      />
    );
    
    const submitButton = screen.getByText('Add Marker');
    fireEvent.click(submitButton);
    
    // Should not call onAddMarker if fields are empty
    expect(mockOnAddMarker).not.toHaveBeenCalled();
  });
});

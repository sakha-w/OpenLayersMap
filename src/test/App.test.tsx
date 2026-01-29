import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

// Mock the OpenLayerMap component since it requires OpenLayers
jest.mock('../components/OpenLayerMap', () => {
  return function MockOpenLayerMap() {
    return <div data-testid="mock-map">Map Component</div>;
  };
});

// Mock the CoordinateModal component
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

describe('App', () => {
  it('should render the app with map and button', () => {
    render(<App />);
    
    expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    expect(screen.getByText('Add Coordinate')).toBeInTheDocument();
  });

  it('should open modal when button is clicked', () => {
    render(<App />);
    
    const addButton = screen.getByText('Add Coordinate');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  it('should close modal when close is triggered', () => {
    render(<App />);
    
    // Open modal
    const addButton = screen.getByText('Add Coordinate');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  it('should display the add coordinate button with icon', () => {
    render(<App />);
    
    const button = screen.getByText('Add Coordinate').closest('button');
    expect(button).toBeInTheDocument();
    expect(button?.querySelector('svg')).toBeInTheDocument();
  });
});

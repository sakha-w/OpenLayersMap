import { useState } from 'react';
import './CoordinateModal.css';


interface CoordinateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMarker: (lat: number, lon: number) => void;
}

interface DMSCoordinate {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: 'N' | 'S' | 'E' | 'W';
}

const CoordinateModal = ({ isOpen, onClose, onAddMarker }: CoordinateModalProps) => {
  const [coordinateType, setCoordinateType] = useState<'DD' | 'DMS'>('DD');
  
  // DD inputs
  const [latDD, setLatDD] = useState('');
  const [lonDD, setLonDD] = useState('');
  
  // DMS inputs for Latitude
  const [latDegrees, setLatDegrees] = useState('');
  const [latMinutes, setLatMinutes] = useState('');
  const [latSeconds, setLatSeconds] = useState('');
  const [latDirection, setLatDirection] = useState<'N' | 'S'>('N');
  
  // DMS inputs for Longitude
  const [lonDegrees, setLonDegrees] = useState('');
  const [lonMinutes, setLonMinutes] = useState('');
  const [lonSeconds, setLonSeconds] = useState('');
  const [lonDirection, setLonDirection] = useState<'E' | 'W'>('E');

  // Convert DMS to DD
  const dmsToDD = (degrees: number, minutes: number, seconds: number, direction: 'N' | 'S' | 'E' | 'W'): number => {
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
      dd = dd * -1;
    }
    return dd;
  };

  // Convert DD to DMS
  const ddToDMS = (dd: number, isLatitude: boolean): DMSCoordinate => {
    const absolute = Math.abs(dd);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;
    
    let direction: 'N' | 'S' | 'E' | 'W';
    if (isLatitude) {
      direction = dd >= 0 ? 'N' : 'S';
    } else {
      direction = dd >= 0 ? 'E' : 'W';
    }
    
    return { degrees, minutes, seconds, direction };
  };

  // Convert from DMS to DD
  const handleConvertDMSToDD = () => {
    const latDeg = parseFloat(latDegrees) || 0;
    const latMin = parseFloat(latMinutes) || 0;
    const latSec = parseFloat(latSeconds) || 0;
    const lonDeg = parseFloat(lonDegrees) || 0;
    const lonMin = parseFloat(lonMinutes) || 0;
    const lonSec = parseFloat(lonSeconds) || 0;

    const lat = dmsToDD(latDeg, latMin, latSec, latDirection);
    const lon = dmsToDD(lonDeg, lonMin, lonSec, lonDirection);

    // Store as positive values in DD, direction handles the sign
    setLatDD(Math.abs(lat).toFixed(6));
    setLonDD(Math.abs(lon).toFixed(6));
    setCoordinateType('DD');
  };

  // Convert from DD to DMS
  const handleConvertDDToDMS = () => {
    let lat = parseFloat(latDD);
    let lon = parseFloat(lonDD);

    if (!isNaN(lat) && !isNaN(lon)) {
      // Apply direction to DD values before conversion
      if (latDirection === 'S' && lat > 0) {
        lat = lat * -1;
      } else if (latDirection === 'N' && lat < 0) {
        lat = Math.abs(lat);
      }
      
      if (lonDirection === 'W' && lon > 0) {
        lon = lon * -1;
      } else if (lonDirection === 'E' && lon < 0) {
        lon = Math.abs(lon);
      }

      const latDMS = ddToDMS(lat, true);
      const lonDMS = ddToDMS(lon, false);

      setLatDegrees(latDMS.degrees.toString());
      setLatMinutes(latDMS.minutes.toString());
      setLatSeconds(latDMS.seconds.toFixed(2));
      setLatDirection(latDMS.direction as 'N' | 'S');

      setLonDegrees(lonDMS.degrees.toString());
      setLonMinutes(lonDMS.minutes.toString());
      setLonSeconds(lonDMS.seconds.toFixed(2));
      setLonDirection(lonDMS.direction as 'E' | 'W');

      setCoordinateType('DMS');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let lat: number, lon: number;

    if (coordinateType === 'DD') {
      lat = parseFloat(latDD);
      lon = parseFloat(lonDD);
      
      // Apply direction to DD values
      if (latDirection === 'S' && lat > 0) {
        lat = lat * -1;
      } else if (latDirection === 'N' && lat < 0) {
        lat = Math.abs(lat);
      }
      
      if (lonDirection === 'W' && lon > 0) {
        lon = lon * -1;
      } else if (lonDirection === 'E' && lon < 0) {
        lon = Math.abs(lon);
      }
    } else {
      const latDeg = parseFloat(latDegrees) || 0;
      const latMin = parseFloat(latMinutes) || 0;
      const latSec = parseFloat(latSeconds) || 0;
      const lonDeg = parseFloat(lonDegrees) || 0;
      const lonMin = parseFloat(lonMinutes) || 0;
      const lonSec = parseFloat(lonSeconds) || 0;

      lat = dmsToDD(latDeg, latMin, latSec, latDirection);
      lon = dmsToDD(lonDeg, lonMin, lonSec, lonDirection);
    }

    if (!isNaN(lat) && !isNaN(lon)) {
      onAddMarker(lat, lon);
      handleClear();
      onClose();
    } else {
      alert('Please enter valid coordinates');
    }
  };

  const handleClear = () => {
    setLatDD('');
    setLonDD('');
    setLatDegrees('');
    setLatMinutes('');
    setLatSeconds('');
    setLonDegrees('');
    setLonMinutes('');
    setLonSeconds('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Coordinate Marker</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="coordinate-type-selector">
          <button
            type="button"
            className={coordinateType === 'DMS' ? 'active' : ''}
            onClick={() => setCoordinateType('DMS')}
          >
            DMS Format
          </button>
          <button
            type="button"
            className={coordinateType === 'DD' ? 'active' : ''}
            onClick={() => setCoordinateType('DD')}
          >
            DD Format
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {coordinateType === 'DD' ? (
            <div className="dd-inputs">
              <div className="coordinate-section">
                <label className="section-label">Latitude (Decimal Degrees)</label>
                <div className="dd-input-row">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={latDD}
                    onChange={(e) => setLatDD(e.target.value)}
                    placeholder="48.8575"
                    required
                  />
                  <select value={latDirection} onChange={(e) => setLatDirection(e.target.value as 'N' | 'S')}>
                    <option value="N">N</option>
                    <option value="S">S</option>
                  </select>
                </div>
              </div>
              
              <div className="coordinate-section">
                <label className="section-label">Longitude (Decimal Degrees)</label>
                <div className="dd-input-row">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={lonDD}
                    onChange={(e) => setLonDD(e.target.value)}
                    placeholder="2.3514"
                    required
                  />
                  <select value={lonDirection} onChange={(e) => setLonDirection(e.target.value as 'E' | 'W')}>
                    <option value="E">E</option>
                    <option value="W">W</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="dms-inputs">
              <div className="coordinate-section">
                <div className="section-header">
                  <label className="section-label">Latitude</label>
                  <span className="direction-badge">{latDirection}</span>
                </div>
                <div className="dms-grid">
                  <div className="dms-input-group">
                    <label>Degrees</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={latDegrees}
                      onChange={(e) => setLatDegrees(e.target.value)}
                      placeholder="48"
                      required
                    />
                  </div>
                  <div className="dms-input-group">
                    <label>Minutes</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={latMinutes}
                      onChange={(e) => setLatMinutes(e.target.value)}
                      placeholder="51"
                      required
                    />
                  </div>
                  <div className="dms-input-group">
                    <label>Seconds</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={latSeconds}
                      onChange={(e) => setLatSeconds(e.target.value)}
                      placeholder="27"
                      required
                    />
                  </div>
                  <div className="dms-input-group">
                    <label>Dir</label>
                    <select value={latDirection} onChange={(e) => setLatDirection(e.target.value as 'N' | 'S')}>
                      <option value="N">N</option>
                      <option value="S">S</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="coordinate-section">
                <div className="section-header">
                  <label className="section-label">Longitude</label>
                  <span className="direction-badge">{lonDirection}</span>
                </div>
                <div className="dms-grid">
                  <div className="dms-input-group">
                    <label>Degrees</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={lonDegrees}
                      onChange={(e) => setLonDegrees(e.target.value)}
                      placeholder="2"
                      required
                    />
                  </div>
                  <div className="dms-input-group">
                    <label>Minutes</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={lonMinutes}
                      onChange={(e) => setLonMinutes(e.target.value)}
                      placeholder="21"
                      required
                    />
                  </div>
                  <div className="dms-input-group">
                    <label>Seconds</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={lonSeconds}
                      onChange={(e) => setLonSeconds(e.target.value)}
                      placeholder="5"
                      required
                    />
                  </div>
                  <div className="dms-input-group">
                    <label>Dir</label>
                    <select value={lonDirection} onChange={(e) => setLonDirection(e.target.value as 'E' | 'W')}>
                      <option value="E">E</option>
                      <option value="W">W</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button type="button" className="convert-btn-action" onClick={coordinateType === 'DD' ? handleConvertDDToDMS : handleConvertDMSToDD}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="convert-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Convert to {coordinateType === 'DD' ? 'DMS' : 'DD'}
          </button>

          <div className="modal-actions">
            <button type="button" className="clear-btn" onClick={handleClear}>
              Clear
            </button>
            <button type="submit" className="submit-btn">
              Add Marker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoordinateModal;

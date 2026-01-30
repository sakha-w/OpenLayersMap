/**
 * =====================================================
 * Test Suite: Coordinate Conversion Functions
 * =====================================================
 *
 * Test ini memverifikasi akurasi konversi koordinat:
 * - DMS (Degrees, Minutes, Seconds)
 * - DD (Decimal Degrees)
 *
 * Fokus utama:
 * 1. Ketepatan perhitungan matematis
 * 2. Penanganan arah koordinat (N, S, E, W)
 * 3. Konsistensi konversi bolak-balik (round-trip)
 * 4. Validasi menggunakan koordinat dunia nyata
 */

describe('Coordinate Conversion Functions', () => {

  /**
   * Mengonversi koordinat dari DMS ke Decimal Degrees (DD)
   *
   * @param degrees Derajat
   * @param minutes Menit
   * @param seconds Detik
   * @param direction Arah koordinat (N, S, E, W)
   * @returns Nilai koordinat dalam Decimal Degrees
   */
  const dmsToDD = (
    degrees: number,
    minutes: number,
    seconds: number,
    direction: 'N' | 'S' | 'E' | 'W'
  ): number => {
    let dd = degrees + minutes / 60 + seconds / 3600;

    // Arah Selatan dan Barat direpresentasikan dengan nilai negatif
    if (direction === 'S' || direction === 'W') {
      dd = dd * -1;
    }

    return dd;
  };

  /**
   * Mengonversi koordinat dari Decimal Degrees (DD) ke DMS
   *
   * @param dd Nilai koordinat dalam Decimal Degrees
   * @param isLatitude Menentukan apakah koordinat latitude atau longitude
   * @returns Objek DMS (degrees, minutes, seconds, direction)
   */
  const ddToDMS = (dd: number, isLatitude: boolean) => {
    const absolute = Math.abs(dd);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;

    let direction: 'N' | 'S' | 'E' | 'W';

    // Penentuan arah berdasarkan jenis koordinat
    if (isLatitude) {
      direction = dd >= 0 ? 'N' : 'S';
    } else {
      direction = dd >= 0 ? 'E' : 'W';
    }

    return { degrees, minutes, seconds, direction };
  };

  /**
   * =====================================================
   * Test: dmsToDD
   * =====================================================
   */
  describe('dmsToDD', () => {

    /** Konversi latitude utara */
    it('should convert DMS to DD for North latitude', () => {
      const result = dmsToDD(48, 51, 27, 'N');
      expect(result).toBeCloseTo(48.8575, 4);
    });

    /** Konversi latitude selatan (negatif) */
    it('should convert DMS to DD for South latitude', () => {
      const result = dmsToDD(33, 52, 10, 'S');
      expect(result).toBeCloseTo(-33.8694, 4);
    });

    /** Konversi longitude timur */
    it('should convert DMS to DD for East longitude', () => {
      const result = dmsToDD(2, 21, 5, 'E');
      expect(result).toBeCloseTo(2.3514, 4);
    });

    /** Konversi longitude barat (negatif) */
    it('should convert DMS to DD for West longitude', () => {
      const result = dmsToDD(74, 17, 50, 'W');
      expect(result).toBeCloseTo(-74.2972, 3);
    });

    /** Kasus nilai nol */
    it('should handle zero values', () => {
      const result = dmsToDD(0, 0, 0, 'N');
      expect(result).toBe(0);
    });

    /** Kasus hanya menit dan detik */
    it('should handle minutes and seconds only', () => {
      const result = dmsToDD(0, 30, 30, 'N');
      expect(result).toBeCloseTo(0.5083, 4);
    });
  });

  /**
   * =====================================================
   * Test: ddToDMS
   * =====================================================
   */
  describe('ddToDMS', () => {

    /** Latitude positif */
    it('should convert DD to DMS for positive latitude', () => {
      const result = ddToDMS(48.8575, true);
      expect(result.degrees).toBe(48);
      expect(result.minutes).toBe(51);
      expect(result.seconds).toBeCloseTo(27, 0);
      expect(result.direction).toBe('N');
    });

    /** Latitude negatif */
    it('should convert DD to DMS for negative latitude', () => {
      const result = ddToDMS(-33.8694, true);
      expect(result.degrees).toBe(33);
      expect(result.minutes).toBe(52);
      expect(result.seconds).toBeCloseTo(10, 0);
      expect(result.direction).toBe('S');
    });

    /** Longitude positif */
    it('should convert DD to DMS for positive longitude', () => {
      const result = ddToDMS(2.3514, false);
      expect(result.degrees).toBe(2);
      expect(result.minutes).toBe(21);
      expect(result.seconds).toBeCloseTo(5, 0);
      expect(result.direction).toBe('E');
    });

    /** Longitude negatif */
    it('should convert DD to DMS for negative longitude', () => {
      const result = ddToDMS(-74.2973, false);
      expect(result.degrees).toBe(74);
      expect(result.minutes).toBe(17);
      expect(result.seconds).toBeCloseTo(50, 0);
      expect(result.direction).toBe('W');
    });

    /** Nilai nol default ke arah Utara */
    it('should handle zero value', () => {
      const result = ddToDMS(0, true);
      expect(result.degrees).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.direction).toBe('N');
    });
  });

  /**
   * =====================================================
   * Test: Round-trip Conversion
   * =====================================================
   *
   * Memastikan konversi bolak-balik tidak
   * menghasilkan deviasi signifikan
   */
  describe('Round-trip conversion', () => {

    it('should convert DMS to DD and back to DMS accurately', () => {
      const originalDMS = {
        degrees: 48,
        minutes: 51,
        seconds: 27,
        direction: 'N' as const,
      };
      
      const dd = dmsToDD(
        originalDMS.degrees,
        originalDMS.minutes,
        originalDMS.seconds,
        originalDMS.direction
      );

      const convertedDMS = ddToDMS(dd, true);
      
      expect(convertedDMS.degrees).toBe(originalDMS.degrees);
      expect(convertedDMS.minutes).toBe(originalDMS.minutes);
      expect(convertedDMS.seconds).toBeCloseTo(originalDMS.seconds, 1);
      expect(convertedDMS.direction).toBe(originalDMS.direction);
    });

    it('should convert DD to DMS and back to DD accurately', () => {
      const originalDD = 48.8575;
      
      const dms = ddToDMS(originalDD, true);
      const convertedDD = dmsToDD(
        dms.degrees,
        dms.minutes,
        dms.seconds,
        dms.direction
      );
      
      expect(convertedDD).toBeCloseTo(originalDD, 4);
    });
  });

  /**
   * =====================================================
   * Test: Real-world Coordinates
   * =====================================================
   *
   * Menggunakan koordinat dunia nyata
   * untuk memastikan fungsi akurat secara praktis
   */
  describe('Real-world coordinates', () => {

    it('should handle Paris coordinates correctly', () => {
      // Paris: 48.8566° N, 2.3522° E
      const lat = dmsToDD(48, 51, 24, 'N');
      const lon = dmsToDD(2, 21, 8, 'E');
      
      expect(lat).toBeCloseTo(48.8567, 4);
      expect(lon).toBeCloseTo(2.3522, 4);
    });

    it('should handle Bogotá (Colombia) coordinates correctly', () => {
      // Bogotá: 4.7110° N, 74.0721° W
      const lat = dmsToDD(4, 42, 40, 'N');
      const lon = dmsToDD(74, 4, 32, 'W');
      
      expect(lat).toBeCloseTo(4.7111, 4);
      expect(lon).toBeCloseTo(-74.0756, 4);
    });

    it('should handle Jakarta coordinates correctly', () => {
      // Jakarta: 6.2088° S, 106.8456° E
      const lat = dmsToDD(6, 12, 32, 'S');
      const lon = dmsToDD(106, 50, 44, 'E');
      
      expect(lat).toBeCloseTo(-6.2089, 4);
      expect(lon).toBeCloseTo(106.8456, 4);
    });
  });
});

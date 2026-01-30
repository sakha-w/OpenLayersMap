import '@testing-library/jest-dom';

/**
 * Menambahkan matcher tambahan dari Testing Library
 * seperti:
 * - toBeInTheDocument()
 * - toHaveTextContent()
 * - toBeVisible()
 *
 * File ini akan dijalankan otomatis sebelum setiap test
 */

// ======================================================
// Mock window.matchMedia
// ======================================================

/**
 * JSDOM tidak menyediakan implementasi matchMedia secara default.
 * Banyak library UI (termasuk CSS media query & responsive logic)
 * bergantung pada fungsi ini.
 *
 * Mock ini memastikan test tidak gagal ketika komponen
 * menggunakan window.matchMedia.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,          // Default: media query tidak match
    media: query,            // Query yang diuji
    onchange: null,

    // Deprecated API (masih dipakai beberapa library lama)
    addListener: jest.fn(),
    removeListener: jest.fn(),

    // API modern untuk event listener
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ======================================================
// Mock HTMLCanvasElement.getContext
// ======================================================

/**
 * OpenLayers menggunakan Canvas API secara intensif.
 * Namun JSDOM TIDAK mengimplementasikan canvas context.
 *
 * Tanpa mock ini, test akan gagal dengan error:
 * "HTMLCanvasElement.prototype.getContext is not implemented"
 *
 * Mock di bawah ini hanya menyediakan fungsi dummy
 * yang dibutuhkan OpenLayers agar test bisa berjalan.
 */
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
})) as any;

export interface Column {
  id: string;
  name: 'quantity' | 'unitPrice' | 'totalPrice';
  x: number; // Position X sur le PDF
  label: string;
}

export interface DetectedItem {
  id: string;
  quantity: number;
  quantityBBox: BoundingBox;
  unitPrice: number;
  totalPrice: number;
  y: number; // Position Y sur le PDF
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OCRResult {
  text: string;
  bbox: BoundingBox;
  confidence: number;
}

export interface SubTotal {
  id: string;
  startIndex: number;
  endIndex: number;
  value: number;
}

export interface PDFDocument {
  file: File;
  url: string;
  numPages: number;
}

export type AppStep = 'upload' | 'define-columns' | 'detect' | 'fill' | 'export';

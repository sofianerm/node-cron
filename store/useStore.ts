import { create } from 'zustand';
import { Column, DetectedItem, PDFDocument, AppStep, SubTotal } from '@/types';

interface AppState {
  // PDF
  pdfDocument: PDFDocument | null;
  setPdfDocument: (doc: PDFDocument | null) => void;

  // Steps
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;

  // Columns
  columns: Column[];
  addColumn: (column: Column) => void;
  removeColumn: (id: string) => void;
  clearColumns: () => void;

  // Detected Items
  detectedItems: DetectedItem[];
  setDetectedItems: (items: DetectedItem[]) => void;
  updateItemUnitPrice: (id: string, unitPrice: number) => void;
  updateItemTotalPrice: (id: string, totalPrice: number) => void;

  // Subtotals
  subtotals: SubTotal[];
  setSubtotals: (subtotals: SubTotal[]) => void;

  // Calculations
  grandTotal: number;
  updateGrandTotal: () => void;

  // UI State
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // PDF
  pdfDocument: null,
  setPdfDocument: (doc) => set({ pdfDocument: doc }),

  // Steps
  currentStep: 'upload',
  setCurrentStep: (step) => set({ currentStep: step }),

  // Columns
  columns: [],
  addColumn: (column) => set((state) => ({ columns: [...state.columns, column] })),
  removeColumn: (id) => set((state) => ({ columns: state.columns.filter((c) => c.id !== id) })),
  clearColumns: () => set({ columns: [] }),

  // Detected Items
  detectedItems: [],
  setDetectedItems: (items) => set({ detectedItems: items }),
  updateItemUnitPrice: (id, unitPrice) => {
    const state = get();
    const items = state.detectedItems.map((item) => {
      if (item.id === id) {
        const totalPrice = item.quantity * unitPrice;
        return { ...item, unitPrice, totalPrice };
      }
      return item;
    });
    set({ detectedItems: items });
    get().updateGrandTotal();
  },
  updateItemTotalPrice: (id, totalPrice) => {
    const state = get();
    const items = state.detectedItems.map((item) => {
      if (item.id === id) {
        const unitPrice = item.quantity > 0 ? totalPrice / item.quantity : 0;
        return { ...item, unitPrice, totalPrice };
      }
      return item;
    });
    set({ detectedItems: items });
    get().updateGrandTotal();
  },

  // Subtotals
  subtotals: [],
  setSubtotals: (subtotals) => set({ subtotals }),

  // Calculations
  grandTotal: 0,
  updateGrandTotal: () => {
    const { detectedItems } = get();
    const total = detectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    set({ grandTotal: total });
  },

  // UI State
  isProcessing: false,
  setIsProcessing: (processing) => set({ isProcessing: processing }),

  error: null,
  setError: (error) => set({ error }),

  // Reset
  reset: () => set({
    pdfDocument: null,
    currentStep: 'upload',
    columns: [],
    detectedItems: [],
    subtotals: [],
    grandTotal: 0,
    isProcessing: false,
    error: null,
  }),
}));

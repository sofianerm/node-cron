import { DetectedItem, SubTotal } from '@/types';

export function calculateItemTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

export function calculateGrandTotal(items: DetectedItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

export function detectSubtotals(items: DetectedItem[]): SubTotal[] {
  // Logic pour détecter les sous-totaux
  // Pour l'instant, retourne un tableau vide
  // TODO: Implémenter la détection intelligente des sous-totaux
  return [];
}

export function validateItem(item: DetectedItem): boolean {
  return (
    item.quantity > 0 &&
    item.unitPrice >= 0 &&
    item.totalPrice >= 0 &&
    Math.abs(item.totalPrice - item.quantity * item.unitPrice) < 0.01 // Tolérance pour les arrondis
  );
}

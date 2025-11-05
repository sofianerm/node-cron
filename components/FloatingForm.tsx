'use client';

import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/lib/utils';
import { X } from 'lucide-react';

export default function FloatingForm() {
  const detectedItems = useStore((state) => state.detectedItems);
  const updateItemUnitPrice = useStore((state) => state.updateItemUnitPrice);
  const grandTotal = useStore((state) => state.grandTotal);
  const currentStep = useStore((state) => state.currentStep);

  if (currentStep !== 'fill' || detectedItems.length === 0) return null;

  const handleUnitPriceChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateItemUnitPrice(id, numValue);
  };

  return (
    <div className="fixed right-8 top-8 bottom-8 w-[400px] glass rounded-2xl p-6 overflow-y-auto animate-slide-in">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-black/80">Prix unitaires</h2>
        <p className="text-sm text-black/40 mt-1">
          {detectedItems.length} élément{detectedItems.length > 1 ? 's' : ''} détecté
          {detectedItems.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-3">
        {detectedItems.map((item, index) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-black/5 rounded-lg flex items-center justify-center text-sm font-medium text-black/60">
              {index + 1}
            </div>
            <div className="flex-shrink-0 text-sm font-medium text-black/40">
              ×{item.quantity}
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={item.unitPrice || ''}
              onChange={(e) => handleUnitPriceChange(item.id, e.target.value)}
              placeholder="0.00"
              className="flex-1 px-3 py-2 bg-white border border-black/10 rounded-lg text-sm font-medium text-black/80 placeholder:text-black/20 focus:outline-none focus:border-black/30"
            />
            <div className="flex-shrink-0 w-24 text-right text-sm font-medium text-black/60">
              {item.totalPrice > 0 ? formatCurrency(item.totalPrice) : '—'}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-black/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-black/60">Total</span>
          <span className="text-2xl font-bold text-black/90">
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

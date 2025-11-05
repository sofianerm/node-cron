'use client';

import { useStore } from '@/store/useStore';
import { X } from 'lucide-react';

export default function FloatingControls() {
  const currentStep = useStore((state) => state.currentStep);
  const columns = useStore((state) => state.columns);
  const removeColumn = useStore((state) => state.removeColumn);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const detectedItems = useStore((state) => state.detectedItems);
  const setDetectedItems = useStore((state) => state.setDetectedItems);
  const setError = useStore((state) => state.setError);
  const pdfDocument = useStore((state) => state.pdfDocument);

  if (!pdfDocument) return null;

  const handleDetect = async () => {
    try {
      const formData = new FormData();
      formData.append('file', pdfDocument.file);
      formData.append('columns', JSON.stringify(columns));

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur OCR');
      }

      const data = await response.json();
      const items = data.quantities.map((qty: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        quantity: qty.value,
        quantityBBox: qty.bbox,
        unitPrice: 0,
        totalPrice: 0,
        y: qty.bbox.y,
      }));

      items.sort((a: any, b: any) => a.y - b.y);
      setDetectedItems(items);
      setCurrentStep('fill');
    } catch (error) {
      setError('Erreur lors de la détection');
    }
  };

  if (currentStep === 'define-columns') {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass rounded-2xl px-6 py-4 animate-fade-in">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {columns.map((col, idx) => (
              <div key={col.id} className="flex items-center gap-2 text-sm">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: ['#3b82f6', '#8b5cf6', '#ec4899'][idx],
                  }}
                />
                <span className="font-medium text-black/60">{col.label}</span>
                <button
                  onClick={() => removeColumn(col.id)}
                  className="p-0.5 hover:bg-black/5 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {columns.length < 3 && (
              <span className="text-sm text-black/30">
                {3 - columns.length} restante{3 - columns.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {columns.length === 3 && (
            <button
              onClick={handleDetect}
              className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80"
            >
              Détecter →
            </button>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 'detect') {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass rounded-2xl px-6 py-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <span className="text-sm font-medium text-black/60">
            Détection en cours...
          </span>
        </div>
      </div>
    );
  }

  return null;
}

'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { ScanSearch, Loader2 } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { DetectedItem } from '@/types';

export default function OCRProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const pdfDocument = useStore((state) => state.pdfDocument);
  const columns = useStore((state) => state.columns);
  const setDetectedItems = useStore((state) => state.setDetectedItems);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const setError = useStore((state) => state.setError);

  const handleDetect = async () => {
    if (!pdfDocument) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Préparer les données pour l'API
      const formData = new FormData();
      formData.append('file', pdfDocument.file);
      formData.append('columns', JSON.stringify(columns));

      // Appeler l'API OCR
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la détection OCR');
      }

      const data = await response.json();

      // Créer les items détectés
      const items: DetectedItem[] = data.quantities.map((qty: any) => ({
        id: generateId(),
        quantity: qty.value,
        quantityBBox: qty.bbox,
        unitPrice: 0,
        totalPrice: 0,
        y: qty.bbox.y,
      }));

      // Trier par position Y (de haut en bas)
      items.sort((a, b) => a.y - b.y);

      setDetectedItems(items);
      setCurrentStep('fill');
    } catch (error) {
      console.error('OCR Error:', error);
      setError('Erreur lors de la détection. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Détecter les quantités</h2>
      <p className="text-gray-600 mb-6">
        Lancez la détection OCR pour extraire automatiquement les quantités du PDF.
      </p>

      <button
        onClick={handleDetect}
        disabled={isProcessing}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-semibold"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Détection en cours...
          </>
        ) : (
          <>
            <ScanSearch className="w-6 h-6" />
            Détecter les quantités
          </>
        )}
      </button>

      {isProcessing && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3 text-blue-700">
            <Loader2 className="w-5 h-5 animate-spin" />
            <div>
              <p className="font-medium">Analyse en cours...</p>
              <p className="text-sm text-blue-600">
                Extraction du texte et détection des quantités
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

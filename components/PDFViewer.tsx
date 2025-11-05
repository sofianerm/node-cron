'use client';

import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useStore } from '@/store/useStore';
import { Column } from '@/types';
import { generateId } from '@/lib/utils';

// Configuration du worker PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export default function PDFViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<any>(null);
  const [scale, setScale] = useState(1.5);

  const pdfDocument = useStore((state) => state.pdfDocument);
  const columns = useStore((state) => state.columns);
  const addColumn = useStore((state) => state.addColumn);
  const currentStep = useStore((state) => state.currentStep);

  // Charger et afficher le PDF
  useEffect(() => {
    if (!pdfDocument || !canvasRef.current) return;

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfDocument.url);
        const pdf = await loadingTask.promise;
        const firstPage = await pdf.getPage(1);
        setPage(firstPage);

        const viewport = firstPage.getViewport({ scale });
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await firstPage.render(renderContext).promise;
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [pdfDocument, scale]);

  // Gérer les clics pour définir les colonnes
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentStep !== 'define-columns') return;
    if (columns.length >= 3) return; // Max 3 colonnes

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Déterminer le type de colonne basé sur l'ordre
    const columnTypes: Array<'quantity' | 'unitPrice' | 'totalPrice'> = [
      'quantity',
      'unitPrice',
      'totalPrice',
    ];
    const labels = ['Quantité', 'Prix unitaire', 'Prix total'];

    const columnType = columnTypes[columns.length];
    const label = labels[columns.length];

    const newColumn: Column = {
      id: generateId(),
      name: columnType,
      x,
      label,
    };

    addColumn(newColumn);
  };

  return (
    <div ref={containerRef} className="relative bg-gray-100 rounded-lg overflow-auto">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`${
          currentStep === 'define-columns' ? 'cursor-crosshair' : 'cursor-default'
        } max-w-full h-auto`}
      />

      {/* Overlay pour afficher les lignes de colonnes */}
      {columns.map((column) => (
        <div
          key={column.id}
          className="absolute top-0 bottom-0 w-0.5 bg-blue-500 pointer-events-none"
          style={{ left: `${column.x}px` }}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {column.label}
          </div>
        </div>
      ))}
    </div>
  );
}

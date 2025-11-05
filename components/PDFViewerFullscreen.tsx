'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { useStore } from '@/store/useStore';
import { Column } from '@/types';
import { generateId } from '@/lib/utils';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export default function PDFViewerFullscreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfPage, setPdfPage] = useState<any>(null);
  const [scale, setScale] = useState(1.5);
  const [viewport, setViewport] = useState<any>(null);

  const pdfDocument = useStore((state) => state.pdfDocument);
  const columns = useStore((state) => state.columns);
  const addColumn = useStore((state) => state.addColumn);
  const currentStep = useStore((state) => state.currentStep);

  // Charger le PDF
  useEffect(() => {
    if (!pdfDocument || !canvasRef.current) return;

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfDocument.url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        setPdfPage(page);

        const vp = page.getViewport({ scale });
        setViewport(vp);

        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        canvas.height = vp.height;
        canvas.width = vp.width;

        await page.render({
          canvasContext: context,
          viewport: vp,
        }).promise;
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [pdfDocument, scale]);

  // Gérer les clics pour définir les colonnes
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (currentStep !== 'define-columns') return;
      if (columns.length >= 3) return;

      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;

      const columnTypes: Array<'quantity' | 'unitPrice' | 'totalPrice'> = [
        'quantity',
        'unitPrice',
        'totalPrice',
      ];
      const labels = ['Quantité', 'Prix unitaire', 'Prix total'];

      const newColumn: Column = {
        id: generateId(),
        name: columnTypes[columns.length],
        x,
        label: labels[columns.length],
      };

      addColumn(newColumn);
    },
    [currentStep, columns.length, addColumn]
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-[#fafafa] overflow-hidden"
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`${
            currentStep === 'define-columns' ? 'cursor-crosshair' : 'cursor-default'
          } shadow-2xl`}
          style={{
            maxWidth: '100vw',
            maxHeight: '100vh',
            objectFit: 'contain',
          }}
        />

        {/* Column indicators - lignes verticales subtiles */}
        {viewport &&
          columns.map((column, index) => {
            const colors = ['#3b82f6', '#8b5cf6', '#ec4899'];
            return (
              <div
                key={column.id}
                className="absolute top-0 bottom-0 pointer-events-none animate-fade-in"
                style={{
                  left: `${column.x}px`,
                  width: '2px',
                  background: colors[index],
                  boxShadow: `0 0 8px ${colors[index]}40`,
                }}
              >
                {/* Label flottant */}
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full px-2 py-1 text-xs font-medium text-white rounded whitespace-nowrap"
                  style={{
                    background: colors[index],
                  }}
                >
                  {column.label}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

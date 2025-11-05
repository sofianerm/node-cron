'use client';

import { useStore } from '@/store/useStore';
import UploadOverlay from '@/components/UploadOverlay';
import PDFViewerFullscreen from '@/components/PDFViewerFullscreen';
import TopBar from '@/components/TopBar';
import FloatingControls from '@/components/FloatingControls';
import FloatingForm from '@/components/FloatingForm';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const pdfDocument = useStore((state) => state.pdfDocument);
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);

  return (
    <main className="relative h-screen overflow-hidden">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 glass rounded-2xl px-6 py-4 flex items-center gap-3 animate-fade-in z-50">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm font-medium text-black/80">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-black/40 hover:text-black/80"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload or PDF Viewer */}
      {!pdfDocument ? <UploadOverlay /> : <PDFViewerFullscreen />}

      {/* Overlays */}
      {pdfDocument && (
        <>
          <TopBar />
          <FloatingControls />
          <FloatingForm />
        </>
      )}
    </main>
  );
}

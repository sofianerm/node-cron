'use client';

import { useStore } from '@/store/useStore';

export default function TopBar() {
  const pdfDocument = useStore((state) => state.pdfDocument);
  const reset = useStore((state) => state.reset);
  const currentStep = useStore((state) => state.currentStep);

  if (!pdfDocument) return null;

  const getStepText = () => {
    switch (currentStep) {
      case 'define-columns':
        return 'Cliquez sur le PDF pour définir les colonnes';
      case 'detect':
        return 'Détection en cours...';
      case 'fill':
        return 'Remplissez les prix';
      default:
        return '';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-8 glass border-b border-black/5 animate-fade-in z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-black/80">
          {pdfDocument.file.name}
        </h1>
        <span className="text-sm text-black/40">{getStepText()}</span>
      </div>

      <button
        onClick={reset}
        className="text-sm font-medium text-black/40 hover:text-black/80 transition-colors"
      >
        Nouveau PDF
      </button>
    </div>
  );
}

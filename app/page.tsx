'use client';

import { useStore } from '@/store/useStore';
import UploadZone from '@/components/UploadZone';
import PDFViewer from '@/components/PDFViewer';
import ColumnSelector from '@/components/ColumnSelector';
import OCRProcessor from '@/components/OCRProcessor';
import QuantityForm from '@/components/QuantityForm';
import StepIndicator from '@/components/StepIndicator';
import { AlertCircle, FileText } from 'lucide-react';

export default function Home() {
  const currentStep = useStore((state) => state.currentStep);
  const pdfDocument = useStore((state) => state.pdfDocument);
  const error = useStore((state) => state.error);
  const reset = useStore((state) => state.reset);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PDF Quote Filler</h1>
                <p className="text-sm text-gray-500">
                  Remplissage intelligent de soumissions
                </p>
              </div>
            </div>
            {pdfDocument && (
              <button
                onClick={reset}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Nouveau PDF
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Erreur</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        {pdfDocument && <StepIndicator />}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - PDF Viewer */}
          <div className="lg:col-span-2">
            {!pdfDocument ? (
              <UploadZone />
            ) : (
              <PDFViewer />
            )}
          </div>

          {/* Right Column - Controls */}
          <div className="lg:col-span-1">
            {currentStep === 'define-columns' && <ColumnSelector />}
            {currentStep === 'detect' && <OCRProcessor />}
            {currentStep === 'fill' && <QuantityForm />}
          </div>
        </div>

        {/* Full Width Form (when in fill step) */}
        {currentStep === 'fill' && (
          <div className="mt-6">
            <QuantityForm />
          </div>
        )}
      </div>
    </main>
  );
}

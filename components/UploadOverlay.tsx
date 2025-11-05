'use client';

import { useCallback } from 'react';
import { useStore } from '@/store/useStore';

export default function UploadOverlay() {
  const setPdfDocument = useStore((state) => state.setPdfDocument);
  const setCurrentStep = useStore((state) => state.setCurrentStep);
  const setError = useStore((state) => state.setError);

  const handleFileChange = useCallback(
    async (file: File) => {
      if (!file.type.includes('pdf')) {
        setError('Veuillez sélectionner un fichier PDF');
        return;
      }

      try {
        const url = URL.createObjectURL(file);
        setPdfDocument({
          file,
          url,
          numPages: 1,
        });
        setCurrentStep('define-columns');
        setError(null);
      } catch (error) {
        console.error('Error uploading PDF:', error);
        setError('Erreur lors du chargement du PDF');
      }
    },
    [setPdfDocument, setCurrentStep, setError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#fafafa]">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative group"
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file);
          }}
          className="hidden"
          id="pdf-upload"
        />
        <label
          htmlFor="pdf-upload"
          className="flex flex-col items-center justify-center w-[600px] h-[400px] cursor-pointer border-2 border-dashed border-black/10 rounded-2xl hover:border-black/30 transition-colors"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-black/10 transition-colors">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 8L12 3L7 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-black/80 mb-2">
              Glissez votre PDF ici
            </p>
            <p className="text-sm text-black/40">ou cliquez pour sélectionner</p>
          </div>
        </label>
      </div>
    </div>
  );
}

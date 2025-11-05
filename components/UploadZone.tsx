'use client';

import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function UploadZone() {
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

        // On va charger le PDF pour obtenir le nombre de pages
        // Pour l'instant, on assume 1 page
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
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-white"
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
      <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
        <Upload className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Téléversez votre soumission PDF
        </h3>
        <p className="text-gray-500">
          Glissez-déposez ou cliquez pour sélectionner un fichier
        </p>
      </label>
    </div>
  );
}

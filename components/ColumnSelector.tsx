'use client';

import { X, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function ColumnSelector() {
  const columns = useStore((state) => state.columns);
  const removeColumn = useStore((state) => state.removeColumn);
  const clearColumns = useStore((state) => state.clearColumns);
  const setCurrentStep = useStore((state) => state.setCurrentStep);

  const handleContinue = () => {
    if (columns.length === 3) {
      setCurrentStep('detect');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Définir les colonnes</h2>
      <p className="text-gray-600 mb-6">
        Cliquez sur le PDF pour définir les 3 colonnes (Quantité, Prix unitaire, Prix total)
      </p>

      <div className="space-y-3 mb-6">
        {columns.map((column, index) => (
          <div
            key={column.id}
            className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <span className="font-medium text-gray-800">{column.label}</span>
            </div>
            <button
              onClick={() => removeColumn(column.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        {[...Array(3 - columns.length)].map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg opacity-50"
          >
            <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-semibold">
              {columns.length + index + 1}
            </div>
            <span className="font-medium text-gray-500">
              {['Quantité', 'Prix unitaire', 'Prix total'][columns.length + index]}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={clearColumns}
          disabled={columns.length === 0}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Réinitialiser
        </button>
        <button
          onClick={handleContinue}
          disabled={columns.length !== 3}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Continuer
        </button>
      </div>
    </div>
  );
}

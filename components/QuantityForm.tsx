'use client';

import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/lib/utils';
import { Calculator } from 'lucide-react';

export default function QuantityForm() {
  const detectedItems = useStore((state) => state.detectedItems);
  const updateItemUnitPrice = useStore((state) => state.updateItemUnitPrice);
  const updateItemTotalPrice = useStore((state) => state.updateItemTotalPrice);
  const grandTotal = useStore((state) => state.grandTotal);

  const handleUnitPriceChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateItemUnitPrice(id, numValue);
  };

  const handleTotalPriceChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateItemTotalPrice(id, numValue);
  };

  if (detectedItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Aucune quantité détectée pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Remplir les prix</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Quantité</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Prix unitaire</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Prix total</th>
            </tr>
          </thead>
          <tbody>
            {detectedItems.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-800">
                  {item.quantity}
                </td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice || ''}
                    onChange={(e) => handleUnitPriceChange(item.id, e.target.value)}
                    className="w-full text-right px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.totalPrice || ''}
                    onChange={(e) => handleTotalPriceChange(item.id, e.target.value)}
                    className="w-full text-right px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-blue-50">
              <td colSpan={3} className="py-4 px-4 text-right font-bold text-gray-800">
                Total général
              </td>
              <td className="py-4 px-4 text-right font-bold text-blue-600 text-lg">
                {formatCurrency(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useStore } from '@/store/useStore';
import { Upload, Columns, ScanSearch, Edit, Download } from 'lucide-react';
import { AppStep } from '@/types';

const steps: { id: AppStep; label: string; icon: any }[] = [
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'define-columns', label: 'Colonnes', icon: Columns },
  { id: 'detect', label: 'Détection', icon: ScanSearch },
  { id: 'fill', label: 'Remplissage', icon: Edit },
  { id: 'export', label: 'Export', icon: Download },
];

export default function StepIndicator() {
  const currentStep = useStore((state) => state.currentStep);

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-all ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

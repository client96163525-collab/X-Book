import React from 'react';
import { Section, FIBData } from '../../types';
import { Trash2 } from 'lucide-react';

interface FIBEditorProps {
  section: Section;
  onChange: (section: Section) => void;
  onDelete: () => void;
}

export default function FIBEditor({ section, onChange, onDelete }: FIBEditorProps) {
  const data = section.data as FIBData;

  const handleChange = (field: keyof FIBData, value: string) => {
    onChange({
      ...section,
      data: {
        ...data,
        [field]: value
      }
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 group relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Fill in the Blank</span>
        </div>
        <button 
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question (Use underscores _____ for blanks)
          </label>
          <input
            type="text"
            value={data.question}
            onChange={(e) => handleChange('question', e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="The sky is _____."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correct Answer
          </label>
          <input
            type="text"
            value={data.answer}
            onChange={(e) => handleChange('answer', e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Explanation (Optional)
          </label>
          <input
            type="text"
            value={data.explanation || ''}
            onChange={(e) => handleChange('explanation', e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Explain why this is the answer"
          />
        </div>
      </div>
    </div>
  );
}

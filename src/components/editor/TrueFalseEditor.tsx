import { Section, TrueFalseData } from '../../types';
import { Trash2, GripVertical, CheckCircle, XCircle } from 'lucide-react';

interface SectionEditorProps {
  section: Section;
  onChange: (updatedSection: Section) => void;
  onDelete: () => void;
}

export default function TrueFalseEditor({ section, onChange, onDelete }: SectionEditorProps) {
  const data = (section.data as TrueFalseData) || { statement: '', isTrue: true, explanation: '' };

  const updateData = (newData: Partial<TrueFalseData>) => {
    onChange({ ...section, data: { ...data, ...newData } });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <span className="font-medium text-gray-700">True / False Question</span>
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <input
        type="text"
        value={data.statement}
        onChange={(e) => updateData({ statement: e.target.value })}
        placeholder="Enter Statement"
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 font-medium"
      />

      <div className="flex gap-4 mb-4">
        <button
            onClick={() => updateData({ isTrue: true })}
            className={`flex-1 py-2 px-4 rounded-md border flex items-center justify-center gap-2 ${data.isTrue ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-300 text-gray-700'}`}
        >
            <CheckCircle className="h-5 w-5" /> True
        </button>
        <button
            onClick={() => updateData({ isTrue: false })}
            className={`flex-1 py-2 px-4 rounded-md border flex items-center justify-center gap-2 ${!data.isTrue ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-300 text-gray-700'}`}
        >
            <XCircle className="h-5 w-5" /> False
        </button>
      </div>

      <textarea
        value={data.explanation || ''}
        onChange={(e) => updateData({ explanation: e.target.value })}
        placeholder="Explanation (Optional)"
        className="w-full p-2 border border-gray-300 rounded text-sm"
        rows={2}
      />
    </div>
  );
}

import { Section, QAData } from '../../types';
import { Trash2, GripVertical } from 'lucide-react';

interface SectionEditorProps {
  section: Section;
  onChange: (updatedSection: Section) => void;
  onDelete: () => void;
}

export default function QAEditor({ section, onChange, onDelete }: SectionEditorProps) {
  const data = (section.data as QAData) || { question: '', answer: '' };

  const updateData = (newData: Partial<QAData>) => {
    onChange({ ...section, data: { ...data, ...newData } });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <span className="font-medium text-gray-700">Q&A</span>
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <input
        type="text"
        value={data.question}
        onChange={(e) => updateData({ question: e.target.value })}
        placeholder="Question"
        className="w-full mb-2 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 font-medium"
      />

      <textarea
        value={data.answer}
        onChange={(e) => updateData({ answer: e.target.value })}
        placeholder="Answer"
        className="w-full p-2 border border-gray-300 rounded text-sm"
        rows={3}
      />
    </div>
  );
}

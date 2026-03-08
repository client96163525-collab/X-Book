import { Section, MCQData, MCQOption } from '../../types';
import { Trash2, GripVertical, Plus, CheckCircle, Circle } from 'lucide-react';

interface SectionEditorProps {
  section: Section;
  onChange: (updatedSection: Section) => void;
  onDelete: () => void;
}

export default function MCQEditor({ section, onChange, onDelete }: SectionEditorProps) {
  const data = (section.data as MCQData) || { question: '', options: [], explanation: '' };

  const updateData = (newData: Partial<MCQData>) => {
    onChange({ ...section, data: { ...data, ...newData } });
  };

  const addOption = () => {
    const newOption: MCQOption = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      isCorrect: false
    };
    updateData({ options: [...data.options, newOption] });
  };

  const updateOption = (id: string, text: string) => {
    const newOptions = data.options.map(opt => opt.id === id ? { ...opt, text } : opt);
    updateData({ options: newOptions });
  };

  const toggleCorrect = (id: string) => {
    const newOptions = data.options.map(opt => ({ ...opt, isCorrect: opt.id === id }));
    updateData({ options: newOptions });
  };

  const removeOption = (id: string) => {
    updateData({ options: data.options.filter(opt => opt.id !== id) });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <span className="font-medium text-gray-700">Multiple Choice Question</span>
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <input
        type="text"
        value={data.question}
        onChange={(e) => updateData({ question: e.target.value })}
        placeholder="Enter Question"
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 font-medium"
      />

      <div className="space-y-2 mb-4">
        {data.options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <button onClick={() => toggleCorrect(option.id)} className="text-gray-400 hover:text-green-600">
              {option.isCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5" />}
            </button>
            <input
              type="text"
              value={option.text}
              onChange={(e) => updateOption(option.id, e.target.value)}
              placeholder={`Option`}
              className={`flex-1 p-2 border rounded ${option.isCorrect ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
            />
            <button onClick={() => removeOption(option.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button onClick={addOption} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
          <Plus className="h-3 w-3" /> Add Option
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

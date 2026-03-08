import { Section } from '../../types';
import { Trash2, GripVertical } from 'lucide-react';

interface SectionEditorProps {
  section: Section;
  onChange: (updatedSection: Section) => void;
  onDelete: () => void;
}

export default function StoryEditor({ section, onChange, onDelete }: SectionEditorProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <span className="font-medium text-gray-700">Story Section</span>
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <input
        type="text"
        value={section.title || ''}
        onChange={(e) => onChange({ ...section, title: e.target.value })}
        placeholder="Chapter Title (Optional)"
        className="w-full mb-2 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
      />
      <textarea
        value={section.content || ''}
        onChange={(e) => onChange({ ...section, content: e.target.value })}
        placeholder="Write your story here..."
        className="w-full h-40 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
      />
    </div>
  );
}

import { Section } from '../../types';
import { Trash2, GripVertical, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface SectionEditorProps {
  section: Section;
  onChange: (updatedSection: Section) => void;
  onDelete: () => void;
}

export default function IllustrationEditor({ section, onChange, onDelete }: SectionEditorProps) {
  const [generating, setGenerating] = useState(false);

  const generateImage = async () => {
    if (!section.imagePrompt) return;
    setGenerating(true);
    try {
       // Mock implementation for stability
       const seed = encodeURIComponent(section.imagePrompt);
       const imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
       
       onChange({ ...section, imageUrl });
       
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <span className="font-medium text-gray-700">Illustration</span>
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Image Prompt</label>
            <textarea
                value={section.imagePrompt || ''}
                onChange={(e) => onChange({ ...section, imagePrompt: e.target.value })}
                placeholder="Describe the image..."
                className="w-full h-24 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-2"
            />
            <button 
                onClick={generateImage}
                disabled={generating || !section.imagePrompt}
                className="flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
                {generating ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <ImageIcon className="h-3 w-3 mr-1" />}
                Generate Image
            </button>
        </div>
        <div className="w-48 h-32 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
            {section.imageUrl ? (
                <img src={section.imageUrl} alt="Generated" className="w-full h-full object-cover" />
            ) : (
                <div className="text-gray-400 text-xs text-center p-2">
                    Image Preview
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

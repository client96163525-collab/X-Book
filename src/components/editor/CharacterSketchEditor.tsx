import { Section, CharacterSketchData } from '../../types';
import { Trash2, GripVertical, Image as ImageIcon, RefreshCw, User } from 'lucide-react';
import { useState } from 'react';

interface SectionEditorProps {
  section: Section;
  onChange: (updatedSection: Section) => void;
  onDelete: () => void;
}

export default function CharacterSketchEditor({ section, onChange, onDelete }: SectionEditorProps) {
  const [generating, setGenerating] = useState(false);
  const data = (section.data as CharacterSketchData) || { role: '', traits: [] };

  const updateData = (updates: Partial<CharacterSketchData>) => {
    onChange({
      ...section,
      data: { ...data, ...updates }
    });
  };

  const generateImage = async () => {
    if (!section.imagePrompt) return;
    setGenerating(true);
    try {
       // Mock implementation for stability
       const seed = encodeURIComponent(section.imagePrompt);
       const imageUrl = `https://picsum.photos/seed/${seed}/400/400`; // Square for character portrait
       
       onChange({ ...section, imageUrl });
       
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <User className="h-5 w-5 text-indigo-600" />
          <span className="font-medium text-gray-700">Character Sketch</span>
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Character Name</label>
                <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) => onChange({ ...section, title: e.target.value })}
                    placeholder="e.g. Sherlock Holmes"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                    <input
                        type="text"
                        value={data.role || ''}
                        onChange={(e) => updateData({ role: e.target.value })}
                        placeholder="e.g. Protagonist"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Traits (comma separated)</label>
                    <input
                        type="text"
                        value={data.traits?.join(', ') || ''}
                        onChange={(e) => updateData({ traits: e.target.value.split(',').map(t => t.trim()) })}
                        placeholder="e.g. Smart, Observant"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description / Backstory</label>
                <textarea
                    value={section.content || ''}
                    onChange={(e) => onChange({ ...section, content: e.target.value })}
                    placeholder="Describe the character's appearance, personality, and background..."
                    className="w-full h-24 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
            </div>
        </div>

        <div className="space-y-3">
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Image Prompt</label>
                <textarea
                    value={section.imagePrompt || ''}
                    onChange={(e) => onChange({ ...section, imagePrompt: e.target.value })}
                    placeholder="Visual description for image generation..."
                    className="w-full h-20 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-2"
                />
                <button 
                    onClick={generateImage}
                    disabled={generating || !section.imagePrompt}
                    className="w-full flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    {generating ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <ImageIcon className="h-3 w-3 mr-1" />}
                    Generate Portrait
                </button>
            </div>

            <div className="aspect-square bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden relative group">
                {section.imageUrl ? (
                    <>
                        <img src={section.imageUrl} alt={section.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                             <button 
                                onClick={() => onChange({ ...section, imageUrl: undefined })}
                                className="bg-white p-1 rounded-full shadow-sm text-red-500 hover:text-red-700"
                                title="Remove Image"
                             >
                                <Trash2 className="h-4 w-4" />
                             </button>
                        </div>
                    </>
                ) : (
                    <div className="text-gray-400 text-xs text-center p-4">
                        <User className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        Portrait Preview
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

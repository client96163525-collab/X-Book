import { Section, SceneData } from '../../types';
import { Trash2, GripVertical, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface SectionEditorProps {
  section: Section;
  onChange: (updatedSection: Section) => void;
  onDelete: () => void;
}

export default function SceneEditor({ section, onChange, onDelete }: SectionEditorProps) {
  const [generating, setGenerating] = useState(false);
  const data = (section.data as SceneData) || { description: '', layout: 'half-page' };

  const generateImage = async () => {
    if (!section.imagePrompt) return;
    setGenerating(true);
    try {
       if (!process.env.GEMINI_API_KEY) {
           throw new Error("Gemini API Key is missing");
       }
       const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
       
       const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash-image',
           contents: { parts: [{ text: section.imagePrompt }] },
       });
       
       let imageUrl = '';
       if (response.candidates?.[0]?.content?.parts) {
           for (const part of response.candidates[0].content.parts) {
               if (part.inlineData) {
                   imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                   break;
               }
           }
       }

       if (imageUrl) {
           onChange({ ...section, imageUrl });
       }
       
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const updateData = (updates: Partial<SceneData>) => {
    onChange({ ...section, data: { ...data, ...updates } });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <span className="font-medium text-gray-700">Scene Illustration</span>
        </div>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Scene Description / Caption</label>
                <textarea
                    value={data.description}
                    onChange={(e) => updateData({ description: e.target.value })}
                    placeholder="Describe the scene for the reader (e.g., 'The brave knight stood before the dragon...')"
                    className="w-full h-20 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
            </div>
            
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Image Prompt (for AI)</label>
                <textarea
                    value={section.imagePrompt || ''}
                    onChange={(e) => onChange({ ...section, imagePrompt: e.target.value })}
                    placeholder="Detailed prompt for image generation..."
                    className="w-full h-20 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-2"
                />
                <button 
                    onClick={generateImage}
                    disabled={generating || !section.imagePrompt}
                    className="flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                    {generating ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <ImageIcon className="h-3 w-3 mr-1" />}
                    Generate Scene Image
                </button>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Layout Style</label>
                <select
                    value={data.layout || 'half-page'}
                    onChange={(e) => updateData({ layout: e.target.value as any })}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="half-page">Standard (Image + Text)</option>
                    <option value="full-page">Full Page Illustration</option>
                </select>
            </div>
        </div>

        <div className="flex items-center justify-center bg-gray-50 rounded border border-gray-200 min-h-[200px]">
            {section.imageUrl ? (
                <img src={section.imageUrl} alt="Scene" className="max-w-full max-h-[300px] object-contain rounded shadow-sm" />
            ) : (
                <div className="text-gray-400 text-sm text-center p-4">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Image Preview
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

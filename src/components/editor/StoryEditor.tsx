import { useState } from 'react';
import { Section } from '../../types';
import { Trash2, GripVertical, Image as ImageIcon, Wand2, Layout, Type } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface SectionEditorProps {
  section: Section;
  onChange: (updatedSection: Section) => void;
  onDelete: () => void;
}

export default function StoryEditor({ section, onChange, onDelete }: SectionEditorProps) {
  const [generatingImage, setGeneratingImage] = useState(false);

  const handleGenerateImage = async () => {
    if (!section.imagePrompt) return;
    setGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: section.imagePrompt }] },
      });
      
      // Extract image from response
      // The response structure for image generation might vary, checking standard path
      // For gemini-2.5-flash-image, it returns inlineData in parts
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
      } else {
        alert('No image generated. Please try again.');
      }

    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB before compression)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please choose an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize if too large (max 800px width/height)
        const MAX_SIZE = 800;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        onChange({ ...section, imageUrl: dataUrl });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
          <span className="font-medium text-gray-700">Story Section</span>
        </div>
        <div className="flex items-center gap-2">
            <select
                value={section.layout || 'text-only'}
                onChange={(e) => onChange({ ...section, layout: e.target.value as any })}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="text-only">Text Only</option>
                <option value="image-top">Image Top</option>
                <option value="image-bottom">Image Bottom</option>
            </select>
            <select
                value={section.font || 'default'}
                onChange={(e) => onChange({ ...section, font: e.target.value as any })}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="default">Default (Theme)</option>
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="handwriting">Handwriting</option>
                <option value="mono">Monospace</option>
            </select>
            <button onClick={onDelete} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
      </div>
      
      <input
        type="text"
        value={section.title || ''}
        onChange={(e) => onChange({ ...section, title: e.target.value })}
        placeholder="Chapter Title (Optional)"
        className="w-full mb-3 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 font-medium"
      />
      
      <textarea
        value={section.content || ''}
        onChange={(e) => onChange({ ...section, content: e.target.value })}
        placeholder="Write your story here..."
        className="w-full h-40 p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-3"
        style={{ fontFamily: section.font === 'serif' ? 'serif' : section.font === 'mono' ? 'monospace' : section.font === 'handwriting' ? 'cursive' : 'sans-serif' }}
      />

      {/* Image Generation Section */}
      {(section.layout === 'image-top' || section.layout === 'image-bottom') && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                <ImageIcon className="h-4 w-4" /> Illustration Settings
            </div>
            
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={section.imagePrompt || ''}
                    onChange={(e) => onChange({ ...section, imagePrompt: e.target.value })}
                    placeholder="Describe the image you want to generate..."
                    className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    onClick={handleGenerateImage}
                    disabled={generatingImage || !section.imagePrompt}
                    className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                    {generatingImage ? <Wand2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                </button>
            </div>

            <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Or upload your own image:</p>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                />
            </div>

            {section.imageUrl && (
                <div className="relative mt-2 group">
                    <img src={section.imageUrl} alt="Generated illustration" className="w-full h-48 object-contain bg-white border border-gray-200 rounded" />
                    <button 
                        onClick={() => onChange({ ...section, imageUrl: undefined })}
                        className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
}

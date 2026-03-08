import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, Timestamp, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { MyDocument } from '../components/PDFDocument';
import { Save, Download, ArrowLeft, RefreshCw, Wand2, Plus, BookOpen, HelpCircle, Image as ImageIcon, CheckSquare, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Section, SectionType } from '../types';
import StoryEditor from '../components/editor/StoryEditor';
import MCQEditor from '../components/editor/MCQEditor';
import TrueFalseEditor from '../components/editor/TrueFalseEditor';
import QAEditor from '../components/editor/QAEditor';
import FIBEditor from '../components/editor/FIBEditor';
import IllustrationEditor from '../components/editor/IllustrationEditor';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('Untitled Book');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [template, setTemplate] = useState('classic');
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [rawInput, setRawInput] = useState(''); // For initial raw input mode

  useEffect(() => {
    if (user?.displayName) {
        setAuthor(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    async function fetchBook() {
      if (!id || !user) return;
      
      if (id === 'new') {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'books', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setSubtitle(data.subtitle || '');
          setAuthor(data.author || '');
          setTemplate(data.template || 'classic');
          
          if (data.sections) {
             setSections(data.sections);
          } else if (data.content) {
             // Fallback for legacy content
             setSections([{
                 id: 'legacy',
                 type: 'story',
                 content: data.content,
                 title: 'Chapter 1'
             }]);
          }
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const bookData = {
        userId: user.uid,
        title,
        subtitle,
        author,
        template,
        sections,
        updatedAt: Timestamp.now(),
      };

      if (id === 'new') {
        const newDocRef = doc(collection(db, 'books')); // Auto-ID
        await setDoc(newDocRef, {
            ...bookData,
            createdAt: Timestamp.now()
        });
        navigate(`/editor/${newDocRef.id}`);
      } else if (id) {
        await updateDoc(doc(db, 'books', id), bookData);
      }
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Failed to save book. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type: SectionType) => {
    const newSection: Section = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: '',
      content: '',
      data: type === 'mcq' ? { question: '', options: [], explanation: '' } : 
            type === 'true_false' ? { statement: '', isTrue: true, explanation: '' } :
            type === 'qa' ? { question: '', answer: '' } :
            type === 'fib' ? { question: '', answer: '', explanation: '' } : undefined
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (index: number, updatedSection: Section) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  };

  const deleteSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const handleGenerateStructure = async () => {
    if (!rawInput) return;
    setGenerating(true);

    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API Key is missing");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = `
        Analyze the following raw content and structure it into a book format.
        Identify stories, questions, true/false, MCQs, and Fill in the Blanks.
        For story sections, analyze the content to suggest a suitable layout, font style, and generate a detailed image prompt for an illustration.
        
        IMPORTANT: 
        1. Return ONLY a valid JSON array. Do not include markdown formatting or code blocks.
        2. For 'font', prefer 'default' to let the book template control the style, unless a specific style (handwriting/mono) is strictly needed for effect.
        3. GENERATE AT LEAST 5 MCQs, 5 True/False questions, 5 Q&A questions, and 5 Fill in the Blanks questions based on the content.
        
        Schema:
        [
          { 
            "type": "story", 
            "title": "...", 
            "content": "...",
            "layout": "image-top" | "image-bottom" | "text-only",
            "font": "default" | "serif" | "sans" | "handwriting" | "mono",
            "imagePrompt": "Detailed prompt for an illustration of this scene (if layout involves image)"
          },
          { "type": "mcq", "data": { "question": "...", "options": [{"id": "1", "text": "...", "isCorrect": boolean}], "explanation": "..." } },
          { "type": "true_false", "data": { "statement": "...", "isTrue": boolean, "explanation": "..." } },
          { "type": "qa", "data": { "question": "...", "answer": "..." } },
          { "type": "fib", "data": { "question": "Sentence with _____ blank", "answer": "correct word", "explanation": "..." } },
          { "type": "illustration", "imagePrompt": "Detailed prompt for an illustration of..." }
        ]

        Raw Content:
        ${rawInput}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        
        let text = response.text;
        
        if (text) {
            // Clean markdown if present
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            try {
                const generatedSections = JSON.parse(text);
                // Add IDs
                const sectionsWithIds = generatedSections.map((s: any) => ({
                    ...s,
                    id: Math.random().toString(36).substr(2, 9)
                }));
                setSections([...sections, ...sectionsWithIds]);
                setRawInput(''); // Clear raw input after successful generation
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                console.log("Raw Response:", text);
                alert("AI returned invalid format. Please try again.");
            }
        }
    } catch (error) {
        console.error("Error generating structure:", error);
        alert(`Failed to generate structure: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        setGenerating(false);
    }
  };

  const handleGenerateAllImages = async () => {
    setGenerating(true);
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API Key is missing");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const newSections = [...sections];
        
        for (let i = 0; i < newSections.length; i++) {
            const section = newSections[i];
            if ((section.type === 'story' || section.type === 'illustration') && section.imagePrompt && !section.imageUrl) {
                try {
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
                        newSections[i] = { ...section, imageUrl };
                        setSections([...newSections]); // Update state progressively to show progress
                    }
                } catch (e) {
                    console.error(`Error generating image for section ${i}:`, e);
                    // Continue to next image even if one fails
                }
            }
        }
    } catch (error) {
        console.error("Error in image generation process:", error);
        alert(`Failed to start image generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        setGenerating(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold border-none focus:ring-0 text-gray-900 placeholder-gray-400 bg-transparent"
            placeholder="Book Title"
          />
        </div>
        <div className="flex items-center gap-3">
          {sections.some(s => (s.type === 'story' || s.type === 'illustration') && s.imagePrompt && !s.imageUrl) && (
            <button
                onClick={handleGenerateAllImages}
                disabled={generating}
                className="hidden md:flex items-center px-3 py-2 border border-indigo-200 rounded-md text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
            >
                {generating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                Generate Missing Images
            </button>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="hidden md:flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {showPreview ? 'Edit Content' : 'Show Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </button>
          <PDFDownloadLink
            document={<MyDocument title={title} subtitle={subtitle} author={author} sections={sections} template={template} />}
            fileName={`${title.replace(/\s+/g, '_')}.pdf`}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            {({ loading }) => (loading ? 'Generating...' : <><Download className="h-4 w-4 mr-2" /> Export PDF</>)}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Editor Pane */}
        <div className={`flex-1 flex flex-col overflow-y-auto ${showPreview ? 'hidden md:flex w-1/2' : 'w-full'}`}>
          
          {/* Book Metadata */}
          <div className="p-6 bg-white border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
             <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Subtitle (Optional)"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             />
             <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author Name"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             />
             <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
             >
                <option value="classic">Classic Template</option>
                <option value="story-book">Story Book</option>
                <option value="children">Children Book</option>
                <option value="workbook">Workbook</option>
                <option value="minimal">Minimal</option>
                <option value="modern">Modern</option>
             </select>
          </div>

          {/* AI Generator Input */}
          {sections.length === 0 && (
            <div className="p-6 bg-indigo-50 border-b border-indigo-100">
                <h3 className="text-lg font-medium text-indigo-900 mb-2 flex items-center gap-2">
                    <Wand2 className="h-5 w-5" /> AI Quick Start
                </h3>
                <p className="text-sm text-indigo-700 mb-4">
                    Paste your raw content (story, questions, notes) below and let AI structure it for you.
                </p>
                <textarea
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    className="w-full h-32 p-3 border border-indigo-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-3"
                    placeholder="Once upon a time... &#10;&#10;Questions:&#10;1. What happened?&#10;2. Who was there?"
                />
                <button
                    onClick={handleGenerateStructure}
                    disabled={generating || !rawInput}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                    {generating ? 'Analyzing...' : 'Generate Book Structure'}
                </button>
            </div>
          )}

          {/* Sections List */}
          <div className="p-6 space-y-6 pb-20">
            {sections.map((section, index) => (
                <div key={section.id}>
                    {section.type === 'story' && (
                        <StoryEditor 
                            section={section} 
                            onChange={(s) => updateSection(index, s)} 
                            onDelete={() => deleteSection(index)} 
                        />
                    )}
                    {section.type === 'mcq' && (
                        <MCQEditor 
                            section={section} 
                            onChange={(s) => updateSection(index, s)} 
                            onDelete={() => deleteSection(index)} 
                        />
                    )}
                    {section.type === 'true_false' && (
                        <TrueFalseEditor 
                            section={section} 
                            onChange={(s) => updateSection(index, s)} 
                            onDelete={() => deleteSection(index)} 
                        />
                    )}
                    {section.type === 'qa' && (
                        <QAEditor 
                            section={section} 
                            onChange={(s) => updateSection(index, s)} 
                            onDelete={() => deleteSection(index)} 
                        />
                    )}
                    {section.type === 'fib' && (
                        <FIBEditor 
                            section={section} 
                            onChange={(s) => updateSection(index, s)} 
                            onDelete={() => deleteSection(index)} 
                        />
                    )}
                    {section.type === 'illustration' && (
                        <IllustrationEditor 
                            section={section} 
                            onChange={(s) => updateSection(index, s)} 
                            onDelete={() => deleteSection(index)} 
                        />
                    )}
                </div>
            ))}

            {/* Add Section Buttons */}
            <div className="flex flex-wrap gap-2 justify-center mt-8 pt-4 border-t border-gray-200">
                <button onClick={() => addSection('story')} className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" /> Add Story
                </button>
                <button onClick={() => addSection('illustration')} className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <ImageIcon className="h-4 w-4 mr-2 text-purple-500" /> Add Illustration
                </button>
                <button onClick={() => addSection('mcq')} className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <CheckSquare className="h-4 w-4 mr-2 text-green-500" /> Add MCQ
                </button>
                <button onClick={() => addSection('true_false')} className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <CheckSquare className="h-4 w-4 mr-2 text-orange-500" /> Add T/F
                </button>
                <button onClick={() => addSection('qa')} className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <HelpCircle className="h-4 w-4 mr-2 text-red-500" /> Add Q&A
                </button>
                <button onClick={() => addSection('fib')} className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <HelpCircle className="h-4 w-4 mr-2 text-yellow-500" /> Add FIB
                </button>
            </div>
          </div>
        </div>

        {/* Preview Pane */}
        <div className={`flex-1 bg-gray-100 border-l border-gray-200 ${showPreview ? 'block' : 'hidden md:block'}`}>
          <PDFViewer width="100%" height="100%" className="w-full h-full">
            <MyDocument title={title} subtitle={subtitle} author={author} sections={sections} template={template} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}

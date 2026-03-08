import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { BookOpen, Upload, FileText, Type, ArrowRight, Loader2 } from 'lucide-react';

export default function CreateBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(user?.displayName || '');
  const [contentType, setContentType] = useState<'scratch' | 'text' | 'file'>('scratch');
  const [content, setContent] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setContent(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleCreate = async () => {
    if (!user) return;
    if (!title) {
        alert("Please enter a book title");
        return;
    }

    setLoading(true);

    try {
      const sections = (contentType !== 'scratch' && content) ? [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'story',
        title: 'Chapter 1',
        content: content
      }] : [];

      const bookData = {
        userId: user.uid,
        title,
        author,
        template: 'classic',
        sections,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(db, 'books'), bookData);
      navigate(`/editor/${docRef.id}`);
    } catch (error) {
      console.error("Error creating book:", error);
      alert("Failed to create book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Book</h1>
        <p className="mt-2 text-gray-600">Let's start building your next masterpiece.</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          
          {/* Step 1: Basic Info */}
          <div className={`space-y-6 ${step === 1 ? 'block' : 'hidden'}`}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Book Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="The Great Adventure"
                />
              </div>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Author Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="author"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!title}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Step 2: Content Source */}
          <div className={`space-y-6 ${step === 2 ? 'block' : 'hidden'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                How do you want to start?
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                
                <div 
                    onClick={() => setContentType('scratch')}
                    className={`relative rounded-lg border p-4 cursor-pointer hover:border-indigo-500 flex flex-col items-center text-center ${contentType === 'scratch' ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                >
                    <BookOpen className="h-8 w-8 text-indigo-600 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900">Start from Scratch</h3>
                    <p className="mt-1 text-xs text-gray-500">Empty canvas for your ideas</p>
                </div>

                <div 
                    onClick={() => setContentType('text')}
                    className={`relative rounded-lg border p-4 cursor-pointer hover:border-indigo-500 flex flex-col items-center text-center ${contentType === 'text' ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                >
                    <Type className="h-8 w-8 text-indigo-600 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900">Paste Text</h3>
                    <p className="mt-1 text-xs text-gray-500">Copy & paste your draft</p>
                </div>

                <div 
                    onClick={() => setContentType('file')}
                    className={`relative rounded-lg border p-4 cursor-pointer hover:border-indigo-500 flex flex-col items-center text-center ${contentType === 'file' ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                >
                    <Upload className="h-8 w-8 text-indigo-600 mb-2" />
                    <h3 className="text-sm font-medium text-gray-900">Upload File</h3>
                    <p className="mt-1 text-xs text-gray-500">.txt or .md files</p>
                </div>

              </div>
            </div>

            {contentType === 'text' && (
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Paste your content here
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="content"
                            name="content"
                            rows={10}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Once upon a time..."
                        />
                    </div>
                </div>
            )}

            {contentType === 'file' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Upload your file
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".txt,.md" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">TXT or MD up to 10MB</p>
                            {content && <p className="text-sm text-green-600 mt-2">File loaded successfully!</p>}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between">
                <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                    Back
                </button>
                <button
                    onClick={handleCreate}
                    disabled={loading || (contentType !== 'scratch' && !content)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Create Book
                </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

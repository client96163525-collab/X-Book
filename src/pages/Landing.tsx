import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Zap, Layout, Image as ImageIcon, PenTool, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Turn Ideas Into</span>{' '}
                  <span className="block text-indigo-600 xl:inline">Beautiful Illustrated Books</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Instantly convert stories, notes, and quizzes into professional PDFs. 
                  AI-powered illustrations, auto-structuring, and interactive workbook elements.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 cursor-pointer"
                    >
                      Start Creating Free
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="relative w-full max-w-lg p-8"
           >
              <div className="bg-white rounded-lg shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-gray-100">
                <div className="h-64 bg-indigo-50 rounded mb-4 flex items-center justify-center text-indigo-300">
                  <ImageIcon className="h-20 w-20" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    <div className="h-8 w-24 rounded bg-gray-200"></div>
                </div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to publish
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <BrainCircuit className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">AI Structuring</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Paste raw text and let AI organize it into chapters, questions, and exercises automatically.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <ImageIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Auto Illustrations</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Generate consistent character and scene illustrations for your stories with one click.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <PenTool className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Workbook Elements</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Easily add MCQs, True/False, and Q&A sections perfect for educational content.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

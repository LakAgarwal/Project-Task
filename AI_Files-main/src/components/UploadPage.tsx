import React, { useState } from 'react';
import { Upload, FileText, Zap } from 'lucide-react';
import FileUploader from './FileUploader';
import { FileData } from '../App';

interface UploadPageProps {
  onGenerate: (file: FileData, prompt: string) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onGenerate }) => {
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (file: FileData) => {
    setUploadedFile(file);
  };

  const handleGenerate = async () => {
    if (!uploadedFile || !prompt.trim()) return;
    
    setIsGenerating(true);
    await onGenerate(uploadedFile, prompt);
    setIsGenerating(false);
  };

  const promptExamples = [
    "Summarize in bullet points for executives",
    "Highlight only action items and deadlines",
    "Extract key decisions and next steps",
    "Create a meeting recap with participant roles",
    "Identify risks and mitigation strategies"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              {/* <div className="p-4 bg-blue-600 rounded-2xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div> */}
            </div>
            {/* <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Transcript Summarizer
            </h1> */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your meeting notes, call transcripts, or documents and get intelligent summaries 
              tailored to your specific needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* File Upload Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <Upload className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Upload Document</h2>
              </div>
              
              <FileUploader onFileUpload={handleFileUpload} />
              
              {uploadedFile && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="font-medium text-green-800">{uploadedFile.name}</p>
                      <p className="text-sm text-green-600">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.content.split(' ').length} words
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <Zap className="w-6 h-6 text-teal-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Custom Instructions</h2>
              </div>
              
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                  How would you like the AI to process your document?
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your custom instructions here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={6}
                />
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Examples:</p>
                <div className="space-y-2">
                  {promptExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition-all duration-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-12 text-center">
            <button
              onClick={handleGenerate}
              disabled={!uploadedFile || !prompt.trim() || isGenerating}
              className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                !uploadedFile || !prompt.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isGenerating
                  ? 'bg-blue-600 text-white cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-300'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Generating Summary...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 mr-3" />
                  Generate AI Summary
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
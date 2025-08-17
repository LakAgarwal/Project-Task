import React, { useState } from 'react';
import { ArrowLeft, Edit, Share2, Download, Copy, Check, Mail, MessageCircle, Twitter, Linkedin, Facebook } from 'lucide-react';
import EditableText from './EditableText';
import ShareModal from './ShareModal';
import ShareOptionsModal from './ShareOptionsModal';

interface ResultsPageProps {
  summary: string;
  setSummary: (summary: string) => void;
  fileName: string;
  prompt: string;
  onBackToUpload: () => void;
  isGenerating: boolean;
}

const ResultsPage: React.FC<ResultsPageProps> = ({
  summary,
  setSummary,
  fileName,
  prompt,
  onBackToUpload,
  isGenerating
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareViaWhatsApp = () => {
    const text = encodeURIComponent(`Summary of ${fileName}:\n\n${summary}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareViaTwitter = () => {
    const text = encodeURIComponent(`Check out this AI-generated summary of ${fileName}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareViaLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`AI Summary: ${fileName}`);
    const summary_text = encodeURIComponent(summary.substring(0, 200) + '...');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary_text}`, '_blank');
  };

  const handleShareViaFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Processing Your Document</h2>
          <p className="text-gray-600">Our AI is analyzing your transcript and generating a summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBackToUpload}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Upload
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopy}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>

          {/* Document Info */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Source Document</h3>
                <p className="text-lg font-semibold text-gray-900">{fileName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Processing Instructions</h3>
                <p className="text-gray-700">"{prompt}"</p>
              </div>
            </div>
          </div>

          {/* Summary Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">AI Generated Summary</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      isEditing
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Done Editing' : 'Edit Summary'}
                  </button>
                  
                  <button
                    onClick={() => setShowShareOptions(true)}
                    className="flex items-center px-4 py-2 bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <EditableText
                content={summary}
                onChange={setSummary}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share Options Modal */}
      {showShareOptions && (
        <ShareOptionsModal
          summary={summary}
          fileName={fileName}
          onClose={() => setShowShareOptions(false)}
          onEmailShare={() => {
            setShowShareOptions(false);
            setShowEmailModal(true);
          }}
          onWhatsAppShare={handleShareViaWhatsApp}
          onTwitterShare={handleShareViaTwitter}
          onLinkedInShare={handleShareViaLinkedIn}
          onFacebookShare={handleShareViaFacebook}
          onCopyShare={handleCopy}
        />
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <ShareModal
          summary={summary}
          fileName={fileName}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
};

export default ResultsPage;
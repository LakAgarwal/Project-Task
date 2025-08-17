import React, { useState } from 'react';
import { X, Mail, MessageCircle, Twitter, Linkedin, Facebook, Copy, Check, Link, Download } from 'lucide-react';

interface ShareOptionsModalProps {
  summary: string;
  fileName: string;
  onClose: () => void;
  onEmailShare: () => void;
  onWhatsAppShare: () => void;
  onTwitterShare: () => void;
  onLinkedInShare: () => void;
  onFacebookShare: () => void;
  onCopyShare: () => void;
}

const ShareOptionsModal: React.FC<ShareOptionsModalProps> = ({
  summary,
  fileName,
  onClose,
  onEmailShare,
  onWhatsAppShare,
  onTwitterShare,
  onLinkedInShare,
  onFacebookShare,
  onCopyShare
}) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyText = async () => {
    await onCopyShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
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

  const shareOptions = [
    {
      name: 'Copy Text',
      icon: copied ? Check : Copy,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      iconColor: copied ? 'text-green-600' : 'text-gray-600',
      onClick: handleCopyText,
      description: copied ? 'Copied!' : 'Copy summary to clipboard'
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
      iconColor: 'text-blue-600',
      onClick: onEmailShare,
      description: 'Send via email'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-100 hover:bg-green-200 text-green-700',
      iconColor: 'text-green-600',
      onClick: onWhatsAppShare,
      description: 'Share on WhatsApp'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-100 hover:bg-sky-200 text-sky-700',
      iconColor: 'text-sky-600',
      onClick: onTwitterShare,
      description: 'Share on Twitter'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
      iconColor: 'text-blue-600',
      onClick: onLinkedInShare,
      description: 'Share on LinkedIn'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
      iconColor: 'text-blue-600',
      onClick: onFacebookShare,
      description: 'Share on Facebook'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Share Summary</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">Choose how you'd like to share your summary</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.onClick}
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${option.color}`}
              >
                <option.icon className={`w-6 h-6 mb-2 ${option.iconColor}`} />
                <span className="text-sm font-medium">{option.name}</span>
                <span className="text-xs text-gray-500 mt-1 text-center">{option.description}</span>
              </button>
            ))}
          </div>

          {/* Additional Options */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-all duration-200"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center px-4 py-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download as TXT
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
          <div className="p-3 bg-white rounded-lg border text-sm text-gray-600">
            <p className="font-medium text-gray-800 mb-1">{fileName}</p>
            <p className="line-clamp-3">
              {summary.length > 150 ? `${summary.substring(0, 150)}...` : summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareOptionsModal;
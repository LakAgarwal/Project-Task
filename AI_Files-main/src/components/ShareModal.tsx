import React, { useState } from 'react';
import { X, Mail, Plus, Trash2, Send } from 'lucide-react';

interface ShareModalProps {
  summary: string;
  fileName: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ summary, fileName, onClose }) => {
  const [emails, setEmails] = useState<string[]>(['']);
  const [subject, setSubject] = useState(`Summary: ${fileName.replace(/\.[^/.]+$/, '')}`);
  const [message, setMessage] = useState('Please find the attached summary below.');
  const [isSending, setIsSending] = useState(false);

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSend = () => {
    const validEmails = emails.filter(email => email.trim() && email.includes('@'));
    
    if (validEmails.length === 0) {
      alert('Please enter at least one valid email address.');
      return;
    }

    setIsSending(true);
    
    // Create email body
    const emailBody = `${message}\n\n--- SUMMARY ---\n\n${summary}`;
    
    // Create mailto link
    const mailtoLink = `mailto:${validEmails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Simulate sending delay
    setTimeout(() => {
      setIsSending(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-teal-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Share Summary</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Email Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Email Recipients
            </label>
            <div className="space-y-3">
              {emails.map((email, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {emails.length > 1 && (
                    <button
                      onClick={() => removeEmailField(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addEmailField}
                className="flex items-center px-3 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add another recipient
              </button>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder="Add a personal message (optional)"
            />
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
              <p className="font-medium">Subject: {subject}</p>
              <div className="mt-2 whitespace-pre-wrap">
                {message}
                {'\n\n--- SUMMARY ---\n\n'}
                {summary.length > 200 ? `${summary.substring(0, 200)}...` : summary}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className={`flex items-center px-6 py-2 rounded-lg transition-all duration-200 ${
                isSending
                  ? 'bg-gray-400 text-white cursor-wait'
                  : 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-4 focus:ring-teal-300'
              }`}
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Summary
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
import React, { useState, useEffect } from 'react';

interface EditableTextProps {
  content: string;
  onChange: (content: string) => void;
  isEditing: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ content, onChange, isEditing }) => {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
    onChange(e.target.value);
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700">
            Edit mode active - Make your changes and click "Done Editing" when finished.
          </p>
        </div>
        <textarea
          value={localContent}
          onChange={handleChange}
          className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
          placeholder="Edit your summary here..."
        />
      </div>
    );
  }

  return (
    <div className="prose max-w-none">
      <div 
        className="whitespace-pre-wrap text-gray-800 leading-relaxed"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {content}
      </div>
    </div>
  );
};

export default EditableText;
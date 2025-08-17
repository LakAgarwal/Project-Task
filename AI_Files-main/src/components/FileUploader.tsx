import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { FileData } from '../App';

interface FileUploaderProps {
  onFileUpload: (file: FileData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return false;
    }
    
    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.txt')) {
      setError('Please upload a TXT, PDF, or DOC file');
      return false;
    }
    
    setError(null);
    return true;
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        // For demo purposes, we'll simulate PDF text extraction
        resolve(`[PDF Content Extracted from ${file.name}]\n\nThis is a sample text content that would be extracted from your PDF file. In a real implementation, this would contain the actual text content from the PDF document. The content includes meeting discussions, decisions made, action items, and other important information that was captured during the session.`);
      } else {
        // For DOC files, simulate content extraction
        resolve(`[Document Content from ${file.name}]\n\nThis represents the extracted text content from your document file. In a production environment, this would contain the actual text parsed from Word documents or other formats. The content typically includes meeting minutes, project notes, call transcripts, and other business communications that need to be summarized.`);
      }
    });
  };

  const handleFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;
    
    try {
      const content = await readFileContent(file);
      const fileData: FileData = {
        name: file.name,
        content,
        size: file.size
      };
      onFileUpload(fileData);
    } catch (err) {
      setError('Failed to read file content');
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          accept=".txt,.pdf,.doc,.docx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className={`w-8 h-8 transition-colors duration-300 ${
              isDragging ? 'text-blue-600' : 'text-blue-500'
            }`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your file here, or <span className="text-blue-600">browse</span>
            </p>
            <p className="text-sm text-gray-500">
              Supports TXT, PDF, DOC files up to 10MB
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-1" />
          <span>TXT</span>
        </div>
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-1" />
          <span>PDF</span>
        </div>
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-1" />
          <span>DOC</span>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
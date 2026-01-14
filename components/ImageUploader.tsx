import React, { useState, useCallback, useRef } from 'react';
import { ImageFile } from '../types';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  id: string;
  title: string;
  onImageUpload: (file: ImageFile | null) => void;
  clickText?: string;
  formatText?: string;
}

const fileToBase64 = (file: File): Promise<{ base64: string, preview: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const preview = reader.result as string;
        const base64 = preview.split(',')[1];
        resolve({ base64, preview });
    };
    reader.onerror = (error) => reject(error);
  });
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageUpload, clickText = "Click to upload", formatText = "PNG, JPG, WEBP (MAX. 4MB)" }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini API
          alert("File size should not exceed 4MB.");
          return;
      }
      try {
        const { base64, preview } = await fileToBase64(file);
        setPreview(preview);
        onImageUpload({ base64, mimeType: file.type, preview });
      } catch (error) {
        console.error("Error converting file to base64", error);
        alert("Could not process file.");
      }
    }
  }, [onImageUpload]);

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setPreview(null);
      onImageUpload(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }

  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{title}</label>
      <div 
        className="flex items-center justify-center w-full aspect-[9/16] max-h-72 relative group"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={`flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors ${preview ? 'border-solid' : 'border-dashed'}`}>
          {preview ? (
            <>
              <img src={preview} alt="Preview" className="object-contain w-full h-full rounded-lg" />
              <button 
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-label="Remove image"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">{clickText}</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatText}</p>
            </div>
          )}
          <input ref={fileInputRef} id={id} type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
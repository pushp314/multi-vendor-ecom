'use client';

import { useState, useRef } from 'react';
import type { PutBlobResult } from '@vercel/blob';
import { Upload, File, Loader2 } from 'lucide-react';

interface UploadButtonProps {
  onUploadComplete: (url: string) => void;
}

export function UploadButton({ onUploadComplete }: UploadButtonProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!inputFileRef.current?.files) {
      return;
    }

    const file = inputFileRef.current.files[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/upload?filename=${file.name}`,
        {
          method: 'POST',
          body: file,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to upload file.');
      }

      const newBlob = (await response.json()) as PutBlobResult;
      setBlob(newBlob);
      onUploadComplete(newBlob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div 
        className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => inputFileRef.current?.click()}
      >
        <input
          type="file"
          ref={inputFileRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
        />
        <div className="text-center">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="text-gray-500">Uploading...</span>
            </div>
          ) : blob ? (
            <div className="flex flex-col items-center gap-2">
              <File className="h-8 w-8 text-green-500" />
              <span className="text-green-500">Upload complete!</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-gray-500" />
                <span className="text-gray-500">Click to upload an image</span>
                <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

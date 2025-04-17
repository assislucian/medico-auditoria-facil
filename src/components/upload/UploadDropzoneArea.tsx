
import React from 'react';
import FileDropZone from './FileDropZone';
import { FileType } from '@/types/upload';

interface UploadDropzoneAreaProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => Promise<void>;
  isUploading: boolean;
  hasFile: (type: FileType) => boolean;
}

const UploadDropzoneArea = ({ 
  handleFileChange, 
  isUploading, 
  hasFile 
}: UploadDropzoneAreaProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FileDropZone
        type="guia"
        onFileChange={handleFileChange}
        disabled={isUploading}
        hasFiles={hasFile('guia')}
      />
      <FileDropZone
        type="demonstrativo"
        onFileChange={handleFileChange}
        disabled={isUploading}
        hasFiles={hasFile('demonstrativo')}
      />
    </div>
  );
};

export default UploadDropzoneArea;

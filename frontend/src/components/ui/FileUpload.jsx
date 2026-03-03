import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function FileUpload({ onUpload, currentFile, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const { data } = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpload(data.data.url);
      toast.success('File uploaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {currentFile ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="h-5 w-5 text-primary-600" />
          <a
            href={currentFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:underline truncate flex-1"
          >
            {currentFile.split('/').pop()}
          </a>
          {onRemove && (
            <button onClick={onRemove} className="text-gray-400 hover:text-red-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors">
          <Upload className="h-6 w-6 text-gray-400 mb-1" />
          <span className="text-xs text-gray-500">
            {uploading ? 'Uploading...' : 'Click to upload file'}
          </span>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
          />
        </label>
      )}
    </div>
  );
}

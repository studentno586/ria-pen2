import React, { useState, useRef } from 'react';
import { Upload, FileAudio, FileVideo, X, FileText, Type, File } from 'lucide-react';

interface SourceInputProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  sourceText: string;
  onSourceTextChange: (text: string) => void;
}

export const SourceInput: React.FC<SourceInputProps> = ({ 
  file, 
  onFileChange, 
  sourceText, 
  onSourceTextChange 
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (activeTab === 'file' && e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (newFile: File) => {
    if (newFile.size > 50 * 1024 * 1024) {
      alert("ファイルサイズが大きすぎます (上限50MB)。短いクリップを使用してください。");
      return;
    }
    onFileChange(newFile);
  };

  const clearFile = () => {
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getIcon = () => {
    if (!file) return <Upload className="w-8 h-8 text-slate-400" />;
    if (file.type.startsWith('audio/')) return <FileAudio className="w-8 h-8 text-blue-500" />;
    if (file.type.startsWith('video/')) return <FileVideo className="w-8 h-8 text-purple-500" />;
    return <FileText className="w-8 h-8 text-slate-500" />;
  };

  return (
    <div>
      <div className="flex border-b border-slate-200 mb-4">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'text'
              ? 'border-[#00205b] text-[#00205b]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Type className="w-4 h-4" />
          テキスト入力
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`flex-1 py-2 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'file'
              ? 'border-[#00205b] text-[#00205b]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <File className="w-4 h-4" />
          ファイル
        </button>
      </div>

      {activeTab === 'text' ? (
        <div className="space-y-2">
          <textarea
            value={sourceText}
            onChange={(e) => onSourceTextChange(e.target.value)}
            className="w-full p-3 rounded border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[150px] text-sm leading-relaxed resize-y placeholder-slate-400"
            placeholder="ここに講義の書き起こし、レジュメのテキストなどを貼り付けてください..."
          />
        </div>
      ) : (
        <div>
          {!file ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 rounded bg-slate-50 p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group flex flex-col items-center justify-center min-h-[150px]"
            >
              <div className="flex justify-center mb-2">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
              </div>
              <p className="text-sm text-slate-600 font-medium">クリックしてアップロード</p>
              <p className="text-xs text-slate-400 mt-1">またはドラッグ＆ドロップ</p>
            </div>
          ) : (
            <div className="relative border border-slate-200 bg-white rounded p-3 flex items-center gap-3 shadow-sm">
              <div className="bg-slate-50 p-2 rounded">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={clearFile}
                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,video/*,image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
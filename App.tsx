import React, { useState } from 'react';
import { Header } from './components/Header';
import { SourceInput } from './components/FileUpload';
import { SettingsPanel } from './components/SettingsPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { DEFAULT_SETTINGS } from './constants';
import { PaperSettings } from './types';
import { generateReactionPaper, refineReactionPaper } from './services/geminiService';
import { Edit3, FileText, ArrowRight, Loader2 } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceText, setSourceText] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [settings, setSettings] = useState<PaperSettings>(DEFAULT_SETTINGS);
  const [modelId, setModelId] = useState<string>("gemini-3-flash-preview");
  
  const [results, setResults] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!file && !sourceText.trim() && !notes.trim()) {
      setError("資料（テキストまたはファイル）あるいはメモを入力してください。");
      return;
    }
    setError(null);
    setIsGenerating(true);
    setResults([]);

    try {
      const generatedTexts = await generateReactionPaper({
        file,
        sourceText,
        notes,
        settings,
        modelId
      });
      setResults(generatedTexts);
    } catch (err: any) {
      setError(err.message || "予期せぬエラーが発生しました。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (index: number, instruction: string) => {
    const originalText = results[index];
    if (!originalText) return;

    try {
      // Use the currently selected model or a faster one for edits
      const refinedText = await refineReactionPaper(originalText, instruction, modelId);
      
      // Update the specific result in the array
      const newResults = [...results];
      newResults[index] = refinedText;
      setResults(newResults);
    } catch (err: any) {
      console.error("Refine failed:", err);
      // We don't block the UI with a global error for refinement, 
      // but alerting or a toast would be good. 
      // For now, the component handles the loading state.
      throw err; 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9] text-[#333] font-sans">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Column: Input Card (Styled like the screenshot's dashboard cards) */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
              {/* Card Header mimicking the portal style */}
              <div className="flex flex-col items-center justify-center pt-8 pb-4 border-b border-slate-100">
                <Edit3 className="w-10 h-10 text-slate-500 mb-3" />
                <h2 className="text-lg font-bold text-slate-700 tracking-wide">条件・資料入力</h2>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                {/* Section 1: Source */}
                <div>
                  <h3 className="text-sm font-bold text-[#00205b] border-l-4 border-[#00205b] pl-3 mb-4">
                    1. 資料アップロード
                  </h3>
                  <SourceInput 
                    file={file} 
                    onFileChange={setFile}
                    sourceText={sourceText}
                    onSourceTextChange={setSourceText}
                  />
                </div>

                {/* Section 2: Settings */}
                <div>
                  <h3 className="text-sm font-bold text-[#00205b] border-l-4 border-[#00205b] pl-3 mb-4">
                    2. 作成設定
                  </h3>
                  <SettingsPanel 
                    settings={settings}
                    notes={notes}
                    modelId={modelId}
                    onSettingsChange={setSettings}
                    onNotesChange={setNotes}
                    onModelChange={setModelId}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded text-sm border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`
                    w-full py-4 rounded font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2
                    ${isGenerating 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-[#00205b] hover:bg-blue-900 hover:shadow-md'}
                  `}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <span>リアクションペーパーを作成</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Output Card (Styled similarly) */}
          <div className="flex flex-col h-full">
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm h-full flex flex-col">
              {/* Card Header */}
              <div className="flex flex-col items-center justify-center pt-8 pb-4 border-b border-slate-100">
                <FileText className="w-10 h-10 text-slate-500 mb-3" />
                <h2 className="text-lg font-bold text-slate-700 tracking-wide">生成結果</h2>
              </div>

              <div className="p-6 md:p-8 flex-1 bg-slate-50/30 flex flex-col min-h-[400px]">
                <ResultDisplay 
                   results={results} 
                   isGenerating={isGenerating} 
                   onRegenerate={results.length > 0 ? handleGenerate : undefined}
                   onRefine={handleRefine}
                />
                
                {results.length === 0 && !isGenerating && (
                  <div className="mt-8 text-center text-slate-400 text-sm">
                    <p>左側のフォームから資料を入力して<br/>「作成」ボタンを押してください。</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-xs">
        <p>&copy; 2025 Ria-Pen (AI Reflection Tool). All rights reserved.</p>
      </footer>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle2, RefreshCw, Sparkles, Send, X } from 'lucide-react';

interface ResultDisplayProps {
  results: string[];
  isGenerating: boolean;
  onRegenerate?: () => void;
  onRefine?: (index: number, instruction: string) => Promise<void>;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  results, 
  isGenerating, 
  onRegenerate,
  onRefine 
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Refinement State
  const [showRefineInput, setShowRefineInput] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    if (results.length > 0) {
      setSelectedIndex(0);
      setShowRefineInput(false);
      setRefineInstruction("");
    }
  }, [results]);

  const currentResult = results[selectedIndex] || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefineSubmit = async () => {
    if (!refineInstruction.trim() || !onRefine) return;
    
    setIsRefining(true);
    try {
      await onRefine(selectedIndex, refineInstruction);
      setRefineInstruction("");
      setShowRefineInput(false);
    } catch (e) {
      console.error(e);
      alert("修正に失敗しました。");
    } finally {
      setIsRefining(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white rounded border border-slate-200">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#00205b] rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium text-slate-600">Processing...</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white rounded border border-slate-200 border-dashed">
        <p className="text-sm">生成結果がここに表示されます</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded border border-slate-200 overflow-hidden flex flex-col shadow-sm h-full">
      {/* Tab Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-2 pt-2 flex gap-1 shrink-0">
        {results.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedIndex(idx);
              setShowRefineInput(false);
            }}
            className={`
              px-4 py-2 text-xs font-bold rounded-t-lg transition-all
              ${selectedIndex === idx 
                ? 'bg-white text-[#00205b] border-t border-l border-r border-slate-200 shadow-sm relative top-[1px]' 
                : 'text-slate-500 hover:bg-slate-100'}
            `}
          >
            パターン {idx + 1}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white flex-1 flex flex-col min-h-0 relative">
        <div className="relative flex-1 min-h-0 transition-all duration-300">
           {isRefining && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="flex flex-col items-center text-[#00205b]">
                   <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                   <span className="text-sm font-bold">修正中...</span>
                </div>
              </div>
           )}
           <textarea
             readOnly={isRefining}
             value={currentResult}
             className={`w-full h-full resize-none outline-none text-slate-800 leading-relaxed font-medium bg-transparent text-sm p-1 transition-all duration-300 ${
               showRefineInput ? 'opacity-50 blur-[1px]' : ''
             }`}
           />
        </div>
        
        {/* Refine Input Area */}
        {showRefineInput && (
          <div className="mt-3 mb-2 p-3 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2 shadow-md relative z-20">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#00205b] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                修正指示を入力（例: もっと真面目に / 300文字くらいに伸ばして）
              </label>
              <button onClick={() => setShowRefineInput(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={refineInstruction}
                  onChange={(e) => setRefineInstruction(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRefineSubmit()}
                  placeholder="指示を入力..."
                  className="w-full text-sm border border-blue-200 rounded px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                {refineInstruction && (
                  <button 
                    onClick={() => setRefineInstruction("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title="クリア"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button 
                onClick={handleRefineSubmit}
                disabled={!refineInstruction.trim()}
                className="bg-[#00205b] text-white p-2 rounded hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-auto flex flex-wrap justify-between items-center pt-3 border-t border-slate-100 gap-2">
           <span className="text-xs text-slate-400 font-mono">
             {currentResult.length} chars
           </span>
           
           <div className="flex flex-wrap gap-2">
              {!showRefineInput && onRefine && (
                <button
                  onClick={() => setShowRefineInput(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#00205b] bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  AIで修正・調整
                </button>
              )}

              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors"
                  title="全体を再生成"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={handleCopy}
                className={`
                  flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-all
                  ${copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-[#00205b] text-white hover:bg-blue-800'}
                `}
              >
                {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { PaperSettings, StudentPersona } from '../types';
import { User, MessageSquare, PenTool, Cpu } from 'lucide-react';

interface SettingsPanelProps {
  settings: PaperSettings;
  notes: string;
  modelId: string;
  onSettingsChange: (newSettings: PaperSettings) => void;
  onNotesChange: (notes: string) => void;
  onModelChange: (modelId: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  notes,
  modelId,
  onSettingsChange,
  onNotesChange,
  onModelChange,
}) => {
  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      character: e.target.value as StudentPersona,
    });
  };

  const handleInputChange = (field: keyof PaperSettings, value: string) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="space-y-5">
      {/* Model Selection */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
          <Cpu className="w-3 h-3" />
          AI Model
        </label>
        <select
          value={modelId}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full p-2 rounded border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
        >
          <option value="gemini-3-flash-preview">Gemini 3.0 Flash (推奨)</option>
          <option value="gemini-3-pro-preview">Gemini 3.0 Pro</option>
          <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
        </select>
      </div>

      {/* Persona Selection */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
          <User className="w-3 h-3" />
          Persona
        </label>
        <select
          value={settings.character}
          onChange={handlePersonaChange}
          className="w-full p-2 rounded border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
        >
          <option value={StudentPersona.BARELY_PASSING}>単位ギリギリの学生（アリバイ重視）</option>
          <option value={StudentPersona.HONORS_STUDENT}>成績優秀な優等生（論理的）</option>
          <option value={StudentPersona.ENTHUSIASTIC_FRESHMAN}>やる気のある1年生（感情豊か）</option>
          <option value={StudentPersona.CRITICAL_THINKER}>批判的思考を持つ学生（分析的）</option>
          <option value={StudentPersona.IWASHITA}>イワシタ（論理的リアリスト×ハイテンション）</option>
        </select>
      </div>

      {/* Text Settings Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
            <PenTool className="w-3 h-3" />
            Length
          </label>
          <select
            value={settings.length}
            onChange={(e) => handleInputChange('length', e.target.value)}
            className="w-full p-2 rounded border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
          >
            <option value="100〜200文字">100〜200文字</option>
            <option value="200〜300文字">200〜300文字</option>
            <option value="300〜400文字">300〜400文字</option>
            <option value="400〜600文字">400〜600文字</option>
            <option value="800文字以上">800文字以上</option>
            <option value="指定なし">指定なし</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
            <MessageSquare className="w-3 h-3" />
            Tone
          </label>
          <input
            type="text"
            value={settings.tone}
            onChange={(e) => handleInputChange('tone', e.target.value)}
            className="w-full p-2 rounded border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
            placeholder="例: です・ます"
          />
        </div>
      </div>

      {/* Notes Input */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
          Keywords / Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full p-2 rounded border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[80px] text-sm resize-y"
          placeholder="印象に残った言葉やキーワードを入力..."
        />
      </div>
    </div>
  );
};
import React from 'react';
import { Monitor, GraduationCap, Calendar, Edit3, CheckSquare, FileText } from 'lucide-react';

export const QuickNav: React.FC = () => {
  const items = [
    { icon: Monitor, label: "塾生サイト" },
    { icon: GraduationCap, label: "K-LMS" },
    { icon: Calendar, label: "休講・補講" },
    { icon: Edit3, label: "履修申告" },
    { icon: CheckSquare, label: "登録済科目" },
    { icon: FileText, label: "学業成績表" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition-shadow hover:border-blue-300 group h-28"
        >
          <item.icon className="w-8 h-8 text-slate-500 group-hover:text-[#00205b]" />
          <span className="text-xs font-bold text-slate-600 group-hover:text-[#00205b]">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
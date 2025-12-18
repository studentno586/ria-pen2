import React from 'react';
import { Home, FileText, ClipboardList, HelpCircle, Grid, ChevronRight } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: "ホーム", active: true },
    { icon: FileText, label: "申請", active: false },
    { icon: ClipboardList, label: "アンケート", active: false },
    { icon: HelpCircle, label: "FAQ・問い合わせ", active: false },
    { icon: Grid, label: "Apps", active: false },
  ];

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] shrink-0">
      <nav className="flex flex-col py-4">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`
              flex items-center justify-between px-6 py-4 text-sm font-medium border-l-4 transition-colors
              ${item.active 
                ? 'border-[#00205b] text-[#00205b] bg-[#f8f9fa]' 
                : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#00205b]'}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {item.label === "Apps" && <ChevronRight className="w-4 h-4 text-slate-400" />}
          </a>
        ))}
        
        <div className="mt-8 px-6">
           <p className="text-xs font-bold text-slate-400 mb-2 pl-2">ショートカット</p>
           <ul className="space-y-1">
             <li className="text-xs text-[#00205b] hover:underline cursor-pointer py-1 pl-2">• K-Supportの使い方</li>
             <li className="text-xs text-[#00205b] hover:underline cursor-pointer py-1 pl-2">• 履修案内</li>
             <li className="text-xs text-[#00205b] hover:underline cursor-pointer py-1 pl-2">• シラバス検索</li>
           </ul>
        </div>
      </nav>
    </aside>
  );
};
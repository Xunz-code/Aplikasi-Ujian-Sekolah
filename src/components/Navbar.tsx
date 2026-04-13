import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, User } from 'lucide-react';
import { Input } from './ui/Input';

export function Navbar() {
  const { profile } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search anything..." 
            className="pl-10 bg-slate-50 border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{profile?.full_name}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{profile?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary border border-primary/10">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChangeDcModal } from './ChangeDcModal';
import { 
  Building2, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Sparkles,
  LayoutDashboard,
  Receipt,
  ArrowRightLeft,
  Edit3
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'user' | 'admin';
  setActiveTab: (tab: 'user' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, isAuthenticated, isAdmin, logout, setShowAuthModal, switchRole } = useAuth();
  const [isChangeDcModalOpen, setIsChangeDcModalOpen] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & DC Location Badge */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-950/50">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg tracking-tight text-slate-10 text-nowrap">DC Express</h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Deposit Portal
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono font-bold text-slate-200">{currentUser?.dcCode || 'DC-GAU-01'}</span>
                <span>• {currentUser?.dcName || 'Guwahati Hub'}</span>
                <button
                  onClick={() => setIsChangeDcModalOpen(true)}
                  className="ml-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded text-[10px] font-bold border border-slate-700/80 transition-colors flex items-center gap-1"
                  title="Change DC Code"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Edit DC</span>
                </button>
              </div>
            </div>
          </div>

          {/* Center: Navigation Tabs for Admin or Mode Switcher */}
          <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('user')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'user'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>DC Deposit Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
              {isAdmin ? (
                <span className="ml-1 text-[10px] uppercase font-bold bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                  Access Granted
                </span>
              ) : (
                <span className="ml-1 text-[10px] uppercase font-bold bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                  Restricted
                </span>
              )}
            </button>
          </div>

          {/* Right: Auth Profile & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Testing Role Switcher Toggle */}
            <div className="hidden lg:flex items-center space-x-1.5 bg-slate-800 text-xs px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-slate-400">Testing Mode:</span>
              <button
                onClick={() => switchRole(isAdmin ? 'DC_USER' : 'ADMIN')}
                className="flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                title="Switch between Admin and DC User role"
              >
                <ArrowRightLeft className="w-3 h-3" />
                {isAdmin ? 'As Admin' : 'As DC User'}
              </button>
            </div>

            {isAuthenticated && currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-right">
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-slate-100 flex items-center justify-end gap-1">
                      {currentUser.name}
                      {isAdmin && (
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 inline" title="Admin User" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                      {currentUser.email}
                    </div>
                  </div>
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full ring-2 ring-emerald-500/40 object-cover bg-slate-800"
                  />
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium shadow-md transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Google Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center space-x-1 w-full">
            <button
              onClick={() => setActiveTab('user')}
              className={`flex-1 py-1.5 text-center rounded-md font-medium transition-colors ${
                activeTab === 'user' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              DC Deposit Portal
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-1.5 text-center rounded-md font-medium transition-colors ${
                activeTab === 'admin' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Admin Dashboard {isAdmin ? '✓' : '🔒'}
            </button>
          </div>
        </div>

      </div>

      <ChangeDcModal
        isOpen={isChangeDcModalOpen}
        onClose={() => setIsChangeDcModalOpen(false)}
      />
    </header>
  );
};

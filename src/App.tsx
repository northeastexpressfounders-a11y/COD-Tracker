import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DepositProvider } from './context/DepositContext';
import { Header } from './components/Header';
import { UserDepositPortal } from './components/UserDepositPortal';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { DenominationModal } from './components/DenominationModal';
import { ScreenshotModal } from './components/ScreenshotModal';

function MainAppContent() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Header Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'user' ? (
          <UserDepositPortal />
        ) : (
          <AdminPortal />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-400">DC Express Logistics Last-Mile Deposit Portal</span>
            <span>• System Operational</span>
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            <span>Powered by Google AI Studio • Admin Access Restricted</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal />
      <DenominationModal />
      <ScreenshotModal />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DepositProvider>
        <MainAppContent />
      </DepositProvider>
    </AuthProvider>
  );
}

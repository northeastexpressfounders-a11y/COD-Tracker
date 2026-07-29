import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_ADMIN_EMAIL, INITIAL_USERS } from '../data/mockData';
import { X, ShieldCheck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, loginWithGoogle, currentUser } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'AUTO' | 'ADMIN' | 'DC_USER'>('AUTO');

  if (!showAuthModal) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const roleToForce = selectedRole === 'AUTO' ? undefined : selectedRole;
    loginWithGoogle(customEmail, customName || undefined, roleToForce);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Top Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Google Sign-In</h3>
              <p className="text-xs text-slate-400">Authenticate for Distribution Center Portal</p>
            </div>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Quick Select Accounts (Google Authenticated Shortcuts) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Account to Continue
            </label>
            <div className="space-y-2">
              
              {/* Founder Admin Account */}
              <button
                onClick={() => loginWithGoogle(DEFAULT_ADMIN_EMAIL, 'Northeast Express Founder', 'ADMIN')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500/60 transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                    alt="Admin"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/40"
                  />
                  <div>
                    <div className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                      <span>Northeast Express Founder</span>
                      <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">{DEFAULT_ADMIN_EMAIL}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Standard DC User Account */}
              <button
                onClick={() => loginWithGoogle('rajesh.dc@expresslogistics.in', 'Rajesh Sharma (DC Agent)', 'DC_USER')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                    alt="DC User"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div>
                    <div className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                      <span>Rajesh Sharma</span>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                        DC Agent
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">rajesh.dc@expresslogistics.in</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>

            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-xs text-slate-500 uppercase font-semibold">
              or enter custom google email
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Custom Google Email Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Google Account Email
              </label>
              <input
                type="email"
                required
                placeholder="your.email@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Suman Sengupta"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Role Assignment Mode
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="AUTO">Auto-detect (Admins based on email)</option>
                <option value="ADMIN">Force Admin Privileges</option>
                <option value="DC_USER">Force Standard DC User Privileges</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2 transition-all"
            >
              {/* Google G icon */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.58 2.765-2.86 4.81-6.887 4.81-4.22 0-7.64-3.42-7.64-7.64s3.42-7.64 7.64-7.64c2.09 0 3.86.76 5.21 2.02l2.36-2.36C18.15 1.13 15.42 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c7.06 0 12.24-4.97 12.24-12.24 0-.82-.08-1.61-.2-2.355H12.24z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>

        </div>

        {/* Modal Footer Note */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            The Admin Portal is restricted to recognized admin accounts (<strong className="text-slate-300 font-mono">{DEFAULT_ADMIN_EMAIL}</strong>).
          </span>
        </div>

      </div>
    </div>
  );
};

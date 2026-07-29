import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, X, Check } from 'lucide-react';

interface ChangeDcModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeDcModal: React.FC<ChangeDcModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateDcCode } = useAuth();

  const [dcCodeInput, setDcCodeInput] = useState<string>('');
  const [dcNameInput, setDcNameInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setDcCodeInput(currentUser?.dcCode || 'DC-GAU-01');
      setDcNameInput(currentUser?.dcName || 'Guwahati Central Hub');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dcCodeInput.trim()) {
      alert('Please enter a valid DC Code.');
      return;
    }

    if (!dcNameInput.trim()) {
      alert('Please enter a valid DC Name.');
      return;
    }

    updateDcCode(dcCodeInput.trim(), dcNameInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Building2 className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-100">Edit Distribution Center (DC)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Distribution Center Code <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DC-GAU-01"
              value={dcCodeInput}
              onChange={(e) => setDcCodeInput(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              DC / Hub Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Guwahati Central Hub"
              value={dcNameInput}
              onChange={(e) => setDcNameInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save DC Details</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useDeposits } from '../context/DepositContext';
import { Rider } from '../types';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  X, 
  Search, 
  Check, 
  Phone, 
  MapPin, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

interface ManageRidersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRider?: (rider: Rider) => void;
}

export const ManageRidersModal: React.FC<ManageRidersModalProps> = ({
  isOpen,
  onClose,
  onSelectRider,
}) => {
  const { riders, addRider, deleteRider } = useDeposits();

  const [activeTab, setActiveTab] = useState<'LIST' | 'ADD'>('LIST');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Form State
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newRoute, setNewRoute] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Confirm Delete State
  const [deletingRider, setDeletingRider] = useState<Rider | null>(null);

  if (!isOpen) return null;

  const filteredRiders = riders.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.routeNo.toLowerCase().includes(q) ||
      (r.phone && r.phone.toLowerCase().includes(q))
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Please enter Rider Full Name.');
      return;
    }

    const created = addRider({
      name: newName,
      id: newId.trim() || undefined,
      routeNo: newRoute.trim() || 'General Route',
      phone: newPhone.trim() || undefined,
    });

    // Reset Form
    setNewName('');
    setNewId('');
    setNewRoute('');
    setNewPhone('');

    if (onSelectRider) {
      onSelectRider(created);
    }

    setActiveTab('LIST');
  };

  const handleConfirmDelete = () => {
    if (deletingRider) {
      deleteRider(deletingRider.id);
      setDeletingRider(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-100 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Users className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-100">Delivery Riders Register</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('LIST')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'LIST'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registered Riders ({riders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ADD')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ADD'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700/80 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Register New Rider</span>
          </button>
        </div>

        {/* TAB 1: Registered Riders List */}
        {activeTab === 'LIST' && (
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search riders by name, ID, route, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Riders Scrollable List */}
            {filteredRiders.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredRiders.map((rider) => (
                  <div
                    key={rider.id}
                    className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 text-xs transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-sm">{rider.name}</span>
                        <span className="font-mono text-[11px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.2 rounded border border-emerald-500/30">
                          {rider.id}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {rider.routeNo}
                        </span>
                        {rider.phone && (
                          <span className="flex items-center gap-1 font-mono text-slate-300">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {rider.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {onSelectRider && (
                        <button
                          onClick={() => {
                            onSelectRider(rider);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Select</span>
                        </button>
                      )}

                      <button
                        onClick={() => setDeletingRider(rider)}
                        className="p-1.5 bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/50 rounded-lg transition-colors"
                        title={`Remove ${rider.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No riders found matching your search.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Register New Rider Form */}
        {activeTab === 'ADD' && (
          <form onSubmit={handleAddSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Rider Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Sharma"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Rider ID / Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. RDR-501"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Assigned Route / Area
              </label>
              <input
                type="text"
                placeholder="e.g. Route 15 - Chandmari Hub"
                value={newRoute}
                onChange={(e) => setNewRoute(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('LIST')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Back to List
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Save & Register</span>
              </button>
            </div>
          </form>
        )}

        {/* Confirm Delete Rider Modal Overlay */}
        {deletingRider && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-sm p-5 shadow-2xl text-slate-100 space-y-3">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>Remove Rider Confirmation</span>
              </div>

              <p className="text-xs text-slate-300">
                Are you sure you want to remove <strong className="text-white">{deletingRider.name}</strong> ({deletingRider.id}) from the DC rider register?
              </p>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDeletingRider(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Rider</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

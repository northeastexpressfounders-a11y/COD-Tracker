import React, { useState } from 'react';
import { useDeposits } from '../context/DepositContext';
import { useAuth } from '../context/AuthContext';
import { ChangeDcModal } from './ChangeDcModal';
import { ManageRidersModal } from './ManageRidersModal';
import { DenominationBreakdown, PaymentMethodApp, Rider } from '../types';
import { 
  Banknote, 
  Smartphone, 
  Upload, 
  X, 
  CheckCircle2, 
  Calculator, 
  Calendar, 
  User as UserIcon, 
  UserPlus,
  Users,
  Trash2,
  History, 
  Eye, 
  Image as ImageIcon,
  Plus,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Search,
  Check,
  Phone,
  MapPin,
  Clock,
  Edit3,
  Building2
} from 'lucide-react';

const DENOMINATIONS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

export const UserDepositPortal: React.FC = () => {
  const { 
    riders, 
    addRider, 
    deleteRider,
    addDeposit, 
    deposits, 
    updateDepositStatus,
    setSelectedDepositForDenominations, 
    setSelectedDepositForScreenshot 
  } = useDeposits();
  const { currentUser, isAdmin } = useAuth();

  const getTodayIso = () => new Date().toISOString().split('T')[0];

  // Rider selection state
  const [selectedRiderId, setSelectedRiderId] = useState<string>('');
  const [riderName, setRiderName] = useState('');
  const [riderId, setRiderId] = useState('');
  const [routeNo, setRouteNo] = useState('');
  const [depositDate, setDepositDate] = useState(getTodayIso());

  // Add / Manage Rider Modals State
  const [isAddRiderModalOpen, setIsAddRiderModalOpen] = useState(false);
  const [isManageRidersModalOpen, setIsManageRidersModalOpen] = useState(false);
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderId, setNewRiderId] = useState('');
  const [newRiderRoute, setNewRiderRoute] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');

  // Change DC Modal State
  const [isChangeDcModalOpen, setIsChangeDcModalOpen] = useState(false);

  // Form Compactness & Layout State
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [viewLayout, setViewLayout] = useState<'STACKED' | 'SPLIT'>('STACKED');
  
  // Denominations State
  const [denominations, setDenominations] = useState<DenominationBreakdown>({
    2000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0,
  });

  // Online Amount State
  const [onlineAmountInput, setOnlineAmountInput] = useState('');
  const [onlineApp, setOnlineApp] = useState<PaymentMethodApp>('GPay');
  const [onlineTxId, setOnlineTxId] = useState('');
  
  // Screenshot Upload State
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Notes & Success Toast
  const [notes, setNotes] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  // History Filter State
  const [historyDateFilter, setHistoryDateFilter] = useState<'TODAY' | 'YESTERDAY' | 'WEEK' | 'ALL'>('TODAY');
  const [historySearchQuery, setHistorySearchQuery] = useState('');

  // Calculate Subtotals
  const totalCash = Object.entries(denominations).reduce((sum: number, [denom, count]) => {
    return sum + Number(denom) * (Number(count) || 0);
  }, 0);

  const totalNotesCount = Object.values(denominations).reduce((sum: number, count: number) => sum + (Number(count) || 0), 0);

  const onlineAmount = parseFloat(onlineAmountInput) || 0;
  const grandTotal = totalCash + onlineAmount;

  // Handle Denomination change
  const handleDenomChange = (denom: number, value: string) => {
    const qty = Math.max(0, parseInt(value, 10) || 0);
    setDenominations((prev) => ({
      ...prev,
      [denom]: qty,
    }));
  };

  const handleQuickAddDenom = (denom: number, addQty: number) => {
    setDenominations((prev) => ({
      ...prev,
      [denom]: (prev[denom] || 0) + addQty,
    }));
  };

  // Handle Rider Selection Dropdown Change
  const handleRiderSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__ADD_NEW__') {
      setIsAddRiderModalOpen(true);
      return;
    }
    if (val === '__MANAGE__') {
      setIsManageRidersModalOpen(true);
      return;
    }
    
    setSelectedRiderId(val);
    const found = riders.find((r) => r.id === val);
    if (found) {
      setRiderName(found.name);
      setRiderId(found.id);
      setRouteNo(found.routeNo);
    } else {
      setRiderName('');
      setRiderId('');
      setRouteNo('');
    }
  };

  // Handle Adding a New Rider
  const handleSaveNewRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiderName.trim()) {
      alert('Please enter Rider Full Name.');
      return;
    }

    const created = addRider({
      name: newRiderName,
      id: newRiderId.trim() || undefined,
      routeNo: newRiderRoute.trim() || 'General Route',
      phone: newRiderPhone.trim() || undefined,
    });

    // Auto select the created rider
    setSelectedRiderId(created.id);
    setRiderName(created.name);
    setRiderId(created.id);
    setRouteNo(created.routeNo);

    // Reset and close modal
    setNewRiderName('');
    setNewRiderId('');
    setNewRiderRoute('');
    setNewRiderPhone('');
    setIsAddRiderModalOpen(false);
  };

  // File Upload Handlers
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshotDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const clearForm = () => {
    setSelectedRiderId('');
    setRiderName('');
    setRiderId('');
    setRouteNo('');
    setDepositDate(getTodayIso());
    setDenominations({
      2000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0,
    });
    setOnlineAmountInput('');
    setOnlineTxId('');
    setScreenshotDataUrl('');
    setScreenshotName('');
    setNotes('');
  };

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!riderName.trim()) {
      alert('Please select or add a Delivery Rider.');
      return;
    }

    if (grandTotal <= 0) {
      alert('Please enter cash denominations or online payment amount (total must be greater than 0).');
      return;
    }

    if (onlineAmount > 0 && !screenshotDataUrl) {
      const confirmNoScreenshot = window.confirm(
        'You specified an online payment amount without attaching a screenshot proof. Submit anyway?'
      );
      if (!confirmNoScreenshot) return;
    }

    const createdRecord = addDeposit({
      dcCode: currentUser?.dcCode || 'DC-GAU-01',
      dcName: currentUser?.dcName || 'Guwahati Central Hub',
      riderId: riderId.trim() || `RDR-${Math.floor(100 + Math.random() * 900)}`,
      riderName: riderName.trim(),
      routeNo: routeNo.trim() || 'General Route',
      depositDate: depositDate,
      denominations: denominations,
      totalCash: totalCash,
      onlineAmount: onlineAmount,
      totalAmount: grandTotal,
      onlinePaymentApp: onlineAmount > 0 ? onlineApp : undefined,
      onlineTransactionId: onlineTxId.trim() || undefined,
      screenshotUrl: screenshotDataUrl || undefined,
      screenshotName: screenshotName || undefined,
      submittedByEmail: currentUser?.email || 'dc.agent@express.in',
      submittedByName: currentUser?.name || 'DC Agent',
      notes: notes.trim() || undefined,
    });

    setSubmittedSuccess(`Deposit Slip ${createdRecord.id} logged successfully!`);
    clearForm();

    setTimeout(() => {
      setSubmittedSuccess(null);
    }, 6000);
  };

  // Filter history deposits
  const todayIso = getTodayIso();
  const yesterdayIso = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const userHistoryDeposits = deposits.filter((d) => {
    if (historySearchQuery.trim()) {
      const q = historySearchQuery.toLowerCase();
      const match =
        d.riderName.toLowerCase().includes(q) ||
        d.riderId.toLowerCase().includes(q) ||
        d.routeNo.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (historyDateFilter === 'TODAY') return d.depositDate === todayIso;
    if (historyDateFilter === 'YESTERDAY') return d.depositDate === yesterdayIso;
    if (historyDateFilter === 'WEEK') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      return d.depositDate >= sevenDaysAgo;
    }
    return true; // ALL
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top DC Counter Portal Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                DC Counter Deposit Portal
              </span>
              <button
                type="button"
                onClick={() => setIsChangeDcModalOpen(true)}
                className="text-xs text-slate-300 hover:text-emerald-400 font-mono font-semibold flex items-center gap-1 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 transition-colors"
                title="Click to Change DC Code"
              >
                <Building2 className="w-3 h-3 text-emerald-400" />
                <span>DC: {currentUser?.dcCode || 'DC-GAU-01'}</span>
                <Edit3 className="w-3 h-3 text-emerald-400 ml-0.5" />
              </button>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1 tracking-tight">
              Distribution Center Cash & Online Deposit Counter
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 max-w-2xl">
              Log rider cash collections by denomination, attach UPI receipt screenshots, and verify incoming deposits instantly.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Split View vs Stacked Layout Toggle */}
            <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewLayout('STACKED')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewLayout === 'STACKED' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stacked
              </button>
              <button
                onClick={() => setViewLayout('SPLIT')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewLayout === 'SPLIT' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Split View (Entry + Verification)
              </button>
            </div>

            {/* Quick Manage & Add Rider Actions */}
            <button
              onClick={() => setIsManageRidersModalOpen(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Manage / Remove Riders</span>
            </button>

            <button
              onClick={() => setIsAddRiderModalOpen(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add New Rider</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {submittedSuccess && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between shadow-xl animate-in slide-in-from-top-2 duration-300 text-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-emerald-100">{submittedSuccess}</span>
              <span className="ml-2 text-emerald-300">Ready for instant verification.</span>
            </div>
          </div>
          <button
            onClick={() => setSubmittedSuccess(null)}
            className="p-1 hover:bg-emerald-900/60 rounded-lg text-emerald-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Layout wrapper: Split View or Stacked View */}
      <div className={`grid gap-6 ${viewLayout === 'SPLIT' ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>
        
        {/* LEFT COLUMN: Compact Deposit Entry Area */}
        <div className={`${viewLayout === 'SPLIT' ? 'lg:col-span-5' : 'w-full'}`}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
            
            {/* Deposit Area Header & Collapse Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">Compact Deposit Entry</h3>
                  <p className="text-[11px] text-slate-400">Log rider cash & online money</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormCollapsed(!isFormCollapsed)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  title={isFormCollapsed ? 'Expand Deposit Area' : 'Minimize Deposit Area to view verification list'}
                >
                  {isFormCollapsed ? (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Expand Form</span>
                    </>
                  ) : (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Minimize</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Minimized View Bar */}
            {isFormCollapsed ? (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Active Entry</span>
                  <span className="font-bold text-slate-200">
                    {riderName ? `${riderName} (${riderId || 'N/A'})` : 'No Rider Selected'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">Grand Total</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ) : (
              /* Expanded Form Content */
              <form onSubmit={handleSubmitDeposit} className="space-y-4">
                
                {/* 1. Rider Selection + Add / Remove Rider option */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Select Delivery Rider</span>
                      <span className="text-rose-400">*</span>
                    </label>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsManageRidersModalOpen(true)}
                        className="text-[11px] text-slate-400 hover:text-emerald-400 hover:underline font-medium flex items-center gap-0.5"
                      >
                        <Users className="w-3 h-3 text-emerald-400" />
                        Manage / Remove
                      </button>
                      <span className="text-slate-600">•</span>
                      <button
                        type="button"
                        onClick={() => setIsAddRiderModalOpen(true)}
                        className="text-[11px] text-emerald-400 hover:underline font-semibold flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRiderId}
                      onChange={handleRiderSelectChange}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="">-- Choose Rider from Register --</option>
                      {riders.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.id}) - {r.routeNo}
                        </option>
                      ))}
                      <option value="__ADD_NEW__" className="font-bold text-emerald-400">
                        + Add New Rider...
                      </option>
                      <option value="__MANAGE__" className="font-bold text-rose-400">
                        ⚙ Manage / Remove Riders...
                      </option>
                    </select>

                    {selectedRiderId && (
                      <button
                        type="button"
                        onClick={() => {
                          const found = riders.find((r) => r.id === selectedRiderId);
                          if (found) {
                            if (window.confirm(`Are you sure you want to remove rider "${found.name}" (${found.id})?`)) {
                              deleteRider(found.id);
                              setSelectedRiderId('');
                              setRiderName('');
                              setRiderId('');
                              setRouteNo('');
                            }
                          }
                        }}
                        className="p-2 bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded-xl transition-colors flex-shrink-0"
                        title="Remove Selected Rider"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Manual / Custom Rider Inputs fallback if needed */}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <input
                        type="text"
                        placeholder="Rider Name"
                        required
                        value={riderName}
                        onChange={(e) => setRiderName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Rider ID"
                        value={riderId}
                        onChange={(e) => setRiderId(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        required
                        value={depositDate}
                        onChange={(e) => setDepositDate(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Compact Denominations Matrix */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cash Denominations</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setDenominations({ 2000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 })}
                      className="text-[10px] text-slate-400 hover:text-rose-400 underline flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Clear
                    </button>
                  </div>

                  {/* Compact Grid of Denominations */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {DENOMINATIONS.map((denom) => {
                      const qty = denominations[denom] || 0;
                      const subtotal = qty * denom;

                      return (
                        <div
                          key={denom}
                          className={`p-2 rounded-lg border transition-all ${
                            qty > 0
                              ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-emerald-400">₹{denom}</span>
                            <span className="font-mono text-[10px] text-slate-400">₹{subtotal}</span>
                          </div>

                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={qty === 0 ? '' : qty}
                            onChange={(e) => handleDenomChange(denom, e.target.value)}
                            className="w-full px-1.5 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-center text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Cash Subtotal Strip */}
                  <div className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Notes: <strong className="text-slate-200">{totalNotesCount}</strong></span>
                    <div>
                      <span className="text-slate-400 text-[11px] mr-1">Cash Subtotal:</span>
                      <span className="font-mono font-bold text-emerald-400">₹{totalCash.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Compact Online Payment & Proof */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
                  <span className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Online Payment & Proof</span>
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-0.5">Online Amount (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0.00"
                        value={onlineAmountInput}
                        onChange={(e) => setOnlineAmountInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-0.5">App / Gateway</label>
                      <select
                        value={onlineApp}
                        onChange={(e) => setOnlineApp(e.target.value as PaymentMethodApp)}
                        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="GPay">GPay</option>
                        <option value="PhonePe">PhonePe</option>
                        <option value="Paytm">Paytm</option>
                        <option value="UPI QR">UPI QR</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="POS Card">POS Card</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-0.5">UPI Ref No</label>
                      <input
                        type="text"
                        placeholder="e.g. GPI9920184"
                        value={onlineTxId}
                        onChange={(e) => setOnlineTxId(e.target.value)}
                        className="w-full px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Screenshot Upload Dropzone Button */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-0.5">Proof Screenshot</label>
                      {screenshotDataUrl ? (
                        <div className="flex items-center justify-between bg-slate-900 px-2 py-1 border border-cyan-500/50 rounded-lg text-[11px]">
                          <span className="truncate max-w-[90px] text-cyan-300 font-mono">{screenshotName || 'Proof'}</span>
                          <button
                            type="button"
                            onClick={() => { setScreenshotDataUrl(''); setScreenshotName(''); }}
                            className="p-0.5 text-rose-400 hover:text-rose-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-2 py-1.5 rounded-lg text-[11px] text-cyan-400 font-medium cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Attach Screenshot</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grand Total Summary & Submit Action */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">Grand Total</span>
                    <span className="text-xl font-extrabold font-mono text-emerald-300">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={clearForm}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Submit Slip</span>
                    </button>
                  </div>
                </div>

              </form>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Deposit Verification & History Log */}
        <div className={`${viewLayout === 'SPLIT' ? 'lg:col-span-7' : 'w-full'}`}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">Deposit Verification & Audit History</h3>
                  <p className="text-[11px] text-slate-400">Review and verify submitted deposits</p>
                </div>
              </div>

              {/* Date Filters */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setHistoryDateFilter('TODAY')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    historyDateFilter === 'TODAY' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setHistoryDateFilter('YESTERDAY')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    historyDateFilter === 'YESTERDAY' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Yesterday
                </button>
                <button
                  onClick={() => setHistoryDateFilter('WEEK')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    historyDateFilter === 'WEEK' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setHistoryDateFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    historyDateFilter === 'ALL' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Search Input for history */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search history by rider name, ID, or route..."
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Deposits List */}
            {userHistoryDeposits.length > 0 ? (
              <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                {userHistoryDeposits.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-100 text-xs">{item.riderName}</span>
                          <span className="text-[11px] font-mono text-slate-400">({item.riderId})</span>
                          
                          {/* Status Badge */}
                          {item.status === 'VERIFIED' && (
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                            </span>
                          )}
                          {item.status === 'PENDING' && (
                            <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.2 rounded-full flex items-center gap-0.5">
                              <Clock className="w-3 h-3 text-amber-300" /> Pending Audit
                            </span>
                          )}
                          {item.status === 'DISCREPANCY' && (
                            <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.2 rounded-full flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3 text-rose-400" /> Discrepancy
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Date: <strong className="text-slate-300">{item.depositDate}</strong> • Route: {item.routeNo} • Ref: <span className="font-mono text-slate-300">{item.id}</span>
                        </div>
                      </div>

                      {/* Total Amount Badge */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-extrabold font-mono text-slate-100">
                          ₹{item.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          C: ₹{item.totalCash} | O: ₹{item.onlineAmount}
                        </div>
                      </div>
                    </div>

                    {/* Action Bar & Quick Verification Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setSelectedDepositForDenominations(item)}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors"
                          title="View Cash Denominations Slip"
                        >
                          <Banknote className="w-3.5 h-3.5" />
                          <span>Denominations</span>
                        </button>

                        {item.screenshotUrl && (
                          <button
                            onClick={() => setSelectedDepositForScreenshot(item)}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors"
                            title="View Payment Screenshot Proof"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Proof</span>
                          </button>
                        )}
                      </div>

                      {/* Staff Quick Verify Action Button */}
                      <div className="flex items-center space-x-1.5">
                        {item.status === 'PENDING' && (
                          <button
                            onClick={() => updateDepositStatus(item.id, 'VERIFIED', undefined, currentUser?.email)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                            title="Verify Cash and Online Deposit"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify Slip</span>
                          </button>
                        )}
                        {item.status === 'VERIFIED' && (
                          <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                            ✓ Verified by Staff
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No deposit records found for the selected date or search filter.
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Add New Rider Modal */}
      {isAddRiderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-100">Add New Delivery Rider</h3>
              </div>
              <button
                onClick={() => setIsAddRiderModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewRider} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Rider Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={newRiderName}
                  onChange={(e) => setNewRiderName(e.target.value)}
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
                    value={newRiderId}
                    onChange={(e) => setNewRiderId(e.target.value)}
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
                    value={newRiderPhone}
                    onChange={(e) => setNewRiderPhone(e.target.value)}
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
                  value={newRiderRoute}
                  onChange={(e) => setNewRiderRoute(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRiderModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Rider</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change DC Modal */}
      <ChangeDcModal
        isOpen={isChangeDcModalOpen}
        onClose={() => setIsChangeDcModalOpen(false)}
      />

      {/* Manage / Remove Riders Modal */}
      <ManageRidersModal
        isOpen={isManageRidersModalOpen}
        onClose={() => setIsManageRidersModalOpen(false)}
        onSelectRider={(rider) => {
          setSelectedRiderId(rider.id);
          setRiderName(rider.name);
          setRiderId(rider.id);
          setRouteNo(rider.routeNo);
        }}
      />

    </div>
  );
};

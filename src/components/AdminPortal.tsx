import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDeposits } from '../context/DepositContext';
import { DepositRecord, DepositStatus } from '../types';
import { ExportModal } from './ExportModal';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  Banknote, 
  Smartphone, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Download, 
  Trash2, 
  RefreshCcw, 
  Eye, 
  Layers, 
  Users, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { isAdmin, currentUser, setShowAuthModal, switchRole } = useAuth();
  const { 
    deposits, 
    filteredDeposits, 
    filterOptions, 
    setFilterOptions, 
    resetFilters, 
    stats, 
    updateDepositStatus, 
    deleteDeposit,
    setSelectedDepositForDenominations,
    setSelectedDepositForScreenshot
  } = useDeposits();

  // Audit Discrepancy Note Modal State
  const [discrepancyModalRecord, setDiscrepancyModalRecord] = useState<DepositRecord | null>(null);
  const [auditNoteInput, setAuditNoteInput] = useState('');

  // Export Modal State
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Table vs Rider Summary View Toggle
  const [viewMode, setViewMode] = useState<'TABLE' | 'RIDER_SUMMARY'>('TABLE');

  const getTodayIso = () => new Date().toISOString().split('T')[0];
  const getPastDateIso = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  // If user is not admin, show restricted access banner
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">Admin Portal Access Restricted</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
            You are currently logged in as <strong className="text-slate-200">{currentUser?.email || 'a standard user'}</strong>. Only authorized DC Admin accounts have access to verify deposits, audit cash slips, and export collection reports.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 max-w-md mx-auto text-left space-y-2">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authorized Admin Email</span>
          </div>
          <p className="font-mono text-emerald-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
            northeastexpressfounders@gmail.com
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => switchRole('ADMIN')}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm shadow-lg transition-all"
          >
            Switch to Admin Role (Test Mode)
          </button>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-sm border border-slate-700 transition-colors"
          >
            Sign in with Admin Google Account
          </button>
        </div>
      </div>
    );
  }

  // Handle Discrepancy Submission
  const handleConfirmDiscrepancy = () => {
    if (!discrepancyModalRecord) return;
    updateDepositStatus(
      discrepancyModalRecord.id,
      'DISCREPANCY',
      auditNoteInput.trim() || 'Flagged discrepancy during cash count audit.',
      currentUser?.email
    );
    setDiscrepancyModalRecord(null);
    setAuditNoteInput('');
  };

  interface RiderAggregate {
    riderId: string;
    riderName: string;
    routeNo: string;
    count: number;
    totalCash: number;
    totalOnline: number;
    grandTotal: number;
    lastDepositDate: string;
  }

  // Group deposits by Rider for the Summary View
  const riderAggregates = filteredDeposits.reduce<Record<string, RiderAggregate>>((acc, curr) => {
    const key = curr.riderId;
    if (!acc[key]) {
      acc[key] = {
        riderId: curr.riderId,
        riderName: curr.riderName,
        routeNo: curr.routeNo,
        count: 0,
        totalCash: 0,
        totalOnline: 0,
        grandTotal: 0,
        lastDepositDate: curr.depositDate,
      };
    }
    acc[key].count += 1;
    acc[key].totalCash += curr.totalCash;
    acc[key].totalOnline += curr.onlineAmount;
    acc[key].grandTotal += curr.totalAmount;
    if (curr.depositDate > acc[key].lastDepositDate) {
      acc[key].lastDepositDate = curr.depositDate;
    }
    return acc;
  }, {});

  const riderList: RiderAggregate[] = Object.values(riderAggregates);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Admin Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Distribution Center Admin Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">Hub: {currentUser?.dcName || 'Guwahati Hub'}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
              Deposit Verification & Cash Reconciliation Hub
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Inspect date-wise rider collections, verify physical cash denomination slips, audit online payment screenshots, and export daily bank deposit sheets.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-950/40 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV / Print Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Today Grand Total */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Today Collection</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-100 font-mono">
              ₹{stats.todayTotalGrand.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats.todayCount} deposit slips submitted today
            </div>
          </div>
        </div>

        {/* Today Cash Total */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Today Cash</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              ₹{stats.todayTotalCash.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Physical vault count
            </div>
          </div>
        </div>

        {/* Today Online Total */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Today Online</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">
              ₹{stats.todayTotalOnline.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              GPay / PhonePe / QR receipts
            </div>
          </div>
        </div>

        {/* Pending Audits */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Pending Audits</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-300 font-mono">
              {stats.pendingCount}
            </div>
            <div className="text-[11px] text-amber-400/80 mt-1">
              Awaiting manager verification
            </div>
          </div>
        </div>

        {/* Verified Count */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Verified Slips</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              {stats.verifiedCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Reconciled & approved
            </div>
          </div>
        </div>

      </div>

      {/* Date-wise Filters & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Rider Name, Rider ID, Route, Deposit ID, or Tx Reference..."
              value={filterOptions.searchQuery}
              onChange={(e) => setFilterOptions({ ...filterOptions, searchQuery: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Date Presets */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterOptions({ ...filterOptions, startDate: getTodayIso(), endDate: getTodayIso() })}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterOptions.startDate === getTodayIso() && filterOptions.endDate === getTodayIso()
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>

            <button
              onClick={() =>
                setFilterOptions({
                  ...filterOptions,
                  startDate: getPastDateIso(1),
                  endDate: getPastDateIso(1),
                })
              }
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterOptions.startDate === getPastDateIso(1) && filterOptions.endDate === getPastDateIso(1)
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yesterday
            </button>

            <button
              onClick={() =>
                setFilterOptions({
                  ...filterOptions,
                  startDate: getPastDateIso(7),
                  endDate: getTodayIso(),
                })
              }
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterOptions.startDate === getPastDateIso(7)
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 7 Days
            </button>

            <button
              onClick={() => setFilterOptions({ ...filterOptions, startDate: '', endDate: '' })}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                !filterOptions.startDate && !filterOptions.endDate
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Dates
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === 'TABLE' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Deposit Slips Table</span>
            </button>
            <button
              onClick={() => setViewMode('RIDER_SUMMARY')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === 'RIDER_SUMMARY' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Rider Totals</span>
            </button>
          </div>

        </div>

        {/* Detailed Date & Status Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filterOptions.startDate}
              onChange={(e) => setFilterOptions({ ...filterOptions, startDate: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filterOptions.endDate}
              onChange={(e) => setFilterOptions({ ...filterOptions, endDate: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Verification Status
            </label>
            <select
              value={filterOptions.statusFilter}
              onChange={(e) => setFilterOptions({ ...filterOptions, statusFilter: e.target.value as any })}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Audit Only</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="DISCREPANCY">Discrepancy Only</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

        </div>

      </div>

      {/* Main View: Deposit Slips Table */}
      {viewMode === 'TABLE' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          
          <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing <strong className="text-slate-200">{filteredDeposits.length}</strong> of {deposits.length} total deposit records
            </div>
            <div className="text-slate-400 font-mono">
              Total Filtered: <strong className="text-emerald-400">₹{filteredDeposits.reduce((acc, c) => acc + c.totalAmount, 0).toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-3.5">Deposit ID / Date</th>
                  <th className="p-3.5">Rider & Route</th>
                  <th className="p-3.5 text-right">Cash Amount</th>
                  <th className="p-3.5 text-right">Online Amount</th>
                  <th className="p-3.5 text-center">Screenshot Proof</th>
                  <th className="p-3.5 text-right">Grand Total</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredDeposits.length > 0 ? (
                  filteredDeposits.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      {/* Deposit ID & Date */}
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-200">{item.id}</div>
                        <div className="text-[11px] text-slate-400">{item.depositDate}</div>
                      </td>

                      {/* Rider & Route */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-100">{item.riderName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ID: {item.riderId} • {item.routeNo}
                        </div>
                      </td>

                      {/* Cash Amount */}
                      <td className="p-3.5 text-right">
                        <div className="font-mono font-bold text-emerald-400">
                          ₹{item.totalCash.toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={() => setSelectedDepositForDenominations(item)}
                          className="mt-1 text-[10px] text-emerald-400 hover:underline inline-flex items-center gap-0.5"
                        >
                          <Banknote className="w-3 h-3" />
                          View Slip
                        </button>
                      </td>

                      {/* Online Amount */}
                      <td className="p-3.5 text-right">
                        <div className="font-mono font-bold text-cyan-400">
                          ₹{item.onlineAmount.toLocaleString('en-IN')}
                        </div>
                        {item.onlinePaymentApp && (
                          <div className="text-[10px] text-slate-400">
                            {item.onlinePaymentApp} {item.onlineTransactionId && `• ${item.onlineTransactionId.slice(-6)}`}
                          </div>
                        )}
                      </td>

                      {/* Screenshot Proof Thumbnail */}
                      <td className="p-3.5 text-center">
                        {item.screenshotUrl ? (
                          <button
                            onClick={() => setSelectedDepositForScreenshot(item)}
                            className="relative group inline-block rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-400 transition-all"
                            title="Click to view payment screenshot"
                          >
                            <img
                              src={item.screenshotUrl}
                              alt="Screenshot preview"
                              className="w-12 h-10 object-cover bg-slate-950"
                            />
                            <div className="absolute inset-0 bg-cyan-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="w-4 h-4 text-cyan-300" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[11px]">No image</span>
                        )}
                      </td>

                      {/* Grand Total */}
                      <td className="p-3.5 text-right font-mono font-extrabold text-slate-100 text-sm">
                        ₹{item.totalAmount.toLocaleString('en-IN')}
                      </td>

                      {/* Status Badge */}
                      <td className="p-3.5 text-center">
                        {item.status === 'VERIFIED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                        {item.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            <Clock className="w-3 h-3" /> Pending Audit
                          </span>
                        )}
                        {item.status === 'DISCREPANCY' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            <AlertTriangle className="w-3 h-3" /> Discrepancy
                          </span>
                        )}
                      </td>

                      {/* Admin Action Buttons */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {item.status !== 'VERIFIED' && (
                            <button
                              onClick={() => updateDepositStatus(item.id, 'VERIFIED', undefined, currentUser?.email)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                              title="Verify Cash and Online receipt"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify</span>
                            </button>
                          )}

                          {item.status !== 'DISCREPANCY' && (
                            <button
                              onClick={() => {
                                setDiscrepancyModalRecord(item);
                                setAuditNoteInput(item.auditNotes || '');
                              }}
                              className="px-2 py-1 bg-slate-800 hover:bg-rose-950 text-rose-300 border border-slate-700 hover:border-rose-500/50 text-[11px] font-medium rounded-lg transition-colors"
                              title="Flag discrepancy"
                            >
                              Flag
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete deposit record ${item.id}?`)) {
                                deleteDeposit(item.id);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No deposit records match the selected date or search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        /* Alternate View: Rider Aggregated Summary Matrix */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>Rider-Wise Aggregate Collections Summary</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Active Riders in Filter: {riderList.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riderList.map((r) => (
              <div
                key={r.riderId}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{r.riderName}</h4>
                    <p className="text-xs text-slate-400 font-mono">ID: {r.riderId} • {r.routeNo}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {r.count} Deposit Slips
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block">Total Cash</span>
                    <span className="font-mono font-bold text-emerald-400">₹{r.totalCash.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total Online</span>
                    <span className="font-mono font-bold text-cyan-400">₹{r.totalOnline.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Grand Total Collection:</span>
                  <span className="font-mono font-extrabold text-slate-100 text-sm">
                    ₹{r.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discrepancy Note Audit Modal */}
      {discrepancyModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-100">Flag Audit Discrepancy</h3>
              </div>
              <button
                onClick={() => setDiscrepancyModalRecord(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Deposit <strong className="text-slate-200">{discrepancyModalRecord.id}</strong> by Rider <strong className="text-slate-200">{discrepancyModalRecord.riderName}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Discrepancy Audit Reason / Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Cash note count short by ₹50, or online reference screenshot mismatch..."
                value={auditNoteInput}
                onChange={(e) => setAuditNoteInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDiscrepancyModalRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDiscrepancy}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Flag Discrepancy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        deposits={filteredDeposits}
      />

    </div>
  );
};

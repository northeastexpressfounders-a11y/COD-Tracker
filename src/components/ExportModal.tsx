import React from 'react';
import { DepositRecord } from '../types';
import { X, Download, Printer, FileSpreadsheet, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deposits: DepositRecord[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, deposits }) => {
  if (!isOpen) return null;

  const handleExportCsv = () => {
    const headers = [
      'Deposit ID',
      'Date',
      'Rider Name',
      'Rider ID',
      'Route No',
      'Total Cash (INR)',
      'Total Online (INR)',
      'Grand Total (INR)',
      'Online App',
      'Transaction ID',
      'Status',
      'Submitted By',
      'Verified By',
      'Notes',
    ];

    const rows = deposits.map((d) => [
      d.id,
      d.depositDate,
      `"${d.riderName.replace(/"/g, '""')}"`,
      d.riderId,
      `"${d.routeNo.replace(/"/g, '""')}"`,
      d.totalCash,
      d.onlineAmount,
      d.totalAmount,
      d.onlinePaymentApp || '',
      d.onlineTransactionId || '',
      d.status,
      `"${d.submittedByName} (${d.submittedByEmail})"`,
      d.verifiedBy || '',
      `"${(d.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DC_Deposits_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintRegister = () => {
    window.print();
  };

  const totalCashSum = deposits.reduce((sum, item) => sum + item.totalCash, 0);
  const totalOnlineSum = deposits.reduce((sum, item) => sum + item.onlineAmount, 0);
  const grandTotalSum = deposits.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Export & Print Deposit Register</h3>
              <p className="text-xs text-slate-400">
                Generating report for <strong className="text-slate-200">{deposits.length} deposit records</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Summary */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          <div className="grid grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Total Cash</span>
              <span className="text-lg font-bold font-mono text-emerald-400">₹{totalCashSum.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Total Online</span>
              <span className="text-lg font-bold font-mono text-cyan-400">₹{totalOnlineSum.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Grand Total</span>
              <span className="text-xl font-extrabold font-mono text-slate-100">₹{grandTotalSum.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Choose Export Format</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* CSV Download Option */}
              <button
                onClick={handleExportCsv}
                className="p-5 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left group transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-100">Export CSV / Excel File</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    Download full raw table with rider names, cash denomination splits, and transaction IDs.
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  Download .CSV file →
                </span>
              </button>

              {/* Printable PDF / Print Register Option */}
              <button
                onClick={handlePrintRegister}
                className="p-5 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left group transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Printer className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-100">Printable Daily Register</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    Format a printable physical register sheet for bank deposit handoff & hub manager signing.
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-cyan-400 flex items-center gap-1">
                  Open Print View →
                </span>
              </button>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-slate-500">Distribution Center Cash Management System</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

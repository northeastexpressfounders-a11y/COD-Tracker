import React from 'react';
import { useDeposits } from '../context/DepositContext';
import { X, ExternalLink, Download, CheckCircle, Smartphone, ShieldCheck } from 'lucide-react';

export const ScreenshotModal: React.FC = () => {
  const { selectedDepositForScreenshot, setSelectedDepositForScreenshot } = useDeposits();

  if (!selectedDepositForScreenshot) return null;

  const record = selectedDepositForScreenshot;

  const handleDownload = () => {
    if (!record.screenshotUrl) return;
    const a = document.createElement('a');
    a.href = record.screenshotUrl;
    a.download = record.screenshotName || `online_payment_proof_${record.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <span>Online Payment Receipt Proof</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-normal">
                  {record.onlinePaymentApp || 'UPI App'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Rider: <strong className="text-slate-200">{record.riderName}</strong> • Tx ID: <span className="font-mono text-cyan-300">{record.onlineTransactionId || 'N/A'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedDepositForScreenshot(null)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Image Content */}
        <div className="p-5 overflow-y-auto flex-grow flex flex-col items-center justify-center bg-slate-950/60">
          
          {record.screenshotUrl ? (
            <div className="relative group max-w-md w-full border border-slate-800 rounded-2xl overflow-hidden shadow-xl bg-slate-900">
              <img
                src={record.screenshotUrl}
                alt={`Screenshot proof for deposit ${record.id}`}
                className="w-full h-auto max-h-[500px] object-contain mx-auto bg-slate-950"
              />
              <div className="absolute bottom-2 right-2 bg-slate-900/90 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg border border-slate-700/60 backdrop-blur-sm">
                {record.screenshotName || 'online_proof.png'}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-500">
              No screenshot image attached for this online payment.
            </div>
          )}

          {/* Transaction Metadata Card */}
          <div className="w-full mt-4 bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-xs grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block">Online Amount</span>
              <span className="text-base font-bold font-mono text-cyan-400">
                ₹{record.onlineAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment App</span>
              <span className="font-medium text-slate-200">{record.onlinePaymentApp || 'UPI'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Transaction Reference</span>
              <span className="font-mono text-slate-300">{record.onlineTransactionId || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Deposit Date</span>
              <span className="font-medium text-slate-300">{record.depositDate}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audit Proof Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            {record.screenshotUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Proof</span>
              </button>
            )}
            <button
              onClick={() => setSelectedDepositForScreenshot(null)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

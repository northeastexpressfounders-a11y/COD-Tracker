import React from 'react';
import { useDeposits } from '../context/DepositContext';
import { X, Banknote, Calculator, CheckCircle2 } from 'lucide-react';

export const DenominationModal: React.FC = () => {
  const { selectedDepositForDenominations, setSelectedDepositForDenominations } = useDeposits();

  if (!selectedDepositForDenominations) return null;

  const { record } = { record: selectedDepositForDenominations };
  const denominations = record.denominations || {};

  const sortedDenoms = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

  let totalNotesCount = 0;
  sortedDenoms.forEach((val) => {
    totalNotesCount += denominations[val] || 0;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Cash Denomination Slip</h3>
              <p className="text-xs text-slate-400">
                Rider: <span className="font-semibold text-slate-200">{record.riderName}</span> ({record.riderId})
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedDepositForDenominations(null)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <div>
              <span className="block text-slate-500">Deposit Reference</span>
              <span className="font-mono text-slate-200 font-bold">{record.id}</span>
            </div>
            <div className="text-right">
              <span className="block text-slate-500">Date</span>
              <span className="text-slate-200 font-medium">{record.depositDate}</span>
            </div>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/60 bg-slate-950/40">
            <div className="grid grid-cols-3 text-xs font-semibold uppercase text-slate-400 px-4 py-2.5 bg-slate-900/80">
              <div>Denomination</div>
              <div className="text-center">Count / Notes</div>
              <div className="text-right">Subtotal</div>
            </div>

            {sortedDenoms.map((denom) => {
              const count = denominations[denom] || 0;
              if (count === 0) return null; // show non-zero notes
              const subtotal = count * denom;

              return (
                <div key={denom} className="grid grid-cols-3 text-sm px-4 py-2.5 items-center">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1">
                    <span>₹{denom}</span>
                  </div>
                  <div className="text-center font-mono text-slate-200 font-medium bg-slate-800/60 py-0.5 rounded px-2 w-fit mx-auto">
                    {count}
                  </div>
                  <div className="text-right font-mono font-bold text-slate-100">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}

            {totalNotesCount === 0 && (
              <div className="p-6 text-center text-sm text-slate-500">
                No physical cash submitted for this deposit.
              </div>
            )}
          </div>

          {/* Totals Box */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5" />
                <span>Total Cash Notes Count: {totalNotesCount}</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Route: {record.routeNo}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Total Cash</div>
              <div className="text-2xl font-extrabold text-emerald-300 font-mono">
                ₹{record.totalCash.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setSelectedDepositForDenominations(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors"
          >
            Close Slip
          </button>
        </div>

      </div>
    </div>
  );
};

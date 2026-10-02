import React from 'react';
import { Lock, ShieldAlert, Info } from 'lucide-react';

interface ReadOnlyBadgeProps {
  label?: string;
  variant?: 'badge' | 'banner' | 'pill';
  showExplanation?: boolean;
}

export const ReadOnlyBadge: React.FC<ReadOnlyBadgeProps> = ({
  label = 'Read Only Profile',
  variant = 'badge',
  showExplanation = false
}) => {
  if (variant === 'banner') {
    return (
      <div className="flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl text-amber-900 dark:text-amber-200 text-xs">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Official Employment Record (Read Only):</span> All personal, designation, department, and compensation records are verified and maintained by College Administration. To request corrections, please contact Registrar HR.
        </div>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-full border border-amber-300/80 dark:border-amber-700/60 shadow-xs">
        <Lock className="w-3 h-3" />
        {label}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700">
      <Lock className="w-3.5 h-3.5 text-amber-500" />
      <span className="font-semibold text-slate-800 dark:text-slate-200">{label}</span>
      {showExplanation && (
        <span className="text-[11px] text-slate-500 border-l border-slate-300 dark:border-slate-600 pl-1.5">
          Locked by Admin
        </span>
      )}
    </div>
  );
};

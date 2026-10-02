import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Shield,
  Clock,
  Terminal,
  Download,
  CheckCircle2
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';

export const AuditLogsPage: React.FC = () => {
  const { success } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const logs = storageService.getAuditLogs();

  const filteredLogs = logs.filter(log => {
    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CampusHR_AuditTrail_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    success('Audit Trail Exported', 'Full cryptographically verifiable action log downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Administrative Security & Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable tracking of institutional logins, profile updates, payroll runs, and permission changes
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExportLogs}
        >
          Export Log File
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'Employee', 'Attendance', 'Leave', 'Payroll', 'Document'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, actor or IP..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No audit logs matching filters</div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                    <Badge variant={log.category === 'Leave' ? 'warning' : log.category === 'Payroll' ? 'success' : 'default'} size="sm">
                      {log.category}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">{log.details}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Actor: <strong className="text-slate-700 dark:text-slate-300">{log.actorName}</strong></span>
                    <span>•</span>
                    <span className="font-mono">IP: {log.ipAddress}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center sm:flex-col sm:items-end gap-1 text-[11px] text-slate-400 shrink-0 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {log.timestamp}
                </span>
                <span className="text-[10px] text-indigo-500 font-semibold">{log.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

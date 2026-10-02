import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  Calendar,
  Lock,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ReadOnlyBadge } from '../../components/ui/ReadOnlyBadge';

export const MyAttendancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  if (!currentUser) return null;

  const attendanceRecords = storageService.getAttendance({ employeeId: currentUser.id });

  // Stats
  const totalPresent = attendanceRecords.filter(a => a.status === 'Present').length;
  const totalLate = attendanceRecords.filter(a => a.status === 'Late').length;
  const totalHours = attendanceRecords.reduce((acc, curr) => acc + curr.workHours, 0);

  return (
    <div className="space-y-6">
      <ReadOnlyBadge variant="banner" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>My Attendance History</span>
            </h2>
            <ReadOnlyBadge variant="pill" label="Read Only Registry" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Biometric campus gate entries and recorded lecture hours for {currentUser.name}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Days Present</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalPresent}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Late Check-ins</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{totalLate}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Hours Logged</span>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{totalHours.toFixed(1)} hrs</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Shift</span>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">
            {attendanceRecords.length > 0 ? (totalHours / attendanceRecords.length).toFixed(1) : 0} hrs
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Punch Logs</h3>
          <span className="text-xs text-slate-400">Authenticated via Turnstile Gate Sensors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Check-Out Time</th>
                <th className="py-3 px-4">Working Hours</th>
                <th className="py-3 px-4">Daily Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendanceRecords.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{r.date}</td>
                  <td className="py-3 px-4 font-mono">{r.checkIn}</td>
                  <td className="py-3 px-4 font-mono">{r.checkOut}</td>
                  <td className="py-3 px-4 font-mono">{r.workHours} hrs</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={r.status === 'Present' ? 'success' : r.status === 'Late' ? 'warning' : 'danger'}
                      size="sm"
                      dot
                    >
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

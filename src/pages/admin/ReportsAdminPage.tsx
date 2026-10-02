import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  Users,
  CalendarCheck,
  Banknote,
  Building2,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const ReportsAdminPage: React.FC = () => {
  const { success } = useToast();
  const [activeReport, setActiveReport] = useState<'employees' | 'attendance' | 'leaves' | 'payroll'>('employees');

  const employees = storageService.getEmployees();
  const departments = storageService.getDepartments();
  const leaves = storageService.getLeaveRequests();
  const attendance = storageService.getAttendance();
  const payroll = storageService.getPayrollRecords();

  const handleExportReport = () => {
    success('Report Exported', `Generated formal PDF & CSV analytical summary for ${activeReport.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Institutional Reports & Governance Metrics</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Accreditation analytics, faculty-student ratios, attendance rates, and payroll budgets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportReport}
          >
            Export Comprehensive Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
        {[
          { id: 'employees', label: 'Faculty & Staff Breakdown', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'attendance', label: 'Attendance Analytics', icon: <CalendarCheck className="w-3.5 h-3.5" /> },
          { id: 'leaves', label: 'Leave Utilization', icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: 'payroll', label: 'Payroll & Compensation', icon: <Banknote className="w-3.5 h-3.5" /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveReport(t.id as any)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              activeReport === t.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Report 1: Faculty Breakdown */}
      {activeReport === 'employees' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Teaching Faculty Ratio</h4>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round((employees.filter(e => e.employeeType === 'Teaching').length / employees.length) * 100)}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Teaching professors & instructors to staff ratio</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Doctoral (Ph.D.) Ratio</h4>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {Math.round((employees.filter(e => e.qualification.includes('Ph.D.')).length / employees.length) * 100)}%
              </div>
              <p className="text-xs text-slate-500 mt-1">Accredited doctoral degree holders</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Average Faculty Tenure</h4>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {(employees.reduce((acc, curr) => acc + curr.experienceYears, 0) / employees.length).toFixed(1)} Yrs
              </div>
              <p className="text-xs text-slate-500 mt-1">Institutional stability & experience</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Department Headcount Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Head of Department</th>
                    <th className="py-2.5 px-3">Teaching</th>
                    <th className="py-2.5 px-3">Non-Teaching</th>
                    <th className="py-2.5 px-3">Total Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {departments.map(d => {
                    const deptStaff = employees.filter(e => e.department === d.name);
                    const teaching = deptStaff.filter(e => e.employeeType === 'Teaching').length;
                    const nonTeaching = deptStaff.filter(e => e.employeeType === 'Non-Teaching').length;
                    return (
                      <tr key={d.id}>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{d.name}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{d.headOfDepartment}</td>
                        <td className="py-2.5 px-3 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{teaching}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">{nonTeaching}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{deptStaff.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Report 2: Attendance */}
      {activeReport === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Monthly Punctuality & Turnstile Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800">
              <span className="text-xs text-teal-800 dark:text-teal-300 font-semibold">Average Attendance Rate</span>
              <div className="text-2xl font-bold text-teal-700 dark:text-teal-300 mt-1">94.2%</div>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
              <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold">Average Check-in Time</span>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">08:26 AM</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-xs text-blue-800 dark:text-blue-300 font-semibold">Daily Average Hours</span>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">8.1 Hours</div>
            </div>
          </div>
        </div>
      )}

      {/* Report 3: Leaves */}
      {activeReport === 'leaves' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Leave Quota Utilization Analysis</h3>
          <p className="text-xs text-slate-500">Breakdown of days taken across casual, medical, and sabbatical leaves</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">14 Days</div>
              <div className="text-xs text-slate-500 mt-0.5">Academic/Sabbatical</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">8 Days</div>
              <div className="text-xs text-slate-500 mt-0.5">Casual Leaves</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <div className="text-xl font-bold text-rose-600 dark:text-rose-400">4 Days</div>
              <div className="text-xs text-slate-500 mt-0.5">Medical/Sick Leaves</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">18 Days</div>
              <div className="text-xs text-slate-500 mt-0.5">Earned/Vacation</div>
            </div>
          </div>
        </div>
      )}

      {/* Report 4: Payroll */}
      {activeReport === 'payroll' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Institutional Payroll Outlay</h3>
          <p className="text-xs text-slate-500">Gross disbursements, institutional provident fund contributions and taxes</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Total Monthly Outlay</span>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 font-mono mt-1">$67,300</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-xs text-blue-800 dark:text-blue-300 font-semibold">Provident Fund Share</span>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 font-mono mt-1">$5,820</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <span className="text-xs text-purple-800 dark:text-purple-300 font-semibold">Tax Deductions Retained</span>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 font-mono mt-1">$8,960</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

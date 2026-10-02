import React from 'react';
import {
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarClock,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Banknote,
  UserPlus,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AdminDashboardPage: React.FC = () => {
  const { setActiveView, viewEmployeeDetail } = useAuth();

  const employees = storageService.getEmployees();
  const departments = storageService.getDepartments();
  const attendance = storageService.getAttendance();
  const leaves = storageService.getLeaveRequests();
  const auditLogs = storageService.getAuditLogs();

  // Metrics
  const totalEmployees = employees.length;
  const teachingStaff = employees.filter(e => e.employeeType === 'Teaching').length;
  const nonTeachingStaff = employees.filter(e => e.employeeType === 'Non-Teaching').length;
  const totalDepartments = departments.length;

  const today = '2026-10-02';
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const presentPercentage = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  // Department distribution
  const deptDistribution = departments.map(d => {
    const count = employees.filter(e => e.department === d.name).length;
    const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
    return { ...d, count, percentage };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Fall Semester 2026-2027 • Term I</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Administrative Command Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Real-time institutional oversight across faculty staffing, biometric gate entries, pending sabbatical requests, and payroll disbursements.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => setActiveView('add-employee')}
            >
              Add Employee
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-slate-700 bg-slate-800/80 hover:bg-slate-700"
              icon={<CalendarClock className="w-4 h-4" />}
              onClick={() => setActiveView('leave')}
            >
              Review Leaves ({pendingLeaves.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Employees */}
        <div className="col-span-1 lg:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Staff</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {totalEmployees}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>100% Onboarded</span>
          </div>
        </div>

        {/* Teaching Staff */}
        <div className="col-span-1 lg:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Teaching Staff</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {teachingStaff}
          </div>
          <span className="text-[11px] text-slate-500">Professors & Instructors</span>
        </div>

        {/* Non-Teaching Staff */}
        <div className="col-span-1 lg:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Non-Teaching</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {nonTeachingStaff}
          </div>
          <span className="text-[11px] text-slate-500">Registrars & Admins</span>
        </div>

        {/* Departments */}
        <div className="col-span-1 lg:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Departments</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {totalDepartments}
          </div>
          <span className="text-[11px] text-slate-500">Across 4 Academic Halls</span>
        </div>

        {/* Present Today */}
        <div className="col-span-1 lg:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Present Today</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {presentToday}/{totalEmployees}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 mt-1">
            <span className="font-semibold">{presentPercentage}%</span> attendance rate
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="col-span-1 lg:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-amber-400 transition-colors"
          onClick={() => setActiveView('leave')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Leaves</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {pendingLeaves.length}
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">Requires Review</span>
        </div>
      </div>

      {/* Middle Row: Department Breakdown & Attendance Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Allocation & Distribution */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Department Staffing Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Faculty & staff assigned per academic wing</p>
            </div>
            <button
              onClick={() => setActiveView('departments')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {deptDistribution.map(dept => (
              <div key={dept.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.name}</span>
                  <span className="text-slate-500 font-mono">{dept.count} staff ({dept.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.max(dept.percentage, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Leave Status Highlights */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Administrative Quick Actions</h3>
            <p className="text-xs text-slate-500 mb-4">One-click operational triggers</p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveView('add-employee')}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left cursor-pointer group"
              >
                <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">New Employee</div>
                  <div className="text-[10px] text-slate-400">Onboard faculty</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('attendance')}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 hover:border-teal-300 dark:hover:border-teal-700 transition-all text-left cursor-pointer group"
              >
                <CalendarCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300">Mark Attendance</div>
                  <div className="text-[10px] text-slate-400">Sync turnstiles</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('payroll')}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-left cursor-pointer group"
              >
                <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300">Run Payroll</div>
                  <div className="text-[10px] text-slate-400">Monthly slips</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('reports')}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all text-left cursor-pointer group"
              >
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300">Generate Report</div>
                  <div className="text-[10px] text-slate-400">Accreditation PDF</div>
                </div>
              </button>
            </div>
          </div>

          {/* Pending Leave Requests Alert Box */}
          <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {pendingLeaves.length} Faculty Leaves Awaiting Action
                </span>
              </div>
              <button
                onClick={() => setActiveView('leave')}
                className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
              >
                Review Now
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {pendingLeaves.slice(0, 2).map(req => (
                <div key={req.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/80 dark:border-amber-900/60 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{req.employeeName}</div>
                    <div className="text-[10px] text-slate-500">{req.leaveType} • {req.daysCount} days ({req.startDate})</div>
                  </div>
                  <Badge variant="warning" size="sm">Pending</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Audit Activities & Recent Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Audit Activities */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Administrative Activities</h3>
              <p className="text-xs text-slate-500">Live audit events & security tracking</p>
            </div>
            <button
              onClick={() => setActiveView('audit-logs')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Full Audit Trail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">{log.action}</span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{log.details}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span>By: <span className="font-medium text-slate-600 dark:text-slate-300">{log.actorName}</span></span>
                    <span>•</span>
                    <span className="font-mono">{log.ipAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Faculty List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active College Faculty</h3>
              <p className="text-xs text-slate-500">Quick profile access</p>
            </div>
            <button
              onClick={() => setActiveView('employees')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {employees.slice(0, 5).map(emp => (
              <div
                key={emp.id}
                onClick={() => viewEmployeeDetail(emp.id)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">{emp.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{emp.designation}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={emp.employeeType === 'Teaching' ? 'default' : 'neutral'} size="sm">
                    {emp.employeeType}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

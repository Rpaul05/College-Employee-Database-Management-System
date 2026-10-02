import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Building2,
  UserCheck,
  Plus
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select, Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

export const AttendanceAdminPage: React.FC = () => {
  const { success } = useToast();
  const employees = storageService.getEmployees();
  const departments = storageService.getDepartments();

  const [selectedDate, setSelectedDate] = useState('2026-10-02');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchEmployee, setSearchEmployee] = useState('');

  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [markEmpId, setMarkEmpId] = useState(employees[0]?.id || '');
  const [markStatus, setMarkStatus] = useState<AttendanceStatus>('Present');
  const [markCheckIn, setMarkCheckIn] = useState('08:30 AM');
  const [markCheckOut, setMarkCheckOut] = useState('05:00 PM');
  const [markWorkHours, setMarkWorkHours] = useState(8.5);

  const allRecords = storageService.getAttendance();

  // Filter records
  const filteredRecords = allRecords.filter(r => {
    const matchesDate = !selectedDate || r.date === selectedDate;
    const matchesDept = selectedDept === 'All' || r.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    const matchesName = r.employeeName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                        r.employeeId.toLowerCase().includes(searchEmployee.toLowerCase());
    return matchesDate && matchesDept && matchesStatus && matchesName;
  });

  // Daily statistics for selected date
  const dateRecords = allRecords.filter(r => r.date === selectedDate);
  const presentCount = dateRecords.filter(r => r.status === 'Present').length;
  const lateCount = dateRecords.filter(r => r.status === 'Late').length;
  const absentCount = dateRecords.filter(r => r.status === 'Absent').length;
  const halfDayCount = dateRecords.filter(r => r.status === 'Half Day').length;

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === markEmpId);
    if (!emp) return;

    const newRecord: AttendanceRecord = {
      id: `ATT-${selectedDate.replace(/-/g, '')}-${markEmpId.slice(-3)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      date: selectedDate,
      checkIn: markStatus === 'Absent' ? '-' : markCheckIn,
      checkOut: markStatus === 'Absent' ? '-' : markCheckOut,
      status: markStatus,
      workHours: markStatus === 'Absent' ? 0 : Number(markWorkHours)
    };

    storageService.markAttendance(newRecord);
    success('Attendance Recorded', `Marked ${emp.name} as ${markStatus} on ${selectedDate}`);
    setIsMarkModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Institution Attendance Registry</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Biometric turnstile logs and manual clock-in adjustments across campus
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsMarkModalOpen(true)}
        >
          Mark / Override Attendance
        </Button>
      </div>

      {/* Date Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Present On Time</span>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{presentCount}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Late Arrivals</span>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{lateCount}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Absent / Unmarked</span>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">{absentCount}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Half Day / Left Early</span>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{halfDayCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Registry Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          {/* Employee Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Search Employee
            </label>
            <input
              type="text"
              value={searchEmployee}
              onChange={(e) => setSearchEmployee(e.target.value)}
              placeholder="Name or Staff ID..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Logged Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No attendance records found matching filters for {selectedDate}.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{r.employeeName}</div>
                      <div className="font-mono text-[11px] text-slate-400">{r.employeeId}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{r.department}</td>
                    <td className="py-3 px-4 font-mono">{r.date}</td>
                    <td className="py-3 px-4 font-mono font-medium">{r.checkIn}</td>
                    <td className="py-3 px-4 font-mono font-medium">{r.checkOut}</td>
                    <td className="py-3 px-4 font-mono">{r.workHours} hrs</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          r.status === 'Present'
                            ? 'success'
                            : r.status === 'Late'
                            ? 'warning'
                            : r.status === 'Half Day'
                            ? 'info'
                            : 'danger'
                        }
                        size="sm"
                        dot
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setMarkEmpId(r.employeeId);
                          setMarkStatus(r.status);
                          setMarkCheckIn(r.checkIn);
                          setMarkCheckOut(r.checkOut);
                          setMarkWorkHours(r.workHours);
                          setIsMarkModalOpen(true);
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                      >
                        Modify
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Record / Override Attendance"
        description="Update clock-in, clock-out timestamps or mark excused absence."
        maxWidth="md"
      >
        <form onSubmit={handleSaveAttendance} className="space-y-4">
          <Select
            label="Select Employee *"
            value={markEmpId}
            onChange={(e) => setMarkEmpId(e.target.value)}
            options={employees.map(e => ({ label: `${e.name} (${e.id}) - ${e.department}`, value: e.id }))}
          />

          <Select
            label="Attendance Status *"
            value={markStatus}
            onChange={(e) => setMarkStatus(e.target.value as AttendanceStatus)}
            options={[
              { label: 'Present (On Time)', value: 'Present' },
              { label: 'Late Arrival', value: 'Late' },
              { label: 'Half Day Session', value: 'Half Day' },
              { label: 'Absent', value: 'Absent' },
              { label: 'On Official Leave', value: 'On Leave' },
            ]}
          />

          {markStatus !== 'Absent' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Check-In Time"
                  value={markCheckIn}
                  onChange={(e) => setMarkCheckIn(e.target.value)}
                />
                <Input
                  label="Check-Out Time"
                  value={markCheckOut}
                  onChange={(e) => setMarkCheckOut(e.target.value)}
                />
              </div>

              <Input
                label="Effective Hours"
                type="number"
                step="0.1"
                value={markWorkHours}
                onChange={(e) => setMarkWorkHours(Number(e.target.value))}
              />
            </>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsMarkModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

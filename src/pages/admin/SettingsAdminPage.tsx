import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Clock,
  CalendarCheck,
  Save,
  Shield,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';

export const SettingsAdminPage: React.FC = () => {
  const { success } = useToast();

  const [collegeName, setCollegeName] = useState('Apex Institute of Technology & Sciences');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [workStartTime, setWorkStartTime] = useState('08:30 AM');
  const [workEndTime, setWorkEndTime] = useState('05:00 PM');
  const [gracePeriod, setGracePeriod] = useState(15);
  const [casualQuota, setCasualQuota] = useState(12);
  const [sickQuota, setSickQuota] = useState(10);
  const [academicQuota, setAcademicQuota] = useState(14);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Saved', 'Institutional governance rules updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Campus Configuration & Institutional Policies</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure academic schedules, attendance grace thresholds, and faculty leave quotas
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<RotateCcw className="w-4 h-4" />}
          onClick={() => storageService.resetAll()}
        >
          Reset Demo Defaults
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Institution Details */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span>Institution & Academic Term</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="College Legal Entity Name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
            />
            <Input
              label="Active Academic Calendar Year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>
        </div>

        {/* Section 2: Working Hours & Biometric Timing */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-500" />
            <span>Standard Working Hours & Biometrics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Daily Shift Start Time"
              value={workStartTime}
              onChange={(e) => setWorkStartTime(e.target.value)}
            />
            <Input
              label="Daily Shift End Time"
              value={workEndTime}
              onChange={(e) => setWorkEndTime(e.target.value)}
            />
            <Input
              label="Turnstile Grace Period (Minutes)"
              type="number"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(Number(e.target.value))}
              helperText="Arrival after this period is flagged as Late."
            />
          </div>
        </div>

        {/* Section 3: Leave Quotas */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-500" />
            <span>Annual Faculty Leave Quotas (Per Academic Year)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Casual Leave Entitlement (Days)"
              type="number"
              value={casualQuota}
              onChange={(e) => setCasualQuota(Number(e.target.value))}
            />
            <Input
              label="Medical / Sick Leave (Days)"
              type="number"
              value={sickQuota}
              onChange={(e) => setSickQuota(Number(e.target.value))}
            />
            <Input
              label="Academic Sabbatical Allowance (Teaching Faculty)"
              type="number"
              value={academicQuota}
              onChange={(e) => setAcademicQuota(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
            Save Institutional Policies
          </Button>
        </div>
      </form>
    </div>
  );
};

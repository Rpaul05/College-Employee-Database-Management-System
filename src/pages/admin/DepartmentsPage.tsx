import React, { useState } from 'react';
import {
  Building2,
  Users,
  Banknote,
  MapPin,
  GraduationCap,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const DepartmentsPage: React.FC = () => {
  const departments = storageService.getDepartments();
  const employees = storageService.getEmployees();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Academic & Administrative Departments</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Overview of faculties, budget allocations, heads of departments, and staff allocation
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search departments..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(dept => {
          const deptStaff = employees.filter(e => e.department === dept.name);
          const teachingCount = deptStaff.filter(e => e.employeeType === 'Teaching').length;
          const nonTeachingCount = deptStaff.filter(e => e.employeeType === 'Non-Teaching').length;

          return (
            <div
              key={dept.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {dept.code}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Est. {dept.establishedYear}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
                  {dept.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-500">Head of Department:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{dept.headOfDepartment}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> Building:
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{dept.building}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Banknote className="w-3 h-3 text-slate-400" /> Annual Budget:
                    </span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{dept.budget}</span>
                  </div>
                </div>
              </div>

              {/* Staff Stats Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 -mx-5 -mb-5 p-4 rounded-b-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {deptStaff.length} Employees
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{teachingCount} Faculty</span>
                  <span>•</span>
                  <span>{nonTeachingCount} Staff</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Banknote,
  FileText,
  Download,
  Printer,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { PayrollRecord } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ReadOnlyBadge } from '../../components/ui/ReadOnlyBadge';
import { useToast } from '../../context/ToastContext';

export const MyPayrollPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { success } = useToast();
  const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null);

  if (!currentUser) return null;

  const payrollRecords = storageService.getPayrollRecords(currentUser.id);

  return (
    <div className="space-y-6">
      <ReadOnlyBadge variant="banner" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>My Compensation & Salary Slips</span>
            </h2>
            <ReadOnlyBadge variant="pill" label="Read Only Records" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified monthly salary disbursements, tax withholdings, and institutional provident fund
          </p>
        </div>
      </div>

      {/* Salary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Gross Monthly Earnings</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ${(currentUser.salary.basic + currentUser.salary.hra + currentUser.salary.da + currentUser.salary.allowances).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Basic + HRA + DA + Allowances</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Statutory Deductions</span>
          <div className="text-2xl font-bold font-mono text-rose-500 mt-1">
            -${(currentUser.salary.pfDeduction + currentUser.salary.taxDeduction).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Provident Fund & Income Tax</span>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Net Monthly Salary</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1">
            ${currentUser.salary.netSalary.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-800 dark:text-emerald-400">Disbursed to {currentUser.salary.bankName}</span>
        </div>
      </div>

      {/* Salary Slips Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Payslip Registry</h3>
          <span className="text-xs text-slate-400">Click to view breakdown or download PDF</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Pay Period</th>
                <th className="py-3 px-4">Gross Earnings</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Net Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payrollRecords.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{p.month}</td>
                  <td className="py-3 px-4 font-mono">${p.grossEarnings.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-rose-500">-${p.totalDeductions.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${p.netPay.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={p.paymentStatus === 'Paid' ? 'success' : 'warning'} size="sm" dot>
                      {p.paymentStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedSlip(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-semibold cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View & Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Slip Modal */}
      <Modal
        isOpen={!!selectedSlip}
        onClose={() => setSelectedSlip(null)}
        title="Official Salary Statement"
        description={`College Payslip for ${selectedSlip?.month}`}
        maxWidth="2xl"
      >
        {selectedSlip && (
          <div className="space-y-5">
            <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Apex Institute of Technology & Sciences</h3>
                    <p className="text-[11px] text-slate-500">Automated Faculty Payroll System</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  {selectedSlip.paymentStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Faculty:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedSlip.employeeName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Staff ID:</span>
                  <strong className="font-mono text-indigo-600 dark:text-indigo-400">{selectedSlip.employeeId}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Department:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedSlip.department}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Pay Period:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedSlip.month}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                <div className="space-y-2 bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
                    Earnings (Credits)
                  </h4>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Basic Pay</span>
                    <span className="font-mono font-semibold">${selectedSlip.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">HRA</span>
                    <span className="font-mono font-semibold">${selectedSlip.hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">DA</span>
                    <span className="font-mono font-semibold">${selectedSlip.da.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Academic Allowance</span>
                    <span className="font-mono font-semibold">${selectedSlip.academicAllowance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 font-bold">
                    <span>Total Gross</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">${selectedSlip.grossEarnings.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2 bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
                    Deductions (Debits)
                  </h4>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">PF Contribution</span>
                    <span className="font-mono font-semibold">${selectedSlip.pf.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Tax (TDS)</span>
                    <span className="font-mono font-semibold">${selectedSlip.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-7 border-t border-slate-200 dark:border-slate-800 font-bold">
                    <span>Total Deductions</span>
                    <span className="font-mono text-rose-500">-${selectedSlip.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Net Credited Salary
                  </span>
                  <div className="text-[11px] text-slate-500">Paid on {selectedSlip.paymentDate}</div>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300">
                  ${selectedSlip.netPay.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" icon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
                Print
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  success('Downloaded Payslip', `Saved ${selectedSlip.month} payslip PDF.`);
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Banknote,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Download,
  Building2,
  TrendingUp,
  Plus,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { PayrollRecord, PayrollStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export const PayrollAdminPage: React.FC = () => {
  const { success } = useToast();
  const employees = storageService.getEmployees();
  const departments = storageService.getDepartments();

  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [viewingSlip, setViewingSlip] = useState<PayrollRecord | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateEmpId, setGenerateEmpId] = useState(employees[0]?.id || '');
  const [generateMonth, setGenerateMonth] = useState('October 2026');

  const allRecords = storageService.getPayrollRecords();

  const filteredRecords = allRecords.filter(p => {
    const matchesMonth = selectedMonth === 'All' || p.month === selectedMonth;
    const matchesStatus = selectedStatus === 'All' || p.paymentStatus === selectedStatus;
    const matchesSearch =
      p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesStatus && matchesSearch;
  });

  // Aggregated totals
  const totalNetDisbursed = filteredRecords.reduce((acc, curr) => acc + curr.netPay, 0);
  const totalGross = filteredRecords.reduce((acc, curr) => acc + curr.grossEarnings, 0);
  const totalTaxes = filteredRecords.reduce((acc, curr) => acc + curr.tax, 0);
  const totalPF = filteredRecords.reduce((acc, curr) => acc + curr.pf, 0);

  const handleGenerateSlipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === generateEmpId);
    if (!emp) return;

    const grossEarnings = emp.salary.basic + emp.salary.hra + emp.salary.da + emp.salary.allowances;
    const pf = emp.salary.pfDeduction;
    const tax = emp.salary.taxDeduction;
    const totalDeductions = pf + tax;
    const netPay = grossEarnings - totalDeductions;

    const newRecord: PayrollRecord = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      designation: emp.designation,
      month: generateMonth,
      basicSalary: emp.salary.basic,
      hra: emp.salary.hra,
      da: emp.salary.da,
      academicAllowance: emp.salary.allowances,
      grossEarnings,
      pf,
      tax,
      totalDeductions,
      netPay,
      paymentStatus: 'Paid',
      paymentDate: new Date().toISOString().split('T')[0],
      transactionId: `TXN-CAMPUS-${Math.floor(1000000 + Math.random() * 9000000)}`
    };

    storageService.generatePayrollSlip(newRecord);
    success('Salary Slip Generated', `Processed salary slip for ${emp.name} for ${generateMonth}`);
    setIsGenerateModalOpen(false);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Faculty & Staff Payroll Management</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Disbursement registers, statutory deductions (PF/TDS), and institutional salary slips
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsGenerateModalOpen(true)}
        >
          Generate Salary Slip
        </Button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Net Disbursed</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            ${totalNetDisbursed.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Selected period disbursements</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Gross Faculty Earnings</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
            ${totalGross.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Basic + HRA + DA + Allowances</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Income Tax (TDS) Withheld</span>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
            ${totalTaxes.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Remitted to treasury</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Provident Fund (PF) Total</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">
            ${totalPF.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Employee + College contributions</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Months</option>
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="October 2026">October 2026 (Scheduled)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee or department..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Title</th>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Gross Earnings</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Net Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No payroll records matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{p.employeeName}</div>
                      <div className="font-mono text-[11px] text-slate-400">{p.employeeId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{p.designation}</div>
                      <div className="text-[11px] text-slate-400">{p.department}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold">{p.month}</td>
                    <td className="py-3 px-4 font-mono font-medium">${p.grossEarnings.toLocaleString()}</td>
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
                        onClick={() => setViewingSlip(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-semibold transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Slip</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Salary Slip Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Monthly Salary Slip"
        description="Compute basic, allowances, and statutory deductions for faculty."
        maxWidth="md"
      >
        <form onSubmit={handleGenerateSlipSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Employee
            </label>
            <select
              value={generateEmpId}
              onChange={(e) => setGenerateEmpId(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
            >
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.id}) - {e.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pay Month
            </label>
            <select
              value={generateMonth}
              onChange={(e) => setGenerateMonth(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
            >
              <option value="October 2026">October 2026</option>
              <option value="November 2026">November 2026</option>
              <option value="September 2026">September 2026</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Generate & Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Salary Slip Detail / Print Preview Modal */}
      <Modal
        isOpen={!!viewingSlip}
        onClose={() => setViewingSlip(null)}
        title="Official College Salary Slip"
        description={`Payslip statement for ${viewingSlip?.employeeName} (${viewingSlip?.month})`}
        maxWidth="2xl"
      >
        {viewingSlip && (
          <div className="space-y-6 print:p-0">
            {/* Printable Letterhead */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Apex Institute of Technology & Sciences</h3>
                    <p className="text-[11px] text-slate-500">CampusHR Automated Payroll System • Accredited Grade A++</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                    {viewingSlip.paymentStatus}
                  </span>
                  <div className="font-mono text-[10px] text-slate-400 mt-0.5">{viewingSlip.transactionId}</div>
                </div>
              </div>

              {/* Employee Particulars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-b border-slate-200 dark:border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Faculty Name:</span>
                  <strong className="text-slate-900 dark:text-white">{viewingSlip.employeeName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Staff ID:</span>
                  <strong className="font-mono text-indigo-600 dark:text-indigo-400">{viewingSlip.employeeId}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Department:</span>
                  <strong className="text-slate-900 dark:text-white">{viewingSlip.department}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Pay Period:</span>
                  <strong className="text-slate-900 dark:text-white">{viewingSlip.month}</strong>
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                {/* Earnings Side */}
                <div className="space-y-2 bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
                    Earnings (Credits)
                  </h4>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Basic Pay</span>
                    <span className="font-mono font-semibold">${viewingSlip.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">House Rent Allowance (HRA)</span>
                    <span className="font-mono font-semibold">${viewingSlip.hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Dearness Allowance (DA)</span>
                    <span className="font-mono font-semibold">${viewingSlip.da.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Academic & Special Allowance</span>
                    <span className="font-mono font-semibold">${viewingSlip.academicAllowance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                    <span>Total Gross Earnings</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">${viewingSlip.grossEarnings.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions Side */}
                <div className="space-y-2 bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
                    Deductions (Debits)
                  </h4>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Provident Fund (PF)</span>
                    <span className="font-mono font-semibold">${viewingSlip.pf.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">TDS / Income Tax</span>
                    <span className="font-mono font-semibold">${viewingSlip.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-7 border-t border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                    <span>Total Deductions</span>
                    <span className="font-mono text-rose-500">-${viewingSlip.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Payable Ribbon */}
              <div className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Net Disbursed Amount
                  </span>
                  <div className="text-[11px] text-slate-500">Disbursed on {viewingSlip.paymentDate}</div>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300">
                  ${viewingSlip.netPay.toLocaleString()}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>System-generated e-salary slip. No physical signature required.</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Institutional Security Stamp
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Printer className="w-4 h-4" />}
                onClick={handlePrintSlip}
              >
                Print Slip
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  success('Salary Slip Downloaded', `Saved PDF payslip for ${viewingSlip.month}`);
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

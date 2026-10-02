import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Upload,
  CheckCircle2,
  XCircle,
  Trash2,
  Download,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { DocumentRecord, DocumentCategory, DocumentStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

export const DocumentsAdminPage: React.FC = () => {
  const { success } = useToast();
  const employees = storageService.getEmployees();
  const documents = storageService.getDocuments();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadEmpId, setUploadEmpId] = useState(employees[0]?.id || '');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('Degree Certificate');
  const [uploadFileSize, setUploadFileSize] = useState('2.4 MB');

  const filteredDocs = documents.filter(d => {
    const matchesCategory = categoryFilter === 'All' || d.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === uploadEmpId);
    if (!emp) return;

    const newDoc: DocumentRecord = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      title: uploadTitle || `${uploadCategory} for ${emp.name}`,
      category: uploadCategory,
      fileSize: uploadFileSize,
      uploadDate: new Date().toISOString().split('T')[0],
      fileType: 'PDF',
      status: 'Verified',
      downloadUrl: '#'
    };

    storageService.addDocument(newDoc);
    success('Document Uploaded', `Added "${newDoc.title}" to institutional records.`);
    setIsUploadModalOpen(false);
    setUploadTitle('');
  };

  const handleVerify = (id: string, status: 'Verified' | 'Rejected') => {
    storageService.verifyDocument(id, status);
    success(`Document ${status}`, `Institutional credential status updated to ${status}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this document from the institutional archive?')) {
      storageService.deleteDocument(id);
      success('Document Removed', 'Record deleted from archive.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Institutional Documents Repository</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Degree verifications, appointment contracts, government IDs, and tax credentials
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Document
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Categories</option>
            <option value="Degree Certificate">Degree Certificate</option>
            <option value="Government ID">Government ID</option>
            <option value="Appointment Letter">Appointment Letter</option>
            <option value="Research Publication">Research Publication</option>
            <option value="Tax Document">Tax Document</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Verification Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search document title or employee..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-3 bg-white dark:bg-slate-900 p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No documents found</p>
            <p className="text-xs text-slate-500 mt-1">Try modifying your filter options</p>
          </div>
        ) : (
          filteredDocs.map(doc => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {doc.category}
                  </span>
                  <Badge
                    variant={doc.status === 'Verified' ? 'success' : doc.status === 'Pending Verification' ? 'warning' : 'danger'}
                    size="sm"
                    dot
                  >
                    {doc.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2 leading-snug line-clamp-2">
                  {doc.title}
                </h3>

                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="text-slate-800 dark:text-slate-200 font-semibold">{doc.employeeName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{doc.employeeId} • {doc.fileSize}</div>
                  <div className="text-[11px] text-slate-400">Uploaded {doc.uploadDate}</div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => alert(`Downloading ${doc.title}...`)}
                  className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <div className="flex items-center gap-1">
                  {doc.status === 'Pending Verification' && (
                    <button
                      onClick={() => handleVerify(doc.id, 'Verified')}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
                      title="Verify Document"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Institutional Document"
        description="Attach educational credentials, background verifications or service contracts."
        maxWidth="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Employee
            </label>
            <select
              value={uploadEmpId}
              onChange={(e) => setUploadEmpId(e.target.value)}
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
              Document Category
            </label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
            >
              <option value="Degree Certificate">Degree Certificate</option>
              <option value="Government ID">Government ID</option>
              <option value="Appointment Letter">Appointment Letter</option>
              <option value="Research Publication">Research Publication</option>
              <option value="Tax Document">Tax Document</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Document Title
            </label>
            <input
              type="text"
              required
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Master's Degree Convocation Certificate"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Simulated File Drop */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 text-center bg-slate-50 dark:bg-slate-950/40">
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Drag and drop certificate PDF here
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Supports PDF, PNG, JPG up to 15MB</p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Verify & Upload
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

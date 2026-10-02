import React from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  Calendar,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Badge } from '../../components/ui/Badge';
import { ReadOnlyBadge } from '../../components/ui/ReadOnlyBadge';

export const MyDocumentsPage: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const documents = storageService.getDocuments(currentUser.id);

  return (
    <div className="space-y-6">
      <ReadOnlyBadge variant="banner" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>My Institutional Verified Documents</span>
            </h2>
            <ReadOnlyBadge variant="pill" label="Read Only Repository" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Archived credentials, verified doctorate degrees, tax withholdings, and faculty contracts
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.length === 0 ? (
          <div className="col-span-3 bg-white dark:bg-slate-900 p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No documents found</p>
            <p className="text-xs text-slate-500 mt-1">Contact the Registrar office to submit new credential records.</p>
          </div>
        ) : (
          documents.map(doc => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {doc.category}
                  </span>
                  <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'} size="sm" dot>
                    {doc.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2 leading-snug">
                  {doc.title}
                </h3>

                <div className="mt-3 text-xs text-slate-500 space-y-1">
                  <div>File Size: <strong className="text-slate-700 dark:text-slate-300">{doc.fileSize}</strong> ({doc.fileType})</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>Verified on {doc.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Official Seal
                </span>

                <button
                  onClick={() => alert(`Downloading verified institutional copy of "${doc.title}"...`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

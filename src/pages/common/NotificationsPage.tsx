import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  CalendarClock,
  Banknote,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const NotificationsPage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { success } = useToast();

  const notifications = storageService.getNotifications(role || 'employee', currentUser?.id);

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsRead(role || 'employee', currentUser?.id);
    success('Notifications Marked as Read');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Institutional Bulletins & Notifications</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time administrative alerts, payroll releases, and leave application status
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<CheckCheck className="w-4 h-4" />}
          onClick={handleMarkAllRead}
        >
          Mark All as Read
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No active notifications</p>
          </div>
        ) : (
          notifications.map(n => {
            const icons = {
              leave: <CalendarClock className="w-4 h-4 text-indigo-500" />,
              payroll: <Banknote className="w-4 h-4 text-emerald-500" />,
              warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
              info: <Info className="w-4 h-4 text-blue-500" />,
              success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            };

            return (
              <div
                key={n.id}
                className={`p-4 flex items-start justify-between gap-4 text-xs transition-colors ${
                  !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {icons[n.type] || <Bell className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[11px] text-slate-400 block mt-1.5">{n.timestamp}</span>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => storageService.markNotificationAsRead(n.id)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 cursor-pointer font-medium"
                  >
                    Mark read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

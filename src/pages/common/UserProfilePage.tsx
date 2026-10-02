import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Mail,
  Building2,
  Calendar,
  Lock,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import { ReadOnlyBadge } from '../../components/ui/ReadOnlyBadge';

export const UserProfilePage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { success } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!currentUser) return null;

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    success('Password Updated', 'Your institutional login credentials have been changed.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Profile & Account Security</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your single sign-on (SSO) credentials and active college session
          </p>
        </div>

        <Badge variant={role === 'admin' ? 'default' : 'warning'} size="md">
          {role === 'admin' ? 'Administrator Account' : 'Faculty Member (Read Only)'}
        </Badge>
      </div>

      {/* User Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
        />
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h3>
            {role === 'employee' && <ReadOnlyBadge variant="pill" />}
          </div>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{currentUser.designation}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-1">
            <span>{currentUser.department}</span>
            <span>•</span>
            <span className="font-mono">{currentUser.email}</span>
            <span>•</span>
            <span>ID: {currentUser.id}</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-500" />
          <span>Update Security Password</span>
        </h3>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

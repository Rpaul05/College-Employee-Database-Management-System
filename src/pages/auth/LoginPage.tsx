import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  Mail,
  Shield,
  Briefcase,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Building,
  Users,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error, info } = useToast();

  const [email, setEmail] = useState('sarah.vance@campushr.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Email Required', 'Please enter your registered college institutional email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, role);
      setIsLoading(false);
      success(
        `Welcome to CampusHR!`,
        `Logged in as ${role === 'admin' ? 'College Administrator (Full Read/Write)' : 'Employee (Read-Only Self-Service)'}`
      );
    }, 600);
  };

  const handleQuickLogin = (demoRole: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('campusHR@2026!');
    setRole(demoRole);
    setIsLoading(true);
    setTimeout(() => {
      login(demoEmail, demoRole);
      setIsLoading(false);
      success(
        `Logged in successfully!`,
        `Role: ${demoRole === 'admin' ? 'Administrator' : 'Faculty/Employee'}`
      );
    }, 400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      error('Please enter your institutional email');
      return;
    }
    setForgotSent(true);
    setTimeout(() => {
      info('Password Reset Link Sent', `If ${forgotEmail} is registered, instructions have been emailed.`);
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden">
      {/* Background aesthetic decorative gradients */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Brand Presentation */}
        <div className="lg:col-span-6 text-white space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-indigo-300 backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold tracking-wide uppercase">Apex Institute of Technology & Sciences</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Faculty & Employee <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">Management</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
              CampusHR powers institutional operations, role-based governance, faculty attendance, leaves, biometric validation, and salary disbursement for higher education.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
              <Shield className="w-5 h-5 text-indigo-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Strict RBAC</h4>
              <p className="text-[11px] text-slate-400">Admin read/write & Employee read-only profiles.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
              <Building className="w-5 h-5 text-emerald-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Academic Units</h4>
              <p className="text-[11px] text-slate-400">Department metrics, faculty & lab ratios.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
              <Award className="w-5 h-5 text-amber-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Payroll & Slips</h4>
              <p className="text-[11px] text-slate-400">Monthly payslips, HRA, DA & tax breakdowns.</p>
            </div>
          </div>

          {/* Quick Demo Personas */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Demo Persona (1-Click Test):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'sarah.vance@campushr.edu')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white group-hover:text-indigo-200 truncate">
                    Dr. Sarah Vance (Admin)
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Full Read + Write System Access</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('employee', 'alex.rivera@campushr.edu')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white group-hover:text-emerald-200 truncate">
                    Prof. Alex Rivera (Faculty)
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Employee (Read-Only Self-Service)</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Login Form Card */}
        <div className="lg:col-span-6 max-w-md mx-auto w-full">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 text-slate-100">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg mb-1">
                <GraduationCap className="w-6 h-6" />
                <span>CampusHR Portal</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to your account</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your role and authenticate with your institutional credentials.
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="mb-5 p-1 bg-slate-950 rounded-xl border border-slate-800 flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setEmail('sarah.vance@campushr.edu');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>College Admin</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('employee');
                  setEmail('alex.rivera@campushr.edu');
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'employee'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Faculty / Staff</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@campushr.edu"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-10 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/20"
                  />
                  <span>Remember session on this device</span>
                </label>
              </div>

              <Button
                type="submit"
                variant={role === 'admin' ? 'primary' : 'success'}
                isLoading={isLoading}
                className="w-full py-2.5 mt-2"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Log In as {role === 'admin' ? 'Administrator' : 'Employee'}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              <span>Protected by College 2FA & SSO Security</span>
              <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Biometric Sync
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> FERPA Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Campus Account Password"
        description="Enter your registered college email address to receive password recovery instructions."
        maxWidth="md"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <Input
            label="Institutional Email Address"
            type="email"
            required
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="e.g. employee@campushr.edu"
            icon={<Mail className="w-4 h-4" />}
            helperText="Instructions will be delivered to your registered inbox."
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForgotModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={forgotSent}
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

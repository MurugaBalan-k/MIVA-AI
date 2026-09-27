import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, ArrowRight, Lock, Mail, User, Briefcase, Hash, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function AuthScreens() {
  const {
    currentScreen,
    setCurrentScreen,
    signup,
    login,
    adminLogin,
    updateProfile,
    authError,
    setAuthError,
    authSuccess,
    setAuthSuccess,
    isLoading,
    user
  } = useAuth();

  const { language, toggleLanguage, t } = useLanguage();

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [adminForm, setAdminForm] = useState({
    adminId: '',
    password: ''
  });

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    employeeId: '',
    role: 'Operator',
    department: 'Shop Floor Operations',
    profilePhoto: ''
  });

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    const res = await signup(signupForm);
    if (res.success) {
      setTimeout(() => {
        setCurrentScreen('login');
      }, 1200);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(loginForm);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    await adminLogin(adminForm);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profileForm);
  };

  return (
    <div className="min-h-screen flowing-bg flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Floating Ambient Orbs */}
      <div className="ambient-glow-orb ambient-glow-cyan w-96 h-96 top-10 -left-20"></div>
      <div className="ambient-glow-orb ambient-glow-blue w-96 h-96 bottom-10 -right-20"></div>

      {/* Top Language & Branding Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/miva_logo_transparent.png"
            alt="MIVA AI"
            className="w-9 h-9 object-contain drop-shadow-[0_4px_14px_rgba(0,140,255,0.4)]"
          />
          <div className="font-['Manrope'] font-bold text-sm tracking-tight text-miva-navy">
            L&T <span className="text-miva-electric">MIVA AI</span>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center rounded-full bg-white/80 p-0.5 border border-miva-cardBorder text-xs font-bold shadow-sm">
          <button
            onClick={() => toggleLanguage('en')}
            className={`px-3.5 py-1 rounded-full transition-all ${
              language === 'en' ? 'bg-gradient-to-r from-miva-royal to-miva-electric text-white shadow-sm' : 'text-miva-navy/70 hover:text-miva-navy'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => toggleLanguage('ta')}
            className={`px-3.5 py-1 rounded-full transition-all ${
              language === 'ta' ? 'bg-gradient-to-r from-miva-royal to-miva-electric text-white shadow-sm' : 'text-miva-navy/70 hover:text-miva-navy'
            }`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6 relative z-10">
        {/* ============================================================ */}
        {/* 1. WELCOME SCREEN (Section 9) */}
        {/* ============================================================ */}
        {currentScreen === 'welcome' && (
          <div className="ultra-glass rounded-4xl p-8 sm:p-11 text-center shadow-miva-hover border border-white/80 animate-message-slide relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-miva-cyan/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative inline-block mb-6">
              <img
                src="/assets/miva_logo_transparent.png"
                alt="MIVA AI"
                className="w-24 h-24 sm:w-28 sm:h-28 mx-auto object-contain drop-shadow-[0_16px_36px_rgba(0,140,255,0.45)] hover:scale-108 transition-all duration-300"
              />
              <div className="absolute -inset-3 bg-gradient-to-r from-miva-cyan/40 via-miva-electric/30 to-miva-royal/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-miva-navy font-['Manrope'] tracking-tight mb-2">
              {t('welcomeTitle')}
            </h1>

            <p className="text-xs sm:text-sm text-miva-muted mb-8 leading-relaxed max-w-xs mx-auto">
              {t('welcomeSubtitle')}
            </p>

            <div className="space-y-3.5">
              <button
                onClick={() => {
                  setAuthError('');
                  setAuthSuccess('');
                  setCurrentScreen('signup');
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-miva-royal via-miva-electric to-miva-cyan text-white font-bold text-sm shadow-md hover:shadow-miva-glow transition-all flex items-center justify-center gap-2 group active:scale-98"
              >
                <span>{t('getStarted')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </button>

              <button
                onClick={() => {
                  setAuthError('');
                  setAuthSuccess('');
                  setCurrentScreen('login');
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-white/90 hover:bg-white text-miva-navy font-bold text-sm border border-miva-cardBorder/90 shadow-sm hover:shadow-miva-soft transition-all active:scale-98"
              >
                {t('signIn')}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-miva-cardBorder/60 flex items-center justify-center">
              <button
                onClick={() => {
                  setAuthError('');
                  setCurrentScreen('admin-login');
                }}
                className="text-xs text-miva-muted hover:text-miva-royal transition-colors flex items-center gap-1.5 font-semibold"
              >
                <Shield className="w-3.5 h-3.5 text-miva-royal" />
                <span>{t('adminLogin')}</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. SIGNUP SCREEN (Section 10) */}
        {/* ============================================================ */}
        {currentScreen === 'signup' && (
          <div className="ultra-glass rounded-4xl p-8 sm:p-10 shadow-miva-hover border border-white/80 animate-message-slide">
            <div className="text-center mb-6">
              <div className="font-['Manrope'] text-xl sm:text-2xl font-extrabold text-miva-navy tracking-tight">
                {t('createAccount')}
              </div>
              <p className="text-xs text-miva-muted mt-1">
                L&T Shop-Floor Personnel Registration
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('fullName')}</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-miva-muted" />
                  <input
                    type="text"
                    required
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    placeholder="e.g. Ramesh K"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric focus:ring-2 focus:ring-miva-sky/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('email')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-miva-muted" />
                  <input
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="name@lt.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric focus:ring-2 focus:ring-miva-sky/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('password')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-miva-muted" />
                  <input
                    type="password"
                    required
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric focus:ring-2 focus:ring-miva-sky/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('confirmPassword')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-miva-muted" />
                  <input
                    type="password"
                    required
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric focus:ring-2 focus:ring-miva-sky/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-miva-royal via-miva-electric to-miva-cyan text-white font-bold text-xs shadow-md hover:shadow-miva-glow transition-all disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : t('createAccountBtn')}
              </button>
            </form>

            <div className="mt-5 text-center">
              <span className="text-xs text-miva-muted">Already have an account? </span>
              <button
                onClick={() => {
                  setAuthError('');
                  setCurrentScreen('login');
                }}
                className="text-xs font-bold text-miva-royal hover:underline"
              >
                {t('signIn')}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. LOGIN SCREEN (Section 11) */}
        {/* ============================================================ */}
        {currentScreen === 'login' && (
          <div className="ultra-glass rounded-4xl p-8 sm:p-10 shadow-miva-hover border border-white/80 animate-message-slide">
            <div className="text-center mb-6">
              <div className="font-['Manrope'] text-xl sm:text-2xl font-extrabold text-miva-navy tracking-tight">
                {t('welcomeBack')}
              </div>
              <p className="text-xs text-miva-muted mt-1">
                Enter your credentials to access MIVA AI
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('email')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-miva-muted" />
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="name@lt.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric focus:ring-2 focus:ring-miva-sky/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('password')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-miva-muted" />
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric focus:ring-2 focus:ring-miva-sky/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-miva-royal via-miva-electric to-miva-cyan text-white font-bold text-xs shadow-md hover:shadow-miva-glow transition-all disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : t('signIn')}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-xs pt-4 border-t border-miva-cardBorder/60">
              <button
                onClick={() => {
                  setAuthError('');
                  setCurrentScreen('signup');
                }}
                className="text-miva-royal hover:underline font-bold"
              >
                Create new account
              </button>

              <button
                onClick={() => {
                  setAuthError('');
                  setCurrentScreen('admin-login');
                }}
                className="text-miva-muted hover:text-miva-royal flex items-center gap-1 font-bold transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-miva-royal" />
                <span>{t('adminLogin')}</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. ADMIN LOGIN SCREEN (Section 12) */}
        {/* ============================================================ */}
        {currentScreen === 'admin-login' && (
          <div className="ultra-glass rounded-4xl p-8 sm:p-10 shadow-miva-hover border border-miva-cyan/40 relative overflow-hidden animate-message-slide">
            <div className="absolute top-0 right-0 w-28 h-28 bg-miva-cyan/15 rounded-full blur-2xl pointer-events-none"></div>

            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-miva-navy text-miva-cyan mb-2 shadow-md">
                <Shield className="w-6 h-6" />
              </div>
              <div className="font-['Manrope'] text-xl font-extrabold text-miva-navy tracking-tight">
                Enterprise Admin Portal
              </div>
              <p className="text-xs text-miva-muted mt-1">
                Governed Knowledge & Shop-Floor Controls
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">Admin ID</label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3.5 top-3.5 text-miva-muted" />
                  <input
                    type="text"
                    required
                    value={adminForm.adminId}
                    onChange={(e) => setAdminForm({ ...adminForm, adminId: e.target.value })}
                    placeholder="ADMIN-LT-01 or admin@lt.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric focus:ring-2 focus:ring-miva-sky/30 transition-all font-mono shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">Admin Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-miva-muted" />
                  <input
                    type="password"
                    required
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric focus:ring-2 focus:ring-miva-sky/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-2xl bg-miva-navy text-white hover:bg-miva-darkBlue font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-miva-cyan" />
                <span>{isLoading ? 'Verifying...' : 'Authorize Admin Access'}</span>
              </button>
            </form>

            <div className="mt-5 text-center pt-3 border-t border-miva-cardBorder/60">
              <button
                onClick={() => {
                  setAuthError('');
                  setCurrentScreen('login');
                }}
                className="text-xs text-miva-muted hover:text-miva-royal font-semibold"
              >
                ← Return to User Login
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. USER PROFILE SETUP SCREEN (Section 13) */}
        {/* ============================================================ */}
        {currentScreen === 'profile-setup' && (
          <div className="ultra-glass rounded-4xl p-8 sm:p-10 shadow-miva-hover border border-white/80 animate-message-slide">
            <div className="text-center mb-6">
              <div className="font-['Manrope'] text-xl sm:text-2xl font-extrabold text-miva-navy tracking-tight">
                {t('setupProfile')}
              </div>
              <p className="text-xs text-miva-muted mt-1">
                Personalize your shop-floor assistance context
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('fullName')}</label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('employeeId')}</label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3.5 top-3.5 text-miva-muted" />
                  <input
                    type="text"
                    required
                    value={profileForm.employeeId}
                    onChange={(e) => setProfileForm({ ...profileForm, employeeId: e.target.value })}
                    placeholder="e.g. LT-84920"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric font-mono shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('role')}</label>
                <select
                  value={profileForm.role}
                  onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric shadow-sm font-semibold"
                >
                  <option value="Operator">Operator</option>
                  <option value="Technician">Technician</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('department')}</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-miva-muted" />
                  <input
                    type="text"
                    required
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    placeholder="e.g. Valve Machining Bay / Heavy Fabrication"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-miva-royal via-miva-electric to-miva-cyan text-white font-bold text-xs shadow-md hover:shadow-miva-glow transition-all"
              >
                {isLoading ? 'Saving...' : t('continue')}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-miva-muted/80 py-2 relative z-10">
        MIVA AI © 2026 — Larsen & Toubro Advanced Manufacturing
      </div>
    </div>
  );
}

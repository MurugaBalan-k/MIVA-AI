import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Settings, Globe, User, Bell, Palette, CheckCircle, Shield } from 'lucide-react';

export default function SettingsView() {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, updateProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    employeeId: user?.employeeId || '',
    role: user?.role || 'Operator',
    department: user?.department || 'Shop Floor Operations'
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [appearance, setAppearance] = useState('light');
  const [notifications, setNotifications] = useState(true);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(profileData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-miva-royal uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4 text-miva-royal" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-miva-navy font-['Manrope'] tracking-tight">
          {t('settings')}
        </h1>
        <p className="text-xs sm:text-sm text-miva-muted mt-1">
          Configure interface language, shop-floor role, and station parameters.
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Language Setting */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-miva-cardBorder/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-miva-pale text-miva-royal border border-miva-sky/30">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Manrope'] font-bold text-sm text-miva-navy">Language / மொழி</h3>
                <p className="text-xs text-miva-muted">Choose your preferred shop-floor language</p>
              </div>
            </div>

            <div className="flex items-center rounded-2xl bg-miva-pale p-1 border border-miva-cardBorder">
              <button
                onClick={() => toggleLanguage('en')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-miva-royal text-white shadow-sm'
                    : 'text-miva-navy/70 hover:text-miva-navy'
                }`}
              >
                English
              </button>
              <button
                onClick={() => toggleLanguage('ta')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  language === 'ta'
                    ? 'bg-miva-royal text-white shadow-sm'
                    : 'text-miva-navy/70 hover:text-miva-navy'
                }`}
              >
                தமிழ் (Tamil)
              </button>
            </div>
          </div>
        </div>

        {/* 2. User Profile Setting */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-miva-cardBorder/80 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-2xl bg-miva-pale text-miva-royal border border-miva-sky/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Manrope'] font-bold text-sm text-miva-navy">Shop-Floor Profile</h3>
              <p className="text-xs text-miva-muted">Operator details and assigned department</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('fullName')}</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('employeeId')}</label>
                <input
                  type="text"
                  value={profileData.employeeId}
                  onChange={(e) => setProfileData({ ...profileData, employeeId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-miva-navy mb-1">{t('role')}</label>
                <select
                  value={profileData.role}
                  onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric"
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
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              {saveSuccess && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Profile updated successfully!</span>
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-5 py-2 rounded-xl bg-miva-royal text-white text-xs font-semibold hover:bg-miva-electric transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* 3. Appearance & Shop Floor Mode */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-miva-cardBorder/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-miva-pale text-miva-royal border border-miva-sky/30">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Manrope'] font-bold text-sm text-miva-navy">Display Appearance</h3>
                <p className="text-xs text-miva-muted">Standard pale-blue clean theme with blue atmospheric lighting</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Active: Pale Blue White (#F2F9FF)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  BookOpen,
  Layers,
  Info,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Smartphone,
  Cpu,
  Flame,
  Activity,
  Zap,
  Box
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onNewChat,
  onSelectLine
}) {
  const { t, language, toggleLanguage } = useLanguage();
  const { user, logout, setCurrentScreen } = useAuth();

  const productionLines = [
    { id: 'line-01', name: 'Valve Manufacturing', icon: Activity, stages: 'CNC → Machining → Testing' },
    { id: 'line-02', name: 'Pump Manufacturing', icon: Box, stages: 'Machining → Assembly → Testing' },
    { id: 'line-03', name: 'Gearbox Manufacturing', icon: Cpu, stages: 'Gear Machining → Assembly → Testing' },
    { id: 'line-04', name: 'Heavy Fabrication', icon: Flame, stages: 'Cutting → Welding → Inspection' },
    { id: 'line-05', name: 'Electrical Panel', icon: Zap, stages: 'Assembly → Wiring → Testing' }
  ];

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024 && onClose) onClose();
  };

  const handleLineClick = (lineId) => {
    if (onSelectLine) onSelectLine(lineId);
    setActiveTab('lines');
    if (window.innerWidth < 1024 && onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-miva-navy/40 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 ultra-glass border-r border-white/60 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-2 py-3 mb-4">
            <div className="relative group cursor-pointer" onClick={() => handleNavClick('chat')}>
<img
  src="/assets/miva_logo_transparent.png"
  alt="MIVA AI"
  className="sidebar-logo"
/>
              <span className="absolute -inset-1.5 rounded-full bg-miva-cyan/30 blur-md -z-10 group-hover:bg-miva-cyan/50 transition-colors glow-ring"></span>
            </div>
            <div>
              <div className="flex items-center gap-1 font-['Manrope']">
                <span className="font-extrabold text-xl text-miva-navy tracking-tight">MIVA</span>
                <span className="font-bold text-xl text-miva-electric">AI</span>
              </div>
              <p className="text-[10px] text-miva-muted uppercase tracking-wider font-bold">
                Shop-Floor Partner
              </p>
            </div>
          </div>

          {/* + New Chat Button with Shimmer Sweep */}
          <button
            onClick={() => {
              if (onNewChat) onNewChat();
              handleNavClick('chat');
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-miva-royal via-miva-electric to-miva-cyan text-white font-semibold text-sm shadow-md hover:shadow-miva-glow hover:-translate-y-0.5 transition-all duration-300 mb-5 group active:scale-98 btn-shine btn-press"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span>{t('newChat')}</span>
          </button>

          {/* Core Navigation Links */}
          <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-miva-muted/80">Workspace</div>
          <nav className="space-y-1.5">
            {[
              { id: 'library', label: t('library'), icon: BookOpen, color: 'text-miva-royal' },
              { id: 'lines', label: t('lines'), icon: Layers, color: 'text-miva-electric' },
              { id: 'about', label: t('aboutMiva'), icon: Info, color: 'text-miva-cyan' },
              { id: 'settings', label: t('settings'), icon: Settings, color: 'text-miva-muted' },
              { id: 'mobile-showcase', label: t('mobileShowcase'), icon: Smartphone, color: 'text-miva-cyan', isSpecial: true }
            ].map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{ animationDelay: `${index * 45}ms` }}
                  className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300 animate-stagger-in btn-press ${
                    isActive
                      ? 'bg-gradient-to-r from-white to-miva-pale text-miva-royal shadow-sm border border-miva-cardBorder'
                      : 'text-miva-navy/75 hover:bg-white/70 hover:text-miva-navy hover:translate-x-0.5'
                  }`}
                >
                  {isActive && (
                    <span className="active-indicator-bar absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 rounded-full bg-gradient-to-b from-miva-electric to-miva-cyan" />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-miva-royal scale-110' : item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isSpecial ? (
                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-miva-cyan/20 text-miva-royal px-1.5 py-0.5 rounded-md">
                      Ref
                    </span>
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 text-miva-muted/60 transition-transform duration-300 ${isActive ? 'translate-x-0.5' : ''}`} />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="my-4 border-t border-miva-cardBorder/60"></div>

          {/* Production Lines Section */}
          <div className="px-3 mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-miva-muted">
              {t('productionLines')}
            </h3>
            <span className="text-[10px] font-bold text-miva-royal bg-miva-pale px-1.5 py-0.5 rounded-full">5</span>
          </div>

          <div className="space-y-1">
            {productionLines.map((line, index) => {
              const Icon = line.icon;
              return (
                <button
                  key={line.id}
                  onClick={() => handleLineClick(line.id)}
                  style={{ animationDelay: `${200 + index * 40}ms` }}
                  className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-white/80 hover:translate-x-0.5 text-xs font-semibold text-miva-navy/80 hover:text-miva-royal transition-all duration-300 flex items-center gap-2.5 group animate-stagger-in btn-press"
                >
                  <Icon className="w-3.5 h-3.5 text-miva-royal/70 group-hover:text-miva-royal group-hover:scale-115 transition-transform duration-300" />
                  <span className="truncate">{line.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Profile & Logout Bottom */}
        <div className="border-t border-miva-cardBorder/60 pt-3 space-y-2">
          {/* Language Switcher */}
          <div className="flex items-center justify-between px-2 py-1.5 rounded-2xl bg-white/65 border border-miva-cardBorder/70 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-miva-muted">Language</span>
            <div className="flex items-center rounded-full bg-miva-pale/80 p-0.5 border border-miva-sky/30 text-[10px] font-bold">
              <button
                onClick={() => toggleLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${language === 'en' ? 'bg-gradient-to-r from-miva-royal to-miva-electric text-white shadow-sm' : 'text-miva-navy/65 hover:text-miva-navy'}`}
              >
                EN
              </button>
              <button
                onClick={() => toggleLanguage('ta')}
                className={`px-2.5 py-1 rounded-full transition-all ${language === 'ta' ? 'bg-gradient-to-r from-miva-royal to-miva-electric text-white shadow-sm' : 'text-miva-navy/65 hover:text-miva-navy'}`}
              >
                தமிழ்
              </button>
            </div>
          </div>

          <div className="border-t border-miva-cardBorder/40 pt-2">
          {user && (
            <div
              onClick={() => handleNavClick('settings')}
              className="flex items-center justify-between p-2 rounded-2xl bg-white/70 hover:bg-white cursor-pointer transition-all border border-miva-sky/30 shadow-sm"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-miva-royal to-miva-cyan text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                  {user.fullName ? user.fullName.charAt(0) : 'U'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-miva-navy truncate">{user.fullName}</div>
                  <div className="text-[10px] text-miva-muted truncate">{user.employeeId || user.role}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setCurrentScreen('admin-login')}
              className="text-[11px] text-miva-muted hover:text-miva-royal flex items-center gap-1 transition-colors font-medium"
            >
              <Shield className="w-3 h-3 text-miva-royal" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={logout}
              className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors font-bold"
            >
              <LogOut className="w-3 h-3" />
              <span>{t('logout')}</span>
            </button>
          </div>
          </div>
        </div>
      </aside>
    </>
  );
}

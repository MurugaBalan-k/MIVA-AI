import React, { useState, useEffect } from 'react';
import { fetchDevelopers, updateDeveloper } from '../services/api';
import { Info, Sparkles, Upload, CheckCircle, ShieldCheck, Heart } from 'lucide-react';

export default function AboutView() {
  const [developers, setDevelopers] = useState([]);
  const [editingDev, setEditingDev] = useState(null);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchDevelopers().then(devs => setDevelopers(devs));
  }, []);

  const handleUpdateAvatar = async (devId) => {
    if (!newAvatarUrl) return;
    const res = await updateDeveloper(devId, { avatar: newAvatarUrl });
    if (res.developer) {
      setDevelopers(prev => prev.map(d => d.id === devId ? res.developer : d));
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingDev(null);
        setNewAvatarUrl('');
      }, 1500);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Brand Hero Card */}
      <div className="glass-card premium-hover-lift rounded-4xl p-8 sm:p-10 border border-miva-cardBorder/90 shadow-miva-soft text-center relative overflow-hidden animate-page-in">
        <div className="relative inline-block mb-4">
          <img
            src="/assets/miva_logo_transparent.png"
            alt="MIVA AI Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain drop-shadow-[0_12px_24px_rgba(0,140,255,0.4)] animate-image-reveal"
          />
          <div className="absolute -inset-3 bg-miva-cyan/20 rounded-full blur-xl -z-10 glow-ring"></div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gradient-flow font-['Manrope'] tracking-tight">
          MIVA AI
        </h1>
        <p className="text-sm font-bold text-miva-electric tracking-wide uppercase mt-1">
          Manufacturing Intelligence & Vision Assistant
        </p>

        <p className="text-xs sm:text-sm text-miva-muted max-w-lg mx-auto mt-3 leading-relaxed">
          AI-powered shop-floor knowledge assistance for Larsen & Toubro manufacturing operations. Governed procedures, instant machine troubleshooting, and multimodal equipment inspection.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-miva-pale border border-miva-sky/40 text-xs font-semibold text-miva-royal">
          <ShieldCheck className="w-3.5 h-3.5 text-miva-cyan" />
          <span>Strict Enterprise Safety & Revision Governance</span>
        </div>
      </div>

      {/* Developed By Section (Section 8 & 38) */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-miva-navy font-['Manrope']">
            MIVA AI Core Development Team
          </h2>
          <p className="text-xs text-miva-muted mt-0.5">
            Leadership, experience engineering, platform engineering & AI systems integration
          </p>
        </div>

        {/* 4 Small Elegant Developer Profile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {developers.map((dev, index) => (
            <div
              key={dev.id}
              style={{ animationDelay: `${index * 80}ms` }}
              className="glass-card glass-card-hover premium-hover-lift p-5 rounded-3xl border border-miva-cardBorder/80 text-center flex flex-col items-center justify-between transition-all duration-300 animate-stagger-in"
            >
              <div className="w-full flex flex-col items-center">
                {/* Developer Photo / Avatar */}
                <div className="relative mb-3 group">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md shadow-miva-royal/10 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.src = '/assets/miva_logo_transparent.png';
                    }}
                  />
                  <button
                    onClick={() => {
                      setEditingDev(dev.id);
                      setNewAvatarUrl(dev.avatar);
                    }}
                    title="Replace with real uploaded portrait"
                    className="absolute bottom-0 right-0 p-1.5 rounded-xl bg-miva-royal text-white text-[10px] shadow-sm hover:bg-miva-electric transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                  </button>
                </div>

                {/* Name */}
                <h3 className="font-['Manrope'] font-bold text-xs sm:text-sm text-miva-navy">
                  {dev.name}
                </h3>

                {/* Role */}
                <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full bg-miva-pale border border-miva-sky/40 text-[10px] font-bold text-miva-royal">
                  {dev.role}
                </div>

                {/* Department */}
                <p className="text-[10px] text-miva-muted mt-2 leading-relaxed">
                  {dev.department}
                </p>
              </div>

              {/* Photo replace prompt trigger */}
              <div className="mt-4 pt-3 border-t border-miva-cardBorder/50 w-full text-[10px] text-miva-muted/80">
                L&T Operations
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Asset Replacement Modal */}
      {editingDev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-miva-navy/60 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-sm w-full border border-miva-cardBorder shadow-2xl">
            <h3 className="font-bold text-sm text-miva-navy mb-1 font-['Manrope']">
              Update Developer Portrait
            </h3>
            <p className="text-xs text-miva-muted mb-4">
              Enter photo asset URL or file path to replace temporary placeholder.
            </p>

            <input
              type="text"
              value={newAvatarUrl}
              onChange={(e) => setNewAvatarUrl(e.target.value)}
              placeholder="e.g. /assets/winson_real.jpg or https://..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-miva-cardBorder mb-4 text-miva-navy focus:outline-none focus:border-miva-electric"
            />

            {saveSuccess && (
              <div className="text-xs text-emerald-600 font-semibold mb-3 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Asset updated successfully!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingDev(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-miva-navy/70 hover:bg-miva-pale"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateAvatar(editingDev)}
                className="px-4 py-1.5 rounded-xl bg-miva-royal text-white text-xs font-semibold hover:bg-miva-electric transition-colors"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { ShieldCheck, FileCheck, Camera, Zap, CheckCircle2, ChevronRight, MessageSquare, ArrowLeft } from 'lucide-react';

export default function MobileShowcaseView({ onBackToApp }) {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#F0F6FC] text-miva-navy flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden select-none">
      {/* Background Atmosphere (Section 4) */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-gradient-to-br from-miva-cyan/15 via-miva-sky/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-gradient-to-tr from-miva-royal/10 via-miva-electric/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Commercial Header */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="p-2 rounded-2xl bg-white border border-miva-cardBorder text-miva-royal hover:bg-miva-pale shadow-sm transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <img src="/assets/miva_logo_transparent.png" alt="MIVA AI" className="w-9 h-9 object-contain drop-shadow-[0_2px_10px_rgba(0,140,255,0.4)]" />
            <div>
              <div className="font-['Manrope'] font-extrabold text-xl tracking-tight text-miva-navy flex items-center gap-1">
                <span>MIVA</span>
                <span className="text-miva-electric">AI</span>
              </div>
              <p className="text-[10px] text-miva-muted uppercase font-bold tracking-wider">
                Manufacturing Intelligence & Vision Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Center Tagline */}
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-miva-royal block font-['Manrope']">
            Your Shop Floor Knowledge Partner
          </span>
          <div className="w-12 h-1 bg-gradient-to-r from-miva-royal to-miva-cyan mx-auto rounded-full mt-1"></div>
        </div>

        {/* Commercial Highlights Badges */}
        <div className="hidden lg:flex flex-col gap-1.5 text-xs font-semibold text-miva-navy">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-miva-cyan shrink-0" />
            <span>Accurate Governed Answers</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-3.5 h-3.5 text-miva-royal shrink-0" />
            <span>Internal Safety Trace</span>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-miva-electric shrink-0" />
            <span>Multimodal Vision Inspection</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-miva-cyan shrink-0" />
            <span>Engineered for L&T Operations</span>
          </div>
        </div>
      </div>

      {/* Center 4 Devices Showcase (Section 41 & Reference Image) */}
      <div className="w-full max-w-7xl mx-auto my-auto py-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
          {/* DEVICE 1: Dark Navy Hero Phone (Splash / Welcome) */}
          <div className="w-[270px] h-[550px] rounded-[44px] p-3 bg-gradient-to-b from-[#1C2C4E] to-[#06183D] border-[4px] border-[#384A6E] shadow-phone-frame relative flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-transform">
            {/* Dynamic Island */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#111] mr-3"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a1f3d] ring-1 ring-[#00cfff]/40"></div>
            </div>

            {/* Glossy Reflection Highlight */}
            <div className="absolute top-0 right-0 w-32 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-tr-[44px] pointer-events-none"></div>

            {/* Phone Screen Content */}
            <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
              <div className="relative mb-6">
                <img
                  src="/assets/miva_logo_transparent.png"
                  alt="MIVA AI Logo"
                  className="w-24 h-24 object-contain drop-shadow-[0_15px_30px_rgba(0,140,255,0.7)] animate-pulse"
                />
                <div className="absolute -inset-4 bg-miva-cyan/30 rounded-full blur-2xl -z-10"></div>
              </div>

              <h2 className="text-2xl font-extrabold text-white font-['Manrope'] tracking-tight">
                MIVA <span className="text-miva-cyan">AI</span>
              </h2>
              <p className="text-[11px] text-miva-sky/90 mt-1 max-w-[190px] leading-tight">
                Manufacturing Intelligence & Vision Assistant
              </p>

              {/* Progress loader */}
              <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden mt-12 mb-2">
                <div className="w-2/3 h-full bg-gradient-to-r from-miva-cyan to-miva-electric rounded-full animate-pulse"></div>
              </div>
              <p className="text-[9px] text-miva-sky/60 font-medium">
                Loading your industrial knowledge...
              </p>
            </div>

            <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mb-1"></div>
          </div>

          {/* DEVICE 2: Light Home Phone (Hello, How can I help you today?) */}
          <div className="w-[270px] h-[550px] rounded-[44px] p-3 bg-gradient-to-b from-[#EBF4FC] to-[#F2F9FF] border-[4px] border-[#CBDDF0] shadow-phone-frame relative flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-transform">
            {/* Dynamic Island */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#111] mr-3"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a1f3d]"></div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 flex flex-col px-3 pt-2 text-left">
              {/* Header inside phone */}
              <div className="flex items-center justify-between mb-3">
                <img src="/assets/miva_logo_transparent.png" alt="MIVA" className="w-6 h-6 object-contain" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-miva-royal to-miva-cyan text-white text-[10px] font-bold flex items-center justify-center">
                  W
                </div>
              </div>

              <div className="text-[11px] text-miva-muted font-medium">Hello,</div>
              <div className="font-['Manrope'] font-extrabold text-sm text-miva-navy leading-tight mt-0.5">
                How can I help you today?
              </div>
              <p className="text-[9px] text-miva-muted mt-1 leading-snug">
                Get instant answers from L&T's manufacturing knowledge base.
              </p>

              {/* 2 Main Action Cards */}
              <div className="grid grid-cols-2 gap-2 mt-4 mb-3">
                <div className="p-2.5 rounded-2xl bg-white border border-miva-cardBorder shadow-sm">
                  <div className="w-6 h-6 rounded-xl bg-miva-pale flex items-center justify-center mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-miva-royal" />
                  </div>
                  <div className="text-[10px] font-bold text-miva-navy leading-tight">Ask a Question</div>
                  <div className="text-[8px] text-miva-muted mt-0.5 leading-tight">From SOPs & manuals</div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white border border-miva-cardBorder shadow-sm">
                  <div className="w-6 h-6 rounded-xl bg-miva-pale flex items-center justify-center mb-1">
                    <Camera className="w-3.5 h-3.5 text-miva-electric" />
                  </div>
                  <div className="text-[10px] font-bold text-miva-navy leading-tight">Upload Image</div>
                  <div className="text-[8px] text-miva-muted mt-0.5 leading-tight">Identify procedures</div>
                </div>
              </div>

              {/* Smart Manufacturing Card */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-miva-navy to-miva-royal text-white shadow-sm mt-auto mb-2 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-bold tracking-tight">Smart Manufacturing</div>
                  <div className="text-[8px] text-miva-sky">Starts with Knowledge</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-miva-cyan" />
              </div>

              {/* Bottom Nav Bar inside phone */}
              <div className="flex justify-around py-1.5 border-t border-miva-cardBorder/60 text-[9px] font-semibold text-miva-muted">
                <span className="text-miva-royal font-bold">Home</span>
                <span>Chat</span>
                <span>Lines</span>
                <span>More</span>
              </div>
            </div>

            <div className="w-28 h-1 bg-black/20 rounded-full mx-auto mb-1"></div>
          </div>

          {/* DEVICE 3: Light Chat Phone (Question & Step-by-Step Answer) */}
          <div className="w-[270px] h-[550px] rounded-[44px] p-3 bg-gradient-to-b from-[#EBF4FC] to-[#F2F9FF] border-[4px] border-[#CBDDF0] shadow-phone-frame relative flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-transform">
            {/* Dynamic Island */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#111] mr-3"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a1f3d]"></div>
            </div>

            {/* Chat Screen Content */}
            <div className="flex-1 flex flex-col px-3 pt-2 text-left space-y-2.5">
              {/* Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-miva-cardBorder/60">
                <img src="/assets/miva_logo_transparent.png" alt="MIVA" className="w-5 h-5 object-contain" />
                <div>
                  <div className="text-[11px] font-bold text-miva-navy leading-none">MIVA AI</div>
                  <div className="text-[8px] text-emerald-600 font-semibold leading-none mt-0.5">● Online</div>
                </div>
              </div>

              {/* User question bubble */}
              <div className="self-end bg-gradient-to-r from-miva-royal to-miva-electric text-white p-2.5 rounded-2xl rounded-br-none text-[10px] max-w-[200px] shadow-sm">
                What should I do if the machine temperature reaches 90°C?
              </div>

              {/* MIVA concise step-by-step answer (Section 18 & Reference Image) */}
              <div className="self-start bg-white p-2.5 rounded-2xl rounded-bl-none text-[9.5px] max-w-[220px] shadow-sm border border-miva-cardBorder text-miva-navy space-y-1">
                <div className="font-semibold text-miva-royal">Temperature Alarm Procedure:</div>
                <div className="flex items-start gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-miva-royal text-white text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Stop the cycle immediately.</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-miva-royal text-white text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Check coolant condition and flow rate.</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-miva-royal text-white text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Inspect for blockage in the cooling system.</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-miva-royal text-white text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span>If temperature remains high, follow approved cooling procedure.</span>
                </div>
              </div>

              {/* Bottom input inside phone */}
              <div className="mt-auto pt-2 flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-miva-cardBorder text-[9px] text-miva-muted">
                <Camera className="w-3.5 h-3.5 text-miva-royal ml-1" />
                <span className="truncate">Ask anything about machines...</span>
                <div className="ml-auto w-5 h-5 rounded-xl bg-miva-royal text-white flex items-center justify-center text-[10px]">
                  →
                </div>
              </div>
            </div>

            <div className="w-28 h-1 bg-black/20 rounded-full mx-auto mb-1"></div>
          </div>

          {/* DEVICE 4: Light Multimodal Vision Phone (Equipment Diagnosis) */}
          <div className="w-[270px] h-[550px] rounded-[44px] p-3 bg-gradient-to-b from-[#EBF4FC] to-[#F2F9FF] border-[4px] border-[#CBDDF0] shadow-phone-frame relative flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-transform">
            {/* Dynamic Island */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#111] mr-3"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a1f3d]"></div>
            </div>

            {/* Vision Diagnosis Screen Content */}
            <div className="flex-1 flex flex-col px-3 pt-2 text-left space-y-2">
              {/* Header */}
              <div className="flex items-center gap-2 pb-1.5 border-b border-miva-cardBorder/60">
                <img src="/assets/miva_logo_transparent.png" alt="MIVA" className="w-5 h-5 object-contain" />
                <span className="text-[11px] font-bold text-miva-navy">MIVA AI Vision</span>
              </div>

              {/* User question */}
              <div className="self-end bg-gradient-to-r from-miva-royal to-miva-electric text-white p-2 rounded-2xl rounded-br-none text-[9.5px] max-w-[200px]">
                Identify this part and give procedure for replacement.
              </div>

              {/* Image preview with bounding box */}
              <div className="self-end relative rounded-xl overflow-hidden border-2 border-miva-royal/40 w-36 h-20 bg-slate-800">
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center">
                  <div className="w-12 h-10 border-2 border-red-500 rounded bg-red-500/20 flex items-center justify-center">
                    <span className="text-[7px] text-white font-mono">GCP-204</span>
                  </div>
                </div>
              </div>

              {/* MIVA concise diagnosis answer (Section 23) */}
              <div className="self-start bg-white p-2.5 rounded-2xl rounded-bl-none text-[9px] max-w-[220px] shadow-sm border border-miva-cardBorder text-miva-navy space-y-1">
                <div className="font-bold text-miva-royal">
                  Gearbox Cooling Pump (Part No. GCP-204)
                </div>
                <div className="text-[8.5px] text-miva-muted leading-tight">Replacement procedure:</div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-miva-royal text-white text-[7px] font-bold flex items-center justify-center shrink-0">1</span>
                    <span>Isolate power supply.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-miva-royal text-white text-[7px] font-bold flex items-center justify-center shrink-0">2</span>
                    <span>Drain coolant into clean drum.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-miva-royal text-white text-[7px] font-bold flex items-center justify-center shrink-0">3</span>
                    <span>Remove mounting flange bolts.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-miva-royal text-white text-[7px] font-bold flex items-center justify-center shrink-0">4</span>
                    <span>Install new pump & check alignment.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-miva-royal text-white text-[7px] font-bold flex items-center justify-center shrink-0">5</span>
                    <span>Refill coolant and test run.</span>
                  </div>
                </div>
              </div>

              {/* Bottom input */}
              <div className="mt-auto pt-2 flex items-center gap-1 p-1 rounded-2xl bg-white border border-miva-cardBorder text-[9px] text-miva-muted">
                <Camera className="w-3.5 h-3.5 text-miva-royal ml-1" />
                <span className="truncate">Ask follow-up question...</span>
                <div className="ml-auto w-5 h-5 rounded-xl bg-miva-royal text-white flex items-center justify-center text-[10px]">
                  →
                </div>
              </div>
            </div>

            <div className="w-28 h-1 bg-black/20 rounded-full mx-auto mb-1"></div>
          </div>
        </div>
      </div>

      {/* Footer Commercial Attribution */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-miva-muted/80 pt-4 border-t border-miva-cardBorder/60 z-10 gap-2">
        <div>
          L&T MIVA AI — Enterprise Manufacturing Intelligence & Vision Assistant
        </div>
        <div className="flex items-center gap-3">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span className="text-miva-royal font-semibold">Strict Governance Verified</span>
        </div>
      </div>
    </div>
  );
}

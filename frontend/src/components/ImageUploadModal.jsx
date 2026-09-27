import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Upload, Camera, Check, Image as ImageIcon, Sparkles, AlertTriangle } from 'lucide-react';

export default function ImageUploadModal({ isOpen, onClose, onAnalyzeImage, isAnalyzing }) {
  const { t, language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const fileInputRef = useRef(null);

  const sampleEquipment = [
    {
      id: "img-01",
      title: "Gearbox Cooling Pump (GCP-204)",
      desc: "Cooling & Lubrication Issue",
      line: "Gearbox Manufacturing Line",
      iconColor: "from-blue-600 to-cyan-500",
      details: "Gearbox auxiliary cooling pump with elevated thermal sensor signature."
    },
    {
      id: "img-02",
      title: "Valve Hydraulic Actuator Cylinder",
      desc: "Hydraulic Seal Seepage",
      line: "Valve Manufacturing Line",
      iconColor: "from-indigo-600 to-blue-500",
      details: "Hydraulic actuator rod seal inspection during 350 bar cycle test."
    },
    {
      id: "img-03",
      title: "Welded Pipe Joint Seam",
      desc: "Surface Porosity Inspection",
      line: "Heavy Fabrication Line",
      iconColor: "from-amber-600 to-orange-500",
      details: "Submerged arc welding seam inspection before non-destructive testing."
    },
    {
      id: "img-04",
      title: "Switchgear Busbar Terminal",
      desc: "Thermal Hotspot Anomaly",
      line: "Electrical Panel Line",
      iconColor: "from-cyan-600 to-teal-500",
      details: "Medium voltage feeder terminal connection with contact resistance."
    }
  ];

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedSampleId(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSampleSelect = (sample) => {
    setSelectedSampleId(sample.id);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onAnalyzeImage({ file: selectedFile, previewUrl });
    } else if (selectedSampleId) {
      const sample = sampleEquipment.find(s => s.id === selectedSampleId);
      onAnalyzeImage({ sampleId: selectedSampleId, sample });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-miva-navy/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-card rounded-4xl p-6 sm:p-7 shadow-2xl border border-miva-cardBorder animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-miva-pale text-miva-muted hover:text-miva-navy transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2.5 rounded-2xl bg-miva-pale border border-miva-sky/40 text-miva-royal">
            <Camera className="w-5 h-5 text-miva-royal" />
          </div>
          <div>
            <h3 className="font-['Manrope'] font-bold text-base text-miva-navy">
              Multimodal Vision Inspection
            </h3>
            <p className="text-xs text-miva-muted">
              Upload equipment photo or select a shop-floor sample
            </p>
          </div>
        </div>

        {/* Upload or Drop Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-5 text-center cursor-pointer transition-all ${
            previewUrl
              ? 'border-miva-electric bg-miva-pale/40'
              : 'border-miva-cardBorder hover:border-miva-royal hover:bg-miva-pale/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {previewUrl ? (
            <div className="space-y-2">
              <img
                src={previewUrl}
                alt="Selected Equipment"
                className="max-h-40 mx-auto rounded-2xl object-cover shadow-sm border border-miva-cardBorder"
              />
              <p className="text-xs font-semibold text-miva-royal">{selectedFile?.name}</p>
              <p className="text-[11px] text-miva-muted">Click to change photo</p>
            </div>
          ) : (
            <div className="py-3">
              <Upload className="w-8 h-8 mx-auto text-miva-royal/70 mb-2" />
              <p className="text-xs font-semibold text-miva-navy">
                Click to browse photo from device or camera
              </p>
              <p className="text-[11px] text-miva-muted mt-0.5">
                PNG, JPG, WebP supported
              </p>
            </div>
          )}
        </div>

        {/* Or Select from Shop Floor Equipment Samples */}
        <div className="mt-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-miva-muted mb-2.5 flex items-center justify-between">
            <span>Or Choose Shop-Floor Sample</span>
            <span className="text-miva-royal font-medium">Quick Diagnosis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sampleEquipment.map((sample) => {
              const isSelected = selectedSampleId === sample.id;
              return (
                <div
                  key={sample.id}
                  onClick={() => handleSampleSelect(sample)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-miva-royal bg-miva-pale shadow-sm ring-2 ring-miva-royal/20'
                      : 'border-miva-cardBorder/80 bg-white/70 hover:bg-miva-pale/40 hover:border-miva-sky'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-miva-royal px-1.5 py-0.5 rounded bg-miva-pale border border-miva-sky/30">
                      {sample.line.split(' ')[0]}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-miva-royal" />}
                  </div>
                  <div className="text-xs font-bold text-miva-navy line-clamp-1">{sample.title}</div>
                  <div className="text-[11px] text-miva-muted mt-0.5 line-clamp-1">{sample.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-miva-cardBorder/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-miva-navy/70 hover:bg-miva-pale transition-colors"
          >
            {t('close')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={(!selectedFile && !selectedSampleId) || isAnalyzing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-miva-royal to-miva-electric text-white text-xs font-semibold shadow-sm hover:shadow-miva-glow transition-all disabled:opacity-40 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Diagnose Equipment'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

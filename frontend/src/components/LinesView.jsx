import React, { useState, useEffect } from 'react';
import { fetchProductionLines, fetchGovernedDocuments } from '../services/api';
import { Layers, ChevronRight, Activity, Box, Cpu, Flame, Zap, CheckCircle2, Clock, Wrench, ShieldAlert } from 'lucide-react';

export default function LinesView({ initialLineId, onAskQuestion }) {
  const [lines, setLines] = useState([]);
  const [selectedLineId, setSelectedLineId] = useState(initialLineId || 'line-01');
  const [activeTab, setActiveTab] = useState('machines'); // 'machines', 'procedures', 'maintenance', 'quality', 'rca'
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [linesData, docsData] = await Promise.all([
        fetchProductionLines(),
        fetchGovernedDocuments()
      ]);
      setLines(linesData);
      setDocuments(docsData);
      setIsLoading(false);
    }
    load();
  }, []);

  const selectedLine = lines.find(l => l.id === selectedLineId) || lines[0];

  const getLineIcon = (lineId) => {
    switch (lineId) {
      case 'line-01': return Activity;
      case 'line-02': return Box;
      case 'line-03': return Cpu;
      case 'line-04': return Flame;
      case 'line-05': return Zap;
      default: return Layers;
    }
  };

  // Filter docs for current line
  const lineDocs = documents.filter(d => d.line_id === selectedLineId);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-miva-royal uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4 text-miva-royal" />
          <span>Shop-Floor Operations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-miva-navy font-['Manrope'] tracking-tight">
          Production Lines
        </h1>
        <p className="text-xs sm:text-sm text-miva-muted mt-1">
          Explore machines, active procedures, maintenance protocols, and quality standards across 5 production units.
        </p>
      </div>

      {/* 5 Production Lines Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {lines.map((line) => {
          const isSelected = selectedLine?.id === line.id;
          const Icon = getLineIcon(line.id);
          return (
            <button
              key={line.id}
              onClick={() => setSelectedLineId(line.id)}
              className={`p-3.5 rounded-3xl text-left transition-all glass-card ${
                isSelected
                  ? 'border-miva-royal bg-white shadow-miva-hover ring-2 ring-miva-royal/20'
                  : 'hover:border-miva-sky/80 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-miva-royal bg-miva-pale px-2 py-0.5 rounded-full border border-miva-sky/30">
                  {line.code}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-miva-royal' : 'text-miva-muted'}`} />
              </div>
              <div className="font-['Manrope'] font-bold text-xs text-miva-navy line-clamp-1">
                {line.name}
              </div>
              <div className="text-[10px] text-miva-muted mt-1 truncate">
                {line.stages.join(' → ')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Line Detail Card */}
      {selectedLine && (
        <div className="glass-card rounded-4xl p-6 sm:p-7 border border-miva-cardBorder/80 shadow-miva-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-miva-cardBorder/60 gap-3">
            <div>
              <span className="text-xs font-bold text-miva-royal bg-miva-pale px-2.5 py-1 rounded-full border border-miva-sky/30">
                {selectedLine.code}
              </span>
              <h2 className="text-xl font-extrabold text-miva-navy font-['Manrope'] mt-2">
                {selectedLine.name}
              </h2>
              <p className="text-xs text-miva-muted mt-0.5">
                {selectedLine.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-miva-muted">Supervisor:</span>
              <span className="text-xs font-bold text-miva-navy bg-miva-pale px-3 py-1 rounded-full border border-miva-cardBorder">
                {selectedLine.supervisor}
              </span>
            </div>
          </div>

          {/* Line Stage Flow Pipeline */}
          <div className="my-5 p-4 rounded-2xl bg-miva-pale/50 border border-miva-sky/20">
            <div className="text-[11px] font-bold uppercase tracking-wider text-miva-muted mb-2">
              Manufacturing Sequence Workflow
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-miva-navy">
              {selectedLine.stages.map((stage, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-miva-cardBorder shadow-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-miva-royal text-white text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{stage}</span>
                  </div>
                  {idx < selectedLine.stages.length - 1 && (
                    <span className="text-miva-electric font-bold">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sub Navigation: Machines | Procedures | Maintenance | Quality | RCA (Section 37) */}
          <div className="flex items-center gap-2 border-b border-miva-cardBorder/60 pb-3 mb-5 overflow-x-auto">
            {['machines', 'procedures', 'maintenance', 'quality', 'rca'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                  activeTab === tab
                    ? 'bg-miva-royal text-white shadow-sm'
                    : 'text-miva-navy/70 hover:bg-miva-pale hover:text-miva-navy'
                }`}
              >
                {tab === 'rca' ? 'RCA Reports' : tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Machines */}
          {activeTab === 'machines' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedLine.machines.map((machine) => (
                <div
                  key={machine.id}
                  className="p-4 rounded-3xl bg-white/80 border border-miva-cardBorder/80 hover:border-miva-electric/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-miva-royal bg-miva-pale px-2 py-0.5 rounded border border-miva-sky/30">
                        {machine.code}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {machine.status}
                      </span>
                    </div>

                    <h4 className="font-['Manrope'] font-bold text-sm text-miva-navy">
                      {machine.name}
                    </h4>

                    {/* Sensor parameters */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                      {machine.temp && (
                        <div className="p-2 rounded-xl bg-miva-pale/60 border border-miva-cardBorder">
                          <span className="text-miva-muted block">Core Temp</span>
                          <span className="font-bold text-miva-navy">{machine.temp}</span>
                        </div>
                      )}
                      {machine.vibration && (
                        <div className="p-2 rounded-xl bg-miva-pale/60 border border-miva-cardBorder">
                          <span className="text-miva-muted block">Vibration</span>
                          <span className="font-bold text-miva-navy">{machine.vibration}</span>
                        </div>
                      )}
                      {machine.pressure && (
                        <div className="p-2 rounded-xl bg-miva-pale/60 border border-miva-cardBorder">
                          <span className="text-miva-muted block">Pressure</span>
                          <span className="font-bold text-miva-navy">{machine.pressure}</span>
                        </div>
                      )}
                      {machine.lastService && (
                        <div className="p-2 rounded-xl bg-miva-pale/60 border border-miva-cardBorder">
                          <span className="text-miva-muted block">Last Service</span>
                          <span className="font-bold text-miva-navy">{machine.lastService}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onAskQuestion) {
                        onAskQuestion(`What are the operating parameters and maintenance status of ${machine.name} (${machine.code})?`);
                      }
                    }}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-miva-pale hover:bg-miva-royal hover:text-white text-miva-royal text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Ask MIVA about this machine</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Procedures & SOPs */}
          {activeTab === 'procedures' && (
            <div className="space-y-3">
              {lineDocs.filter(d => d.type === 'SOP' || d.type === 'Work Instruction').length === 0 ? (
                <p className="text-xs text-miva-muted py-6 text-center">No approved procedures registered for this station yet.</p>
              ) : (
                lineDocs.map((doc) => (
                  <div
                    key={doc.document_id}
                    className="p-4 rounded-2xl bg-white/80 border border-miva-cardBorder/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {doc.status}
                        </span>
                        <span className="text-[11px] font-mono text-miva-muted">{doc.code}</span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-miva-navy">{doc.title}</h4>
                      <p className="text-xs text-miva-muted mt-0.5">{doc.summary}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (onAskQuestion) onAskQuestion(`Explain the steps in ${doc.title}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-miva-pale text-miva-royal hover:bg-miva-royal hover:text-white text-xs font-semibold transition-colors shrink-0 ml-3"
                    >
                      Query SOP
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Maintenance */}
          {activeTab === 'maintenance' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/80 border border-miva-cardBorder/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-miva-navy">Scheduled Preventive Maintenance (PM)</span>
                  <span className="text-[11px] text-miva-royal font-semibold">Weekly Cycle</span>
                </div>
                <p className="text-xs text-miva-muted">
                  Daily visual lubrication inspection, filter cleaning, and axis guide-rail wipe down as per ISO 9001 standards.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 border border-miva-cardBorder/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-miva-navy">Auxiliary Chiller & Thermal Exchanger</span>
                  <span className="text-[11px] text-miva-royal font-semibold">Monthly Cycle</span>
                </div>
                <p className="text-xs text-miva-muted">
                  Check coolant Brix concentration (8-10%), clean intake suction strainers, verify pump flow delivery.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Quality */}
          {activeTab === 'quality' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/80 border border-miva-cardBorder/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-miva-navy">Coordinate Measuring Machine (CMM) Dimensional Verification</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">Tolerance: ±0.005 mm</span>
                </div>
                <p className="text-xs text-miva-muted">
                  Critical bore diameters, face perpendicularity, and groove depth verified before downstream assembly.
                </p>
              </div>
            </div>
          )}

          {/* Tab 5: RCA (Root Cause Analysis) */}
          {activeTab === 'rca' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/80 border border-miva-cardBorder/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-miva-navy">RCA-2026-04: Transient Spindle Overheat</span>
                  <span className="text-[11px] text-miva-muted">Closed: 2026-06-18</span>
                </div>
                <p className="text-xs text-miva-muted">
                  Root Cause: Filter blockage by fine metal swarf due to delayed coolant change. Corrective action: Swarf scraper cycle increased to 2x per shift.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

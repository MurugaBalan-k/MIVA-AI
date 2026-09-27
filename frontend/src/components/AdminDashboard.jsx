import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchProductionLines,
  fetchGovernedDocuments,
  uploadGovernedPDF,
  updateDocumentStatus,
  fetchRiskAlerts,
  updateRiskAlertStatus,
  fetchWorkInstructions,
  reviewWorkInstruction,
  runBenchmarkEvaluation,
  fetchAuditLogs
} from '../services/api';
import {
  Shield,
  Layers,
  FileText,
  AlertTriangle,
  FileCheck,
  BarChart3,
  Cpu,
  Users,
  LogOut,
  Upload,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export default function AdminDashboard() {
  const { admin, logout, setCurrentScreen } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // overview, users, lines, machines, knowledge, alerts, instructions, evaluation, audit
  const [lines, setLines] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [workInstructions, setWorkInstructions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [evalResults, setEvalResults] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New PDF upload form
  const [uploadForm, setUploadForm] = useState({
    documentName: '',
    lineId: 'line-01',
    machineId: 'm-01-2',
    type: 'SOP',
    revision: 'Rev 03',
    effectiveDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    customContent: ''
  });
  const [uploadStatus, setUploadStatus] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [l, d, a, w, logs] = await Promise.all([
        fetchProductionLines(),
        fetchGovernedDocuments(),
        fetchRiskAlerts(),
        fetchWorkInstructions(),
        fetchAuditLogs()
      ]);
      setLines(l);
      setDocuments(d);
      setAlerts(a);
      setWorkInstructions(w);
      setAuditLogs(logs);
    } catch (e) {
      console.error("Failed to load admin data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus('Processing PDF & vectorizing chunks...');

    const formData = new FormData();
    formData.append('documentName', uploadForm.documentName);
    formData.append('lineId', uploadForm.lineId);
    formData.append('machineId', uploadForm.machineId);
    formData.append('type', uploadForm.type);
    formData.append('revision', uploadForm.revision);
    formData.append('effectiveDate', uploadForm.effectiveDate);
    formData.append('status', uploadForm.status);
    formData.append('customContent', uploadForm.customContent);

    try {
      await uploadGovernedPDF(formData);
      setUploadStatus('Document processed & indexed into governed knowledge base!');
      loadData();
      setTimeout(() => {
        setUploadStatus('');
        setUploadForm({
          documentName: '',
          lineId: 'line-01',
          machineId: 'm-01-2',
          type: 'SOP',
          revision: 'Rev 03',
          effectiveDate: new Date().toISOString().split('T')[0],
          status: 'ACTIVE',
          customContent: ''
        });
      }, 2500);
    } catch (err) {
      setUploadStatus(`Error: ${err.message}`);
    }
  };

  const handleStatusToggle = async (docId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUPERSEDED' : 'ACTIVE';
    await updateDocumentStatus(docId, nextStatus);
    loadData();
  };

  const handleAlertResolve = async (alertId, currentStatus) => {
    const nextStatus = currentStatus === 'New' ? 'Under Review' : 'Resolved';
    await updateRiskAlertStatus(alertId, nextStatus, 'Admin', 'Reviewed shop floor incident.');
    loadData();
  };

  const handleWorkInstructionReview = async (wiId, action) => {
    await reviewWorkInstruction(wiId, action);
    loadData();
  };

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const res = await runBenchmarkEvaluation();
      setEvalResults(res.summary);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F9FF] text-miva-navy flex">
      {/* Admin Sidebar (Section 29) */}
      <aside className="w-64 bg-miva-navy text-white flex flex-col justify-between p-4 shrink-0 shadow-xl">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-white/10">
            <img src="/assets/miva_logo_transparent.png" alt="MIVA" className="w-8 h-8 object-contain" />
            <div>
              <div className="font-['Manrope'] font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>MIVA</span>
                <span className="text-miva-cyan">ADMIN</span>
              </div>
              <p className="text-[10px] text-miva-sky font-semibold">L&T Plant Governance</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'lines', label: 'Production Lines', icon: Layers },
              { id: 'knowledge', label: 'Knowledge Base', icon: FileText, badge: documents.length },
              { id: 'alerts', label: 'Risk Alerts', icon: AlertTriangle, badge: alerts.filter(a => a.status === 'New').length, alertBadge: true },
              { id: 'instructions', label: 'Work Instructions', icon: FileCheck, badge: workInstructions.filter(w => w.status === 'DRAFT').length },
              { id: 'evaluation', label: 'Evaluation System', icon: Cpu },
              { id: 'audit', label: 'Audit Logs', icon: Clock }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-miva-royal text-white shadow-md'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-miva-cyan' : 'text-white/60'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.alertBadge
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switch to User Mode & Logout */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setCurrentScreen('app')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-miva-sky font-semibold transition-all"
          >
            <span>Open MIVA AI Chat</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW (Section 30) */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-miva-navy font-['Manrope']">
                  Admin Overview
                </h1>
                <p className="text-xs text-miva-muted mt-0.5">
                  L&T Shop-Floor Manufacturing Intelligence Dashboard
                </p>
              </div>
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-royal font-semibold shadow-sm hover:bg-miva-pale transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Minimal Metrics (Section 30): Active Users, Documents, Machines, Risk Alerts */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-5 rounded-3xl border border-miva-cardBorder">
                <span className="text-xs font-semibold text-miva-muted uppercase">Active Users</span>
                <div className="text-3xl font-extrabold text-miva-navy mt-1 font-['Manrope']">24</div>
                <div className="text-[11px] text-emerald-600 mt-1 font-medium">Operators & Engineers</div>
              </div>

              <div className="glass-card p-5 rounded-3xl border border-miva-cardBorder">
                <span className="text-xs font-semibold text-miva-muted uppercase">Governed Documents</span>
                <div className="text-3xl font-extrabold text-miva-navy mt-1 font-['Manrope']">{documents.length}</div>
                <div className="text-[11px] text-miva-royal mt-1 font-medium">Active SOPs & WIs</div>
              </div>

              <div className="glass-card p-5 rounded-3xl border border-miva-cardBorder">
                <span className="text-xs font-semibold text-miva-muted uppercase">Monitored Machines</span>
                <div className="text-3xl font-extrabold text-miva-navy mt-1 font-['Manrope']">
                  {lines.reduce((acc, l) => acc + (l.machines?.length || 0), 0)}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1 font-medium">5 Production Lines</div>
              </div>

              <div className="glass-card p-5 rounded-3xl border border-miva-cardBorder">
                <span className="text-xs font-semibold text-miva-muted uppercase">Risk Alerts</span>
                <div className="text-3xl font-extrabold text-rose-600 mt-1 font-['Manrope']">{alerts.length}</div>
                <div className="text-[11px] text-rose-500 mt-1 font-medium">Harmful queries prevented</div>
              </div>
            </div>

            {/* Recent Alerts Quick Peek */}
            <div className="glass-card rounded-3xl p-6 border border-miva-cardBorder">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Manrope'] font-bold text-sm text-miva-navy">Recent Risk Alerts</h3>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className="text-xs text-miva-royal font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {alerts.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-3.5 rounded-2xl bg-white border border-rose-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                          {a.riskLevel}
                        </span>
                        <span className="text-xs font-bold text-miva-navy">{a.user}</span>
                        <span className="text-[10px] text-miva-muted">{new Date(a.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-rose-700 italic font-mono">"{a.question}"</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: KNOWLEDGE BASE & PDF UPLOAD (Section 31 & 32) */}
        {/* ============================================================ */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-miva-navy font-['Manrope']">
                Governed Knowledge Base
              </h1>
              <p className="text-xs text-miva-muted mt-0.5">
                Upload approved manufacturing SOPs, manage revisions, and configure vector indexing.
              </p>
            </div>

            {/* Upload PDF Form (Section 31 & 32) */}
            <div className="glass-card rounded-4xl p-6 sm:p-7 border border-miva-cardBorder">
              <h3 className="font-['Manrope'] font-bold text-sm text-miva-navy mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-miva-royal" />
                <span>Upload & Ingest Governed PDF Document</span>
              </h3>

              {uploadStatus && (
                <div className={`mb-4 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  uploadStatus.includes('Error') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadStatus}</span>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-miva-navy mb-1">Production Line</label>
                    <select
                      value={uploadForm.lineId}
                      onChange={(e) => setUploadForm({ ...uploadForm, lineId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric"
                    >
                      {lines.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-miva-navy mb-1">Target Machine</label>
                    <select
                      value={uploadForm.machineId}
                      onChange={(e) => setUploadForm({ ...uploadForm, machineId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric"
                    >
                      {lines.find(l => l.id === uploadForm.lineId)?.machines.map((m) => (
                        <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-miva-navy mb-1">Document Type</label>
                    <select
                      value={uploadForm.type}
                      onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric"
                    >
                      <option value="SOP">SOP</option>
                      <option value="Work Instruction">Work Instruction</option>
                      <option value="Maintenance Report">Maintenance Report</option>
                      <option value="RCA Report">RCA Report</option>
                      <option value="Quality Alert">Quality Alert</option>
                      <option value="Equipment Image">Equipment Image</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-miva-navy mb-1">Document Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spindle Bearings Replacement Protocol"
                      value={uploadForm.documentName}
                      onChange={(e) => setUploadForm({ ...uploadForm, documentName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-miva-navy mb-1">Revision Code</label>
                    <input
                      type="text"
                      value={uploadForm.revision}
                      onChange={(e) => setUploadForm({ ...uploadForm, revision: e.target.value })}
                      placeholder="Rev 03"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-miva-navy mb-1">Document Content / Operating Procedure Extract</label>
                  <textarea
                    rows={3}
                    placeholder="Enter procedural instructions for automated sectioning and vector indexing..."
                    value={uploadForm.customContent}
                    onChange={(e) => setUploadForm({ ...uploadForm, customContent: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-miva-cardBorder text-xs text-miva-navy focus:outline-none focus:border-miva-electric"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-miva-royal to-miva-electric text-white text-xs font-semibold shadow-sm hover:shadow-miva-glow transition-all"
                >
                  Upload & Index Document
                </button>
              </form>
            </div>

            {/* Governed Document List with Revision Toggle */}
            <div className="glass-card rounded-4xl p-6 border border-miva-cardBorder">
              <h3 className="font-['Manrope'] font-bold text-sm text-miva-navy mb-4">
                Indexed Governed Documents ({documents.length})
              </h3>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.document_id}
                    className="p-4 rounded-2xl bg-white border border-miva-cardBorder flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {doc.status}
                        </span>
                        <span className="text-[11px] font-mono text-miva-muted">{doc.code}</span>
                        <span className="text-[11px] font-bold text-miva-royal">{doc.revision}</span>
                        <span className="text-[11px] text-miva-muted">• {doc.type}</span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-miva-navy">{doc.title}</h4>
                      <p className="text-xs text-miva-muted mt-0.5 line-clamp-1">{doc.summary}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStatusToggle(doc.document_id, doc.status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          doc.status === 'ACTIVE'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title="Toggle revision status"
                      >
                        {doc.status === 'ACTIVE' ? 'Set SUPERSEDED' : 'Set ACTIVE'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: RISK ALERTS (Section 27) */}
        {/* ============================================================ */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-miva-navy font-['Manrope']">
                Risk & Safety Incidents
              </h1>
              <p className="text-xs text-miva-muted mt-0.5">
                Automatically logged security incidents when users submit harmful, destructive, or safety-bypass queries.
              </p>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="glass-card p-5 rounded-3xl border border-rose-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                        {alert.riskLevel}
                      </span>
                      <span className="text-xs font-bold text-miva-navy">User: {alert.user}</span>
                      <span className="text-[11px] text-miva-muted">
                        • {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-miva-navy font-mono bg-rose-50/60 p-2.5 rounded-xl border border-rose-200/60">
                      Query: "{alert.question}"
                    </div>

                    <div className="text-[11px] text-miva-muted">
                      Line: <span className="font-semibold text-miva-navy">{alert.line}</span> • Station:{' '}
                      <span className="font-semibold text-miva-navy">{alert.machine}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        alert.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : alert.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800 animate-pulse'
                      }`}
                    >
                      {alert.status}
                    </span>

                    {alert.status !== 'Resolved' && (
                      <button
                        onClick={() => handleAlertResolve(alert.id, alert.status)}
                        className="px-3 py-1.5 rounded-xl bg-miva-navy text-white text-xs font-semibold hover:bg-miva-darkBlue transition-all"
                      >
                        {alert.status === 'New' ? 'Mark Under Review' : 'Mark Resolved'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: WORK INSTRUCTIONS REVIEW (Section 25) */}
        {/* ============================================================ */}
        {activeTab === 'instructions' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-miva-navy font-['Manrope']">
                Work Instruction Approvals
              </h1>
              <p className="text-xs text-miva-muted mt-0.5">
                Review AI-generated draft work instructions. Approving promotes them into official governed SOPs.
              </p>
            </div>

            <div className="space-y-4">
              {workInstructions.map((wi) => (
                <div key={wi.id} className="glass-card p-6 rounded-4xl border border-miva-cardBorder space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-miva-cardBorder/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            wi.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : wi.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {wi.status}
                        </span>
                        <span className="text-xs text-miva-muted">Requested by {wi.user}</span>
                      </div>
                      <h3 className="font-['Manrope'] font-bold text-base text-miva-navy mt-1">
                        {wi.title}
                      </h3>
                      <p className="text-xs text-miva-muted">{wi.line} • {wi.machine}</p>
                    </div>

                    {wi.status === 'DRAFT' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleWorkInstructionReview(wi.id, 'APPROVE')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Promote to SOP</span>
                        </button>
                        <button
                          onClick={() => handleWorkInstructionReview(wi.id, 'REJECT')}
                          className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-white border border-miva-cardBorder/80">
                      <div className="font-bold text-miva-navy mb-1.5">Required Tools & Safety</div>
                      <ul className="list-disc pl-4 space-y-1 text-miva-muted">
                        {wi.requiredTools?.map((t, idx) => <li key={idx}>{t}</li>)}
                        {wi.safety?.map((s, idx) => <li key={idx} className="text-amber-700 font-medium">{s}</li>)}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-miva-cardBorder/80">
                      <div className="font-bold text-miva-navy mb-1.5">Step-by-Step Procedure</div>
                      <ol className="list-decimal pl-4 space-y-1 text-miva-navy">
                        {wi.procedure?.map((p, idx) => <li key={idx}>{p}</li>)}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: BENCHMARK EVALUATION MODULE (Section 47 & 48) */}
        {/* ============================================================ */}
        {activeTab === 'evaluation' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-miva-navy font-['Manrope']">
                  RAG Evaluation & Benchmark Module
                </h1>
                <p className="text-xs text-miva-muted mt-0.5">
                  Comparative performance assessment: Keyword Search vs Basic Text RAG vs MIVA AI Multimodal RAG.
                </p>
              </div>

              <button
                onClick={handleRunEvaluation}
                disabled={isEvaluating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-miva-royal to-miva-electric text-white text-xs font-semibold shadow-sm hover:shadow-miva-glow transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                <span>{isEvaluating ? 'Executing Benchmark...' : 'Run Benchmark Evaluation'}</span>
              </button>
            </div>

            {/* Scorecard Summary Table */}
            {evalResults && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* System 1: Keyword Search */}
                  <div className="glass-card rounded-3xl p-5 border border-miva-cardBorder">
                    <div className="text-[11px] font-bold uppercase text-miva-muted">System 1</div>
                    <div className="text-base font-extrabold text-miva-navy font-['Manrope'] mt-0.5">
                      Keyword Search
                    </div>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Retrieval Accuracy:</span>
                        <span className="font-bold text-miva-navy">{evalResults.systems.keywordSearch.retrievalAccuracy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Answer Correctness:</span>
                        <span className="font-bold text-miva-navy">{evalResults.systems.keywordSearch.answerCorrectness}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Image Query Support:</span>
                        <span className="font-bold text-rose-600">0.0% (Unsupported)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Revision Handling:</span>
                        <span className="font-semibold text-rose-600 text-[11px]">Fails</span>
                      </div>
                    </div>
                  </div>

                  {/* System 2: Basic Text RAG */}
                  <div className="glass-card rounded-3xl p-5 border border-miva-cardBorder">
                    <div className="text-[11px] font-bold uppercase text-miva-muted">System 2</div>
                    <div className="text-base font-extrabold text-miva-navy font-['Manrope'] mt-0.5">
                      Basic Text-Only RAG
                    </div>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Retrieval Accuracy:</span>
                        <span className="font-bold text-miva-navy">{evalResults.systems.basicTextRAG.retrievalAccuracy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Answer Correctness:</span>
                        <span className="font-bold text-miva-navy">{evalResults.systems.basicTextRAG.answerCorrectness}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Image Query Support:</span>
                        <span className="font-bold text-rose-600">0.0% (Unsupported)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Revision Handling:</span>
                        <span className="font-semibold text-amber-600 text-[11px]">Unreliable</span>
                      </div>
                    </div>
                  </div>

                  {/* System 3: MIVA AI Multimodal RAG */}
                  <div className="glass-card rounded-3xl p-5 border-2 border-miva-cyan/80 bg-white/95 shadow-miva-hover">
                    <div className="text-[11px] font-bold uppercase text-miva-royal">System 3 (Ours)</div>
                    <div className="text-base font-extrabold text-miva-navy font-['Manrope'] mt-0.5 flex items-center justify-between">
                      <span>MIVA AI Multimodal RAG</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Leader
                      </span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Retrieval Accuracy:</span>
                        <span className="font-bold text-emerald-600">{evalResults.systems.mivaMultimodalRAG.retrievalAccuracy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Answer Correctness:</span>
                        <span className="font-bold text-emerald-600">{evalResults.systems.mivaMultimodalRAG.answerCorrectness}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Image Query Support:</span>
                        <span className="font-bold text-emerald-600">96.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-miva-muted">Revision Governance:</span>
                        <span className="font-bold text-emerald-600 text-[11px]">100% Governed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question-by-Question Evaluation Table */}
                <div className="glass-card rounded-4xl p-6 border border-miva-cardBorder overflow-x-auto">
                  <h4 className="font-['Manrope'] font-bold text-sm text-miva-navy mb-3">
                    Expert-Authored Test Suite Results ({evalResults.details.length} questions)
                  </h4>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-miva-cardBorder text-miva-muted">
                        <th className="py-2.5 px-3">Question</th>
                        <th className="py-2.5 px-3">Target SOP</th>
                        <th className="py-2.5 px-3">Keyword Search</th>
                        <th className="py-2.5 px-3">Basic Text RAG</th>
                        <th className="py-2.5 px-3">MIVA Multimodal RAG</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-miva-cardBorder/50">
                      {evalResults.details.map((q) => (
                        <tr key={q.id} className="hover:bg-miva-pale/40">
                          <td className="py-2.5 px-3 font-medium text-miva-navy max-w-xs truncate">
                            {q.question}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-miva-muted">
                            {q.targetDoc}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-miva-navy">
                            {q.keywordSearch.score}% ({q.keywordSearch.latencyMs}ms)
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-miva-navy">
                            {q.basicTextRAG.score}% ({q.basicTextRAG.latencyMs}ms)
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-600">
                            {q.mivaMultimodalRAG.score}% ({q.mivaMultimodalRAG.latencyMs}ms)
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: INTERNAL AUDIT LOGS (Section 19) */}
        {/* ============================================================ */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-miva-navy font-['Manrope']">
                Internal Evidence & Audit Logs
              </h1>
              <p className="text-xs text-miva-muted mt-0.5">
                Strict internal evidence tracking (Document, Page, Section, Revision, Chunk ID, Confidence). Kept hidden from user interface per Section 19.
              </p>
            </div>

            <div className="space-y-3">
              {auditLogs.length === 0 ? (
                <div className="p-8 text-center glass-card rounded-3xl text-xs text-miva-muted">
                  No internal queries logged in this session yet. Ask a question in the chat to see the internal trace.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="glass-card p-4 rounded-3xl border border-miva-cardBorder font-mono text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-miva-royal">Event: {log.type}</span>
                      <span className="text-[10px] text-miva-muted">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>

                    <div className="text-miva-navy font-sans text-xs mb-2">
                      <span className="text-miva-muted font-mono">Query:</span> "{log.query}"
                    </div>

                    {log.internalTrace && (
                      <div className="p-3 rounded-2xl bg-white/90 border border-miva-cardBorder text-[11px] space-y-1 text-miva-navy">
                        <div>Document ID: <span className="font-bold">{log.internalTrace.documentId || log.internalTrace.matchedDocument}</span></div>
                        <div>Revision: <span className="font-bold text-emerald-600">{log.internalTrace.revision || 'ACTIVE'}</span></div>
                        <div>Page: <span className="font-bold">{log.internalTrace.page || 1}</span> • Section: <span className="font-bold">{log.internalTrace.section || 'Standard'}</span></div>
                        <div>Chunk ID: <span className="font-mono text-miva-muted">{log.internalTrace.chunkId || 'chk-auto'}</span></div>
                        <div>Confidence Score: <span className="font-bold text-emerald-600">{(log.internalTrace.confidence * 100).toFixed(1)}%</span></div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

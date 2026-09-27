import React, { useState, useEffect } from 'react';
import { fetchGovernedDocuments } from '../services/api';
import { BookOpen, Bookmark, Clock, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function LibraryView({ onSelectDocument, onAskQuestion }) {
  const [activeTab, setActiveTab] = useState('documents'); // 'documents', 'saved', 'chats'
  const [documents, setDocuments] = useState([]);
  const [savedItems, setSavedItems] = useState([
    {
      id: "sav-01",
      title: "Valve Machining Center Cooling & Temperature Alarm Procedure",
      code: "WI_001_Temperature_Alarm.pdf",
      date: "2026-09-26",
      summary: "Coolant flow inspection, load reduction, and thermal trip thresholds."
    },
    {
      id: "sav-02",
      title: "Welding PPE and Pre-Heating Standard (ASME Sec IX)",
      code: "SOP-WELD-PPE-04.pdf",
      date: "2026-09-25",
      summary: "Mandatory shade DIN 10-12 helmet, leather gauntlets, and safety shoes."
    }
  ]);

  const recentChats = [
    {
      id: "c-01",
      title: "Valve machine temperature reduction steps",
      time: "Today, 10:24 AM",
      snippet: "Check the coolant flow and inspect the cooling system. Reduce the machine load..."
    },
    {
      id: "c-02",
      title: "Centrifugal pump discharge pressure test",
      time: "Yesterday, 04:15 PM",
      snippet: "Confirm suction isolation valve is 100% open. Check discharge manometer reads 120 bar..."
    }
  ];

  useEffect(() => {
    fetchGovernedDocuments().then(docs => setDocuments(docs));
  }, []);

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-miva-royal uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4 text-miva-royal" />
          <span>Knowledge Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-miva-navy font-['Manrope'] tracking-tight">
          Library
        </h1>
        <p className="text-xs sm:text-sm text-miva-muted mt-1">
          Access approved shop-floor documentation, saved items, and recent conversations.
        </p>
      </div>

      {/* Tabs: Documents | Saved | Recent Chats */}
      <div className="flex items-center gap-2 border-b border-miva-cardBorder/60 pb-3">
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'documents'
              ? 'bg-miva-royal text-white shadow-sm'
              : 'text-miva-navy/70 hover:bg-miva-pale hover:text-miva-navy'
          }`}
        >
          Recent Documents
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'saved'
              ? 'bg-miva-royal text-white shadow-sm'
              : 'text-miva-navy/70 hover:bg-miva-pale hover:text-miva-navy'
          }`}
        >
          Saved Items ({savedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'chats'
              ? 'bg-miva-royal text-white shadow-sm'
              : 'text-miva-navy/70 hover:bg-miva-pale hover:text-miva-navy'
          }`}
        >
          Recent Chats ({recentChats.length})
        </button>
      </div>

      {/* Documents List */}
      {activeTab === 'documents' && (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.document_id}
              className="glass-card glass-card-hover p-4 sm:p-5 rounded-3xl border border-miva-cardBorder/80 flex items-center justify-between transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-miva-pale text-miva-royal border border-miva-sky/30 mt-0.5 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doc.status}
                    </span>
                    <span className="text-[11px] font-mono text-miva-muted">{doc.code}</span>
                    <span className="text-[11px] font-semibold text-miva-royal bg-miva-pale px-2 py-0.2 rounded">
                      {doc.revision}
                    </span>
                  </div>
                  <h3 className="font-['Manrope'] font-bold text-sm text-miva-navy">{doc.title}</h3>
                  <p className="text-xs text-miva-muted mt-1 leading-relaxed max-w-xl">
                    {doc.summary}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onAskQuestion) onAskQuestion(`What are the key steps in ${doc.title}?`);
                }}
                className="px-3.5 py-2 rounded-xl bg-miva-pale hover:bg-miva-royal hover:text-white text-miva-royal text-xs font-semibold transition-colors shrink-0 ml-4 flex items-center gap-1"
              >
                <span>Ask MIVA</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Saved Items */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="glass-card p-4 rounded-3xl border border-miva-cardBorder/80 flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 mt-0.5">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-miva-muted font-mono mb-0.5">{item.code} • Saved on {item.date}</div>
                  <h4 className="font-bold text-xs sm:text-sm text-miva-navy">{item.title}</h4>
                  <p className="text-xs text-miva-muted mt-0.5">{item.summary}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onAskQuestion) onAskQuestion(`Provide the standard procedure for ${item.title}`);
                }}
                className="px-3 py-1.5 rounded-xl bg-miva-pale text-miva-royal text-xs font-semibold hover:bg-miva-royal hover:text-white transition-colors shrink-0"
              >
                Open Procedure
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Recent Chats */}
      {activeTab === 'chats' && (
        <div className="space-y-3">
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              className="glass-card p-4 rounded-3xl border border-miva-cardBorder/80 hover:border-miva-electric/50 transition-all cursor-pointer"
              onClick={() => {
                if (onAskQuestion) onAskQuestion(chat.title);
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-miva-navy">{chat.title}</span>
                <span className="text-[10px] text-miva-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {chat.time}
                </span>
              </div>
              <p className="text-xs text-miva-muted truncate">{chat.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

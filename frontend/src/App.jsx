import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Sidebar from './components/Sidebar';
import ChatWorkspace from './components/ChatWorkspace';
import LinesView from './components/LinesView';
import LibraryView from './components/LibraryView';
import AboutView from './components/AboutView';
import SettingsView from './components/SettingsView';
import AdminDashboard from './components/AdminDashboard';
import MobileShowcaseView from './components/MobileShowcaseView';
import AuthScreens from './components/AuthScreens';
import { Menu } from 'lucide-react';

function AppContent() {
  const { currentScreen, setCurrentScreen } = useAuth();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'lines', 'library', 'about', 'settings', 'mobile-showcase'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState('line-01');

  // Handle Admin Dashboard Screen
  if (currentScreen === 'admin-dashboard') {
    return <AdminDashboard />;
  }

  // Handle Auth Flow (Welcome, Signup, Login, Admin Login, Profile Setup)
  if (['welcome', 'signup', 'login', 'admin-login', 'profile-setup'].includes(currentScreen)) {
    return <AuthScreens />;
  }

  // Handle Full-Screen Mobile Showcase
  if (activeTab === 'mobile-showcase') {
    return <MobileShowcaseView onBackToApp={() => setActiveTab('chat')} />;
  }

  return (
    <div className="min-h-screen flowing-bg flex">
      {/* Minimal Collapsible Sidebar (Section 14) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewChat={() => setActiveTab('chat')}
        onSelectLine={(lineId) => {
          setSelectedLineId(lineId);
          setActiveTab('lines');
        }}
      />

      {/* Main Workspace (Navbar-free premium workspace) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Mobile-only floating navigation control. The desktop navbar remains fully removed. */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 lg:hidden w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-xl border border-miva-cardBorder shadow-miva-soft text-miva-royal flex items-center justify-center hover:bg-white transition-all"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div key={activeTab} className="flex-1 overflow-y-auto flex flex-col animate-page-in">
          {activeTab === 'chat' && (
            <ChatWorkspace
              onSelectLine={(lineId) => {
                setSelectedLineId(lineId);
                setActiveTab('lines');
              }}
            />
          )}

          {activeTab === 'lines' && (
            <LinesView
              initialLineId={selectedLineId}
              onAskQuestion={(question) => {
                setActiveTab('chat');
              }}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView
              onAskQuestion={(question) => {
                setActiveTab('chat');
              }}
            />
          )}

          {activeTab === 'about' && <AboutView />}

          {activeTab === 'settings' && <SettingsView />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ModalitiesView } from './components/ModalitiesView';
import { UnifiedTrainer } from './components/UnifiedTrainer';
import { CustomTrainer } from './components/CustomTrainer';
import { CasilleroView } from './components/CasilleroView';
import { RecordsView } from './components/RecordsView';
import { RulesView } from './components/RulesView';
import { loadProfile, evaluateSessionResult } from './utils/profileManager';

export function App() {
  const [currentTab, setTab] = useState('dashboard'); // 'dashboard' | 'modalities' | 'casillero' | 'records' | 'rules'
  const [activeSession, setActiveSession] = useState(null);
  const [isCustomGymOpen, setIsCustomGymOpen] = useState(false);
  const [profile, setProfile] = useState(() => loadProfile());
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync sound setting
  useEffect(() => {
    try {
      const savedSound = localStorage.getItem('neurofit_sound');
      if (savedSound !== null) setSoundEnabled(savedSound === 'true');
    } catch (e) {}
  }, []);

  const handleStartSession = (sessionConfig) => {
    setActiveSession({
      ...sessionConfig,
      sessionId: Date.now() + Math.random()
    });
  };

  const handleCompleteSession = (sessionData) => {
    const outcome = evaluateSessionResult(profile, sessionData);
    setProfile(outcome.newProfile);
    return outcome;
  };

  return (
    <div className="min-h-[100dvh] bg-slate-100/90 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        streak={profile.streak || 1}
        xp={profile.xp || 0}
        soundEnabled={soundEnabled}
        setSoundEnabled={(val) => {
          setSoundEnabled(val);
          localStorage.setItem('neurofit_sound', val.toString());
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {/* If an active session is playing */}
        {activeSession ? (
          <UnifiedTrainer
            key={activeSession.sessionId || JSON.stringify(activeSession)}
            config={activeSession}
            profile={profile}
            onBack={() => setActiveSession(null)}
            onComplete={handleCompleteSession}
            onStartSession={handleStartSession}
            soundEnabled={soundEnabled}
          />
        ) : isCustomGymOpen ? (
          /* Custom Gym Trainer */
          <CustomTrainer
            onBack={() => setIsCustomGymOpen(false)}
            onComplete={(sessionData) => {
              handleCompleteSession(sessionData);
              setIsCustomGymOpen(false);
            }}
            soundEnabled={soundEnabled}
          />
        ) : (
          /* Main Navigation Views */
          <>
            {currentTab === 'dashboard' && (
              <Dashboard
                profile={profile}
                onStartSession={handleStartSession}
                onOpenCustomGym={() => setIsCustomGymOpen(true)}
                onOpenModalities={() => setTab('modalities')}
                soundEnabled={soundEnabled}
              />
            )}
            {currentTab === 'modalities' && (
              <ModalitiesView
                profile={profile}
                onStartSession={handleStartSession}
                soundEnabled={soundEnabled}
              />
            )}
            {currentTab === 'casillero' && (
              <CasilleroView soundEnabled={soundEnabled} />
            )}
            {currentTab === 'records' && (
              <RecordsView profile={profile} />
            )}
            {currentTab === 'rules' && (
              <RulesView />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      {!activeSession && !isCustomGymOpen && (
        <Navigation currentTab={currentTab} setTab={setTab} />
      )}
    </div>
  );
}

export default App;

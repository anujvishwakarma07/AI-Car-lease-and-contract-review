import { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import DashboardView from './components/DashboardView.jsx';
import ContractAnalyser from './components/ContractAnalyser.jsx';
import VinLookup from './components/VinLookup.jsx';
import NegotiationCoach from './components/NegotiationCoach.jsx';
import Footer from './components/Footer.jsx';
import AuthView from './components/AuthView.jsx';
import OfferComparision from './components/OfferComparision.jsx';
import SettingsView from './components/SettingsView.jsx';
import BuyCredits from './components/BuyCredits.jsx';
import { Agentation } from 'agentation';

import darkModeLogo from './assets/darkModeTextual.png';
import lightModeLogo from './assets/LightModeTextual.png';
import darkModeSymbol from './assets/darkModeSymbolic.png';
import lightModeSymbol from './assets/lightModeSybolic.png';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Theme state persisted in localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  const [contractResult, setContractResult] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Auto-restore session from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.username, id: payload.id });
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Session restore failed:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Lifted Chat memory states (Preserves conversation across tab switching!)
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'bot',
      text: 'Hello! I am your AI Car Negotiation Coach.\n\nI can help you review dealer pricing sheets, draft professional emails to salespeople, or advice you on specific terms like acquisition fees, doc fees, and money factors.\n\nIf you have uploaded a contract in the Contract Analyzer tab, I will automatically use its numbers to give you custom negotiation counter-offers!'
    }
  ]);
  const [chatHistory, setChatHistory] = useState([]);

  // Scroll to top of the content container on tab switches
  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [activeTab]);

  // Auto-redirect to home dashboard upon login success
  useEffect(() => {
    if (isAuthenticated) {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated]);

  return (
    <>
      <Agentation />
      <div className="dashboard-layout">
        <div className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <img 
              src={theme === 'dark' ? darkModeSymbol : lightModeSymbol} 
              alt="VetoCar Mark" 
              style={{ height: '25px', objectFit: 'contain' }} 
            />
            <img 
              src={theme === 'dark' ? darkModeLogo : lightModeLogo} 
              alt="VetoCar Logo" 
              style={{ height: '18px', objectFit: 'contain' }} 
            />
          </div>
          <button
            onClick={toggleTheme}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px'
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
          theme={theme}
          toggleTheme={toggleTheme}
          isAuthenticated={isAuthenticated}
        />

        <div className="main-content">
          {activeTab === 'dashboard' && (
            <DashboardView setActiveTab={setActiveTab} />
          )}

          {activeTab === 'analyzer' && (
            isAuthenticated ? (
              <ContractAnalyser
                contractResult={contractResult}
                setContractResult={setContractResult}
                setChatMessages={setChatMessages}
              />
            ) : (
              <AuthView setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          )}

          {activeTab === 'vin' && (
            isAuthenticated ? (
              <VinLookup />
            ) : (
              <AuthView setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          )}

          {activeTab === 'coach' && (
            isAuthenticated ? (
              <NegotiationCoach
                contractResult={contractResult}
                chatMessages={chatMessages}
                setChatMessages={setChatMessages}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
              />
            ) : (
              <AuthView setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          )}

          {activeTab === 'compare' && (
            isAuthenticated ? (
              <OfferComparision />
            ) : (
              <AuthView setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          )}
          {activeTab === 'settings' && (
            isAuthenticated ? (
              <SettingsView />
            ) : (
              <AuthView setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          )}
          {activeTab === 'buy_credits' && (
            isAuthenticated ? (
              <BuyCredits />
            ) : (
              <AuthView setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          )}
          <Footer theme={theme} />
        </div>
      </div>
    </>
  );

}

export default App;

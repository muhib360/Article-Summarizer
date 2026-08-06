import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useSummaryStore } from './store/summaryStore';
import { useAuthStore } from './store/authStore';
import UrlInput from './components/UrlInput';
import SummaryCard from './components/SummaryCard';
import LoadingSpinner from './components/LoadingSpinner';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import { Sparkles, LogOut, User } from 'lucide-react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function HomePage() {
  const { summary, isLoading } = useSummaryStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app">
      {/* Background blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <main className="main-content">
        {/* User bar */}
        <div className="user-bar">
          <div className="user-info">
            <div className="user-avatar">
              <User size={16} />
            </div>
            <span className="user-name">{user?.displayName || user?.email}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn" id="logout-btn">
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>

        {/* Hero header */}
        <header className="hero">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI-Powered Summarization</span>
          </div>
          <h1 className="hero-title">
            Understand any article
            <span className="gradient-text"> in seconds</span>
          </h1>
          <p className="hero-subtitle">
            Paste a URL and get a clean, structured summary with key insights — powered by LLMs.
          </p>
        </header>

        {/* Input */}
        <UrlInput />

        {/* Results area */}
        <AnimatePresence mode="wait">
          {isLoading && <LoadingSpinner key="loader" />}
          {!isLoading && summary && <SummaryCard key="summary" summary={summary} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, [initAuth]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e2e',
            color: '#cdd6f4',
            border: '1px solid rgba(137, 180, 250, 0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />

      <Routes>
        <Route
          path="/login"
          element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestGuard>
              <SignUpPage />
            </GuestGuard>
          }
        />
        <Route
          path="/"
          element={
            <AuthGuard>
              <HomePage />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;

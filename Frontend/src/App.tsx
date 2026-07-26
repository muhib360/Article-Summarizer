import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useSummaryStore } from './store/summaryStore';
import UrlInput from './components/UrlInput';
import SummaryCard from './components/SummaryCard';
import LoadingSpinner from './components/LoadingSpinner';
import { Sparkles } from 'lucide-react';

function App() {
  const { summary, isLoading } = useSummaryStore();

  return (
    <div className="app">
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

      {/* Background blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <main className="main-content">
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

export default App;

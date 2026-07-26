import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Sparkles, ArrowRight } from 'lucide-react';
import { useSummaryStore } from '../store/summaryStore';
import { fetchSummary } from '../api/summarize';
import toast from 'react-hot-toast';

export default function UrlInput() {
  const { url, setUrl, setLoading, setSummary, setError, isLoading } = useSummaryStore();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await fetchSummary(url);
      setSummary(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="url-input-wrapper"
    >
      <form onSubmit={handleSubmit} className="url-form">
        <div className={`input-container ${isFocused ? 'focused' : ''}`}>
          <Link2 className="input-icon" size={20} />
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Paste any article URL..."
            className="url-field"
            disabled={isLoading}
            autoComplete="off"
          />
          <motion.button
            id="summarize-btn"
            type="submit"
            disabled={isLoading}
            className="submit-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? (
              <span className="btn-text">
                <Sparkles size={16} className="spin-icon" />
                Summarizing...
              </span>
            ) : (
              <span className="btn-text">
                Summarize
                <ArrowRight size={16} />
              </span>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

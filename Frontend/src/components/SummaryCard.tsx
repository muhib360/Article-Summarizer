import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Zap, CheckCircle2, RotateCcw } from 'lucide-react';
import type { Summary } from '../types/summary';
import AdditionalInfo from './AdditionalInfo';
import { useSummaryStore } from '../store/summaryStore';

interface Props {
  summary: Summary;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const bulletVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function SummaryCard({ summary }: Props) {
  const { reset } = useSummaryStore();

  return (
    <AnimatePresence>
      <motion.div
        className="summary-card"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="card-header">
          <div className="card-header-left">
            <BookOpen size={20} className="card-icon" />
            <span className="card-label">Summary</span>
          </div>
          <motion.button
            id="reset-btn"
            className="reset-btn"
            onClick={reset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={14} />
            New Article
          </motion.button>
        </div>

        {/* Title */}
        <motion.h2
          className="summary-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {summary.title}
        </motion.h2>

        {/* TL;DR */}
        <motion.div
          className="tldr-box"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="tldr-header">
            <Zap size={14} className="tldr-icon" />
            <span className="tldr-label">TL;DR</span>
          </div>
          <p className="tldr-text">{summary.tldr}</p>
        </motion.div>

        {/* Bullet Points */}
        <div className="bullet-section">
          <div className="section-header">
            <CheckCircle2 size={16} className="section-icon" />
            <h3 className="section-title">Key Points</h3>
          </div>
          <motion.ul
            className="bullet-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {summary.bullet_points.map((point, i) => (
              <motion.li key={i} className="bullet-item" variants={bulletVariants}>
                <span className="bullet-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="bullet-text">{point}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Additional Info */}
        {summary.additional_info && Object.keys(summary.additional_info).length > 0 && (
          <AdditionalInfo info={summary.additional_info} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

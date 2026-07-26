import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const dotVariants = {
  hidden: { opacity: 0.3, scale: 0.8 },
  visible: {
    opacity: [0.3, 1, 0.3],
    scale: [0.8, 1.2, 0.8],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
};

export default function LoadingSpinner() {
  return (
    <motion.div
      className="loading-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="loading-dots"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="dot"
            variants={dotVariants}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </motion.div>
      <p className="loading-text">Reading & summarizing article...</p>
    </motion.div>
  );
}

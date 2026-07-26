import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface Props {
  info: Record<string, string>;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function AdditionalInfo({ info }: Props) {
  const entries = Object.entries(info);
  if (entries.length === 0) return null;

  return (
    <motion.div
      className="additional-info"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="section-header">
        <Info size={16} className="section-icon" />
        <h3 className="section-title">Additional Details</h3>
      </div>
      <motion.div
        className="info-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {entries.map(([key, value]) => (
          <motion.div key={key} className="info-item" variants={itemVariants}>
            <span className="info-key">{key}</span>
            <span className="info-value">{value}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

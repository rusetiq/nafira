import { motion } from 'framer-motion';

const pathVariants = {
  animate: {
    x: [0, 35, -15, 30, 0],
    y: [0, -20, 30, 10, 0],
    scale: [1, 1.1, 0.9, 1.05, 1],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function TargetCursor({ className }) {
  return (
    <motion.div className={`target-cursor ${className ?? ''}`} variants={pathVariants} animate="animate">
      <div className="absolute inset-2 rounded-full border border-white/30" />
      <div className="absolute inset-4 rounded-full border border-white/15" />
    </motion.div>
  );
}

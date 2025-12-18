import { motion } from 'framer-motion';
import clsx from 'clsx';

const spotlightVariants = {
  initial: { opacity: 0, y: 24 },
  animate: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};

export default function SpotlightCard({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={clsx('spotlight-card', className)}
      custom={delay}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={spotlightVariants}
    >
      {children}
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import clsx from 'clsx';

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};

export default function MagicBento({ children, className, delay = 0, animateOnScroll = false }) {
  return (
    <motion.div
      className={clsx('magic-bento', className)}
      custom={delay}
      initial="initial"
      animate={animateOnScroll ? undefined : "animate"}
      whileInView={animateOnScroll ? "animate" : undefined}
      viewport={animateOnScroll ? { once: true, amount: 0.3 } : undefined}
      variants={cardVariants}
    >
      {children}
    </motion.div>
  );
}


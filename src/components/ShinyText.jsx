import { motion } from 'framer-motion';
import clsx from 'clsx';

const shimmerVariants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: '200% 50%',
    transition: { duration: 6, repeat: Infinity, ease: 'linear' },
  },
};

export default function ShinyText({ children, className }) {
  return (
    <motion.span
      className={clsx('shiny-text leading-tight', className)}
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.span>
  );
}

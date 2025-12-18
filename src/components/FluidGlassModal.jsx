import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function FluidGlassModal({ open, onClose, title, children, className }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div className={clsx('fluid-glass relative max-w-2xl w-full mx-6', className)} variants={modalVariants}>
            <button
              className="absolute right-6 top-6 rounded-full border border-white/10 bg-black/30 p-2 text-white/80 transition hover:text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            {title && <h3 className="mb-4 text-2xl font-semibold">{title}</h3>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

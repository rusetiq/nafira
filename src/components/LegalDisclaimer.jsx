import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
export default function LegalDisclaimer({ className = '' }) {
    return (
        <motion.div
            className={`flex items-start gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 text-sm ${className}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="text-white/70 leading-relaxed">
                <strong className="text-orange-300">Medical Disclaimer:</strong> Nafira provides informational insights only.
                This is not medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional
                before making dietary changes or decisions affecting your health.
            </div>
        </motion.div>
    );
}

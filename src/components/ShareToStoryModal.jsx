import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

/**
 * ShareToStoryModal - Spotify Wrapped-style shareable meal card
 * Uses the overlay.svg template with meal photo as background
 */
export default function ShareToStoryModal({ open, onClose, mealData }) {
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const cardRef = useRef(null);

    // Reset downloaded state when modal opens
    useEffect(() => {
        if (open) {
            setDownloaded(false);
        }
    }, [open]);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        setDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
            });

            const link = document.createElement('a');
            link.download = `nafira-meal-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 3000);
        } catch (error) {
            console.error('Failed to generate image:', error);
        } finally {
            setDownloading(false);
        }
    };

    if (!mealData) return null;

    const { name, score, macros, image } = mealData;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative z-10 w-full max-w-md bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl border border-white/10 p-6 shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Share2 className="w-5 h-5 text-accent-primary" />
                                <h2 className="text-lg font-semibold text-white">Share to Story</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        </div>

                        {/* Story Card Preview */}
                        <div
                            ref={cardRef}
                            className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black"
                            style={{ maxHeight: '400px' }}
                        >
                            {/* Meal Image Background */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${image})` }}
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                            {/* Nafira Branding - Top Left */}
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                                        <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 2 1 3.5 2.5 4.5v9.5c0 .8.7 1.5 1.5 1.5h1c.8 0 1.5-.7 1.5-1.5V11c1.5-1 2.5-2.5 2.5-4.5C16.5 4 14.5 2 12 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm tracking-wide">NAFIRA</p>
                                    <p className="text-white/60 text-xs">Smart nutritional analysis</p>
                                </div>
                            </div>

                            {/* Bottom Card with Score & Macros */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    {/* Score Circle */}
                                    <div className="flex justify-center mb-3">
                                        <div className="relative w-20 h-20">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    fill="none"
                                                    stroke="rgba(255,255,255,0.2)"
                                                    strokeWidth="8"
                                                />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    fill="none"
                                                    stroke="url(#scoreGrad)"
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(score / 100) * 251} 251`}
                                                />
                                                <defs>
                                                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#FFC299" />
                                                        <stop offset="100%" stopColor="#f54703" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-white font-bold text-lg">{score}</span>
                                                <span className="text-white/60 text-[10px]">out of 100</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Meal Name */}
                                    <h3 className="text-white font-bold text-center text-lg mb-3">
                                        {name || 'Delicious Meal'}
                                    </h3>

                                    {/* Macros */}
                                    {macros && (
                                        <div className="flex justify-center gap-6 text-center">
                                            <div>
                                                <p className="text-white/60 text-xs uppercase tracking-wide">Protein</p>
                                                <p className="text-white font-semibold">{macros.protein}g</p>
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-xs uppercase tracking-wide">Carbs</p>
                                                <p className="text-white font-semibold">{macros.carbs}g</p>
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-xs uppercase tracking-wide">Fats</p>
                                                <p className="text-white font-semibold">{macros.fats}g</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Download Button */}
                        <motion.button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {downloading ? (
                                <>
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    />
                                    Generating...
                                </>
                            ) : downloaded ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Downloaded!
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Download for Story
                                </>
                            )}
                        </motion.button>

                        <p className="text-center text-white/40 text-xs mt-3">
                            Save and share to Instagram, WhatsApp, or any social platform
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

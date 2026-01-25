import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Eye, Server, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

export default function PrivacyPage() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

    const sections = [
        {
            title: "Information Assessment",
            icon: Eye,
            content: (
                <div className="space-y-4 text-white/70">
                    <p>We collect specific data points to power our metabolic analysis engine:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h4 className="text-white font-bold mb-2">Biometric Data</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Dietary preferences & restrictions</li>
                                <li>Metabolic goals</li>
                                <li>Allergen profiles</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h4 className="text-white font-bold mb-2">Visual Input</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Meal photographs</li>
                                <li>Preparation context</li>
                                <li>Consumption timestamps</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Data Utilization",
            icon: Server,
            content: (
                <div className="space-y-4 text-white/70">
                    <p>Your data isn't just stored; it's processed to generate value for you:</p>
                    <ul className="grid gap-3 mt-2">
                        {['AI Model training for higher accuracy', 'Personalized macronutrient calibration', 'Timeline generation for metabolic trends'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#f54703] rounded-full" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            title: "Third-Party Logistics",
            icon: Globe,
            content: (
                <div className="space-y-6 text-white/70">
                    <p>We partner with industry leaders to process high-fidelity data:</p>
                    <div className="p-6 bg-[#f54703]/5 border border-[#f54703]/20 rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[#f54703]/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                        <div className="relative z-10">
                            <h4 className="text-[#f54703] font-bold uppercase tracking-wider text-sm mb-2">AI Processors</h4>
                            <p className="text-white">Google Gemini Vision AI & Hugging Face</p>
                            <p className="text-xs mt-2 opacity-50">Used strictly for ingredient identification and nutritional estimation.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Your Sovereignty",
            icon: Lock,
            content: (
                <div className="space-y-4 text-white/70">
                    <p>You retain absolute control over your digital biological footprint:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {['Access', 'Rectification', 'Erasure', 'Portability'].map((right) => (
                            <span key={right} className="px-3 py-1 rounded-full border border-white/20 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-default">
                                {right}
                            </span>
                        ))}
                    </div>
                    <p className="text-sm mt-4 italic">GDPR & CCPA Compliant</p>
                </div>
            )
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-[#050505] text-[#f0f0f0] font-display selection:bg-[#f54703] selection:text-white pb-20">
            {/* Custom Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 mix-blend-difference">
                <button
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-[#f54703] transition-colors"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>
                <div className="font-black text-xl tracking-tighter hidden sm:block">NAFIRA LEGAL</div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 pt-32 relative">
                <motion.div
                    style={{ opacity: headerOpacity }}
                    className="mb-24"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-6 text-[#f54703]"
                    >
                        <Shield size={48} strokeWidth={1.5} />
                        <span className="font-mono text-sm uppercase tracking-widest">Protocol 01</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]"
                    >
                        Privacy<br />Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 text-xl text-white/40 font-mono"
                    >
                        Last Updated: January 21, 2026
                    </motion.p>
                </motion.div>

                <div className="space-y-32">
                    {sections.map((section, idx) => (
                        <motion.section
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className="relative pl-8 md:pl-0"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 md:hidden" />
                            <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-16">
                                <div className="relative">
                                    <div className="sticky top-32">
                                        <section.icon className="w-8 h-8 text-[#f54703] mb-4" />
                                        <h2 className="text-3xl font-bold uppercase tracking-tight">{section.title}</h2>
                                        <span className="text-9xl font-black absolute -top-8 -left-8 text-white/[0.03] -z-10 select-none">
                                            0{idx + 1}
                                        </span>
                                    </div>
                                </div>
                                <div className="prose prose-invert prose-lg">
                                    {section.content}
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-white/40 text-sm font-mono">
                    <p>For detailed inquiries, contact our Data Protection Officer via the dashboard.</p>
                    <p>© 2026 Nafira Systems.</p>
                </div>
            </div>
        </div>
    );
}

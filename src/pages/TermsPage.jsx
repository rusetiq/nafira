import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, ArrowLeft, Check, AlertTriangle, XCircle, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

export default function TermsPage() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const termsSections = [
        {
            title: "The Agreement",
            icon: Scale,
            content: (
                <div className="space-y-4 text-white/70">
                    <p>By accessing Nafira ("The Service"), you enter into a binding agreement. Access is a privilege, not a right, contingent on your adherence to these protocols.</p>
                </div>
            )
        },
        {
            title: "Medical Reality",
            icon: AlertTriangle,
            content: (
                <div className="space-y-4">
                    <div className="bg-[#f54703]/10 border-l-4 border-[#f54703] p-6 rounded-r-xl">
                        <h4 className="text-[#f54703] font-bold uppercase tracking-wider text-sm mb-2">Critical Disclaimer</h4>
                        <p className="text-white/90 font-medium">
                            Nafira is an intelligence layer, not a doctor. We provide data, not diagnoses.
                        </p>
                        <p className="text-white/60 text-sm mt-2">
                            Our algorithms estimate nutritional content based on visual data. Do not rely on this system for critical medical decisions, insulin dosing, or allergen avoidance.
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: "User Obligations",
            icon: Check,
            content: (
                <div className="space-y-4 text-white/70">
                    <p>Your responsibilities in this ecosystem:</p>
                    <ul className="grid gap-4 sm:grid-cols-2 mt-4">
                        {[
                            "Provide accurate metabolic data",
                            "Maintain account security",
                            "Report system anomalies",
                            "Respect intellectual property"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                <Check size={16} className="text-[#f54703]" />
                                <span className="text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            title: "Liability Limits",
            icon: XCircle,
            content: (
                <div className="space-y-4 text-white/70">
                    <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, NAFIRA SHALL NOT BE LIABLE FOR:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm marker:text-[#f54703]">
                        <li>Indirect or consequential damages</li>
                        <li>Loss of biological data or profits</li>
                        <li>Health outcomes resulting from misuse</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Intellectual Property",
            icon: FileText,
            content: (
                <div className="space-y-4 text-white/70">
                    <p>
                        The Service, including its "Vision-to-Nutrition" algorithms and interface designs, is the exclusive property of Nafira Systems.
                    </p>
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
                    style={{ scale: headerScale }}
                    className="mb-24 text-center md:text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-4 mb-6 text-[#f54703] border border-[#f54703]/30 px-4 py-1 rounded-full bg-[#f54703]/5"
                    >
                        <FileText size={16} />
                        <span className="font-mono text-xs uppercase tracking-widest">Protocol 02</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]"
                    >
                        Terms of<br /><span className="text-white/20">Service</span>
                    </motion.h1>
                </motion.div>

                <div className="space-y-24">
                    {termsSections.map((section, idx) => (
                        <motion.section
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6 }}
                            className="group"
                        >
                            <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-white/10 pt-12 group-hover:border-[#f54703]/50 transition-colors duration-500">
                                <div className="md:w-1/3 shrink-0">
                                    <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                                        <section.icon className="text-[#f54703] opacity-0 group-hover:opacity-100 transition-opacity -ml-8 absolute md:static" size={20} />
                                        {section.title}
                                    </h2>
                                    <span className="text-8xl font-black text-white/[0.02] absolute -mt-12 ml-20 pointer-events-none select-none">
                                        0{idx + 1}
                                    </span>
                                </div>
                                <div className="md:w-2/3 prose prose-invert prose-lg">
                                    {section.content}
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                <div className="mt-32 text-center">
                    <p className="text-white/40 font-mono text-xs uppercase">
                        By using Nafira, you acknowledge that you have read and understood these terms.
                    </p>
                </div>
            </div>
        </div>
    );
}

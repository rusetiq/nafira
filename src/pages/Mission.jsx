import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Globe, Cpu, Heart, Zap, Shield, ArrowUpRight } from 'lucide-react';

const manifestoItems = [
    { title: "Transparent", desc: "No hidden algorithms. We believe in open science and clear, understandable data." },
    { title: "Adaptive", desc: "Health isn't static. Our systems evolve with your biological rhythms." },
    { title: "Universal", desc: "Democratizing access to elite-level nutritional intelligence for everyone." },
    { title: "Private", desc: "Your biological data is yours. We process locally where possible and encrypt always." }
];

export default function Mission() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const headerY = useTransform(scrollYProgress, [0, 0.2], ["0%", "-50%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    // Custom Cursor Logic
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    const [cursorVariant, setCursorVariant] = useState("default");

    useEffect(() => {
        const moveCursor = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        }
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [mouseX, mouseY]);

    const cursorX = useSpring(mouseX, { damping: 25, stiffness: 300 });
    const cursorY = useSpring(mouseY, { damping: 25, stiffness: 300 });

    const cursorVariants = {
        default: { height: 16, width: 16, x: -8, y: -8, backgroundColor: "#f54703", mixBlendMode: "screen" },
        text: { height: 80, width: 80, x: -40, y: -40, backgroundColor: "#ffffff", mixBlendMode: "difference" },
        card: { height: 40, width: 40, x: -20, y: -20, backgroundColor: "#f54703", mixBlendMode: "normal" }
    };

    const textEnter = () => setCursorVariant("text");
    const textLeave = () => setCursorVariant("default");
    const cardEnter = () => setCursorVariant("card");

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen bg-[#050505] text-[#f0f0f0] font-display selection:bg-[#f54703] selection:text-white cursor-none overflow-x-hidden"
        >
            {/* Custom Cursor */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                variants={cursorVariants}
                animate={cursorVariant}
                style={{ translateX: cursorX, translateY: cursorY }}
            />

            {/* Navigation Element */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 mix-blend-difference">
                <motion.button
                    onClick={() => navigate('/')}
                    onMouseEnter={cardEnter} onMouseLeave={textLeave}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-[#f54703] transition-colors"
                >
                    <ArrowLeft size={18} /> Back
                </motion.button>
                <div className="font-black text-xl tracking-tighter">NAFIRA MISSION</div>
            </nav>

            {/* Section 1: Hero */}
            <section className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden px-4">
                <motion.div
                    style={{ y: headerY, opacity: opacityHero }}
                    className="relative z-10 text-center"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h1
                            onMouseEnter={textEnter} onMouseLeave={textLeave}
                            className="text-[12vw] leading-[0.8] font-black uppercase tracking-tighter text-transparent"
                            style={{ WebkitTextStroke: "2px #f54703" }}
                        >
                            De<br />code
                        </h1>
                        <h1
                            onMouseEnter={textEnter} onMouseLeave={textLeave}
                            className="text-[12vw] leading-[0.8] font-black uppercase tracking-tighter text-white mix-blend-overlay mt-[-4vw]"
                        >
                            Life
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-12 max-w-xl mx-auto text-lg md:text-xl font-mono text-white/50 text-center leading-relaxed"
                    >
                        We are building the operating system for human metabolism.
                        <br />
                        <span className="text-[#f54703]">Data-driven. Unapologetically precise.</span>
                    </motion.p>
                </motion.div>

                {/* Background Grid */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </section>

            {/* Section 2: Statement */}
            <section className="py-32 px-4 md:px-12 bg-[#0a0a0a] relative z-10">
                <div className="max-w-6xl mx-auto">
                    <p className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                        <span className="opacity-30">Current nutrition is broken.</span>{" "}
                        <span className="text-white" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                            It relies on guesswork, fad diets, and generic advice that ignores your unique biology.
                        </span>{" "}
                        <span className="text-[#f54703]" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                            We exist to change that.
                        </span>
                    </p>
                </div>
            </section>

            {/* Section 3: Pillars (Bento Gridish) */}
            <section className="py-24 px-4 bg-[#050505] text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-min gap-6">
                    {/* Large Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-2 row-span-2 bg-[#111] border border-white/10 rounded-[2rem] p-10 flex flex-col justify-between hover:border-[#f54703]/50 transition-colors group relative overflow-hidden"
                        onMouseEnter={cardEnter} onMouseLeave={textLeave}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f54703]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div>
                            <Target className="text-[#f54703] w-12 h-12 mb-6" />
                            <h3 className="text-4xl font-bold uppercase tracking-tighter mb-4">Precision over Intuition</h3>
                            <p className="text-xl text-white/60 max-w-lg">
                                Using advanced computer vision and metabolic modeling, we don't just guess what you're eating. We analyze it physically and chemically to predict its impact on <em>your</em> body.
                            </p>
                        </div>
                        <div className="mt-12 flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full border border-white/20 flex items-center justify-center font-mono text-xs">AI</div>
                            <div className="h-px bg-white/20 flex-grow"></div>
                            <div className="h-16 w-16 rounded-full bg-[#f54703] flex items-center justify-center font-mono text-xs text-black font-bold">YOU</div>
                        </div>
                    </motion.div>

                    {/* Tall Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] p-8 flex flex-col justify-end min-h-[400px] hover:bg-[#161616] transition-colors"
                        onMouseEnter={cardEnter} onMouseLeave={textLeave}
                    >
                        <Globe className="text-white w-8 h-8 mb-4" />
                        <h4 className="text-2xl font-bold uppercase mb-2">Global Scale</h4>
                        <p className="text-sm text-white/50">From local ingredients to global health standards. We adapt to every culture.</p>
                    </motion.div>

                    {/* Standard Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#f54703] text-black rounded-[2rem] p-8 flex flex-col justify-center items-center text-center group"
                        onMouseEnter={cardEnter} onMouseLeave={textLeave}
                    >
                        <Heart className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <h4 className="text-2xl font-black uppercase">User First</h4>
                    </motion.div>

                    {/* Wide Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="lg:col-span-2 bg-[#111] border border-white/10 rounded-[2rem] p-8 flex items-center gap-8 group overflow-hidden"
                        onMouseEnter={cardEnter} onMouseLeave={textLeave}
                    >
                        <div className="flex-shrink-0 bg-white/5 p-4 rounded-full">
                            <Cpu className="w-8 h-8 text-[#f54703]" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold uppercase mb-1">Compute at the Edge</h4>
                            <p className="text-sm text-white/50">Real-time processing for real-time decisions. No latency in your health journey.</p>
                        </div>
                        <ArrowUpRight className="ml-auto w-8 h-8 text-white/20 group-hover:text-[#f54703] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </motion.div>
                </div>
            </section>

            {/* Section 4: Manifesto List */}
            <section className="py-32 bg-[#050505] px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-sm font-mono uppercase tracking-widest text-[#f54703] mb-12">The Manifesto</h2>
                    <div className="space-y-16">
                        {manifestoItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="group cursor-pointer border-b border-white/10 pb-12"
                                onMouseEnter={textEnter} onMouseLeave={textLeave}
                            >
                                <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-20">
                                    <h3 className="text-5xl md:text-7xl font-black uppercase text-transparent text-stroke-white group-hover:text-stroke-primary transition-all duration-500">
                                        {item.title}
                                    </h3>
                                    <p className="text-xl text-white/60 group-hover:text-white transition-colors max-w-md">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / CTA */}
            <section className="h-[80vh] flex flex-col justify-center items-center bg-[#f54703] text-black relative overflow-hidden">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="absolute inset-0 bg-white rounded-full mix-blend-overlay opacity-20 blur-[100px]"
                />

                <h2 className="text-[10vw] font-black uppercase tracking-tighter leading-none text-center relative z-10">
                    Join the <br /> Revolution
                </h2>

                <div className="mt-12 flex gap-6 relative z-10">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-4 bg-black text-white rounded-full text-lg font-bold uppercase tracking-wider hover:scale-105 transition-transform"
                        onMouseEnter={cardEnter} onMouseLeave={textLeave}
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-4 border-2 border-black text-black rounded-full text-lg font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all"
                        onMouseEnter={cardEnter} onMouseLeave={textLeave}
                    >
                        Return Home
                    </button>
                </div>
            </section>

            <style>{`
                .text-stroke-white {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
                    color: transparent;
                }
                .text-stroke-primary {
                    -webkit-text-stroke: 1px #f54703;
                    color: transparent;
                }
            `}</style>
        </div>
    );
}

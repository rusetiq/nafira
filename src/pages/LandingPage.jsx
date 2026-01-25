import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { Sprout, Globe, HeartPulse, ScanLine, ArrowDown, Leaf, Activity, Heart, ArrowRight, Target } from 'lucide-react';

const marqueeVariants = {
    animate: {
        x: [0, -1000],
        transition: {
            x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 35,
                ease: "linear",
            },
        },
    },
};

const lettersContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.2
        }
    }
};

const letterAnimation = {
    hidden: { y: 100, opacity: 0, rotate: 10 },
    visible: {
        y: 0,
        opacity: 1,
        rotate: 0,
        transition: {
            duration: 1.2,
            ease: [0.2, 0.65, 0.3, 0.9],
        }
    }
};

const floatAnimation = {
    animate: {
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export default function LandingPage() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroTextY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);

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

    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    const cursorVariants = {
        default: {
            height: 12,
            width: 12,
            x: -6,
            y: -6,
            backgroundColor: "#ffffff",
            border: "none",
            mixBlendMode: "difference",
            scale: 1,
            opacity: 1
        },
        hover: {
            height: 48,
            width: 48,
            x: -24,
            y: -24,
            backgroundColor: "transparent",
            border: "2px solid #ffffff",
            mixBlendMode: "difference",
            scale: 1,
            opacity: 1
        }
    };

    const textEnter = () => setCursorVariant("hover");
    const textLeave = () => setCursorVariant("default");

    return (
        <div ref={containerRef} className="relative min-h-screen bg-accent-primary text-[#0d0d0e] font-display selection:bg-[#0d0d0e] selection:text-white overflow-x-hidden cursor-none">

            <motion.div
                className="hidden lg:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                variants={cursorVariants}
                animate={cursorVariant}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                style={{
                    translateX: cursorX,
                    translateY: cursorY,
                }}
            />

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-4 left-4 right-4 sm:left-8 sm:right-8 z-50 flex justify-between items-center px-6 py-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.1)] transition-all hover:bg-white/20 hover:border-white/30"
                onMouseEnter={textEnter} onMouseLeave={textLeave}
            >
                <div className="flex flex-col leading-none pointer-events-none select-none">
                    <span className="text-xl font-black tracking-tighter uppercase text-black/90">NAFIRA<span className="align-super text-xs">®</span></span>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1">
                        <Leaf size={14} className="text-black/70" />
                        <span className="text-xs font-bold uppercase tracking-wider text-black/70">made by rusetiq</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="hidden sm:flex text-sm font-bold uppercase tracking-widest text-black/70 hover:text-black transition-colors"
                        onMouseEnter={textEnter} onMouseLeave={textLeave}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#0d0d0e] text-white px-5 py-2.5 rounded-full font-bold uppercase text-xs tracking-wider hover:bg-white hover:text-black transition-all shadow-md group relative overflow-hidden"
                        onMouseEnter={textEnter} onMouseLeave={textLeave}
                    >
                        <span className="relative z-10 text-white group-hover:text-black transition-colors">Get Started</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    </button>
                </div>
            </motion.nav>

            <section className="relative h-screen flex flex-col justify-end pb-20 px-4 sm:px-8 overflow-hidden bg-accent-primary">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-white/10 blur-[100px]"
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute -bottom-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-black/5 blur-[80px]"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                <motion.div style={{ y: heroTextY }} className="relative z-10 pointer-events-none">
                    <motion.div
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                        className="border-t-4 border-black mb-8 w-24 opacity-80"
                    />

                    <div className="overflow-hidden">
                        <motion.div variants={lettersContainer} initial="hidden" animate="visible" className="flex flex-wrap">
                            {Array.from("NUTRITIONAL").map((char, i) => (
                                <motion.span key={i} variants={letterAnimation} className="text-[13vw] leading-[0.8] font-black uppercase tracking-tighter text-[#0d0d0e] inline-block">
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>
                        <br />
                        <div className="relative inline-block">
                            <motion.div variants={lettersContainer} initial="hidden" animate="visible" className="flex flex-wrap relative z-10">
                                {Array.from("CLARITY").map((char, i) => (
                                    <motion.span key={i} variants={letterAnimation} className="text-[13vw] leading-[0.8] font-black uppercase tracking-tighter text-white inline-block drop-shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12 pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.5 }}
                            className="max-w-2xl"
                        >
                            <h2 className="text-2xl sm:text-3xl font-medium leading-tight mb-6 tracking-tight">
                                Transform your relationship with food through scientific clarity.
                            </h2>
                            <p className="text-lg opacity-70 leading-relaxed max-w-md">
                                We translate complex nutritional data into simple, actionable insights for your long-term vitality.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 2 }}
                            className="pb-4 md:pb-8"
                        >
                            <motion.div
                                variants={floatAnimation}
                                animate="animate"
                                className="flex gap-4 items-center opacity-60"
                                onMouseEnter={textEnter} onMouseLeave={textLeave}
                            >
                                <ArrowDown />
                                <span className="font-mono text-xs uppercase tracking-widest">Discover More</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-[#0d0d0e] py-6 overflow-hidden flex whitespace-nowrap -rotate-1 origin-left scale-105 border-y-4 border-white"
            >
                <motion.div variants={marqueeVariants} animate="animate" className="flex items-center gap-12 sm:gap-20 text-white/90">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12 sm:gap-20">
                            <span className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter">Mindful Nutrition</span>
                            <span className="h-8 w-8 bg-accent-primary rounded-full" />
                            <span className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-transparent text-stroke-white">Holistic Health</span>
                            <span className="h-8 w-8 bg-accent-primary rounded-full" />
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            <section className="px-4 sm:px-8 py-24 sm:py-32 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 relative z-10 bg-accent-primary">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-4 bg-[#f8f8f8] text-[#0d0d0e] p-8 sm:p-12 rounded-[2.5rem] flex flex-col justify-between min-h-[400px] shadow-sm hover:scale-[1.02] transition-transform duration-500 will-change-transform"
                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                >
                    <div>
                        <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center mb-6">
                            <HeartPulse className="text-accent-primary" size={24} />
                        </div>
                        <h3 className="text-3xl font-bold uppercase mb-4 tracking-tight">Well-being First</h3>
                        <p className="text-black/60 leading-relaxed font-medium">
                            Our goal aligns with UN SDG 3: Ensuring healthy lives and promoting well-being for all ages. We believe specific, personalized data is the key to preventative health.
                        </p>
                    </div>
                    <div className="mt-8 flex items-center gap-2">
                        <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="font-mono text-xs uppercase tracking-widest opacity-50">Sustainable Health Goal</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="lg:col-span-8 bg-white text-black p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500"
                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                >
                    <motion.div
                        className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity duration-500"
                        variants={floatAnimation} animate="animate"
                    >
                        <Sprout size={64} className="text-accent-primary" />
                    </motion.div>

                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="max-w-xl">
                            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                                See Food <br />
                                <span className="text-transparent text-stroke-black">Differently.</span>
                            </h2>
                            <p className="text-black/60 text-xl font-medium">
                                Advanced computer vision for real-time nutritional analysis.
                            </p>
                        </div>

                        <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-8">
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-widest text-black/50 mb-1">Capabilities</h4>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full bg-black/5 text-xs font-bold text-black/60">Macro Tracking</span>
                                    <span className="px-3 py-1 rounded-full bg-black/5 text-xs font-bold text-black/60">Ingredient ID</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-all duration-300">
                                <ScanLine size={20} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-8 bg-[#0d0d0e] text-white p-8 sm:p-12 rounded-[2.5rem] min-h-[400px] relative overflow-hidden group cursor-pointer"
                    onClick={() => navigate('/demo')}
                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                >
                    <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543362906-ac1b4526c110?q=80&w=2069&auto=format&fit=crop')" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

                    <div className="relative z-10 h-full flex flex-col justify-end">
                        <div className="mb-6 w-16 h-16 rounded-full bg-white text-black flex items-center justify-center">
                            <Activity size={28} />
                        </div>
                        <h3 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-4">Try the Demo</h3>
                        <p className="text-white/70 max-w-md text-lg">
                            Experience the power of our AI analysis without an account. Upload a meal photo and get instant insights.
                        </p>
                        <motion.div
                            className="mt-8 flex items-center gap-3 text-white font-bold uppercase tracking-widest text-sm"
                            whileHover={{ x: 10 }}
                        >
                            Start Analysis <ArrowRight />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="lg:col-span-4 bg-white p-8 sm:p-12 rounded-[2.5rem] flex flex-col justify-center items-center text-center shadow-sm"
                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                >
                    <Globe size={64} className="text-[#0d0d0e] mb-6 block mx-auto" />
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Global Vision</h3>
                    <p className="text-black/60 font-medium">
                        Promoting sustainable eating habits for a healthier planet.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="lg:col-span-12 bg-[#0d0d0e] text-white p-8 sm:p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500"
                    onClick={() => navigate('/mission')}
                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <Target size={24} className="text-white" />
                            </div>
                            <span className="text-sm font-mono uppercase tracking-widest text-white/50">Our Mission</span>
                        </div>
                        <h3 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-4">The Manifesto</h3>
                        <p className="text-white/60 text-lg max-w-2xl font-medium">
                            We're building the operating system for human metabolism. Transparent, adaptive, and universal. Read our full mission statement.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <motion.div
                            className="bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-colors hover:bg-gray-200"
                            whileHover={{ scale: 1.05 }}
                        >
                            Read More <ArrowRight size={16} />
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <footer className="bg-[#0d0d0e] text-white py-20 px-6 sm:px-12 border-t-8 border-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                    <div>
                        <h2 className="text-6xl font-black uppercase tracking-tighter mb-6 relative inline-block">
                            Nafira
                            <span className="text-base align-top text-accent-primary ml-2">®</span>
                        </h2>
                        <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-white/50">
                            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-white/30 text-xs font-mono max-w-xs ml-auto mb-4">
                            DISCLAIMER
                            <br />
                            WE ARE NOT MEDICAL ADVISORS, AND THIS APP IS NOT A MEDICAL DEVICE. THE AI ONLY PROVIDES SUGGESTIONS, THESE ARE NOT TO BE TAKEN AS MEDICAL ADVICES.
                        </p>
                        <p className="text-white/20 text-xs">
                            © 2026 NAFIRA INC. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
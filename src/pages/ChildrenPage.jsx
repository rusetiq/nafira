import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Plus, TrendingUp, Baby, AlertCircle, Scale, Ruler, Utensils, Activity, ArrowLeft, Lightbulb, Trash2, Calendar, User } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import GradientText from '../components/GradientText';
import FluidGlassModal from '../components/FluidGlassModal';
import api from '../services/api';

export default function ChildrenPage() {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [growthModalOpen, setGrowthModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [childDetails, setChildDetails] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'male',
        weight: '',
        height: ''
    });
    const [growthData, setGrowthData] = useState({ weight: '', height: '', notes: '' });

    // Cursor Logic
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

    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    const cursorVariants = {
        default: {
            height: 12, width: 12, x: -6, y: -6,
            backgroundColor: "#fff", mixBlendMode: "difference"
        },
        hover: {
            height: 60, width: 60, x: -30, y: -30,
            backgroundColor: "transparent", border: "1px solid #fff",
            mixBlendMode: "difference"
        }
    };

    const textEnter = () => setCursorVariant("hover");
    const textLeave = () => setCursorVariant("default");

    useEffect(() => {
        loadChildren();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            loadChildDetails(selectedChild.id);
        }
    }, [selectedChild]);

    const loadChildren = async () => {
        try {
            const data = await api.get('/children');
            setChildren(data);
        } catch (error) {
            console.error('Error loading children:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadChildDetails = async (childId) => {
        try {
            const [nutritionNeeds, mealSuggestions, riskAssessment, growthHistory] = await Promise.all([
                api.get(`/children/${childId}/nutrition-needs`),
                api.get(`/children/${childId}/meal-suggestions`),
                api.get(`/children/${childId}/risk-assessment`),
                api.get(`/children/${childId}/growth`)
            ]);
            setChildDetails({ nutritionNeeds, mealSuggestions, riskAssessment, growthHistory });
        } catch (error) {
            console.error('Error loading child details:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/children', formData);
            setModalOpen(false);
            setFormData({ name: '', age: '', gender: 'male', weight: '', height: '' });
            loadChildren();
        } catch (error) {
            console.error('Error adding child:', error);
            alert('Failed to add child profile');
        }
    };

    const handleGrowthSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/children/${selectedChild.id}/growth`, growthData);
            setGrowthModalOpen(false);
            setGrowthData({ weight: '', height: '', notes: '' });
            loadChildDetails(selectedChild.id);
            loadChildren();
        } catch (error) {
            console.error('Error recording growth:', error);
            alert('Failed to record growth');
        }
    };

    const handleDeleteChild = async (childId) => {
        if (!window.confirm('Are you sure you want to delete this child profile?')) return;
        try {
            await api.delete(`/children/${childId}`);
            setSelectedChild(null);
            setChildDetails(null);
            loadChildren();
        } catch (error) {
            console.error('Error deleting child:', error);
        }
    };

    const calculateAge = (dob) => {
        // Simple age calculation for now
        // Assuming DOB is passed, if age is passed directly use that
        if (!dob) return 0;
        const birth = new Date(dob);
        const now = new Date();
        const years = now.getFullYear() - birth.getFullYear();
        // roughly
        return years > 0 ? years : 0;
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'moderate': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'high': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center font-display">
                <span className="animate-pulse text-white/50 text-xl tracking-widest uppercase">Initializing...</span>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#050505] text-[#f8fafc] font-display selection:bg-[#f54703] selection:text-white cursor-none overflow-x-hidden">
            {/* Custom Cursor */}
            <motion.div
                className="hidden lg:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                variants={cursorVariants}
                animate={cursorVariant}
                style={{ translateX: cursorX, translateY: cursorY }}
            />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <FloatingShape color="rgba(245, 71, 3, 0.1)" size={800} top="-10%" left="-20%" delay={0} />
                <FloatingShape color="rgba(30, 64, 175, 0.08)" size={600} bottom="10%" right="-10%" delay={5} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-20">
                {selectedChild && childDetails ? (
                    // Detail View
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="flex items-center gap-6 mb-12">
                            <button
                                onClick={() => { setSelectedChild(null); setChildDetails(null); }}
                                className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                                onMouseEnter={textEnter} onMouseLeave={textLeave}
                            >
                                <ArrowLeft size={24} className="text-white/70 group-hover:text-white" />
                            </button>
                            <div>
                                <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                                    {selectedChild.name}
                                </h1>
                                <div className="flex items-center gap-4 mt-2 text-white/40 font-mono text-sm uppercase tracking-wider">
                                    <span>{selectedChild.age} Years Old</span>
                                    <span className="w-1 h-1 bg-white/40 rounded-full" />
                                    <span>{selectedChild.gender}</span>
                                </div>
                            </div>
                            <div className="ml-auto flex gap-4">
                                <button
                                    onClick={() => setGrowthModalOpen(true)}
                                    className="px-6 py-3 rounded-full bg-[#f54703] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors"
                                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                                >
                                    LOG GROWTH
                                </button>
                                <button
                                    onClick={() => handleDeleteChild(selectedChild.id)}
                                    className="p-3 rounded-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 transition-colors"
                                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Top Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Weight', value: selectedChild.current_weight || '--', unit: 'KG', icon: Scale, color: 'text-blue-400' },
                                { label: 'Height', value: selectedChild.current_height || '--', unit: 'CM', icon: Ruler, color: 'text-amber-400' },
                                { label: 'Calories', value: childDetails.nutritionNeeds?.calories || '--', unit: 'KCAL', icon: Activity, color: 'text-[#f54703]' },
                                { label: 'Status', value: childDetails.riskAssessment?.risk || 'Check', unit: 'RISK', icon: AlertCircle, color: 'text-purple-400' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-[#000000]/40 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hover:border-white/20 transition-all group"
                                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
                                        <span className="font-mono text-xs text-white/30 uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black tracking-tight">{stat.value}</span>
                                        <span className="text-sm font-bold text-white/40">{stat.unit}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Nutrition Needs - Wide */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-5">
                                    <Utensils size={120} />
                                </div>
                                <h3 className="text-2xl font-bold uppercase tracking-tight mb-8 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-[#f54703] rounded-full" />
                                    Daily Targets
                                </h3>

                                <div className="grid grid-cols-3 gap-6">
                                    {[
                                        { label: 'Protein', val: childDetails.nutritionNeeds?.protein, sub: 'Building Blocks' },
                                        { label: 'Carbs', val: childDetails.nutritionNeeds?.carbs, sub: 'Energy Source' },
                                        { label: 'Fats', val: childDetails.nutritionNeeds?.fats, sub: 'Brain Health' },
                                    ].map((nutrient, i) => (
                                        <div key={i} className="bg-white/5 rounded-3xl p-6 text-center border border-white/5">
                                            <div className="text-3xl font-black mb-1">{nutrient.val}<span className="text-sm text-white/40 ml-1">g</span></div>
                                            <div className="text-xs font-bold uppercase tracking-widest text-[#f54703] mb-2">{nutrient.label}</div>
                                            <div className="text-[10px] text-white/30 font-mono uppercase">{nutrient.sub}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Suggestions - Tall */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-[#151515] border border-white/10 rounded-[2.5rem] p-8"
                            >
                                <h3 className="text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-3">
                                    <Lightbulb className="text-yellow-400" size={24} />
                                    Smart Picks
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {childDetails.mealSuggestions?.suggestions?.slice(0, 4).map((meal, idx) => (
                                        <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-[#f54703]/20 text-[#f54703] flex items-center justify-center font-bold text-sm shrink-0">{idx + 1}</div>
                                            <span className="text-sm font-medium leading-tight">{meal}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* History Table */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 sm:p-12"
                        >
                            <h3 className="text-2xl font-bold uppercase tracking-tight mb-8">Growth Trajectory</h3>
                            {childDetails.growthHistory?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/10 text-white/30 text-xs font-mono uppercase tracking-widest">
                                                <th className="pb-4 pl-4">Date Recoded</th>
                                                <th className="pb-4">Weight</th>
                                                <th className="pb-4">Height</th>
                                                <th className="pb-4">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {childDetails.growthHistory.map((record, idx) => (
                                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                    <td className="py-4 pl-4 font-mono text-sm text-white/60">{new Date(record.recorded_at).toLocaleDateString()}</td>
                                                    <td className="py-4 font-bold">{record.weight} kg</td>
                                                    <td className="py-4 font-bold">{record.height} cm</td>
                                                    <td className="py-4 text-sm text-white/40 max-w-xs truncate">{record.notes || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-3xl">
                                    <p className="text-white/40 mb-4">No growth data available yet.</p>
                                    <button onClick={() => setGrowthModalOpen(true)} className="text-[#f54703] font-bold uppercase tracking-wider text-sm hover:underline">Start Logging</button>
                                </div>
                            )}
                        </motion.div>

                    </motion.div>
                ) : (
                    // Index List View
                    <>
                        <motion.header
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
                        >
                            <div>
                                <span className="text-[#f54703] font-mono text-xs uppercase tracking-[0.2em] mb-4 block">Family Health â€¢ SDG 3.2</span>
                                <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
                                    Child<br />
                                    <span className="text-transparent" style={{ webkitTextStroke: '1px #fff' }}>Wellness</span>
                                </h1>
                            </div>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="group relative px-8 py-4 bg-[#f8fafc] text-black rounded-full font-bold uppercase tracking-wider overflow-hidden"
                                onMouseEnter={textEnter} onMouseLeave={textLeave}
                            >
                                <span className="relative z-10 group-hover:text-[#f54703] transition-colors">Add Profile</span>
                                <div className="absolute inset-0 bg-[#0d0d0e] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                            </button>
                        </motion.header>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {children.map((child, i) => (
                                <motion.div
                                    key={child.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setSelectedChild(child)}
                                    className="group relative bg-[#111] hover:bg-[#161616] border border-white/5 hover:border-[#f54703]/50 p-8 rounded-[2.5rem] transition-all duration-500 cursor-none"
                                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                                >
                                    <div className="absolute top-8 right-8 p-3 rounded-full bg-white/5 group-hover:bg-[#f54703] group-hover:text-black transition-colors duration-500">
                                        <ArrowLeft className="rotate-180" size={20} />
                                    </div>

                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 text-white/30 group-hover:scale-110 group-hover:text-[#f54703] transition-all duration-500">
                                        <Baby size={32} />
                                    </div>

                                    <h3 className="text-3xl font-bold uppercase tracking-tight mb-2 group-hover:translate-x-2 transition-transform duration-500">{child.name}</h3>
                                    <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-8">{child.age} Years Old</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-black border border-white/5">
                                            <div className="text-xs text-white/30 uppercase tracking-wider mb-1">Weight</div>
                                            <div className="text-xl font-bold">{child.current_weight || '--'}<span className="text-xs ml-1 font-normal opacity-50">kg</span></div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-black border border-white/5">
                                            <div className="text-xs text-white/30 uppercase tracking-wider mb-1">Height</div>
                                            <div className="text-xl font-bold">{child.current_height || '--'}<span className="text-xs ml-1 font-normal opacity-50">cm</span></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {children.length === 0 && (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-[3rem]">
                                    <p className="text-2xl font-bold text-white/30 mb-4">No Profiles Found</p>
                                    <p className="text-white/20">Add a child profile to get started</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Modals - Wrapped with new aesthetics */}
            <FluidGlassModal open={modalOpen} onClose={() => setModalOpen(false)} title="New Profile">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Child Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#f54703] focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                            placeholder="Enter Name"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Age</label>
                            <input
                                type="number"
                                required
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#f54703] focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Gender</label>
                            <div className="relative">
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#f54703] focus:outline-none appearance-none transition-all"
                                >
                                    <option value="male" className="bg-[#111]">Male</option>
                                    <option value="female" className="bg-[#111]">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Weight (KG)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#f54703] focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Height (CM)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#f54703] focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-4 rounded-2xl bg-[#f54703] text-[#050505] font-black uppercase tracking-widest hover:bg-white transition-colors mt-4">
                        Create Profile
                    </button>
                </form>
            </FluidGlassModal>

            <FluidGlassModal open={growthModalOpen} onClose={() => setGrowthModalOpen(false)} title="Log Growth">
                <form onSubmit={handleGrowthSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Weight (KG)</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                value={growthData.weight}
                                onChange={(e) => setGrowthData({ ...growthData, weight: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#f54703] focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Height (CM)</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                value={growthData.height}
                                onChange={(e) => setGrowthData({ ...growthData, height: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#f54703] focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Notes</label>
                        <textarea
                            value={growthData.notes}
                            onChange={(e) => setGrowthData({ ...growthData, notes: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#f54703] focus:outline-none transition-all min-h-[120px]"
                        />
                    </div>
                    <button type="submit" className="w-full py-4 rounded-2xl bg-[#f54703] text-[#050505] font-black uppercase tracking-widest hover:bg-white transition-colors mt-4">
                        Save Log
                    </button>
                </form>
            </FluidGlassModal>
        </div>
    );
}

function FloatingShape({ color, size, top, left, right, bottom, delay }) {
    return (
        <motion.div
            className="absolute rounded-full blur-[100px]"
            style={{ backgroundColor: color, width: size, height: size, top, left, right, bottom }}
            animate={{
                y: [0, 50, 0],
                x: [0, 30, 0],
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration: 10,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
}

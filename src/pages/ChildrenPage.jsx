import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingUp, Baby, AlertCircle, Scale, Ruler, Utensils, Activity, ArrowLeft, X, Lightbulb } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import GradientText from '../components/GradientText';
import FluidGlassModal from '../components/FluidGlassModal';
import DitheredBackground from '../components/DitheredBackground';
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
        const birth = new Date(dob);
        const now = new Date();
        const years = now.getFullYear() - birth.getFullYear();
        const months = now.getMonth() - birth.getMonth();
        if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
            return years - 1;
        }
        return years;
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'low': return 'text-green-400 bg-green-500/20';
            case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
            case 'high': return 'text-red-400 bg-red-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    // Child Detail View
    if (selectedChild && childDetails) {
        return (
            <div className="min-h-screen bg-background-dark px-3 sm:px-6 lg:px-10 pb-16 sm:pb-20 pt-6 sm:pt-10 text-white relative overflow-hidden">
                <DitheredBackground />
                <div className="relative z-10 max-w-7xl mx-auto">
                    <motion.button
                        onClick={() => { setSelectedChild(null); setChildDetails(null); }}
                        className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
                        whileHover={{ x: -5 }}
                    >
                        <ArrowLeft size={20} />
                        <span>Back to All Children</span>
                    </motion.button>

                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold">
                                <GradientText>{selectedChild.name}</GradientText>
                            </h1>
                            <p className="text-white/60">
                                {calculateAge(selectedChild.date_of_birth)} years old • {selectedChild.gender}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                onClick={() => setGrowthModalOpen(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium"
                            >
                                <Plus size={18} />
                                Record Growth
                            </motion.button>
                            <motion.button
                                onClick={() => handleDeleteChild(selectedChild.id)}
                                whileHover={{ scale: 1.05 }}
                                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30"
                            >
                                Delete
                            </motion.button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <MagicBento>
                            <div className="flex items-center gap-3 mb-2">
                                <Scale className="w-5 h-5 text-blue-400" />
                                <span className="text-sm text-white/60">Current Weight</span>
                            </div>
                            <p className="text-3xl font-bold">
                                <GradientText>{selectedChild.current_weight || '--'} kg</GradientText>
                            </p>
                        </MagicBento>

                        <MagicBento>
                            <div className="flex items-center gap-3 mb-2">
                                <Ruler className="w-5 h-5 text-green-400" />
                                <span className="text-sm text-white/60">Current Height</span>
                            </div>
                            <p className="text-3xl font-bold">
                                <GradientText>{selectedChild.current_height || '--'} cm</GradientText>
                            </p>
                        </MagicBento>

                        <MagicBento>
                            <div className="flex items-center gap-3 mb-2">
                                <Activity className="w-5 h-5 text-orange-400" />
                                <span className="text-sm text-white/60">Daily Calories</span>
                            </div>
                            <p className="text-3xl font-bold">
                                <GradientText>{childDetails.nutritionNeeds?.calories || '--'}</GradientText>
                            </p>
                        </MagicBento>

                        <MagicBento>
                            <div className="flex items-center gap-3 mb-2">
                                <AlertCircle className="w-5 h-5 text-purple-400" />
                                <span className="text-sm text-white/60">Risk Assessment</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(childDetails.riskAssessment?.risk)}`}>
                                {childDetails.riskAssessment?.risk || 'Unknown'} risk
                            </span>
                        </MagicBento>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <MagicBento>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Utensils className="w-5 h-5 text-accent-primary" />
                                <GradientText>Daily Nutrition Needs</GradientText>
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 rounded-xl bg-white/5">
                                    <p className="text-2xl font-bold text-blue-400">{childDetails.nutritionNeeds?.protein || 0}g</p>
                                    <p className="text-xs text-white/60">Protein</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-white/5">
                                    <p className="text-2xl font-bold text-green-400">{childDetails.nutritionNeeds?.carbs || 0}g</p>
                                    <p className="text-xs text-white/60">Carbs</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-white/5">
                                    <p className="text-2xl font-bold text-yellow-400">{childDetails.nutritionNeeds?.fats || 0}g</p>
                                    <p className="text-xs text-white/60">Fats</p>
                                </div>
                            </div>
                        </MagicBento>

                        <MagicBento>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-400" />
                                <GradientText>Meal Suggestions</GradientText>
                            </h2>
                            <div className="space-y-2">
                                {childDetails.mealSuggestions?.suggestions?.slice(0, 5).map((meal, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-primary/20 text-accent-primary text-sm font-bold">
                                            {idx + 1}
                                        </span>
                                        <span className="text-sm">{meal}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </MagicBento>

                        <MagicBento className="lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                <GradientText>Growth History</GradientText>
                            </h2>
                            {childDetails.growthHistory?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-white/60 border-b border-white/10">
                                                <th className="pb-3 pr-4">Date</th>
                                                <th className="pb-3 pr-4">Weight (kg)</th>
                                                <th className="pb-3 pr-4">Height (cm)</th>
                                                <th className="pb-3">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {childDetails.growthHistory.map((record, idx) => (
                                                <tr key={idx} className="border-b border-white/5">
                                                    <td className="py-3 pr-4 text-sm">
                                                        {new Date(record.recorded_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 pr-4 font-medium">{record.weight}</td>
                                                    <td className="py-3 pr-4 font-medium">{record.height}</td>
                                                    <td className="py-3 text-sm text-white/60">{record.notes || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-white/40">
                                    <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                                    <p>No growth records yet</p>
                                    <button
                                        onClick={() => setGrowthModalOpen(true)}
                                        className="mt-4 px-4 py-2 rounded-xl bg-accent-primary/20 text-accent-primary"
                                    >
                                        Record First Measurement
                                    </button>
                                </div>
                            )}
                        </MagicBento>

                        {childDetails.riskAssessment?.message && (
                            <MagicBento className="lg:col-span-2">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    <GradientText>Health Assessment</GradientText>
                                </h2>
                                <div className={`p-4 rounded-xl ${getRiskColor(childDetails.riskAssessment?.risk)}`}>
                                    <p className="font-medium mb-2">
                                        Risk Level: {childDetails.riskAssessment?.risk?.toUpperCase()}
                                    </p>
                                    <p className="text-sm opacity-80">{childDetails.riskAssessment?.message}</p>
                                </div>
                                {childDetails.riskAssessment?.weightPercentile && (
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="p-3 rounded-xl bg-white/5">
                                            <p className="text-sm text-white/60">Weight Percentile</p>
                                            <p className="text-lg font-bold">{childDetails.riskAssessment.weightPercentile}%</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/5">
                                            <p className="text-sm text-white/60">Height Percentile</p>
                                            <p className="text-lg font-bold">{childDetails.riskAssessment.heightPercentile}%</p>
                                        </div>
                                    </div>
                                )}
                            </MagicBento>
                        )}
                    </div>

                    {/* Growth Recording Modal */}
                    <FluidGlassModal open={growthModalOpen} onClose={() => setGrowthModalOpen(false)} title="Record Growth Measurement">
                        <form onSubmit={handleGrowthSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={growthData.weight}
                                        onChange={(e) => setGrowthData({ ...growthData, weight: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Height (cm)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={growthData.height}
                                        onChange={(e) => setGrowthData({ ...growthData, height: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-primary focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                                <textarea
                                    value={growthData.notes}
                                    onChange={(e) => setGrowthData({ ...growthData, notes: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-primary focus:outline-none"
                                    rows={3}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold hover:opacity-90"
                            >
                                Save Measurement
                            </button>
                        </form>
                    </FluidGlassModal>
                </div>
            </div>
        );
    }

    // Main Children List View
    return (
        <div className="min-h-screen bg-background-dark px-3 sm:px-6 lg:px-10 pb-16 sm:pb-20 pt-6 sm:pt-10 text-white relative overflow-hidden">
            <DitheredBackground />

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.header
                    className="flex flex-wrap items-center justify-between gap-3 sm:gap-6 mb-6 sm:mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/60">
                            SDG 3.2 - Child Nutrition
                        </p>
                        <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold">
                            <GradientText>Children & Family Nutrition</GradientText>
                        </h1>
                        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-white/60">
                            Track growth and ensure optimal nutrition for your children
                        </p>
                    </div>
                    <motion.button
                        onClick={() => setModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium uppercase tracking-wider hover:border-accent-soft hover:bg-white/10"
                    >
                        <Plus size={18} />
                        Add Child
                    </motion.button>
                </motion.header>

                {children.length === 0 ? (
                    <MagicBento className="text-center py-12">
                        <Baby className="w-16 h-16 mx-auto text-white/40 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Children Added Yet</h3>
                        <p className="text-white/60 mb-6">Start tracking your children's nutrition and growth</p>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold"
                        >
                            Add Your First Child
                        </button>
                    </MagicBento>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {children.map((child) => (
                            <motion.div
                                key={child.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                onClick={() => setSelectedChild(child)}
                            >
                                <MagicBento className="cursor-pointer">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold">{child.name}</h3>
                                            <p className="text-sm text-white/60">
                                                {calculateAge(child.date_of_birth)} years old
                                            </p>
                                        </div>
                                        <Baby className="w-8 h-8 text-accent-primary" />
                                    </div>

                                    {child.current_weight && child.current_height && (
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div className="rounded-xl bg-white/5 p-3">
                                                <p className="text-xs text-white/60">Weight</p>
                                                <p className="text-lg font-semibold">
                                                    <GradientText>{child.current_weight} kg</GradientText>
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-white/5 p-3">
                                                <p className="text-xs text-white/60">Height</p>
                                                <p className="text-lg font-semibold">
                                                    <GradientText>{child.current_height} cm</GradientText>
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <p className="mt-4 text-sm text-accent-primary">Click to view details →</p>
                                </MagicBento>
                            </motion.div>
                        ))}
                    </div>
                )}

                <FluidGlassModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Child Profile">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-primary focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Age (years)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="18"
                                placeholder="e.g. 5"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-primary focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-primary focus:outline-none"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Height (cm)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold hover:opacity-90"
                        >
                            Add Child
                        </button>
                    </form>
                </FluidGlassModal>
            </div>
        </div>
    );
}

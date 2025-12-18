import { useState, useEffect } from 'react';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import GradientText from '../components/GradientText';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import DitheredBackground from '../components/DitheredBackground';
import api from '../services/api';

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-2 text-sm">
      <p className="text-white/80">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="text-xs" style={{ color: item.color }}>
          {item.dataKey}: {item.value}
        </p>
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const [timelineMeals, setTimelineMeals] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [glowBadges, setGlowBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [meals, stats, badges] = await Promise.all([
        api.getMealHistory(20),
        api.getWeeklyStats(),
        api.getBadges()
      ]);
      setTimelineMeals(meals);
      setWeeklyTrend(stats);
      setGlowBadges(badges);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark px-6 pb-20 pt-10 text-white sm:px-10 lg:px-16 relative">
      <DitheredBackground />
      <div className="relative z-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">History & Progress</p>
          <h1 className="mt-2 text-4xl font-semibold">Timeline, streaks, and radiance trends.</h1>
        </div>
        <button className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm uppercase tracking-wider text-white/80 transition hover:border-accent-soft">
          Export insights
        </button>
      </header>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <MagicBento>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Logged meals</p>
          <div className="mt-6 space-y-4">
            {timelineMeals.map((meal) => (
              <div key={meal.id} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-lg font-semibold">{meal.title}</p>
                  <p className="text-xs text-white/60">{meal.date}</p>
                  <p className="mt-2 text-sm text-white/70">{meal.notes}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Score</p>
                  <GradientText className="text-3xl">{meal.score}</GradientText>
                </div>
              </div>
            ))}
          </div>
        </MagicBento>

        <div className="space-y-6">
          <MagicBento>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Weekly health trend</p>
            <div className="mt-5 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="day" stroke="#ffffff88" tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} />
                  <Tooltip content={<TrendTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#f54703" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="calories" stroke="#FD8B5D" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MagicBento>

          <MagicBento>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Calorie harmony</p>
            <div className="mt-5 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFC299" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#FFC299" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#ffffff55" tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff33" tickLine={false} axisLine={false} />
                  <Tooltip content={<TrendTooltip />} />
                  <Area type="monotone" dataKey="calories" stroke="#FFC299" fillOpacity={1} fill="url(#calGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </MagicBento>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {glowBadges.map((badge, idx) => (
          <SpotlightCard key={badge.id} delay={idx * 0.1} className="flex flex-col gap-2 bg-white/5 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Badge unlocked</p>
            <GradientText className="text-xl">{badge.title}</GradientText>
            <p className="text-sm text-white/70">{badge.description}</p>
          </SpotlightCard>
        ))}
      </section>
      </div>
    </div>
  );
}

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [quickStats, setQuickStats] = useState([
    { label: 'Calories left', value: '1,250', delta: '-8% vs yesterday', accent: '#FD8B5D' },
    { label: 'Macro balance', value: '45 / 30 / 25', delta: 'C / P / F', accent: '#FFC299' },
    { label: 'Health score', value: '92', delta: '+3 boost today', accent: '#f54703' },
  ]);
  const [recentMeals, setRecentMeals] = useState([]);
  const [analysisState, setAnalysisState] = useState({ running: false, result: null });

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [stats, meals] = await Promise.all([
        api.getQuickStats(),
        api.getRecentMeals()
      ]);
      setQuickStats(stats);
      setRecentMeals(meals);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const startAnalysis = async (file) => {
    setAnalysisState({ running: true, result: null });
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      const result = await api.analyzeMeal(file);
      
      // Update recent meals
      setRecentMeals((prev) => [result, ...prev.slice(0, 5)]);
      
      // Refresh quick stats
      const stats = await api.getQuickStats();
      setQuickStats(stats);
      
      setAnalysisState({ running: false, result });
      return result;
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisState({ running: false, result: null });
      throw error;
    }
  };

  const value = useMemo(
    () => ({ quickStats, recentMeals, analysisState, startAnalysis, refreshData: loadData }),
    [quickStats, recentMeals, analysisState]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside AppDataProvider');
  return context;
}

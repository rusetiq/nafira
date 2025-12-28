import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import MealAnalysisPage from './pages/MealAnalysisPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePageEnhanced';
import DemoPage from './pages/DemoPage';
import ChildrenPage from './pages/ChildrenPage';
import SustainabilityPage from './pages/SustainabilityPage';
import KnowledgePage from './pages/KnowledgePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ShowcasePage from './pages/ShowcasePage';
import Navigation from './components/Navigation';
import VisionModelReadyToast from './components/VisionModelReadyToast';
import api from './services/api';
import './index.css';

function ProtectedRoute({ children, requireOnboarding = true }) {
  const { isAuthenticated, loading, user } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (isAuthenticated && requireOnboarding) {
        try {
          const profile = await api.getProfile();
          setOnboardingComplete(profile.onboarding_completed);
        } catch (error) {
          console.error('Error checking onboarding:', error);
        }
      }
      setCheckingOnboarding(false);
    };

    if (!loading) {
      checkOnboarding();
    }
  }, [isAuthenticated, loading, requireOnboarding]);

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireOnboarding && !onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  return children;
}

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isShowcasePage = location.pathname === '/showcase';

  return (
    <div className="app-shell min-h-screen text-white">
      {isAuthenticated && !isShowcasePage && <Navigation />}
      {isAuthenticated && !isShowcasePage && <VisionModelReadyToast />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireOnboarding={false}>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <MealAnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/children"
          element={
            <ProtectedRoute>
              <ChildrenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sustainability"
          element={
            <ProtectedRoute>
              <SustainabilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge"
          element={
            <ProtectedRoute>
              <KnowledgePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge/:id"
          element={
            <ProtectedRoute>
              <ArticleDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
    </div>
  );
}

export default App;

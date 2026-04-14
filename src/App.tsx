import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import SalesRepDashboard from './pages/SalesRepDashboard';
import LoginPage from './pages/LoginPage';
import { getAuthSession, logout, type AuthSession } from './data/store';

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = getAuthSession();
    setSession(savedSession);
    setLoading(false);
  }, []);

  const handleLogin = (newSession: AuthSession) => {
    setSession(newSession);
  };

  const handleLogout = () => {
    logout();
    setSession(null);
  };

  const handleAdminClick = () => {
    // Check if already logged in
    const currentSession = getAuthSession();
    if (currentSession) {
      setSession(currentSession);
    } else {
      setSession(null); // Will show login page
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Show login page if no session
  if (!session) {
    return (
      <>
        <HomePage onAdminClick={handleAdminClick} />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  // Route based on role
  if (session.role === 'sales_rep') {
    return <SalesRepDashboard onLogout={handleLogout} salesRepName={session.name} salesRepId={session.userId} />;
  }

  // Admin or Super Admin
  return <AdminDashboard onBack={handleLogout} isSuperAdmin={session.role === 'super_admin'} currentUserName={session.name} currentUserId={session.userId} />;
}

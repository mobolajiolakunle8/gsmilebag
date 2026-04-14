import { useState, useEffect } from 'react';
import { X, User, Lock, Store, Shield, Eye, EyeOff, Phone } from 'lucide-react';
import { login, loginSalesRep, getSettings, type AuthSession } from '../data/store';

interface LoginPageProps {
  onLogin: (session: AuthSession) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const settings = getSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'sales_rep'>('admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => setIsOpen(true);
    window.addEventListener('open-login-modal', handleOpenLogin);
    return () => window.removeEventListener('open-login-modal', handleOpenLogin);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let session: AuthSession | null = null;
      if (activeTab === 'admin') {
        session = login(identifier, password);
      } else {
        session = loginSalesRep(identifier, password);
      }
      if (session) {
        onLogin(session);
        setIsOpen(false);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'super_admin' | 'sales_rep') => {
    if (role === 'super_admin') {
      setIdentifier('admin@gsmilebags.com');
      setPassword('admin123');
      setActiveTab('admin');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm overflow-y-auto overscroll-contain">
      {/* Scrollable container with proper mobile handling */}
      <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300 my-auto">
          {/* Header - Compact on mobile */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 sm:p-6 text-white relative rounded-t-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex items-center gap-3">
              {settings.businessLogo ? (
                <img src={settings.businessLogo} alt={settings.businessName} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/30 bg-white/10 shrink-0" />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold truncate">{settings.businessName || 'G-Smile Bags'}</h2>
                <p className="text-amber-100 text-xs sm:text-sm">Staff Portal</p>
              </div>
            </div>
          </div>

          {/* Tabs - Scrollable on tiny screens */}
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => {
                setActiveTab('admin');
                setError('');
                setIdentifier('');
                setPassword('');
              }}
              className={`flex-1 min-w-0 py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              Admin / Manager
            </button>
            <button
              onClick={() => {
                setActiveTab('sales_rep');
                setError('');
                setIdentifier('');
                setPassword('');
              }}
              className={`flex-1 min-w-0 py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'sales_rep'
                  ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              Sales Rep
            </button>
          </div>

          {/* Form - Scrollable content */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'admin' ? 'Email or Phone Number' : 'Phone Number'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {activeTab === 'admin' ? (
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder={activeTab === 'admin' ? 'Enter email or phone' : 'Enter phone number'}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 text-white py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-amber-700 focus:ring-4 focus:ring-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {activeTab === 'admin' ? <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> : <User className="w-4 h-4 sm:w-5 sm:h-5" />}
                  Sign In
                </>
              )}
            </button>

            {/* Quick Login for Demo */}
            <div className="pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-[10px] sm:text-xs text-gray-500 text-center mb-2 sm:mb-3">Quick Login (Demo)</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('super_admin')}
                  className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] sm:text-xs text-gray-600 transition-colors"
                >
                  Super Admin
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2">
                Default: admin@gsmilebags.com / admin123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

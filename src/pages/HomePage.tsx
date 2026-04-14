import { useState, useEffect } from 'react';
import {
  Truck, Phone, Star, Shield, RefreshCw, Lock, Headphones,
  ArrowRight, Menu, X, MessageCircle, ChevronRight, Heart,
  ShoppingBag, MapPin, Mail, Send, Package, Award, Zap,
  User, Eye, Building2, CheckCircle2, Copy,
  AlertTriangle, Receipt, ArrowLeft, Upload,
  ShieldCheck, Tag, Maximize2,
} from 'lucide-react';
import {
  getProducts, getTestimonials, getSettings, getCategories, getOrders, formatPrice,
  addOrder, generateWhatsAppUrl, Product, Testimonial,
  startCustomerSignup, verifyCustomerEmailCode, resendCustomerVerificationCode,
  loginCustomerAccount, getCustomerAuthSession, logoutCustomerAccount,
  type CustomerAuthSession,
} from '../data/store';

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function CustomerAuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (session: CustomerAuthSession) => void;
}) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [devCode, setDevCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMode('signin');
      setStep('form');
      setName('');
      setEmail('');
      setPassword('');
      setVerificationCode('');
      setDevCode('');
      setMessage('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const session = loginCustomerAccount(email, password);
    if (!session) {
      setError('Invalid credentials or unverified email. Complete signup verification first.');
      setLoading(false);
      return;
    }
    onAuthSuccess(session);
    setLoading(false);
    onClose();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const result = startCustomerSignup(name, email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setDevCode(result.devCode || '');
    setStep('verify');
    setMessage('Verification code sent. Enter the code below to verify your email.');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const result = verifyCustomerEmailCode(email, verificationCode);
    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }
    const session = loginCustomerAccount(email, password);
    setLoading(false);
    if (!session) {
      setError('Email verified, but automatic sign in failed. Please sign in manually.');
      setMode('signin');
      setStep('form');
      return;
    }
    onAuthSuccess(session);
    onClose();
  };

  const handleResendCode = () => {
    setError('');
    const result = resendCustomerVerificationCode(email);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setDevCode(result.devCode || '');
    setMessage('A new verification code has been generated.');
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Customer Account</h3>
            <p className="text-sm text-gray-500">Sign up with verified email (optional for ordering)</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          {step === 'form' && (
            <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
              <button
                onClick={() => { setMode('signin'); setError(''); setMessage(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'signin' ? 'bg-white text-gray-900 shadow' : 'text-gray-500'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'signup' ? 'bg-white text-gray-900 shadow' : 'text-gray-500'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {message && <p className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{message}</p>}
          {error && <p className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          {step === 'form' ? (
            <form onSubmit={mode === 'signin' ? handleSignIn : handleSignup} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Your full name"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="At least 6 characters"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Continue to Verification'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <p className="font-semibold mb-1">Verification required</p>
                <p>We generated a code for {email}.</p>
                {devCode && <p className="mt-2 font-mono text-base">Code: {devCode}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Enter Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="6-digit code"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify Email and Sign In'}
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                className="w-full text-sm text-amber-700 hover:text-amber-800"
              >
                Resend Code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Quick Order Modal
function QuickOrderModal({ product, onClose, customerSession }: { product: Product; onClose: () => void; customerSession?: CustomerAuthSession | null }) {
  const [step, setStep] = useState<'details' | 'payment' | 'transfer' | 'receipt'>('details');
  const [form, setForm] = useState({ name: '', phone: '', email: '', quantity: 1, message: '' });
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderId, setOrderId] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [receiptImage, setReceiptImage] = useState('');
  const [receiptName, setReceiptName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!customerSession) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || customerSession.name,
      email: prev.email || customerSession.email,
    }));
  }, [customerSession]);

  const total = product.price * form.quantity;
  const settings = getSettings();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a receipt image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Receipt image must be less than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setReceiptImage(result);
      setReceiptName(file.name);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const proceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep('payment');
  };

  const submitOrder = (paymentMethod: string, paymentStatus: string, paymentReference: string = ''): string => {
    const productCode = product.productCode || `GSB-${product.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = addOrder({
      customerName: form.name,
      customerPhone: form.phone,
      customerEmail: form.email,
      product: product.name,
      productCode,
      quantity: form.quantity,
      total,
      status: paymentStatus === 'verified' ? 'confirmed' : 'pending',
      message: form.message,
      revenueCollected: false,
      revenueAmount: 0,
      paymentMethod: paymentMethod as any,
      paymentStatus: paymentStatus as any,
      paymentReference,
      paymentReceipt: {
        method: paymentMethod,
        status: paymentStatus,
        reference: paymentReference,
        amount: total,
        date: new Date().toISOString(),
      },
      saleImage: receiptImage || undefined,
    });

    window.dispatchEvent(new Event('gsb-order-updated'));
    return newOrder.id;
  };

  const handleTransferConfirm = () => {
    if (!receiptImage) {
      setError('Please upload your bank transfer receipt before continuing.');
      return;
    }
    setError('');
    const ref = 'TRF-' + Date.now().toString(36).toUpperCase();
    const id = submitOrder('Transfer', 'awaiting_confirmation', ref);
    setOrderId(id);
    setPaymentRef(ref);
    const url = generateWhatsAppUrl({
      id, product: product.name, quantity: form.quantity, total,
      customerName: form.name, customerPhone: form.phone, customerEmail: form.email,
      message: form.message, paymentMethod: 'Bank Transfer',
      paymentStatus: 'awaiting_confirmation', paymentReference: ref, productCode: product.productCode,
      saleImage: receiptImage,
    });
    setWhatsappUrl(url);
    setStep('receipt');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {step !== 'details' && step !== 'receipt' ? (
              <button onClick={() => setStep(step === 'payment' ? 'details' : 'payment' )}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
            ) : <div />}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center flex-1">
              {step === 'details' && 'Quick Order'}
              {step === 'payment' && 'Select Payment'}
              {step === 'transfer' && 'Bank Transfer'}
              {step === 'receipt' && 'Verification Submitted!'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>

          {/* Step Progress */}
          {step !== 'receipt' && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {['details', 'payment', 'receipt'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${['details', 'payment', 'receipt'].indexOf(step) > i ? 'bg-green-500 text-white'
                      : ['details', 'payment', 'receipt'].indexOf(step) === i ? 'bg-amber-500 text-black'
                      : 'bg-gray-200 text-gray-500'}`}>
                    {['details', 'payment', 'receipt'].indexOf(step) > i ? '✓' : i + 1}
                  </div>
                  {i < 2 && <div className={`w-8 sm:w-12 h-0.5 ${['details', 'payment', 'receipt'].indexOf(step) > i ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          )}

          {/* STEP 1: Details */}
          {step === 'details' && (
            <>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-5">
                <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{product.name}</p>
                  <p className="text-amber-600 font-bold">{formatPrice(product.price)}</p>
                  {customerSession && (
                    <p className="text-[10px] text-green-700 mt-0.5">✓ Verified: {customerSession.email}</p>
                  )}
                </div>
              </div>
              <form onSubmit={proceedToPayment} className="space-y-3.5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm" placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number *</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm" placeholder="08012345678" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email (optional)</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setForm({...form, quantity: Math.max(1, form.quantity - 1)})}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">-</button>
                    <span className="text-lg font-bold w-8 text-center">{form.quantity}</span>
                    <button type="button" onClick={() => setForm({...form, quantity: form.quantity + 1})}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-bold text-lg">+</button>
                    <span className="ml-auto text-amber-600 font-bold">{formatPrice(product.price * form.quantity)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Message (optional)</label>
                  <textarea rows={2} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none text-sm" placeholder="Any special requests..." />
                </div>
                <button type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-3.5 rounded-xl text-base font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg flex items-center justify-center gap-2 mt-2">
                  Continue to Payment <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Payment Method Selection */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{product.name}</p>
                  <p className="text-amber-600 font-bold text-sm">{formatPrice(total)}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center font-medium">Choose your payment method:</p>

              {/* Bank Transfer */}
              <button onClick={() => setStep('transfer')}
                className="w-full border-2 border-gray-200 hover:border-blue-500 rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-lg hover:shadow-blue-500/5 group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900">Bank Transfer</p>
                  <p className="text-xs text-gray-500 mt-0.5">Transfer to our business account</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>

              <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 rounded-xl">
                <Shield className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-700 font-medium">Bank transfer only. Upload your receipt for verification.</p>
              </div>
            </div>
          )}

          {/* STEP 3a: Bank Transfer */}
          {step === 'transfer' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-blue-900">Business Account Details</h4>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Bank Name</p>
                      <p className="font-bold text-gray-900">{settings.bankName}</p>
                    </div>
                    <button onClick={() => copyToClipboard(settings.bankName, 'bank')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Copy className={`w-4 h-4 ${copiedField === 'bank' ? 'text-green-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Account Number</p>
                      <p className="font-bold text-gray-900 text-lg tracking-wider">{settings.bankAccountNumber}</p>
                    </div>
                    <button onClick={() => copyToClipboard(settings.bankAccountNumber, 'account')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Copy className={`w-4 h-4 ${copiedField === 'account' ? 'text-green-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Account Name</p>
                      <p className="font-bold text-gray-900">{settings.bankAccountName}</p>
                    </div>
                    <button onClick={() => copyToClipboard(settings.bankAccountName, 'aname')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Copy className={`w-4 h-4 ${copiedField === 'aname' ? 'text-green-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">Important!</p>
                    <p className="text-xs text-amber-700 mt-1">Please transfer exactly <strong>{formatPrice(total)}</strong> to the account above. Upload your receipt before continuing so we can verify your payment.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Upload Transaction Receipt</h4>
                <label className="block cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 text-center hover:border-amber-400 hover:bg-amber-50 transition-colors">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">{receiptImage ? 'Receipt uploaded - tap to replace' : 'Tap to upload receipt image'}</p>
                    <p className="text-xs text-gray-500 mt-1">PNG or JPG, max 5MB</p>
                  </div>
                </label>
                {receiptImage && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500">{receiptName}</p>
                      <button type="button" onClick={() => { setReceiptImage(''); setReceiptName(''); }} className="text-xs text-red-600 hover:text-red-700 font-medium">Remove</button>
                    </div>
                    <img src={receiptImage} alt="Transaction receipt" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Amount to pay:</span>
                  <span className="font-bold text-gray-900 text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
              )}

              <button onClick={handleTransferConfirm}
                disabled={!receiptImage}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl text-base font-bold hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <CheckCircle2 className="w-5 h-5" /> Submit for Verification
              </button>
            </div>
          )}

          {/* STEP 4: Receipt + WhatsApp */}
          {step === 'receipt' && (
            <div className="space-y-5">
              {/* Success Header */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Submitted for Verification</h4>
                <p className="text-gray-500 text-sm mt-1">Your order is pending confirmation after receipt upload</p>
              </div>

              {/* Receipt Card */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 bg-gray-50">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="w-5 h-5 text-amber-600" />
                  <h5 className="font-bold text-gray-900">Order Receipt</h5>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-mono font-bold text-gray-900">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Product</span>
                    <span className="font-medium text-gray-900 text-right max-w-[180px] truncate">{product.name}</span>
                  </div>
                  {product.productCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Product Code</span>
                      <span className="font-mono text-xs bg-amber-50 px-2 py-0.5 rounded text-amber-700">{product.productCode}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quantity</span>
                    <span className="font-bold text-gray-900">×{form.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment</span>
                    <span className="font-medium text-gray-900">
                      Bank Transfer
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference</span>
                    <span className="font-mono text-xs text-gray-700">{paymentRef}</span>
                  </div>
                  {receiptImage && (
                    <div className="pt-2">
                      <span className="block text-gray-500 mb-2">Receipt Preview</span>
                      <img src={receiptImage} alt="Uploaded receipt" className="w-full h-36 object-cover rounded-xl border border-gray-200" />
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-700">Total Paid</span>
                    <span className="font-bold text-green-600 text-lg">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Confirmation Button */}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-base font-bold transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-[0.98]">
                <MessageCircle className="w-5 h-5" /> Send Receipt & Order Details to WhatsApp
              </a>
              <button onClick={onClose}
                className="w-full text-gray-500 hover:text-gray-700 py-3 rounded-xl text-sm font-medium transition-colors border border-gray-200 hover:bg-gray-50">
                Close
              </button>
              <p className="text-xs text-gray-400 text-center">Order saved to dashboard • Pending admin confirmation ✓</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Product Card
function FullImageModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col items-center justify-center">
        <button
          onClick={onClose}
          className="absolute -top-1 right-0 sm:top-2 sm:right-2 z-10 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="w-full max-h-[92vh] flex items-center justify-center rounded-3xl overflow-hidden bg-black/20 border border-white/10 shadow-2xl">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-[92vh] w-auto h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function ProductPreviewModal({ product, onClose, onOrder }: { product: Product; onClose: () => void; onOrder: () => void }) {
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-black transition-all">
          <X className="w-6 h-6" />
        </button>
        
        <div className="w-full md:w-1/2 min-h-[320px] md:min-h-[560px] relative bg-gradient-to-br from-gray-50 to-gray-100">
          <button
            type="button"
            onClick={() => setShowFullImage(true)}
            className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-gray-700 shadow-lg hover:bg-white hover:text-amber-600 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Full Image
          </button>
          <button
            type="button"
            onClick={() => setShowFullImage(true)}
            className="absolute inset-0 cursor-zoom-in"
            aria-label={`Open full image preview for ${product.name}`}
          />
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 sm:p-6 md:p-8"
          />
          {product.badge && (
            <span className="absolute top-6 left-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              {product.badge}
            </span>
          )}
        </div>
        
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <div className="mb-6">
            <p className="text-amber-600 text-sm font-bold uppercase tracking-widest mb-2">{product.category}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h2>
            <div className="flex items-center gap-1.5 mb-4">
              {[...Array(product.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
              ))}
              <span className="text-gray-500 text-sm font-medium ml-2">({product.reviews} customer reviews)</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-400 line-through font-medium">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Description</h4>
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description || "Crafted with premium materials and exceptional attention to detail. This piece combines timeless elegance with modern functionality, making it the perfect addition to your professional or casual wardrobe."}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>Genuine Material</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="w-5 h-5 text-blue-500" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
                <span>Quality Tested</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-5 h-5 text-purple-500" />
                <span>Code: {product.productCode || 'GSB-PROD'}</span>
              </div>
            </div>
            
            <button
              onClick={() => { onClose(); onOrder(); }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-4 rounded-2xl text-lg font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 mt-8"
            >
              <ShoppingBag className="w-6 h-6" /> Order Now
            </button>
          </div>
        </div>
      </div>
      {showFullImage && <FullImageModal product={product} onClose={() => setShowFullImage(false)} />}
    </div>
  );
}

function ProductCard({ product, customerSession }: { product: Product; customerSession?: CustomerAuthSession | null }) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div
        className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-square cursor-pointer" onClick={() => setShowPreview(true)}>
          <img src={product.image} alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`} />
          <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
          {product.badge && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">{product.badge}</span>
          )}
          <button onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${liked ? 'bg-red-500 text-white shadow-lg' : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'} ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
          <div className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button onClick={(e) => { e.stopPropagation(); setShowOrder(true); }}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black py-2.5 rounded-xl text-sm font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg flex items-center justify-center gap-1.5">
              <ShoppingBag className="w-4 h-4" /> Order Now
            </button>
            <button onClick={(e) => { e.stopPropagation(); setShowPreview(true); }}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-700 hover:bg-white hover:text-amber-600 transition-all shadow-lg">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-5 cursor-pointer" onClick={() => setShowPreview(true)}>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-gray-900 font-bold text-sm sm:text-base mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(product.rating)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />))}
            <span className="text-gray-500 text-xs ml-1">({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-bold text-lg">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-gray-400 text-sm line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <button onClick={(e) => { e.stopPropagation(); setShowOrder(true); }}
              className="bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-500 hover:text-black transition-all">
              Order
            </button>
          </div>
        </div>
      </div>
      {showPreview && <ProductPreviewModal product={product} onClose={() => setShowPreview(false)} onOrder={() => setShowOrder(true)} />}
      {showOrder && <QuickOrderModal product={product} onClose={() => setShowOrder(false)} customerSession={customerSession} />}
    </>
  );
}

function AnnouncementBar() {
  const settings = getSettings();
  return (
    <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white py-2.5 px-4 text-center text-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      <div className="relative flex items-center justify-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-amber-300" />
          FREE delivery within Ibadan on orders above <strong className="text-amber-200">{formatPrice(settings.freeDeliveryThreshold)}</strong>
        </span>
        <span className="hidden sm:inline text-amber-400">|</span>
        <span className="flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-amber-300" />
          Call/WhatsApp:{' '}
          <a href={`tel:${settings.phone}`} className="underline hover:text-amber-200 transition-colors font-semibold">{settings.phone}</a>
        </span>
      </div>
    </div>
  );
}

function Navbar({
  onAdminClick,
  customerSession,
  onAuthOpen,
  onCustomerLogout,
}: {
  onAdminClick: () => void;
  customerSession: CustomerAuthSession | null;
  onAuthOpen: () => void;
  onCustomerLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settings = getSettings();
  const waNum = settings.whatsappNumber || '2348065653384';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Featured', href: '#featured' },
    { label: 'Products', href: '#products' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-xl shadow-gray-200/20 border-b border-gray-100' : 'bg-white/90 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#home" className="flex items-center gap-2 group">
            {settings.businessLogo ? (
              <img src={settings.businessLogo} alt={settings.businessName} className="w-10 h-10 rounded-lg object-cover border border-amber-200 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
                <span className="text-white font-bold text-lg">{(settings.businessName || 'G').charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <span className="text-gray-900 font-bold text-lg sm:text-xl tracking-tight">{settings.businessName || 'G-Smile Bags'}</span>
              <p className="text-[10px] text-gray-500 -mt-1 tracking-widest uppercase">Premium Leather</p>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className="text-gray-700 hover:text-amber-600 transition-colors text-sm font-medium tracking-wide relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <button onClick={onAdminClick} className="text-gray-500 hover:text-amber-600 transition-colors" title="Admin">
              <User className="w-5 h-5" />
            </button>
            {customerSession ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Hi, {customerSession.name.split(' ')[0]}</span>
                <button
                  onClick={onCustomerLogout}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthOpen}
                className="text-sm font-semibold text-amber-700 hover:text-amber-800"
              >
                Sign In
              </button>
            )}
            <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-5 py-2.5 rounded-full text-sm font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105">
              Order Now
            </a>
          </div>
          <button className="md:hidden text-gray-700 p-2 hover:text-amber-600 transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className="block text-gray-700 hover:text-amber-600 transition-colors text-lg font-medium py-2"
                onClick={() => setIsOpen(false)}>{link.label}</a>
            ))}
            {!customerSession ? (
              <button
                onClick={() => { onAuthOpen(); setIsOpen(false); }}
                className="block text-gray-700 hover:text-amber-600 transition-colors text-lg font-medium py-2 w-full text-left"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <button
                onClick={() => { onCustomerLogout(); setIsOpen(false); }}
                className="block text-gray-700 hover:text-amber-600 transition-colors text-lg font-medium py-2 w-full text-left"
              >
                Logout ({customerSession.name.split(' ')[0]})
              </button>
            )}
            <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer"
              className="block bg-gradient-to-r from-amber-500 to-amber-600 text-black px-5 py-3 rounded-full text-center font-bold mt-4">
              Order Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const settings = getSettings();
  const [salesCount, setSalesCount] = useState(() => getOrders().length);

  useEffect(() => {
    const refreshSalesCount = () => setSalesCount(getOrders().length);
    window.addEventListener('gsb-order-updated', refreshSalesCount);
    window.addEventListener('storage', refreshSalesCount);

    return () => {
      window.removeEventListener('gsb-order-updated', refreshSalesCount);
      window.removeEventListener('storage', refreshSalesCount);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={settings.heroImage} alt="Leather craftsmanship" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      </div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium tracking-wide">{settings.heroSubtitle}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Carry{' '}
            <em className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 not-italic">
              Confidence
            </em>
            <br />
            in Every Stitch
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">{settings.heroDescription}</p>
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="#products"
              className="group bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 rounded-full text-lg font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 flex items-center gap-2">
              Shop Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#about"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm">
              Learn More
            </a>
          </div>
          <div className="flex flex-wrap gap-8 sm:gap-12">
            {[
              { value: salesCount.toString(), label: 'Happy Customers' },
              { value: '100%', label: 'Genuine Leather' },
              { value: '5★', label: 'Top Rated' },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-amber-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: Shield, title: '100% Authentic', desc: 'Genuine leather only' },
    { icon: Zap, title: 'Fast Delivery', desc: 'Within Ibadan & beyond' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return policy' },
    { icon: Lock, title: 'Secure Orders', desc: 'Safe & easy ordering' },
    { icon: Headphones, title: '24/7 Support', desc: 'Always here for you' },
  ];
  return (
    <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-8 sm:py-12 border-y border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3 sm:gap-4 group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <item.icon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{item.title}</p>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts({ customerSession }: { customerSession: CustomerAuthSession | null }) {
  const products = getProducts().filter((p: Product) => p.featured && p.inStock);
  return (
    <section id="featured" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-amber-600 text-sm font-medium mb-3">
            <Award className="w-4 h-4" /> Featured Collection
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <em className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 not-italic">Bestsellers</em>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Discover our most loved pieces, handpicked for quality and style.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.slice(0, 4).map((product: Product) => (<ProductCard key={product.id} product={product} customerSession={customerSession} />))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  const settings = getSettings();
  if (!settings.promoActive) return null;

  if (settings.useCustomPromoImage && settings.promoImageDesktop) {
    const ImageContent = () => (
      <img 
        src={settings.promoImageDesktop} 
        alt="Promotion" 
        className="w-full h-auto max-h-[600px] object-cover sm:object-contain bg-black"
      />
    );

    return (
      <section className="w-full bg-black flex justify-center items-center">
        {settings.promoLink ? (
          <a href={settings.promoLink} className="block w-full cursor-pointer hover:opacity-95 transition-opacity max-w-screen-2xl mx-auto">
            <ImageContent />
          </a>
        ) : (
          <div className="w-full max-w-screen-2xl mx-auto">
            <ImageContent />
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-black mb-3">🎉 Special Offer!</h2>
        <p className="text-black/80 text-lg mb-4">Get <strong>{settings.promoDiscount}% OFF</strong> your first order with code</p>
        <div className="inline-flex items-center gap-3 bg-black/10 backdrop-blur-sm rounded-xl px-6 py-3 mb-6">
          <span className="text-black font-mono font-bold text-xl tracking-wider">{settings.promoCode}</span>
          <button onClick={() => { navigator.clipboard.writeText(settings.promoCode); }}
            className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">
            Copy
          </button>
        </div>
        <p className="text-black/60 text-sm">Valid on all products • Limited time offer</p>
      </div>
    </section>
  );
}

function AllProducts({ customerSession }: { customerSession: CustomerAuthSession | null }) {
  const allProducts = getProducts().filter((p: Product) => p.inStock);
  const storedCategories = getCategories();
  // Show stored categories that have products, plus any product categories not in stored list
  const productCategories = Array.from(new Set(allProducts.map((p: Product) => p.category)));
  const categories: string[] = ['All', ...storedCategories.filter(c => productCategories.includes(c)), ...productCategories.filter(c => !storedCategories.includes(c))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? allProducts : allProducts.filter((p: Product) => p.category === activeCategory);

  return (
    <section id="products" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-amber-600 text-sm font-medium mb-3">
            <ShoppingBag className="w-4 h-4" /> Our Products
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore <em className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 not-italic">Our Collection</em>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((cat: string) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filtered.map((product: Product) => (<ProductCard key={product.id} product={product} customerSession={customerSession} />))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No products in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const settings = getSettings();

  // Icon mapping
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Award,
    Truck,
    RefreshCw,
    Headphones,
    Shield,
    Star,
    Zap,
  };

  return (
    <section id="about" className="py-16 sm:py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-600 text-sm font-medium mb-3">
              <Shield className="w-4 h-4" /> {settings.whyChooseSubtitle}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {settings.whyChooseTitle}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {settings.whyChooseDescription}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {settings.whyChooseFeatures.map((item, index) => {
                const IconComponent = iconMap[item.icon] || Award;
                return (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                      <IconComponent className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-sm">{item.title}</p>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1559563458-527698bf5295?w=800&h=600&fit=crop" alt="Leather craftsmanship"
              className="rounded-2xl shadow-2xl w-full" />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-900 font-bold">{settings.whyChooseBadge}</p>
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (<Star key={i} className="w-3 h-3 text-amber-400 fill-current" />))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = getTestimonials();
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium mb-3">
            <Star className="w-4 h-4" /> Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            What Our <em className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300 not-italic">Customers</em> Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Don't just take our word for it — hear from our happy customers.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial: Testimonial) => (
            <div key={testimonial.id}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-800 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 group">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 text-amber-400 fill-current" />))}
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-amber-500/20">
                  {testimonial.initial}
                </div>
                <div>
                  <p className="text-white font-bold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  const settings = getSettings();
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Ready to Elevate Your Style?</h2>
        <p className="text-amber-100/80 text-lg mb-8 max-w-2xl mx-auto">Join hundreds of satisfied customers who trust {settings.businessName || 'G-Smile Bags'} for premium leather craftsmanship.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Hello ${settings.businessName || 'G-Smile Bags'}! I'm interested in your products.`)}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-amber-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-50 transition-all shadow-xl hover:scale-105">
            <MessageCircle className="w-5 h-5" /> Order on WhatsApp
          </a>
          <a href={`tel:${settings.phone}`}
            className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 hover:border-white/60 transition-all">
            <Phone className="w-5 h-5" /> Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const settings = getSettings();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const [waLink, setWaLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello ${settings.businessName || 'G-Smile Bags'}!\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message}`
    );
    setWaLink(`https://wa.me/${settings.whatsappNumber}?text=${text}`);
    setSent(true);
  };

  const resetForm = () => {
    setSent(false);
    setWaLink('');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium mb-3">
            <Mail className="w-4 h-4" /> Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Contact <em className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300 not-italic">Us</em>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Have a question or want to place a custom order? We'd love to hear from you.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="space-y-6 mb-8">
              {[
                { icon: Phone, label: 'Phone / WhatsApp', value: settings.phone, href: `tel:${settings.phone}` },
                { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
                { icon: MapPin, label: 'Location', value: settings.location, href: '#' },
              ].map((item) => (
                <a key={item.label} href={item.href}
                  className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-amber-500/30 transition-all group">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                    <item.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="flex gap-3">
              {[
                { icon: InstagramIcon, label: 'Instagram', url: settings.instagram },
                { icon: FacebookIcon, label: 'Facebook', url: settings.facebook },
                { icon: TwitterIcon, label: 'Twitter', url: settings.twitter },
              ].map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all group">
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Your Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  placeholder="John Doe" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Phone Number</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                placeholder="08012345678" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Message</label>
              <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
                placeholder="Tell us what you're looking for..."></textarea>
            </div>
            {sent ? (
              <div className="space-y-3">
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl text-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white active:scale-95">
                  <MessageCircle className="w-5 h-5" /> Open WhatsApp to Send ✓
                </a>
                <button type="button" onClick={resetForm}
                  className="w-full py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white border border-gray-800 hover:bg-gray-900 transition-all">
                  Send another message
                </button>
              </div>
            ) : (
              <button type="submit"
                className="w-full py-4 rounded-xl text-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-amber-500/20 hover:shadow-amber-500/40">
                <Send className="w-5 h-5" /> Send Message via WhatsApp
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const settings = getSettings();
  const banner = settings.footerBanner || {
    active: true,
    text: "FREE delivery within Ibadan on orders above ₦30,000 | Call/WhatsApp: 08065653384",
    displayMode: 'marquee-left',
    speed: 'normal'
  };

  const getSpeed = () => {
    if (banner.speed === 'slow') return '30s';
    if (banner.speed === 'fast') return '10s';
    return '18s';
  };

  const bannerText = banner.text || "FREE delivery within Ibadan on orders above ₦30,000 | Call/WhatsApp: 08065653384";
  const separator = "  ★  ";
  const fullText = bannerText + separator + bannerText + separator + bannerText + separator;
  const isMarquee = banner.displayMode?.startsWith('marquee');
  const direction = banner.displayMode === 'marquee-right' ? 'reverse' : 'normal';

  return (
    <footer className="bg-gray-950 border-t border-gray-800/50">
      {banner.active && (
        <div className="bg-amber-600 text-white overflow-hidden py-3 border-b border-amber-500/20 relative">
          <style>
            {`
              @keyframes scrollMarquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @keyframes pulseBounce {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.03); opacity: 0.95; }
              }
              @keyframes fadeSlide {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
              }
            `}
          </style>

          {isMarquee ? (
            <div
              className="flex whitespace-nowrap font-medium text-sm tracking-wider items-center"
              style={{
                animation: `scrollMarquee ${getSpeed()} linear infinite`,
                animationDirection: direction,
              }}
            >
              <span className="pr-0">{fullText}</span>
              <span className="pr-0">{fullText}</span>
            </div>
          ) : banner.displayMode === 'bounce' ? (
            <div
              className="flex whitespace-nowrap font-medium text-sm tracking-wider items-center justify-center"
              style={{ animation: 'pulseBounce 2s ease-in-out infinite' }}
            >
              {bannerText}
            </div>
          ) : banner.displayMode === 'fade' ? (
            <div
              className="flex whitespace-nowrap font-medium text-sm tracking-wider items-center justify-center"
              style={{ animation: 'fadeSlide 3s ease-in-out infinite' }}
            >
              {bannerText}
            </div>
          ) : (
            <div className="flex whitespace-nowrap font-medium text-sm tracking-wider items-center justify-center">
              {bannerText}
            </div>
          )}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {settings.businessLogo ? (
                <img src={settings.businessLogo} alt={settings.businessName} className="w-10 h-10 rounded-lg object-cover border border-gray-700" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{(settings.businessName || 'G').charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div><span className="text-white font-bold text-lg">{settings.businessName || 'G-Smile Bags'}</span></div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">Premium handcrafted leather bags made in Nigeria. Elevate your style with our exclusive collection of genuine leather bags.</p>
            <div className="flex gap-3">
              {[
                { Icon: InstagramIcon, url: settings.instagram },
                { Icon: FacebookIcon, url: settings.facebook },
                { Icon: TwitterIcon, url: settings.twitter },
              ].map(({ Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all">
                  <Icon className="w-4 h-4 text-gray-400 hover:text-amber-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {['Home', 'Featured', 'Products', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-1.5 group">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" />{link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {getCategories().map((cat) => (
                <li key={cat}>
                  <a href="#products"
                    className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-1.5 group">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 transition-all" />{cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />{settings.location}
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-amber-400 transition-colors">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition-colors">{settings.email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} {settings.businessName || 'G-Smile Bags'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
              className="flex items-center gap-1.5 text-gray-600 hover:text-amber-400 transition-colors text-xs sm:text-sm group"
              title="Staff Login Portal"
            >
              <Lock className="w-3.5 h-3.5 group-hover:text-amber-400 transition-colors" />
              <span>Staff Login</span>
            </button>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span>Made with</span><Heart className="w-3.5 h-3.5 text-red-500 fill-current" /><span>in Nigeria</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  const settings = getSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: settings.aiBotWelcome || `Hello! Welcome to ${settings.businessName || 'G-Smile Bags'}. How can we help you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const formatWaNumber = (phone: string): string => {
    const cleaned = phone.replace(/[^0-9+]/g, '');
    if (cleaned.startsWith('+234')) return cleaned.substring(1);
    if (cleaned.startsWith('234')) return cleaned;
    if (cleaned.startsWith('0')) return '234' + cleaned.substring(1);
    return cleaned;
  };

  const waNumber = formatWaNumber(settings.whatsappNumber || '08065653384');

  const handleHumanTransfer = () => {
    const transcript = chatHistory
      .map(msg => `${msg.sender === 'ai' ? 'Bot' : 'User'}: ${msg.text}`)
      .join('\n');
    const text = `Hello ${settings.businessName || 'G-Smile Bags'}! 👋\n\nI want to talk to a human representative.\n\nChat Summary:\n${transcript}`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message
    const userMsg = { sender: 'user' as const, text, time: timeStr };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');

    // 2. Simulate AI Typing and Auto-Reply
    setIsTyping(true);
    setTimeout(() => {
      let reply = "Thanks for your message. Please click 'Transfer to Human on WhatsApp' to continue with our support team.";
      
      const lowerText = text.toLowerCase();
      if (settings.aiBotRules && settings.aiBotEnabled) {
        // Try matching custom rules/FAQs first
        for (const rule of settings.aiBotRules) {
          if (lowerText.includes(rule.trigger.toLowerCase())) {
            reply = rule.reply;
            break;
          }
        }
      }

      setChatHistory(prev => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ─── Chat Popup ─── */}
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[370px] bg-white rounded-2xl shadow-2xl shadow-black/20 border border-gray-100 overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-xl">👜</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-300 border-2 border-green-500 rounded-full"></span>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm">{settings.businessName || 'G-Smile Bags'}</h4>
              <p className="text-green-100 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full inline-block"></span>
                Typically replies instantly
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversational History / Messages Container */}
          <div className="p-4 bg-gray-50 h-[260px] overflow-y-auto flex flex-col gap-3">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white text-gray-700 rounded-tl-none border border-gray-100 shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start">
                <div className="bg-white border border-gray-100 shadow-sm px-3.5 py-2.5 rounded-xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Transfer to Human Action Button */}
          <div className="px-4 py-2 bg-green-50 border-y border-green-100 flex justify-center">
            <button
              onClick={handleHumanTransfer}
              className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors flex items-center gap-1.5"
            >
              💬 Transfer to Human on WhatsApp
            </button>
          </div>

          {/* Quick Replies */}
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {[
              { emoji: '🛍️', label: 'Browse Products' },
              { emoji: '📦', label: 'Track Order' },
              { emoji: '💰', label: 'Check Prices' },
              { emoji: '🤝', label: 'Custom Order' },
            ].map((q) => (
              <button
                key={q.label}
                onClick={() => setMessage(q.label === 'Browse Products' ? "Hi! I'd love to browse your collection. What products do you have available?" : q.label === 'Track Order' ? "Hi! I'd like to track my order." : q.label === 'Check Prices' ? "Hi! Can you share your price list?" : "Hi! I'm interested in placing a custom order.")}
                className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors border border-green-200 font-medium"
              >
                {q.emoji} {q.label}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSend}
                className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-xl transition-colors shadow-md shadow-green-500/20 active:scale-95 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-center">
              Powered by WhatsApp • <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">Open WhatsApp</a>
            </p>
          </div>
        </div>
      )}

      {/* ─── Toggle Button ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl shadow-green-500/40 transition-all hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform" />
        ) : (
          <MessageCircle className="w-6 h-6 transition-transform group-hover:rotate-12" />
        )}
        {!isOpen && (
          <>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
            {/* Tooltip */}
            <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              Chat with us! 💬
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></span>
            </span>
          </>
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function HomePage({ onAdminClick }: { onAdminClick: () => void }) {
  const [customerSession, setCustomerSession] = useState<CustomerAuthSession | null>(null);
  const [showCustomerAuth, setShowCustomerAuth] = useState(false);

  useEffect(() => {
    setCustomerSession(getCustomerAuthSession());
  }, []);

  const handleCustomerAuthSuccess = (session: CustomerAuthSession) => {
    setCustomerSession(session);
  };

  const handleCustomerLogout = () => {
    logoutCustomerAccount();
    setCustomerSession(null);
  };

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <AnnouncementBar />
      <Navbar
        onAdminClick={onAdminClick}
        customerSession={customerSession}
        onAuthOpen={() => setShowCustomerAuth(true)}
        onCustomerLogout={handleCustomerLogout}
      />
      <HeroSection />
      <TrustStrip />
      <FeaturedProducts customerSession={customerSession} />
      <PromoBanner />
      <AllProducts customerSession={customerSession} />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTABanner />
      <ContactSection />
      <Footer />
      <CustomerAuthModal
        isOpen={showCustomerAuth}
        onClose={() => setShowCustomerAuth(false)}
        onAuthSuccess={handleCustomerAuthSuccess}
      />
      <FloatingWhatsApp />
    </div>
  );
}

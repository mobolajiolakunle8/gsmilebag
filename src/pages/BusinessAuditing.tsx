import { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Wallet, PieChart, FileText,
  Download, AlertCircle, CheckCircle2, Activity,
  BarChart3, FileCheck, Shield, Target, ShoppingBag,
  Lock, Eye, EyeOff, Lightbulb,
  Store, Globe, CreditCard, ArrowUpRight, ArrowDownRight,
  AlertTriangle, ThumbsUp, Info, ChevronDown, ChevronUp, Copy
} from 'lucide-react';
import {
  getOrders, getExpenses, formatPrice
} from '../data/store';

type Period = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';
type AuditTab = 'overview' | 'transactions' | 'pandl' | 'trail' | 'health' | 'advice';

function getStartOfPeriod(period: Period): Date {
  const now = new Date();
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  switch (period) {
    case 'today': return d;
    case 'week': d.setDate(d.getDate() - d.getDay()); return d;
    case 'month': d.setDate(1); return d;
    case 'quarter': d.setMonth(Math.floor(d.getMonth() / 3) * 3, 1); return d;
    case 'year': d.setMonth(0, 1); return d;
    case 'all': return new Date(2020, 0, 1);
  }
}

export default function BusinessAuditing() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<AuditTab>('overview');
  const [period, setPeriod] = useState<Period>('month');
  const [expandedAdvice, setExpandedAdvice] = useState<string | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState('');

  // Audit password (stored in localStorage)
  const AUDIT_PASSWORD = 'audit2024';

  const handleUnlock = () => {
    if (password === AUDIT_PASSWORD) {
      setIsUnlocked(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Access denied.');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPassword('');
  };

  const allOrders = getOrders();
  const allExpenses = getExpenses();

  const startDate = useMemo(() => getStartOfPeriod(period), [period]);

  const filteredOrders = useMemo(() => {
    return allOrders.filter(o => new Date(o.date) >= startDate);
  }, [allOrders, startDate]);

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter(e => new Date(e.date) >= startDate);
  }, [allExpenses, startDate]);

  // ---- TRANSACTION ANALYSIS BY SOURCE ----
  const onlineOrders = useMemo(() => filteredOrders.filter(o =>
    !o.orderType || o.orderType === 'online'
  ), [filteredOrders]);

  const storeOrders = useMemo(() => filteredOrders.filter(o =>
    o.orderType === 'in-store'
  ), [filteredOrders]);

  const posOrders = useMemo(() => filteredOrders.filter(o =>
    o.orderType === 'in-store' && o.paymentMethod && ['cash', 'transfer', 'pos', 'card'].includes(o.paymentMethod)
  ), [filteredOrders]);

  const onlineRevenue = onlineOrders.reduce((sum, o) => sum + o.total, 0);
  const storeRevenue = storeOrders.reduce((sum, o) => sum + o.total, 0);
  const posRevenue = posOrders.reduce((sum, o) => sum + o.total, 0);

  const onlineCollected = onlineOrders.filter(o => o.revenueCollected).reduce((sum, o) => sum + (o.revenueAmount || o.total), 0);
  const storeCollected = storeOrders.filter(o => o.revenueCollected).reduce((sum, o) => sum + (o.revenueAmount || o.total), 0);
  const posCollected = posOrders.filter(o => o.revenueCollected).reduce((sum, o) => sum + (o.revenueAmount || o.total), 0);

  const onlinePending = onlineOrders.filter(o => !o.revenueCollected && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const storePending = storeOrders.filter(o => !o.revenueCollected && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);

  // Payment method breakdown
  const paymentBreakdown = useMemo(() => {
    const map: Record<string, { count: number; revenue: number; collected: number }> = {};
    filteredOrders.forEach(o => {
      const method = o.paymentMethod || 'unspecified';
      if (!map[method]) map[method] = { count: 0, revenue: 0, collected: 0 };
      map[method].count += 1;
      map[method].revenue += o.total;
      if (o.revenueCollected) map[method].collected += (o.revenueAmount || o.total);
    });
    return Object.entries(map).map(([method, data]) => ({
      method: method.charAt(0).toUpperCase() + method.slice(1),
      ...data
    })).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // ---- GENERAL FINANCIALS ----
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const collectedRevenue = filteredOrders.filter(o => o.revenueCollected).reduce((sum, o) => sum + (o.revenueAmount || o.total), 0);
  const pendingRevenue = filteredOrders.filter(o => !o.revenueCollected && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const cancelledRevenue = filteredOrders.filter(o => o.status === 'cancelled').reduce((sum, o) => sum + o.total, 0);

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = collectedRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const collectionRate = totalRevenue > 0 ? (collectedRevenue / totalRevenue) * 100 : 0;

  // Expense by category
  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach(e => { map[e.purpose] = (map[e.purpose] || 0) + e.amount; });
    return Object.entries(map)
      .map(([purpose, amount]) => ({ purpose, amount, percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, totalExpenses]);

  // Revenue by product
  const revenueByProduct = useMemo(() => {
    const map: Record<string, { qty: number; revenue: number }> = {};
    filteredOrders.forEach(o => {
      if (!map[o.product]) map[o.product] = { qty: 0, revenue: 0 };
      map[o.product].qty += o.quantity;
      map[o.product].revenue += o.total;
    });
    return Object.entries(map)
      .map(([product, data]) => ({ product, ...data, percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0 }))
      .sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [filteredOrders, totalRevenue]);

  const ordersByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return map;
  }, [filteredOrders]);

  // Audit trail
  const auditTrail = useMemo(() => {
    const transactions: Array<{
      id: string; date: string; type: 'income' | 'expense';
      description: string; amount: number; status: string;
      reference?: string; channel: string; paymentMethod?: string;
    }> = [];
    filteredOrders.forEach(o => {
      transactions.push({
        id: o.id, date: o.date, type: 'income',
        description: `${o.product} × ${o.quantity} - ${o.customerName}`,
        amount: o.total,
        status: o.revenueCollected ? 'Collected' : o.status === 'cancelled' ? 'Cancelled' : 'Pending',
        reference: o.paymentReference,
        channel: o.orderType === 'in-store' ? 'Store' : 'Online',
        paymentMethod: o.paymentMethod || 'N/A',
      });
    });
    filteredExpenses.forEach(e => {
      transactions.push({
        id: e.id, date: e.createdAt, type: 'expense',
        description: e.purpose + (e.salesRepName ? ` - ${e.salesRepName}` : ''),
        amount: e.amount, status: 'Paid', channel: 'Expense',
      });
    });
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredOrders, filteredExpenses]);

  // Health indicators
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const totalCustomers = new Set(filteredOrders.map(o => o.customerPhone)).size;
  const customerLTV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

  const healthScore = useMemo(() => {
    let score = 50;
    if (profitMargin > 20) score += 20; else if (profitMargin > 10) score += 10; else if (profitMargin < 0) score -= 20;
    if (collectionRate > 80) score += 15; else if (collectionRate > 60) score += 7; else if (collectionRate < 40) score -= 15;
    if (expenseRatio < 40) score += 15; else if (expenseRatio < 60) score += 7; else if (expenseRatio > 80) score -= 15;
    return Math.max(0, Math.min(100, score));
  }, [profitMargin, collectionRate, expenseRatio]);

  const getHealthStatus = () => {
    if (healthScore >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 };
    if (healthScore >= 60) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp };
    if (healthScore >= 40) return { label: 'Fair', color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertCircle };
    return { label: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-50', icon: TrendingDown };
  };
  const healthStatus = getHealthStatus();

  // ---- PROFESSIONAL AUDITING ADVICE ENGINE ----
  const auditingAdvice = useMemo(() => {
    const advice: Array<{
      id: string; category: string; icon: typeof Lightbulb;
      severity: 'success' | 'warning' | 'danger' | 'info';
      title: string; detail: string; recommendation: string;
    }> = [];

    // 1. Profit Analysis
    if (profitMargin >= 30) {
      advice.push({
        id: 'profit-excellent', category: 'Profitability', icon: ThumbsUp, severity: 'success',
        title: 'Strong Profit Margin',
        detail: `Your profit margin of ${profitMargin.toFixed(1)}% is excellent. This indicates efficient cost management and healthy pricing strategy.`,
        recommendation: 'Consider reinvesting a portion of profits into marketing to accelerate growth. Maintain your current pricing strategy while exploring premium product lines.'
      });
    } else if (profitMargin >= 15) {
      advice.push({
        id: 'profit-good', category: 'Profitability', icon: TrendingUp, severity: 'info',
        title: 'Moderate Profit Margin',
        detail: `Your profit margin of ${profitMargin.toFixed(1)}% is acceptable but has room for improvement. Industry benchmarks suggest 25-35% for retail leather goods.`,
        recommendation: 'Review your supplier costs and negotiate bulk discounts. Consider incremental price adjustments of 5-10% on best-selling items. Focus on upselling premium products.'
      });
    } else if (profitMargin >= 0) {
      advice.push({
        id: 'profit-low', category: 'Profitability', icon: AlertTriangle, severity: 'warning',
        title: 'Low Profit Margin — Action Required',
        detail: `Your profit margin of ${profitMargin.toFixed(1)}% is below the recommended threshold. Every naira of revenue is barely covering costs.`,
        recommendation: 'Immediately review your pricing structure. Identify products with the lowest margins and either increase prices or find cheaper suppliers. Reduce non-essential operating expenses by 15-20%.'
      });
    } else {
      advice.push({
        id: 'profit-negative', category: 'Profitability', icon: AlertCircle, severity: 'danger',
        title: '🚨 Business is Operating at a Loss',
        detail: `Your net profit is negative (${formatPrice(Math.abs(netProfit))} loss). Total expenses exceed collected revenue. This is unsustainable.`,
        recommendation: 'URGENT: Conduct an immediate expense audit. Cut all non-essential spending. Raise prices on your top 5 products. Negotiate payment terms with suppliers. Consider temporarily reducing product range to focus on highest-margin items only.'
      });
    }

    // 2. Collection Rate
    if (collectionRate >= 90) {
      advice.push({
        id: 'collection-excellent', category: 'Cash Flow', icon: ThumbsUp, severity: 'success',
        title: 'Outstanding Payment Collection',
        detail: `${collectionRate.toFixed(0)}% collection rate means almost all sales revenue is being realized as cash. This is excellent for cash flow.`,
        recommendation: 'Maintain this discipline. Consider offering a small early-payment discount (2-3%) to keep this momentum going.'
      });
    } else if (collectionRate >= 70) {
      advice.push({
        id: 'collection-good', category: 'Cash Flow', icon: Info, severity: 'info',
        title: 'Good Collection Rate — Can Improve',
        detail: `${collectionRate.toFixed(0)}% collection rate is decent, but ${formatPrice(pendingRevenue)} is still pending. Uncollected revenue is effectively an interest-free loan to customers.`,
        recommendation: 'Set up automated payment reminders for pending orders. Follow up on unpaid invoices within 48 hours. Consider requiring deposits or full payment before order processing.'
      });
    } else {
      advice.push({
        id: 'collection-poor', category: 'Cash Flow', icon: AlertTriangle, severity: 'warning',
        title: 'Poor Collection Rate — Cash Flow Risk',
        detail: `Only ${collectionRate.toFixed(0)}% of revenue has been collected. ${formatPrice(pendingRevenue)} is outstanding. This creates a dangerous cash flow gap.`,
        recommendation: 'Implement a strict "no payment, no delivery" policy for new customers. Assign a dedicated staff member to follow up on pending payments daily. Offer multiple payment methods to make it easier for customers to pay immediately.'
      });
    }

    // 3. Expense Management
    if (expenseRatio < 30) {
      advice.push({
        id: 'expense-excellent', category: 'Expense Management', icon: ThumbsUp, severity: 'success',
        title: 'Lean Operations',
        detail: `Expenses are only ${expenseRatio.toFixed(0)}% of revenue. Your cost management is exemplary.`,
        recommendation: 'While lean is good, ensure you\'re not under-investing in growth areas like marketing, staff training, or product development that could increase revenue further.'
      });
    } else if (expenseRatio < 60) {
      advice.push({
        id: 'expense-moderate', category: 'Expense Management', icon: Info, severity: 'info',
        title: 'Expenses Within Normal Range',
        detail: `Your expense ratio of ${expenseRatio.toFixed(0)}% is within the typical range for retail businesses (40-65%).`,
        recommendation: 'Review your top 3 expense categories for potential savings. Even a 5% reduction in expenses directly improves your bottom line. Track ROI on every major expense.'
      });
    } else {
      advice.push({
        id: 'expense-high', category: 'Expense Management', icon: AlertTriangle, severity: 'warning',
        title: 'High Expense Ratio — Review Required',
        detail: `Expenses consume ${expenseRatio.toFixed(0)}% of revenue. This leaves very little room for profit and growth.`,
        recommendation: 'Conduct a line-by-line expense review. Identify and eliminate redundant costs. Renegotiate vendor contracts. Consider co-sharing resources or spaces. Set a target to reduce expenses by 10% within 30 days.'
      });
    }

    // 4. Revenue Channel Analysis
    const onlinePct = totalRevenue > 0 ? (onlineRevenue / totalRevenue) * 100 : 0;
    const storePct = totalRevenue > 0 ? (storeRevenue / totalRevenue) * 100 : 0;

    if (onlinePct > 80) {
      advice.push({
        id: 'channel-online', category: 'Sales Channels', icon: Globe, severity: 'info',
        title: 'Heavily Dependent on Online Sales',
        detail: `${onlinePct.toFixed(0)}% of revenue comes from online orders. While online is great, over-reliance on one channel is risky.`,
        recommendation: 'Develop your physical store/POS presence to diversify. Consider pop-up shops, markets, or partnerships with retail stores. Aim for a 60/40 online-to-store split.'
      });
    } else if (storePct > 80) {
      advice.push({
        id: 'channel-store', category: 'Sales Channels', icon: Store, severity: 'info',
        title: 'Heavily Dependent on Store Sales',
        detail: `${storePct.toFixed(0)}% of revenue comes from in-store purchases. You\'re missing out on the broader online market.`,
        recommendation: 'Invest in your online presence. Improve your website, run targeted social media ads, and consider listing on marketplaces. The Nigerian e-commerce market is growing 25%+ annually.'
      });
    } else if (totalRevenue > 0) {
      advice.push({
        id: 'channel-balanced', category: 'Sales Channels', icon: ThumbsUp, severity: 'success',
        title: 'Good Channel Diversification',
        detail: `Revenue is split between online (${onlinePct.toFixed(0)}%) and in-store (${storePct.toFixed(0)}%). This diversification reduces risk.`,
        recommendation: 'Continue developing both channels. Consider which channel has higher margins and focus growth efforts there. Track customer acquisition cost for each channel.'
      });
    }

    // 5. Order Volume & Growth
    if (filteredOrders.length >= 50) {
      advice.push({
        id: 'volume-high', category: 'Sales Volume', icon: TrendingUp, severity: 'success',
        title: 'Strong Sales Volume',
        detail: `${filteredOrders.length} orders in this period demonstrates healthy demand for your products.`,
        recommendation: 'Focus on maintaining quality and customer service at this volume. Consider hiring additional staff or investing in automation tools to handle increased demand efficiently.'
      });
    } else if (filteredOrders.length >= 20) {
      advice.push({
        id: 'volume-medium', category: 'Sales Volume', icon: Info, severity: 'info',
        title: 'Moderate Sales Volume',
        detail: `${filteredOrders.length} orders in this period shows steady business. There is potential to grow significantly.`,
        recommendation: 'Invest in targeted marketing campaigns. Referral programs can be very effective — offer existing customers discounts for bringing new buyers. Run seasonal promotions to boost order frequency.'
      });
    } else if (filteredOrders.length > 0) {
      advice.push({
        id: 'volume-low', category: 'Sales Volume', icon: AlertTriangle, severity: 'warning',
        title: 'Low Sales Volume — Growth Needed',
        detail: `Only ${filteredOrders.length} orders in this period. This suggests limited market reach or customer awareness.`,
        recommendation: 'Increase your marketing budget. Focus on social media marketing (Instagram, WhatsApp status, TikTok). Offer first-time buyer discounts. Partner with influencers or complementary businesses. Ensure your product photos and descriptions are compelling.'
      });
    }

    // 6. Average Order Value
    if (avgOrderValue > 0) {
      if (avgOrderValue >= 30000) {
        advice.push({
          id: 'aov-high', category: 'Order Value', icon: ThumbsUp, severity: 'success',
          title: 'High Average Order Value',
          detail: `Average order value of ${formatPrice(avgOrderValue)} is strong. Customers are spending well per transaction.`,
          recommendation: 'Capitalize on this by offering bundle deals (e.g., "Buy a briefcase + laptop bag and save 10%"). Premium customers are willing to spend more if the value proposition is clear.'
        });
      } else {
        advice.push({
          id: 'aov-low', category: 'Order Value', icon: Info, severity: 'info',
          title: 'Opportunity to Increase Average Order Value',
          detail: `Average order value is ${formatPrice(avgOrderValue)}. There\'s room to grow through upselling and cross-selling.`,
          recommendation: 'Train staff to suggest complementary products. Create product bundles. Implement a "customers also bought" feature. Offer free delivery thresholds slightly above your current AOV to encourage larger orders.'
        });
      }
    }

    // 7. Customer Concentration
    if (totalCustomers > 0 && filteredOrders.length > 0) {
      const repeatRate = ((filteredOrders.length - totalCustomers) / filteredOrders.length) * 100;
      if (repeatRate > 20) {
        advice.push({
          id: 'repeat-good', category: 'Customer Retention', icon: ThumbsUp, severity: 'success',
          title: 'Good Customer Repeat Rate',
          detail: `${repeatRate.toFixed(0)}% of orders are from returning customers. This indicates strong customer satisfaction.`,
          recommendation: 'Implement a loyalty program to further increase repeat purchases. A points-based system or VIP tiers can boost customer lifetime value significantly.'
        });
      } else {
        advice.push({
          id: 'repeat-low', category: 'Customer Retention', icon: AlertTriangle, severity: 'warning',
          title: 'Low Customer Repeat Rate',
          detail: `Most orders appear to be from new customers. Retaining existing customers is 5x cheaper than acquiring new ones.`,
          recommendation: 'Implement post-purchase follow-ups via WhatsApp. Send "Thank You" messages with a discount code for their next purchase. Create a simple loyalty program. Ask for feedback and act on it.'
        });
      }
    }

    // 8. Top Product Concentration
    if (revenueByProduct.length > 0) {
      const topProductPct = revenueByProduct[0]?.percentage || 0;
      if (topProductPct > 60) {
        advice.push({
          id: 'product-risk', category: 'Product Risk', icon: AlertTriangle, severity: 'warning',
          title: 'High Revenue Concentration in One Product',
          detail: `"${revenueByProduct[0]?.product}" accounts for ${topProductPct.toFixed(0)}% of total revenue. If this product faces supply issues or demand drops, your business is at risk.`,
          recommendation: 'Diversify your product range. Invest in marketing your 2nd and 3rd best sellers. Consider developing exclusive variants or limited editions to spread revenue across more products.'
        });
      } else if (revenueByProduct.length >= 3) {
        advice.push({
          id: 'product-diverse', category: 'Product Risk', icon: ThumbsUp, severity: 'success',
          title: 'Good Product Diversification',
          detail: `Revenue is well-distributed across ${revenueByProduct.length} products. This reduces dependency risk.`,
          recommendation: 'Continue developing your product range. Consider seasonal collections to keep customers engaged and attract new market segments.'
        });
      }
    }

    // 9. Cancellation Rate
    const cancellationRate = filteredOrders.length > 0 ? ((ordersByStatus.cancelled || 0) / filteredOrders.length) * 100 : 0;
    if (cancellationRate > 15) {
      advice.push({
        id: 'cancel-high', category: 'Order Fulfillment', icon: AlertCircle, severity: 'danger',
        title: 'High Order Cancellation Rate',
        detail: `${cancellationRate.toFixed(0)}% of orders are being cancelled. This wastes resources and indicates potential issues with pricing, stock, or customer expectations.`,
        recommendation: 'Investigate the root cause: Are products out of stock? Are prices too high after checkout? Is delivery taking too long? Implement confirm-before-process workflow. Send order confirmation messages immediately after purchase.'
      });
    } else if (cancellationRate > 5) {
      advice.push({
        id: 'cancel-moderate', category: 'Order Fulfillment', icon: Info, severity: 'info',
        title: 'Acceptable Cancellation Rate',
        detail: `${cancellationRate.toFixed(0)}% cancellation rate is within normal range but should be monitored.`,
        recommendation: 'Track cancellation reasons. Improve product descriptions and photos to set accurate expectations. Ensure stock levels are updated in real-time.'
      });
    }

    // 10. Overall Recommendation
    if (healthScore >= 80) {
      advice.push({
        id: 'overall', category: 'Strategic Direction', icon: Lightbulb, severity: 'success',
        title: '🎯 Strategic Recommendation: Scale & Expand',
        detail: `Your business health score is ${healthScore}/100. You have strong fundamentals — high margins, good collection rate, and controlled expenses. This is the right time to scale.`,
        recommendation: 'Consider: 1) Expanding to new cities (Lagos, Abuja), 2) Launching a premium product line, 3) Hiring sales reps on commission, 4) Investing in paid advertising (Google Ads, Instagram), 5) Exploring wholesale/B2B channels with corporate clients.'
      });
    } else if (healthScore >= 60) {
      advice.push({
        id: 'overall', category: 'Strategic Direction', icon: Lightbulb, severity: 'info',
        title: '🎯 Strategic Recommendation: Optimize & Strengthen',
        detail: `Your business health score is ${healthScore}/100. Operations are stable but there are specific areas that need attention before scaling.`,
        recommendation: 'Focus on: 1) Improving collection rate (follow up on pending payments), 2) Reducing top expense categories, 3) Increasing average order value through upselling, 4) Building customer loyalty programs, 5) Setting clear monthly revenue targets and tracking progress.'
      });
    } else {
      advice.push({
        id: 'overall', category: 'Strategic Direction', icon: AlertTriangle, severity: 'warning',
        title: '🎯 Strategic Recommendation: Stabilize & Recover',
        detail: `Your business health score is ${healthScore}/100. There are critical areas that need immediate attention to ensure long-term viability.`,
        recommendation: 'Priority actions: 1) Stop all non-essential spending immediately, 2) Collect ALL pending payments within 7 days, 3) Review and adjust pricing on every product, 4) Focus only on your top 3 best-selling products, 5) Set a strict weekly budget, 6) Seek advice from a financial advisor or experienced mentor in your industry.'
      });
    }

    return advice;
  }, [profitMargin, collectionRate, expenseRatio, onlineRevenue, storeRevenue, totalRevenue, filteredOrders, revenueByProduct, ordersByStatus, healthScore, netProfit, pendingRevenue, avgOrderValue, totalCustomers]);

  // Export functions
  const handleExportAudit = () => {
    const headers = 'Date,Type,Channel,Description,Amount,Status,Payment Method,Reference\n';
    const rows = auditTrail.map(t =>
      `"${new Date(t.date).toLocaleString()}","${t.type}","${t.channel}","${t.description.replace(/"/g, '""')}",${t.amount},"${t.status}","${t.paymentMethod || ''}","${t.reference || ''}"`
    ).join('\n');
    const summary = `\n\nSUMMARY\nPeriod,${period}\nTotal Revenue,${totalRevenue}\nOnline Revenue,${onlineRevenue}\nStore Revenue,${storeRevenue}\nCollected Revenue,${collectedRevenue}\nPending Revenue,${pendingRevenue}\nTotal Expenses,${totalExpenses}\nNet Profit,${netProfit}\nProfit Margin,${profitMargin.toFixed(2)}%\nCollection Rate,${collectionRate.toFixed(2)}%\nHealth Score,${healthScore}/100`;
    const blob = new Blob([headers + rows + summary], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_${period}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAdvice = () => {
    const content = `G-SMILE BAGS - PROFESSIONAL AUDITING ADVICE\nGenerated: ${new Date().toLocaleString()}\nPeriod: ${period}\nHealth Score: ${healthScore}/100\n\n${'='.repeat(60)}\n\n${auditingAdvice.map((a, i) => `${i + 1}. [${a.severity.toUpperCase()}] ${a.title}\nCategory: ${a.category}\nAnalysis: ${a.detail}\nRecommendation: ${a.recommendation}\n`).join('\n---\n\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_advice_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAdvice = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopySuccess(text);
    setTimeout(() => setShowCopySuccess(''), 2000);
  };

  const tabs: Array<{ id: AuditTab; label: string; icon: typeof BarChart3 }> = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'pandl', label: 'P&L Statement', icon: FileText },
    { id: 'trail', label: 'Audit Trail', icon: Activity },
    { id: 'health', label: 'Financial Health', icon: Shield },
    { id: 'advice', label: '💡 Audit Advice', icon: Lightbulb },
  ];

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case 'success': return { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', badge: 'bg-green-100 text-green-700', header: 'text-green-800' };
      case 'warning': return { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', header: 'text-amber-800' };
      case 'danger': return { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', badge: 'bg-red-100 text-red-700', header: 'text-red-800' };
      default: return { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700', header: 'text-blue-800' };
    }
  };

  // ======== PASSWORD GATE ========
  if (!isUnlocked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Business Auditing</h2>
              <p className="text-indigo-200 text-sm mt-2">This section is password protected</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Audit Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                    placeholder="Enter password to access"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {passwordError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {passwordError}
                </div>
              )}
              <button
                onClick={handleUnlock}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Unlock Audit Page
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 Access restricted to authorized personnel only
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ======== MAIN AUDIT CONTENT ========
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-indigo-600" />
            Business Auditing
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium ml-2">Unlocked</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">Comprehensive financial audit and compliance reporting</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as Period)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button onClick={handleExportAudit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={handleLock} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Lock className="w-4 h-4" /> Lock
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 sm:p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Revenue</span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm">Total Revenue</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">{formatPrice(totalRevenue)}</p>
              <p className="text-white/70 text-xs mt-2">{filteredOrders.length} orders</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 sm:p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Expenses</span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm">Total Expenses</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">{formatPrice(totalExpenses)}</p>
              <p className="text-white/70 text-xs mt-2">{filteredExpenses.length} transactions</p>
            </div>
            <div className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'} rounded-xl p-4 sm:p-5 text-white`}>
              <div className="flex items-center justify-between mb-2">
                {netProfit >= 0 ? <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" /> : <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />}
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Profit</span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm">Net Profit</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">{formatPrice(netProfit)}</p>
              <p className="text-white/70 text-xs mt-2">{profitMargin.toFixed(1)}% margin</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-4 sm:p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                <span className={`text-xs px-2 py-1 rounded-full ${healthStatus.bg} ${healthStatus.color} bg-white`}>{healthStatus.label}</span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm">Health Score</p>
              <p className="text-lg sm:text-2xl font-bold mt-1">{healthScore}/100</p>
              <p className="text-white/70 text-xs mt-2">{collectionRate.toFixed(0)}% collected</p>
            </div>
          </div>

          {/* Channel Overview */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Online Sales</h4>
                  <p className="text-xs text-gray-500">{onlineOrders.length} orders</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatPrice(onlineRevenue)}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="text-green-600">{formatPrice(onlineCollected)} collected</span>
                {onlinePending > 0 && <span className="text-amber-600">· {formatPrice(onlinePending)} pending</span>}
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${totalRevenue > 0 ? (onlineRevenue / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">In-Store Sales</h4>
                  <p className="text-xs text-gray-500">{storeOrders.length} orders</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatPrice(storeRevenue)}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="text-green-600">{formatPrice(storeCollected)} collected</span>
                {storePending > 0 && <span className="text-amber-600">· {formatPrice(storePending)} pending</span>}
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${totalRevenue > 0 ? (storeRevenue / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">POS Terminal</h4>
                  <p className="text-xs text-gray-500">{posOrders.length} orders</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{formatPrice(posRevenue)}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="text-green-600">{formatPrice(posCollected)} collected</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500" style={{ width: `${totalRevenue > 0 ? (posRevenue / totalRevenue) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          {/* Revenue vs Expenses + Top Expenses */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                Revenue Breakdown
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Collected</span>
                    <span className="font-bold text-green-600">{formatPrice(collectedRevenue)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${totalRevenue > 0 ? (collectedRevenue / totalRevenue) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-bold text-amber-600">{formatPrice(pendingRevenue)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${totalRevenue > 0 ? (pendingRevenue / totalRevenue) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Cancelled</span>
                    <span className="font-bold text-red-600">{formatPrice(cancelledRevenue)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${totalRevenue > 0 ? (cancelledRevenue / totalRevenue) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-red-600" />
                Top Expenses
              </h3>
              <div className="space-y-2.5">
                {expensesByCategory.slice(0, 5).map((exp) => (
                  <div key={exp.purpose}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">{exp.purpose}</span>
                      <span className="font-medium">{formatPrice(exp.amount)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-400 to-rose-500" style={{ width: `${exp.percentage}%` }} />
                    </div>
                  </div>
                ))}
                {expensesByCategory.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No expenses recorded</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TRANSACTIONS ANALYSIS TAB ===== */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Channel Comparison */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Financial Transactions by Channel
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {/* Online */}
              <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Online Orders</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Orders</span><span className="font-medium">{onlineOrders.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Gross Revenue</span><span className="font-medium">{formatPrice(onlineRevenue)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Collected</span><span className="font-medium text-green-600">{formatPrice(onlineCollected)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Pending</span><span className="font-medium text-amber-600">{formatPrice(onlinePending)}</span></div>
                  <div className="border-t border-blue-200 pt-2 flex justify-between font-bold">
                    <span>Collection Rate</span>
                    <span className={onlineRevenue > 0 && (onlineCollected / onlineRevenue) * 100 >= 80 ? 'text-green-600' : 'text-amber-600'}>
                      {onlineRevenue > 0 ? ((onlineCollected / onlineRevenue) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
              </div>
              {/* In-Store */}
              <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <Store className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-semibold text-emerald-800">In-Store / POS</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Orders</span><span className="font-medium">{storeOrders.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Gross Revenue</span><span className="font-medium">{formatPrice(storeRevenue)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Collected</span><span className="font-medium text-green-600">{formatPrice(storeCollected)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Pending</span><span className="font-medium text-amber-600">{formatPrice(storePending)}</span></div>
                  <div className="border-t border-emerald-200 pt-2 flex justify-between font-bold">
                    <span>Collection Rate</span>
                    <span className={storeRevenue > 0 && (storeCollected / storeRevenue) * 100 >= 80 ? 'text-green-600' : 'text-amber-600'}>
                      {storeRevenue > 0 ? ((storeCollected / storeRevenue) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>
              </div>
              {/* Summary */}
              <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-semibold text-indigo-800">Overall Summary</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Total Orders</span><span className="font-medium">{filteredOrders.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Total Revenue</span><span className="font-medium">{formatPrice(totalRevenue)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Expenses</span><span className="font-medium text-red-600">{formatPrice(totalExpenses)}</span></div>
                  <div className="border-t border-indigo-200 pt-2 flex justify-between font-bold">
                    <span>Net Profit</span>
                    <span className={netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>{formatPrice(netProfit)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Split Bar */}
            {totalRevenue > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue Split</h4>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  {onlineRevenue > 0 && (
                    <div className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${(onlineRevenue / totalRevenue) * 100}%` }}>
                      Online {((onlineRevenue / totalRevenue) * 100).toFixed(0)}%
                    </div>
                  )}
                  {storeRevenue > 0 && (
                    <div className="bg-emerald-500 flex items-center justify-center text-white text-xs font-medium" style={{ width: `${(storeRevenue / totalRevenue) * 100}%` }}>
                      Store {((storeRevenue / totalRevenue) * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Payment Method Analysis
            </h3>
            {paymentBreakdown.length > 0 ? (
              <div className="space-y-4">
                {paymentBreakdown.map(pm => (
                  <div key={pm.method} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{pm.method}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{pm.count} orders</span>
                      </div>
                      <span className="font-bold text-gray-900">{formatPrice(pm.revenue)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-indigo-500" style={{ width: `${totalRevenue > 0 ? (pm.revenue / totalRevenue) * 100 : 0}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{totalRevenue > 0 ? ((pm.revenue / totalRevenue) * 100).toFixed(1) : 0}% of total revenue</span>
                      <span className="text-green-600">{formatPrice(pm.collected)} collected ({pm.revenue > 0 ? ((pm.collected / pm.revenue) * 100).toFixed(0) : 0}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">No payment data available</p>
            )}
          </div>

          {/* Top Products by Channel */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              Top Products
            </h3>
            <div className="space-y-3">
              {revenueByProduct.slice(0, 5).map((item, idx) => (
                <div key={item.product} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-gray-200 text-gray-700' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product}</p>
                      <p className="text-sm font-bold text-gray-900 ml-2">{formatPrice(item.revenue)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{item.qty} sold</span>
                    </div>
                  </div>
                </div>
              ))}
              {revenueByProduct.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No product data</p>}
            </div>
          </div>
        </div>
      )}

      {/* ===== P&L STATEMENT TAB ===== */}
      {activeTab === 'pandl' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h3 className="text-xl font-bold">Profit & Loss Statement</h3>
            <p className="text-indigo-100 text-sm mt-1">Period: {period.charAt(0).toUpperCase() + period.slice(1)} | {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long' })}</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Revenue */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-4 h-4 text-green-600" /></div>
                REVENUE
              </h4>
              <div className="bg-green-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Gross Sales</span><span className="font-medium">{formatPrice(totalRevenue)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Less: Cancelled Orders</span><span className="font-medium text-red-600">({formatPrice(cancelledRevenue)})</span></div>
                <div className="border-t border-green-200 pt-2 flex justify-between font-bold"><span>Net Sales</span><span className="text-green-700">{formatPrice(totalRevenue - cancelledRevenue)}</span></div>
              </div>
            </div>
            {/* COGS */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"><DollarSign className="w-4 h-4 text-amber-600" /></div>
                COST OF GOODS SOLD
              </h4>
              <div className="bg-amber-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Product Costs (est. 40%)</span><span className="font-medium">{formatPrice(totalRevenue * 0.4)}</span></div>
                <div className="border-t border-amber-200 pt-2 flex justify-between font-bold"><span>Gross Profit</span><span className="text-amber-700">{formatPrice(totalRevenue * 0.6)}</span></div>
              </div>
            </div>
            {/* Operating Expenses */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"><Wallet className="w-4 h-4 text-red-600" /></div>
                OPERATING EXPENSES
              </h4>
              <div className="bg-red-50 rounded-lg p-4 space-y-2">
                {expensesByCategory.map(exp => (
                  <div key={exp.purpose} className="flex justify-between text-sm">
                    <span className="text-gray-600">{exp.purpose}</span>
                    <span className="font-medium">{formatPrice(exp.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-red-200 pt-2 flex justify-between font-bold"><span>Total Operating Expenses</span><span className="text-red-700">{formatPrice(totalExpenses)}</span></div>
              </div>
            </div>
            {/* Net */}
            <div className={`${netProfit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border-2 rounded-xl p-5`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">NET {netProfit >= 0 ? 'PROFIT' : 'LOSS'}</h4>
                  <p className="text-sm text-gray-600 mt-1">After all expenses</p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatPrice(Math.abs(netProfit))}</p>
                  <p className={`text-sm font-medium ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{profitMargin.toFixed(1)}% margin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== AUDIT TRAIL TAB ===== */}
      {activeTab === 'trail' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600" />Transaction Audit Trail</h3>
            <span className="text-sm text-gray-500">{auditTrail.length} transactions</span>
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Date/Time</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Channel</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Description</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden md:table-cell">Payment</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden lg:table-cell">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditTrail.map((tx) => (
                  <tr key={tx.id + tx.date} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(tx.date).toLocaleString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.channel === 'Online' ? 'bg-blue-100 text-blue-700' :
                        tx.channel === 'Store' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{tx.channel}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{tx.description}</td>
                    <td className={`px-4 py-3 text-sm font-medium text-right whitespace-nowrap ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatPrice(tx.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.status === 'Collected' || tx.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        tx.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>{tx.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{tx.paymentMethod || '-'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell truncate max-w-[120px]">{tx.reference || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {auditTrail.length === 0 && (
              <div className="p-12 text-center text-gray-400"><FileText className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No transactions in this period</p></div>
            )}
          </div>
        </div>
      )}

      {/* ===== FINANCIAL HEALTH TAB ===== */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className={`${healthStatus.bg} border-2 ${healthStatus.color.replace('text-', 'border-').replace('-600', '-200')} rounded-xl p-6`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${healthStatus.bg} rounded-2xl flex items-center justify-center border-2 ${healthStatus.color.replace('text-', 'border-').replace('-600', '-300')}`}>
                  <healthStatus.icon className={`w-8 h-8 ${healthStatus.color}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Financial Health: {healthStatus.label}</h3>
                  <p className="text-gray-600 mt-1">Overall business performance score</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-4xl font-bold ${healthStatus.color}`}>{healthScore}</p>
                <p className="text-sm text-gray-500">out of 100</p>
              </div>
            </div>
            <div className="mt-4 h-3 bg-white/50 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${healthScore >= 80 ? 'from-green-400 to-emerald-500' : healthScore >= 60 ? 'from-blue-400 to-indigo-500' : healthScore >= 40 ? 'from-amber-400 to-orange-500' : 'from-red-400 to-rose-500'}`} style={{ width: `${healthScore}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: 'Profit Margin', value: `${profitMargin.toFixed(1)}%`, sub: profitMargin >= 20 ? 'Healthy' : profitMargin >= 10 ? 'Moderate' : 'Low', good: profitMargin >= 20, icon: PieChart },
              { label: 'Collection Rate', value: `${collectionRate.toFixed(0)}%`, sub: `${formatPrice(collectedRevenue)}`, good: collectionRate >= 80, icon: CheckCircle2 },
              { label: 'Expense Ratio', value: `${expenseRatio.toFixed(0)}%`, sub: 'of revenue spent', good: expenseRatio < 50, icon: Wallet },
              { label: 'Avg Order Value', value: formatPrice(avgOrderValue), sub: 'per transaction', good: true, icon: ShoppingBag },
              { label: 'Customer LTV', value: formatPrice(customerLTV), sub: `${totalCustomers} customers`, good: true, icon: Target },
              { label: 'Order Fulfillment', value: `${ordersByStatus.delivered || 0}/${filteredOrders.length}`, sub: 'orders delivered', good: true, icon: Activity },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">{item.label}</h4>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.good ? 'bg-green-100' : 'bg-amber-100'}`}>
                    <item.icon className={`w-3.5 h-3.5 ${item.good ? 'text-green-600' : 'text-amber-600'}`} />
                  </div>
                </div>
                <p className={`text-lg sm:text-2xl font-bold ${item.good ? 'text-gray-900' : 'text-amber-600'}`}>{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Top Performing Products</h3>
            <div className="space-y-3">
              {revenueByProduct.slice(0, 5).map((item, idx) => (
                <div key={item.product} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-gray-200 text-gray-700' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                  }`}>{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product}</p>
                      <p className="text-sm font-bold text-gray-900 ml-2">{formatPrice(item.revenue)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{item.qty} sold</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== AUDIT ADVICE TAB ===== */}
      {activeTab === 'advice' && (
        <div className="space-y-6">
          {/* Advice Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-xl p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Professional Audit Advice</h3>
                  <p className="text-indigo-200 text-sm mt-1">AI-generated recommendations based on your business data</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleExportAdvice} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Download className="w-4 h-4" /> Export Report
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{auditingAdvice.filter(a => a.severity === 'success').length}</p>
                <p className="text-indigo-200 text-xs">Strengths</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{auditingAdvice.filter(a => a.severity === 'warning' || a.severity === 'danger').length}</p>
                <p className="text-indigo-200 text-xs">Concerns</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{auditingAdvice.length}</p>
                <p className="text-indigo-200 text-xs">Total Insights</p>
              </div>
            </div>
          </div>

          {/* Advice Cards */}
          <div className="space-y-4">
            {auditingAdvice.map((advice) => {
              const colors = getSeverityColors(advice.severity);
              const isExpanded = expandedAdvice === advice.id;
              return (
                <div key={advice.id} className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden transition-all`}>
                  <button
                    onClick={() => setExpandedAdvice(isExpanded ? null : advice.id)}
                    className="w-full p-4 sm:p-5 flex items-start gap-3 sm:gap-4 text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors.badge}`}>
                      <advice.icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>{advice.category}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                          {advice.severity === 'success' ? '✅' : advice.severity === 'warning' ? '⚠️' : advice.severity === 'danger' ? '🚨' : 'ℹ️'}
                          {' '}{advice.severity.charAt(0).toUpperCase() + advice.severity.slice(1)}
                        </span>
                      </div>
                      <h4 className={`font-bold mt-1 ${colors.header}`}>{advice.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{advice.detail}</p>
                    </div>
                    <div className="shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t" style={{ borderColor: colors.border }}>
                      <div className="mt-4 bg-white/60 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Recommendation
                        </h5>
                        <p className="text-sm text-gray-700 leading-relaxed">{advice.recommendation}</p>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopyAdvice(`${advice.title}\n\n${advice.detail}\n\nRecommendation: ${advice.recommendation}`); }}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                          {showCopySuccess === advice.id ? <><CheckCircle2 className="w-3 h-3 text-green-500" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Checklist */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Priority Action Checklist
            </h3>
            <div className="space-y-2">
              {auditingAdvice
                .filter(a => a.severity === 'danger' || a.severity === 'warning')
                .map((a, i) => (
                  <div key={a.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="text-red-500 font-bold text-sm mt-0.5">{i + 1}.</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{a.recommendation.slice(0, 150)}...</p>
                    </div>
                  </div>
                ))
              }
              {auditingAdvice.filter(a => a.severity === 'danger' || a.severity === 'warning').length === 0 && (
                <div className="text-center py-6">
                  <ThumbsUp className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">No critical issues found!</p>
                  <p className="text-gray-500 text-sm mt-1">Your business is performing well. Keep up the good work.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

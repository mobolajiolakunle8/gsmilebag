import { useState, useEffect, useRef } from 'react';
import { 
  LogOut, Package, TrendingUp, DollarSign, ShoppingCart, 
  Camera, X, Plus, Minus,
  CheckCircle, Search, Hash, CreditCard,
  BarChart3, Calendar, Download, FileText, ChevronLeft, ChevronRight,
  ShoppingBag, Check, Store, Wallet, Edit2, Trash2, Scale,
} from 'lucide-react';
import { 
  getProducts, getOrdersBySalesRep, addPhysicalStoreSale, updateSalesRepStats,
  formatPrice, type Product, type Order,
  getDailyReport, getWeeklyReport, getMonthlyReport, getCustomRangeReport,
  type SalesReportData,
  getExpenses, addExpense, updateExpense, deleteExpense,
  getDailyExpenses, getWeeklyExpenses, getMonthlyExpenses,
  getTotalExpenses, getExpensePurposes, type Expense,
  getSettings,
} from '../data/store';


interface SalesRepDashboardProps {
  onLogout: () => void;
  salesRepName: string;
  salesRepId: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  isManual?: boolean;
  manualPrice?: number;
  manualCategory?: string;
}

// ─── Sales Reports for Sales Rep ──────────────────────────────
function SalesRepReports({ salesRepId }: { salesRepId: string }) {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [customStart, setCustomStart] = useState(new Date().toISOString().split('T')[0]);
  const [customEnd, setCustomEnd] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState<SalesReportData | null>(null);

  const generateCurrentReport = () => {
    const date = new Date(selectedDate);
    let r: SalesReportData;
    switch (reportType) {
      case 'daily': r = getDailyReport(date, salesRepId); break;
      case 'weekly': r = getWeeklyReport(date, salesRepId); break;
      case 'monthly': r = getMonthlyReport(date, salesRepId); break;
      case 'custom': r = getCustomRangeReport(new Date(customStart), new Date(customEnd), salesRepId); break;
    }
    setReport(r);
  };

  const navigateDate = (direction: number) => {
    const d = new Date(selectedDate);
    if (reportType === 'daily') d.setDate(d.getDate() + direction);
    else if (reportType === 'weekly') d.setDate(d.getDate() + direction * 7);
    else if (reportType === 'monthly') d.setMonth(d.getMonth() + direction);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const exportCSV = () => {
    if (!report) return;
    let csv = 'Sales Report\n';
    csv += `Period,${report.period}\n`;
    csv += `Total Sales,${report.totalSales}\n`;
    csv += `Total Revenue,${report.totalRevenue}\n`;
    csv += `Paid Revenue,${report.paidRevenue}\n\n`;
    csv += 'Top Products\nProduct,Quantity,Revenue\n';
    report.topProducts.forEach(p => { csv += `"${p.name}",${p.quantity},${p.revenue}\n`; });
    csv += '\nDaily Breakdown\nDate,Sales,Revenue\n';
    report.dailyBreakdown.forEach(d => { csv += `${d.date},${d.sales},${d.revenue}\n`; });
    csv += '\nPayment Methods\nMethod,Count,Total\n';
    report.paymentMethodBreakdown.forEach(p => { csv += `${p.method},${p.count},${p.total}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-sales-report-${reportType}-${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useState(() => { generateCurrentReport(); });

  const maxBarValue = report ? Math.max(...report.dailyBreakdown.map(d => d.revenue), 1) : 1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              My Sales Reports
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm mt-1">Your personal sales documentation</p>
          </div>
          {report && (
            <button onClick={exportCSV}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors self-start">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          {/* Period Type */}
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Period</label>
            <div className="grid grid-cols-4 gap-1">
              {(['daily', 'weekly', 'monthly', 'custom'] as const).map(type => (
                <button key={type} onClick={() => setReportType(type)}
                  className={`py-2 px-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all capitalize ${
                    reportType === type
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Generate */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            {reportType !== 'custom' ? (
              <div className="flex items-center gap-1 sm:gap-2 flex-1">
                <button onClick={() => navigateDate(-1)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                    className="w-full pl-9 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button onClick={() => navigateDate(1)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch gap-2 flex-1">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                    className="w-full pl-9 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
                <span className="text-gray-400 text-sm text-center self-center">to</span>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                    className="w-full pl-9 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            )}
            <button onClick={generateCurrentReport}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2 shrink-0">
              <FileText className="w-4 h-4" /> Generate
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {report && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-bold text-gray-900">{report.period}</h3>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500">Sales</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{report.totalSales}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500">Revenue</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{formatPrice(report.totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500">Paid</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-green-600">{formatPrice(report.paidRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500">Unpaid</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-amber-600">{formatPrice(report.unpaidRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-red-600" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500">Cancelled</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-red-600">{report.cancelledOrders}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500">Avg Value</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{formatPrice(Math.round(report.averageOrderValue))}</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" /> Revenue Breakdown
            </h4>
            {report.dailyBreakdown.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No data for this period</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {report.dailyBreakdown.map((day, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs text-gray-500 w-14 sm:w-16 shrink-0 truncate">{day.date}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 sm:h-6 relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
                        style={{ width: `${Math.max((day.revenue / maxBarValue) * 100, 10)}%` }}
                      >
                        <span className="text-[9px] sm:text-[10px] text-white font-medium whitespace-nowrap">
                          {formatPrice(day.revenue)}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 w-4 text-right shrink-0">{day.sales}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payment Methods */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" /> Payment Methods
              </h4>
              {report.paymentMethodBreakdown.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No data</p>
              ) : (
                <div className="space-y-2">
                  {report.paymentMethodBreakdown.map((pm, i) => {
                    const bgColors = ['bg-blue-50', 'bg-green-50', 'bg-amber-50', 'bg-purple-50'];
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500'];
                    const textColors = ['text-blue-700', 'text-green-700', 'text-amber-700', 'text-purple-700'];
                    const totalPm = report.paymentMethodBreakdown.reduce((s, p) => s + p.total, 0);
                    return (
                      <div key={i} className={`${bgColors[i % 4]} rounded-lg p-2.5`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium text-xs ${textColors[i % 4]}`}>
                            {pm.method === 'Cash' ? '💵' : pm.method === 'Transfer' ? '🏦' : '💳'} {pm.method}
                          </span>
                          <span className="text-[10px] text-gray-500">{pm.count} orders</span>
                        </div>
                        <div className="w-full bg-white/60 rounded-full h-1.5">
                          <div className={`h-full ${colors[i % 4]} rounded-full`}
                            style={{ width: `${totalPm > 0 ? (pm.total / totalPm) * 100 : 0}%` }} />
                        </div>
                        <p className={`font-bold text-xs mt-1 ${textColors[i % 4]}`}>{formatPrice(pm.total)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" /> Top Products
              </h4>
              {report.topProducts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No sales</p>
              ) : (
                <div className="space-y-2">
                  {report.topProducts.map((prod, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center shrink-0">
                        <span className="text-indigo-600 font-bold text-[10px]">#{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-xs truncate">{prod.name}</p>
                        <p className="text-[10px] text-gray-500">{prod.quantity} sold</p>
                      </div>
                      <span className="font-bold text-gray-900 text-xs shrink-0">{formatPrice(prod.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Types */}
          {report.orderTypeBreakdown.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-600" /> Order Types
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {report.orderTypeBreakdown.map((ot, i) => (
                  <div key={i} className={`p-3 rounded-xl ${ot.type === 'In-Store' ? 'bg-purple-50' : 'bg-blue-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {ot.type === 'In-Store' ? <Store className="w-3.5 h-3.5 text-purple-600" /> : <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />}
                      <span className={`text-xs font-medium ${ot.type === 'In-Store' ? 'text-purple-700' : 'text-blue-700'}`}>{ot.type}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{ot.count}</p>
                    <p className="text-xs text-gray-500">{formatPrice(ot.total)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!report && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-900 mb-2">Generate a Report</h3>
          <p className="text-xs text-gray-500 mb-4">Select a period and click Generate</p>
          <button onClick={generateCurrentReport}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 inline-flex items-center gap-2">
            <FileText className="w-4 h-4" /> Generate Today's Report
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sales Rep Expenses ───────────────────────────────────────
function SalesRepExpenses({ salesRepId, salesRepName }: { salesRepId: string; salesRepName: string }) {
  const [expenses, setExpenses] = useState<Expense[]>(getExpenses().filter(e => e.salesRepId === salesRepId));
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editPurpose, setEditPurpose] = useState('');

  const purposes = getExpensePurposes();
  const myExpenses = expenses;
  const todayTotal = getDailyExpenses(new Date(), salesRepId).reduce((s, e) => s + e.amount, 0);
  const weekTotal = getWeeklyExpenses(new Date(), salesRepId).reduce((s, e) => s + e.amount, 0);
  const monthTotal = getMonthlyExpenses(new Date(), salesRepId).reduce((s, e) => s + e.amount, 0);
  const allTotal = getTotalExpenses(salesRepId);

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    const p = purpose === 'Other' ? customPurpose : purpose;
    if (!p) return;
    addExpense(amt, p, salesRepId, salesRepName);
    setExpenses(getExpenses().filter(e => e.salesRepId === salesRepId));
    setAmount('');
    setPurpose('');
    setCustomPurpose('');
  };

  const handleSaveEdit = (id: string) => {
    const amt = parseFloat(editAmount);
    if (!amt || amt <= 0 || !editPurpose) return;
    updateExpense(id, amt, editPurpose);
    setExpenses(getExpenses().filter(e => e.salesRepId === salesRepId));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this expense?')) return;
    deleteExpense(id);
    setExpenses(getExpenses().filter(e => e.salesRepId === salesRepId));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-4 sm:p-6 text-white">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <Wallet className="w-5 h-5" /> My Expenses
        </h2>
        <p className="text-red-100 text-xs sm:text-sm mt-1">Track your daily business expenses</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <span className="text-xs text-gray-500">Today</span>
          <p className="text-lg font-bold text-red-600 mt-1">{formatPrice(todayTotal)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <span className="text-xs text-gray-500">This Week</span>
          <p className="text-lg font-bold text-orange-600 mt-1">{formatPrice(weekTotal)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <span className="text-xs text-gray-500">This Month</span>
          <p className="text-lg font-bold text-amber-600 mt-1">{formatPrice(monthTotal)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <span className="text-xs text-gray-500">All Time</span>
          <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(allTotal)}</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-red-600" /> Add Expense
          </h3>
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1">
            <Calendar className="w-3 h-3 text-blue-600" />
            <span className="text-[11px] font-semibold text-blue-700">{new Date().toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-32">
            <label className="block text-xs text-gray-500 mb-1">Amount (₦)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="5000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Purpose</label>
            <select value={purpose} onChange={e => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500">
              <option value="">Select...</option>
              {purposes.map(p => <option key={p} value={p}>{p}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>
          {purpose === 'Other' && (
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Custom</label>
              <input type="text" value={customPurpose} onChange={e => setCustomPurpose(e.target.value)} placeholder="Describe..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
            </div>
          )}
          <div className="flex items-end">
            <button onClick={handleAdd}
              className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-3">My Expense Records</h3>
        {myExpenses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Wallet className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No expenses recorded yet</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-4">
            {(() => {
              const grouped = myExpenses.reduce((acc, exp) => {
                const d = exp.date;
                if (!acc[d]) acc[d] = [];
                acc[d].push(exp);
                return acc;
              }, {} as Record<string, typeof myExpenses>);
              const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
              return sortedDates.map(date => {
                const dayExpenses = grouped[date];
                const dayTotal = dayExpenses.reduce((s, e) => s + e.amount, 0);
                const dateObj = new Date(date + 'T00:00:00');
                const dayLabel = dateObj.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' });
                const isToday = date === new Date().toISOString().split('T')[0];
                return (
                  <div key={date}>
                    <div className="flex items-center justify-between mb-1.5 px-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${isToday ? 'text-blue-700' : 'text-gray-600'}`}>{dayLabel}</span>
                        {isToday && <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">TODAY</span>}
                      </div>
                      <span className="text-[11px] font-bold text-red-600">{formatPrice(dayTotal)}</span>
                    </div>
                    <div className="space-y-1.5">
                      {dayExpenses.map(expense => (
                        <div key={expense.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                            <Wallet className="w-4 h-4 text-red-600" />
                          </div>
                          {editingId === expense.id ? (
                            <div className="flex-1 flex gap-2">
                              <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)}
                                className="w-24 px-2 py-1 border rounded text-sm" />
                              <input type="text" value={editPurpose} onChange={e => setEditPurpose(e.target.value)}
                                className="flex-1 px-2 py-1 border rounded text-sm" />
                              <button onClick={() => handleSaveEdit(expense.id)} className="p-1 bg-green-100 text-green-700 rounded"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setEditingId(null)} className="p-1 bg-gray-200 text-gray-600 rounded"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 text-sm truncate">{expense.purpose}</p>
                                <span className="font-bold text-red-600 text-sm ml-2">{formatPrice(expense.amount)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {expense.createdAt && (
                                  <span className="text-[10px] text-gray-400">{new Date(expense.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</span>
                                )}
                                <span className="text-[10px] text-gray-400">{expense.id}</span>
                              </div>
                            </div>
                          )}
                          {editingId !== expense.id && (
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => { setEditingId(expense.id); setEditAmount(expense.amount.toString()); setEditPurpose(expense.purpose); }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDelete(expense.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Sales Rep Dashboard ─────────────────────────────────
export default function SalesRepDashboard({ onLogout, salesRepName, salesRepId }: SalesRepDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pos' | 'history' | 'reports' | 'balance' | 'expenses'>('pos');
  const settings = getSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Manual product states
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualProductName, setManualProductName] = useState('');
  const [manualProductPrice, setManualProductPrice] = useState('');
  const [manualProductCategory, setManualProductCategory] = useState('');

  // Checkout states
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Transfer' | 'POS' | 'Card'>('Cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [saleImage, setSaleImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Success states
  const [successReceipt, setSuccessReceipt] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Stats
  const [stats, setStats] = useState({ todaySales: 0, todayRevenue: 0, totalSales: 0, totalRevenue: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load data
  useEffect(() => {
    const loadData = () => {
      const allProducts = getProducts();
      const orders = getOrdersBySalesRep(salesRepId);
      setProducts(allProducts);
      setMyOrders(orders);
      const today = new Date().toDateString();
      const todayOrders = orders.filter(o => new Date(o.date).toDateString() === today);
      setStats({
        todaySales: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
        totalSales: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.revenueCollected ? o.revenueAmount : 0), 0),
      });
      setLoading(false);
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [salesRepId]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product, isManual = false, manualPrice?: number, manualCategory?: string) => {
    const existing = cart.find(item => item.product.id === product.id && item.isManual === isManual);
    if (existing) {
      setCart(cart.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product, quantity: 1, isManual, manualPrice, manualCategory }]);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(cart.map((item, i) => i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleAddManualProduct = () => {
    if (!manualProductName.trim() || !manualProductPrice) return;
    const price = parseFloat(manualProductPrice);
    if (isNaN(price) || price <= 0) return;
    const manualProduct: Product = {
      id: -Date.now(), name: manualProductName.trim(), price, originalPrice: price,
      image: '', category: manualProductCategory.trim() || 'General',
      badge: 'Manual', rating: 5, reviews: 0, featured: false, inStock: true,
    };
    addToCart(manualProduct, true, price, manualProductCategory.trim() || 'General');
    setManualProductName(''); setManualProductPrice(''); setManualProductCategory(''); setShowManualForm(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch {
      alert('Could not access camera. Please use file upload instead.');
      fileInputRef.current?.click();
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setSaleImage(canvas.toDataURL('image/jpeg', 0.8));
        setShowCamera(false);
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSaleImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSale = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      for (const item of cart) {
        const productName = item.isManual ? `${item.product.name} (Manual Product)` : item.product.name;
        const total = (item.isManual ? (item.manualPrice || item.product.price) : item.product.price) * item.quantity;
        const order = addPhysicalStoreSale({
          customerName: customerName || 'Walk-in Customer', customerPhone: customerPhone || '',
          customerEmail: customerEmail || '', product: productName, quantity: item.quantity, total,
          paymentMethod, message: `Sold by: ${salesRepName}`,
          saleImage: saleImage || undefined, salesRepId, salesRepName,
          revenueCollected: true, revenueAmount: total,
        });
        updateSalesRepStats(salesRepId, total);
        setSuccessReceipt(order);
      }
      setCart([]); setCustomerName(''); setCustomerPhone(''); setCustomerEmail('');
      setSaleImage(null); setPaymentMethod('Cash');
      setMyOrders(getOrdersBySalesRep(salesRepId));
    } catch {
      alert('Error processing sale. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              {settings.businessLogo ? (
                <img src={settings.businessLogo} alt={settings.businessName} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-cover border border-gray-200 shrink-0" />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="font-bold text-gray-900 text-sm sm:text-base truncate">{settings.businessName || 'G-Smile Bags'}</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">Sales Rep Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-medium text-gray-900 text-sm">{salesRepName}</p>
                <p className="text-xs text-gray-500">ID: {salesRepId}</p>
              </div>
              <button onClick={onLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Logout">
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div className="bg-amber-50 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
              <div className="flex items-center gap-1.5 text-amber-700 mb-0.5 sm:mb-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium">Today's Sales</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.todaySales}</p>
            </div>
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
              <div className="flex items-center gap-1.5 text-green-700 mb-0.5 sm:mb-1">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium">Today's Rev</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatPrice(stats.todayRevenue)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
              <div className="flex items-center gap-1.5 text-blue-700 mb-0.5 sm:mb-1">
                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium">Total Sales</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalSales}</p>
            </div>
            <div className="bg-purple-50 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
              <div className="flex items-center gap-1.5 text-purple-700 mb-0.5 sm:mb-1">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs font-medium">Total Rev</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Scrollable */}
      <div className="bg-white border-b border-gray-200 sticky top-14 sm:top-16 z-30 shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide -mb-px">
            <button onClick={() => setActiveTab('pos')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'pos' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> POS
            </button>
            <button onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'history' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> My Sales
            </button>
            <button onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reports' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Reports
            </button>
            <button onClick={() => setActiveTab('balance')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'balance' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Balance
            </button>
            <button onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'expenses' ? 'border-amber-600 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Expenses
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">

          {/* POS Tab */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Products Grid */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-500 text-sm" />
                  </div>
                  <button onClick={() => setShowManualForm(true)}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 bg-violet-100 text-violet-700 rounded-lg sm:rounded-xl font-medium hover:bg-violet-200 transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap text-xs sm:text-sm">
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Manual</span>
                  </button>
                </div>

                {showManualForm && (
                  <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className="font-medium text-violet-900 flex items-center gap-2 text-xs sm:text-sm">
                        <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Manual Product Entry
                      </h3>
                      <button onClick={() => setShowManualForm(false)} className="text-violet-600 hover:text-violet-800">
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <input type="text" value={manualProductName} onChange={(e) => setManualProductName(e.target.value)}
                        placeholder="Product name *" className="px-3 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 text-sm" />
                      <input type="number" value={manualProductPrice} onChange={(e) => setManualProductPrice(e.target.value)}
                        placeholder="Price in ₦ *" className="px-3 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 text-sm" />
                      <input type="text" value={manualProductCategory} onChange={(e) => setManualProductCategory(e.target.value)}
                        placeholder="Category (optional)" className="px-3 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 text-sm" />
                    </div>
                    <button onClick={handleAddManualProduct} disabled={!manualProductName.trim() || !manualProductPrice}
                      className="mt-2 sm:mt-3 w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 text-sm">
                      Add to Cart
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                  {filteredProducts.map((product) => (
                    <button key={product.id} onClick={() => addToCart(product)}
                      className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all text-left">
                      <div className="aspect-square bg-gray-100 relative">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-amber-600 text-white text-[9px] sm:text-xs rounded-md">
                            {product.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 sm:p-3">
                        <h3 className="font-medium text-gray-900 truncate text-xs sm:text-sm">{product.name}</h3>
                        <p className="text-amber-600 font-bold text-xs sm:text-sm">{formatPrice(product.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkout Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:sticky lg:top-32">
                  <div className="p-3 sm:p-4 border-b border-gray-200">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> Checkout ({cart.length})
                    </h2>
                  </div>
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {cart.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-gray-400">
                        <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
                        <p className="text-sm">Cart is empty</p>
                        <p className="text-xs">Click products to add</p>
                      </div>
                    ) : (
                      <>
                        {cart.map((item, index) => (
                          <div key={index} className={`p-2.5 sm:p-3 rounded-lg border ${item.isManual ? 'bg-violet-50 border-violet-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{item.product.name}</p>
                                {item.isManual && <span className="text-[10px] text-violet-600">{item.manualCategory || 'General'}</span>}
                                <p className="text-amber-600 font-medium text-xs sm:text-sm">
                                  {formatPrice(item.isManual ? (item.manualPrice || item.product.price) : item.product.price)}
                                </p>
                              </div>
                              <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700 p-0.5">
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <button onClick={() => updateQuantity(index, -1)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100">
                                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <span className="w-6 sm:w-8 text-center font-medium text-xs sm:text-sm">{item.quantity}</span>
                                <button onClick={() => updateQuantity(index, 1)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100">
                                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                              <p className="font-bold text-gray-900 text-xs sm:text-sm">
                                {formatPrice((item.isManual ? (item.manualPrice || item.product.price) : item.product.price) * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Total */}
                        <div className="border-t border-gray-200 pt-3 sm:pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Total</span>
                            <span className="text-xl sm:text-2xl font-bold text-amber-600">
                              {formatPrice(cart.reduce((sum, item) => sum + (item.isManual ? (item.manualPrice || item.product.price) : item.product.price) * item.quantity, 0))}
                            </span>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            <CreditCard className="w-3.5 h-3.5 inline mr-1" /> Payment Method
                          </label>
                          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm">
                            <option value="Cash">Cash</option>
                            <option value="Transfer">Bank Transfer</option>
                            <option value="POS">POS</option>
                            <option value="Card">Card</option>
                          </select>
                        </div>

                        {/* Customer Details */}
                        <div className="space-y-2 sm:space-y-3">
                          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Customer name (optional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-amber-500" />
                          <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="Phone number (optional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-amber-500" />
                          <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="Email (optional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-amber-500" />
                        </div>

                        {/* Sale Image */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            <Camera className="w-3.5 h-3.5 inline mr-1" /> Photo (Optional)
                          </label>
                          {saleImage ? (
                            <div className="relative">
                              <img src={saleImage} alt="Sale" className="w-full h-24 sm:h-32 object-cover rounded-lg" />
                              <button onClick={() => setSaleImage(null)}
                                className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full">
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button type="button" onClick={startCamera}
                                className="flex-1 py-2 px-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-amber-500 hover:text-amber-600 flex items-center justify-center gap-1.5 text-xs">
                                <Camera className="w-3.5 h-3.5" /> Camera
                              </button>
                              <button type="button" onClick={() => fileInputRef.current?.click()}
                                className="flex-1 py-2 px-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-amber-500 hover:text-amber-600 flex items-center justify-center gap-1.5 text-xs">
                                <Package className="w-3.5 h-3.5" /> Upload
                              </button>
                            </div>
                          )}
                          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </div>

                        {/* Submit */}
                        <button onClick={handleSubmitSale} disabled={submitting}
                          className="w-full py-2.5 sm:py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                          {submitting ? (
                            <><div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                          ) : (
                            <><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Complete Sale</>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sales History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 sm:p-6 text-white">
                <h2 className="text-lg sm:text-xl font-bold">My Sales History</h2>
                <p className="text-amber-100 text-xs sm:text-sm mt-1">{myOrders.length} total transactions</p>
              </div>
              {myOrders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No sales yet</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {myOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[10px] sm:text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{order.id}</span>
                            <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>{order.status}</span>
                            {order.revenueCollected && (
                              <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">💰 Paid</span>
                            )}
                          </div>
                          <p className="font-medium text-gray-900 text-xs sm:text-sm mt-1 truncate">{order.product}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                            {order.customerName} · {order.paymentMethod} · {new Date(order.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-amber-600 text-sm sm:text-base">{formatPrice(order.total)}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">×{order.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <SalesRepReports salesRepId={salesRepId} />
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <SalesRepExpenses salesRepId={salesRepId} salesRepName={salesRepName} />
          )}
        </div>
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex-1 relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="p-4 bg-black flex items-center justify-between safe-area-bottom">
            <button onClick={() => { setShowCamera(false); const s = videoRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t => t.stop()); }}
              className="px-4 py-2 text-white text-sm">Cancel</button>
            <button onClick={captureImage}
              className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full border-4 border-gray-400 flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full border-2 border-gray-800" />
            </button>
            <div className="w-16" />
          </div>
        </div>
      )}

      {/* Success Receipt Modal */}
      {successReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex py-4 sm:py-8 px-3 sm:px-4">
          <div className="bg-white rounded-2xl max-w-md w-full m-auto p-4 sm:p-6 animate-in fade-in zoom-in">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sale Complete!</h2>
              <p className="text-gray-500 text-xs sm:text-sm">Order ID: {successReceipt.id}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Product</span>
                <span className="font-medium text-gray-900 truncate max-w-[150px]">{successReceipt.product}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity</span>
                <span className="font-medium text-gray-900">{successReceipt.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment</span>
                <span className="font-medium text-gray-900">{successReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-amber-600 text-lg sm:text-xl">{formatPrice(successReceipt.total)}</span>
              </div>
              {successReceipt.saleImage && (
                <div className="pt-2 sm:pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Transaction Photo:</p>
                  <img src={successReceipt.saleImage} alt="Receipt" className="w-full h-24 sm:h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>
            <button onClick={() => setSuccessReceipt(null)}
              className="w-full py-2.5 sm:py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 text-sm sm:text-base">
              New Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useRef } from 'react';
import {
  LayoutDashboard, Package, Star, Settings, LogOut, Plus, Edit2, Trash2,
  Search, X, Check, TrendingUp, Users, ShoppingBag, DollarSign,
  Eye, MessageCircle, ArrowLeft, Save, RefreshCw, AlertTriangle, Phone, Tag, Shield, Upload, Image as ImageIcon, Store, CreditCard, Pencil, Camera,
  BarChart3, Calendar, Download, FileText, ChevronLeft, ChevronRight, Wallet, Scale,
  ClipboardList, Users as UsersIcon, Building2, FileCheck,
} from 'lucide-react';
import {
  getProducts, addProduct, updateProduct, deleteProduct,
  getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial,
  getOrders, updateOrderStatus, updateOrderRevenue, addPhysicalStoreSale,
  getTotalRevenue, getPendingRevenue, getSuccessfulOrdersCount, getFailedOrdersCount,
  getSettings, saveSettings,
  getCategories, addCategory, updateCategory, deleteCategory,
  getCustomers, updateCustomer, deleteCustomer, getCustomerOrders, getTotalCustomers,
  addCustomerFromWhatsApp, parseWhatsAppMessage, getWhatsAppCustomers, getCustomerSourceCounts, ParsedWhatsAppCustomer,
  getSalesReps, addSalesRep, updateSalesRep, deleteSalesRep, SalesRep,
  formatPrice, Product, Testimonial, Order, Customer, resetAllData, WhyChooseFeature,
  getDailyReport, getWeeklyReport, getMonthlyReport, getCustomRangeReport,
  getExpenses, addExpense, updateExpense, deleteExpense,
  getDailyExpenses, getWeeklyExpenses, getMonthlyExpenses,
  getTotalExpenses, getExpensePurposes, Expense,
  type SalesReportData,
} from '../data/store';
import BusinessAuditing from './BusinessAuditing';

// ─── Dashboard Overview ───────────────────────────────────────
function DashboardOverview() {
  const products = getProducts();
  const orders = getOrders();
  const testimonials = getTestimonials();

  const totalRevenue = getTotalRevenue();
  const pendingRevenue = getPendingRevenue();
  const successfulOrders = getSuccessfulOrdersCount();
  const failedOrders = getFailedOrdersCount();
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const totalCategories = getCategories().length;

  const stats = [
    { icon: DollarSign, label: 'Collected Revenue', value: formatPrice(totalRevenue), color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', subtext: `${successfulOrders} successful orders` },
    { icon: TrendingUp, label: 'Pending Revenue', value: formatPrice(pendingRevenue), color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', subtext: `${orders.filter(o => !o.revenueCollected && o.status !== 'cancelled').length} awaiting payment` },
    { icon: ShoppingBag, label: 'Total Orders', value: orders.length.toString(), color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', subtext: `${failedOrders} cancelled` },
    { icon: Package, label: 'Products', value: `${inStockProducts}/${totalProducts}`, color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50', subtext: `${totalProducts - inStockProducts} out of stock` },
    { icon: Tag, label: 'Categories', value: totalCategories.toString(), color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', subtext: 'Product categories' },
    { icon: Users, label: 'Testimonials', value: testimonials.length.toString(), color: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-50', subtext: 'Customer reviews' },
    { icon: Check, label: 'Success Rate', value: orders.length > 0 ? `${Math.round((successfulOrders / orders.length) * 100)}%` : '0%', color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', subtext: 'Revenue collection rate' },
    { icon: Shield, label: 'Customers', value: getTotalCustomers().toString(), color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', subtext: 'Unique registered users' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text`} />
            </div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                    <p className="text-gray-500 text-xs">{order.product} × {order.quantity}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>{order.status}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.revenueCollected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {order.revenueCollected ? '💰 Paid' : '⏳ Unpaid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Products Management ──────────────────────────────────────
function ProductsManager() {
  const [products, setProducts] = useState(getProducts());
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyProduct: Omit<Product, 'id'> = {
    name: '', price: 0, originalPrice: 0, image: '', category: '',
    badge: '', rating: 5, reviews: 0, featured: false, inStock: true,
    description: '',
  };

  const [form, setForm] = useState(emptyProduct);

  const refresh = () => setProducts(getProducts());

  const handleSave = () => {
    if (editing) {
      updateProduct({ ...editing, ...form } as Product);
    } else {
      addProduct(form);
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyProduct);
    setImagePreview('');
    refresh();
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name, price: product.price, originalPrice: product.originalPrice,
      image: product.image, category: product.category, badge: product.badge,
      rating: product.rating, reviews: product.reviews, featured: product.featured, inStock: product.inStock,
      description: product.description || '',
    });
    setImagePreview(product.image);
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setForm({ ...form, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setForm({ ...form, image: url });
    setImagePreview(url);
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    setDeleteConfirm(null);
    refresh();
  };

  const filtered = products.filter((p: Product) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products ({products.length})</h2>
        <button onClick={() => { setEditing(null); setForm(emptyProduct); setImagePreview(''); setShowForm(true); }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          placeholder="Search products..." />
      </div>

      {/* Product List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Product</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Price</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden md:table-cell">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product: Product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                        {product.badge && <span className="text-xs text-amber-600">{product.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{product.category}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteConfirm(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] overflow-y-auto flex py-8 px-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl m-auto max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{editing ? 'Edit Product' : 'Add Product'}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" placeholder="Product name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₦) *</label>
                    <input type="number" required value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Original Price (₦)</label>
                    <input type="number" value={form.originalPrice || ''} onChange={e => setForm({...form, originalPrice: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Product Image *</label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-3 relative group">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl border-2 border-gray-200" />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(''); setForm({...form, image: ''}); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Upload Options */}
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 text-center hover:border-amber-500 hover:bg-amber-50 transition-all group"
                      >
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-amber-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700 group-hover:text-amber-700">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                      </button>
                    </div>
                    
                    {/* OR Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs text-gray-400">OR</span>
                      </div>
                    </div>
                    
                    {/* URL Input */}
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={form.image.startsWith('data:') ? '' : form.image}
                        onChange={e => handleImageUrlChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 text-sm"
                        placeholder="Paste image URL"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500">
                      <option value="">Select</option>
                      {getCategories().map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Badge</label>
                    <input type="text" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" placeholder="e.g. Bestseller" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Reviews Count</label>
                    <input type="number" value={form.reviews || ''} onChange={e => setForm({...form, reviews: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Rating</label>
                    <select value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500">
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                  <textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 min-h-[100px]"
                    placeholder="Enter detailed product description..." />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500" />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500" />
                    <span className="text-sm text-gray-700">In Stock</span>
                  </label>
                </div>
                <button onClick={handleSave}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-3 rounded-xl font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editing ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Orders Management ────────────────────────────────────────
function OrdersManager() {
  const role = localStorage.getItem('gsb_role') || 'admin';
  const repId = localStorage.getItem('gsb_sales_rep_id');
  const [orders, setOrders] = useState(getOrders().filter(o => role === 'admin' || o.salesRepId === repId));
  const [filter, setFilter] = useState<string>('all');
  const [revenueFilter, setRevenueFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingRevenue, setEditingRevenue] = useState<string | null>(null);
  const [tempRevenueAmount, setTempRevenueAmount] = useState<number>(0);

  const refresh = () => setOrders(getOrders());

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    refresh();
  };

  const handleRevenueToggle = (order: Order) => {
    const newCollected = !order.revenueCollected;
    const amount = newCollected ? (order.revenueAmount || order.total) : 0;
    updateOrderRevenue(order.id, newCollected, amount);
    refresh();
  };

  const handleRevenueAmountSave = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      updateOrderRevenue(orderId, order.revenueCollected, tempRevenueAmount);
      setEditingRevenue(null);
      refresh();
    }
  };

  const filtered = orders.filter((o: Order) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (revenueFilter === 'paid' && !o.revenueCollected) return false;
    if (revenueFilter === 'unpaid' && o.revenueCollected) return false;
    if (search && !o.customerName.toLowerCase().includes(search.toLowerCase()) && !o.product.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusOptions: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  // Revenue summary for filtered orders
  const totalOrderValue = orders.reduce((s, o) => s + o.total, 0);
  const collectedTotal = orders.filter(o => o.revenueCollected).reduce((s, o) => s + (o.revenueAmount || o.total), 0);
  const uncollectedTotal = orders.filter(o => !o.revenueCollected && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders ({orders.length})</h2>

      {/* Revenue Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">💰 Collected Revenue</p>
          <p className="text-2xl font-bold text-green-800 mt-1">{formatPrice(collectedTotal)}</p>
          <p className="text-xs text-green-500 mt-1">{orders.filter(o => o.revenueCollected).length} orders paid</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <p className="text-sm text-amber-600 font-medium">⏳ Pending Revenue</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{formatPrice(uncollectedTotal)}</p>
          <p className="text-xs text-amber-500 mt-1">{orders.filter(o => !o.revenueCollected && o.status !== 'cancelled').length} orders awaiting</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">📊 Total Order Value</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{formatPrice(totalOrderValue)}</p>
          <p className="text-xs text-blue-500 mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
            placeholder="Search by name, product, or order ID..." />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500">
          <option value="all">All Status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={revenueFilter} onChange={e => setRevenueFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500">
          <option value="all">All Revenue</option>
          <option value="paid">💰 Paid</option>
          <option value="unpaid">⏳ Unpaid</option>
        </select>
        <button onClick={refresh} className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-500">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order: Order) => (
            <div key={order.id} className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all ${
              order.revenueCollected ? 'border-green-200 shadow-sm' : order.status === 'cancelled' ? 'border-red-200' : 'border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    order.revenueCollected ? 'bg-green-100' : 'bg-amber-50'
                  }`}>
                    {order.revenueCollected ? (
                      <span className="text-xl">💰</span>
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900">{order.id}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.revenueCollected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {order.revenueCollected ? '✅ Paid' : '⏳ Unpaid'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.customerName} • {order.product} × {order.quantity}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 sm:min-w-[180px]">
                  {/* Revenue Amount Display/Edit */}
                  {editingRevenue === order.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">₦</span>
                      <input
                        type="number"
                        value={tempRevenueAmount}
                        onChange={e => setTempRevenueAmount(Number(e.target.value))}
                        className="border border-amber-500 rounded-lg px-2 py-1 text-sm text-gray-900 w-28 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleRevenueAmountSave(order.id)}
                      />
                      <button onClick={() => handleRevenueAmountSave(order.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingRevenue(null)} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-lg ${order.revenueCollected ? 'text-green-700' : 'text-gray-900'}`}>
                        {order.revenueCollected ? formatPrice(order.revenueAmount || order.total) : formatPrice(order.total)}
                      </p>
                      <button
                        onClick={() => { setEditingRevenue(order.id); setTempRevenueAmount(order.revenueAmount || order.total); }}
                        className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                        title="Edit revenue amount"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Status Dropdown */}
                  <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value as Order['status'])}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:border-amber-500 w-full">
                    {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>

                  {/* Revenue Toggle Button */}
                  <button
                    onClick={() => handleRevenueToggle(order)}
                    className={`w-full text-xs font-bold px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      order.revenueCollected
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        : 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
                    }`}
                  >
                    {order.revenueCollected ? (
                      <><X className="w-3.5 h-3.5" /> Mark Unpaid</>
                    ) : (
                      <><Check className="w-3.5 h-3.5" /> Mark as Paid</>
                    )}
                  </button>
                </div>
              </div>

              {/* Message & Attached Image */}
              {order.message && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600"><MessageCircle className="w-3 h-3 inline mr-1" />{order.message}</p>
                </div>
              )}
              {order.saleImage && (
                <div className="mt-3">
                  <span className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Transaction Photo</span>
                  <img src={order.saleImage} alt="Sale transaction capture" className="w-full h-36 object-cover rounded-lg border border-gray-200" />
                </div>
              )}

              {/* Contact Info */}
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                <span>📱 {order.customerPhone}</span>
                <span>✉️ {order.customerEmail || 'N/A'}</span>
                {order.revenueCollected && (
                  <span className="text-green-600 font-medium">
                    💰 Revenue: {formatPrice(order.revenueAmount || order.total)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Testimonials Management ──────────────────────────────────
function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState(getTestimonials());
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const emptyTestimonial: Omit<Testimonial, 'id'> = { name: '', location: '', text: '', initial: '' };
  const [form, setForm] = useState(emptyTestimonial);

  const refresh = () => setTestimonials(getTestimonials());

  const handleSave = () => {
    if (editing) {
      updateTestimonial({ ...editing, ...form } as Testimonial);
    } else {
      addTestimonial(form);
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyTestimonial);
    refresh();
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, location: t.location, text: t.text, initial: t.initial });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    deleteTestimonial(id);
    setDeleteConfirm(null);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Testimonials ({testimonials.length})</h2>
        <button onClick={() => { setEditing(null); setForm(emptyTestimonial); setShowForm(true); }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t: Testimonial) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white font-bold">
                {t.initial}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.location}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm italic mb-4">"{t.text}"</p>
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => handleEdit(t)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50">
                <Edit2 className="w-4 h-4" />
              </button>
              {deleteConfirm === t.id ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteConfirm(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(t.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Testimonial Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[70] overflow-y-auto flex py-8 px-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl m-auto max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value, initial: e.target.value.charAt(0).toUpperCase()})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" placeholder="Customer name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" placeholder="e.g. Lagos, Nigeria" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Review *</label>
                  <textarea required rows={4} value={form.text} onChange={e => setForm({...form, text: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 resize-none" placeholder="Customer review..." />
                </div>
                <button onClick={handleSave}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-3 rounded-xl font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editing ? 'Update' : 'Add Testimonial'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings Management ──────────────────────────────────────
function SettingsManager() {
  const [settings, setSettings] = useState(getSettings());
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const promoDesktopInputRef = useRef<HTMLInputElement>(null);
  const businessLogoInputRef = useRef<HTMLInputElement>(null);

  const handleBusinessLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert('Logo size must be less than 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({ ...settings, businessLogo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handlePromoImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'desktop') {
          setSettings({ ...settings, promoImageDesktop: reader.result as string });
        } else {
          setSettings({ ...settings, promoImageMobile: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Categories management state
  const [categories, setCategories] = useState(getCategories());
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<string | null>(null);

  // Why Choose Us management state
  const [whyFeatures, setWhyFeatures] = useState<WhyChooseFeature[]>(settings.whyChooseFeatures || []);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);
  const [newFeature, setNewFeature] = useState({ icon: 'Award', title: '', desc: '' });

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    resetAllData();
    setSettings(getSettings());
    setShowReset(false);
    window.location.reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
        <button onClick={() => setShowReset(true)}
          className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <AlertTriangle className="w-4 h-4" /> Reset All Data
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Phone className="w-5 h-5 text-amber-600" /> Contact Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
              <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">WhatsApp Number (with country code)</label>
              <input type="text" value={settings.whatsappNumber} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" placeholder="2348065653384" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Admin WhatsApp (for order alerts)</label>
              <input type="text" value={settings.adminWhatsappNumber} onChange={e => setSettings({...settings, adminWhatsappNumber: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" placeholder="2348065653384" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
              <input type="text" value={settings.location} onChange={e => setSettings({...settings, location: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
            </div>
          </div>
        </div>

        {/* Brand Identity */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Store className="w-5 h-5 text-amber-600" /> Business Identity</h3>
          <div className="grid sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Business Name</label>
              <input
                type="text"
                value={settings.businessName || ''}
                onChange={e => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
                placeholder="e.g. G-Smile Bags"
              />
              <p className="text-xs text-gray-500 mt-1">Shown in navbar, footer, chat widget, and dashboards.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Business Logo</label>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-amber-800 font-medium mb-1.5">📐 Recommended Size:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-amber-700">
                  <div>
                    <span className="font-semibold">Ideal:</span> 512 × 512 px
                  </div>
                  <div>
                    <span className="font-semibold">Format:</span> PNG (transparent)
                  </div>
                  <div>
                    <span className="font-semibold">Min:</span> 200 × 200 px
                  </div>
                  <div>
                    <span className="font-semibold">Max:</span> &lt; 500KB
                  </div>
                </div>
              </div>
              {settings.businessLogo ? (
                <div className="relative border border-gray-200 rounded-xl p-3 bg-gray-50">
                  <img src={settings.businessLogo} alt="Business logo" className="w-20 h-20 rounded-lg object-cover border border-gray-200 bg-white" />
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => businessLogoInputRef.current?.click()}
                      className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-white"
                    >
                      Change Logo
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, businessLogo: '' })}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => businessLogoInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-amber-500 hover:bg-amber-50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 font-medium">Upload business logo</p>
                  <p className="text-xs text-gray-400">PNG/JPG, up to 3MB | Square shape (1:1)</p>
                </button>
              )}
              <input
                ref={businessLogoInputRef}
                type="file"
                accept="image/*"
                onChange={handleBusinessLogoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Bank Account & Payment Settings */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-600" /> Bank Account & Payment</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
            <p className="text-xs text-blue-700">These bank details are shown to customers when they choose <strong>Bank Transfer</strong> during checkout. Customers will copy the details to make payment.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Bank Name</label>
              <input type="text" value={settings.bankName || ''} onChange={e => setSettings({...settings, bankName: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="e.g. Access Bank" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Account Number</label>
              <input type="text" value={settings.bankAccountNumber || ''} onChange={e => setSettings({...settings, bankAccountNumber: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono tracking-wider" placeholder="0123456789" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Account Name</label>
              <input type="text" value={settings.bankAccountName || ''} onChange={e => setSettings({...settings, bankAccountName: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="e.g. G-Smile Bags Enterprise" />
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-2">
              <CreditCard className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">Debit / Credit Card Payments (Paystack)</p>
                <p className="text-xs text-amber-700 mt-1">Card payments are processed securely through Paystack. Enter your Paystack public key below.</p>
                <p className="text-xs text-amber-600 mt-1">Get your key at <a href="https://dashboard.paystack.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">dashboard.paystack.com</a></p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Paystack Public Key</label>
            <input type="text" value={settings.paystackPublicKey || ''} onChange={e => setSettings({...settings, paystackPublicKey: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono text-sm"
              placeholder="pk_live_xxx or pk_test_xxx" />
            <p className="text-xs text-gray-400 mt-1.5">Use <code className="bg-gray-100 px-1.5 py-0.5 rounded text-green-600">pk_live_...</code> for real payments or <code className="bg-gray-100 px-1.5 py-0.5 rounded text-amber-600">pk_test_...</code> for testing</p>
          </div>
          {/* Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-700 mb-2">📱 Preview — What Customers See:</p>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 mb-1">Bank Name</p>
              <p className="font-bold text-gray-900 text-sm">{settings.bankName || '—'}</p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="font-mono font-bold text-gray-900">{settings.bankAccountNumber || '—'}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Account Name</p>
              <p className="font-bold text-gray-900 text-sm">{settings.bankAccountName || '—'}</p>
            </div>
          </div>
        </div>

        {/* Delivery & Promo */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-amber-600" /> Delivery & Promotions</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Free Delivery Threshold (₦)</label>
              <input type="number" value={settings.freeDeliveryThreshold || ''} onChange={e => setSettings({...settings, freeDeliveryThreshold: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" checked={settings.promoActive} onChange={e => setSettings({...settings, promoActive: e.target.checked})}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500" />
                <span className="text-sm font-bold text-gray-900">Show Promo Banner</span>
              </label>
            </div>
          </div>

          {settings.promoActive && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4 space-y-5">
              <label className="flex items-center gap-2 cursor-pointer border-b border-gray-200 pb-4">
                <input type="checkbox" checked={settings.useCustomPromoImage} onChange={e => setSettings({...settings, useCustomPromoImage: e.target.checked})}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500" />
                <span className="font-bold text-gray-900">Use Custom Uploaded Image/Design</span>
                <span className="text-sm text-gray-500 ml-2">(Instead of default text banner)</span>
              </label>

              {settings.useCustomPromoImage ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Promo Banner Image (Desktop & Mobile)</label>
                    {settings.promoImageDesktop ? (
                      <div className="relative border border-gray-200 rounded-lg overflow-hidden group">
                        <img src={settings.promoImageDesktop} alt="Promo Desktop" className="w-full h-40 object-cover" />
                        <button onClick={() => setSettings({...settings, promoImageDesktop: ''})}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => promoDesktopInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload banner image</p>
                        <p className="text-xs text-gray-400">Recommended: Landscape format (e.g. 1920x600px)</p>
                      </div>
                    )}
                    <input type="file" ref={promoDesktopInputRef} accept="image/*" onChange={(e) => handlePromoImageUpload(e, 'desktop')} className="hidden" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Link URL (Optional)</label>
                    <input type="text" value={settings.promoLink || ''} onChange={e => setSettings({...settings, promoLink: e.target.value})}
                      placeholder="https://... or /products"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Promo Code</label>
                    <input type="text" value={settings.promoCode} onChange={e => setSettings({...settings, promoCode: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Promo Discount (%)</label>
                    <input type="number" value={settings.promoDiscount || ''} onChange={e => setSettings({...settings, promoDiscount: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🤖 AI WhatsApp Assistant Config */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">🤖 AI WhatsApp Bot Configuration</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">Enable AI Chat Assistant</h4>
                <p className="text-xs text-gray-500">Activates the interactive AI auto-responder inside the chat widget.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiBotEnabled !== false}
                  onChange={e => setSettings({ ...settings, aiBotEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Bot Name</label>
                <input
                  type="text"
                  value={settings.aiBotName || ''}
                  onChange={e => setSettings({ ...settings, aiBotName: e.target.value })}
                  placeholder="e.g., G-Smile AI Assistant"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Welcome/Greeting Message</label>
                <input
                  type="text"
                  value={settings.aiBotWelcome || ''}
                  onChange={e => setSettings({ ...settings, aiBotWelcome: e.target.value })}
                  placeholder="Hello! How can I help you today?"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold text-sm text-gray-700 flex justify-between items-center">
                <span>Auto-Reply Rules (Trigger Keywords & Responses)</span>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    aiBotRules: [...(settings.aiBotRules || []), { trigger: '', reply: '' }]
                  })}
                  className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  + Add Rule
                </button>
              </div>
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                {(settings.aiBotRules || []).map((rule, idx) => (
                  <div key={idx} className="p-3 flex items-start gap-2">
                    <input
                      type="text"
                      placeholder="Keyword Trigger (e.g., price)"
                      value={rule.trigger}
                      onChange={e => {
                        const newRules = [...(settings.aiBotRules || [])];
                        newRules[idx].trigger = e.target.value;
                        setSettings({ ...settings, aiBotRules: newRules });
                      }}
                      className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-amber-500"
                    />
                    <textarea
                      placeholder="Bot Reply / Answer"
                      value={rule.reply}
                      onChange={e => {
                        const newRules = [...(settings.aiBotRules || [])];
                        newRules[idx].reply = e.target.value;
                        setSettings({ ...settings, aiBotRules: newRules });
                      }}
                      rows={2}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-amber-500 resize-none"
                    />
                    <button
                      onClick={() => {
                        const newRules = (settings.aiBotRules || []).filter((_, i) => i !== idx);
                        setSettings({ ...settings, aiBotRules: newRules });
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-amber-600" /> Social Media</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Instagram URL</label>
              <input type="url" value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Facebook URL</label>
              <input type="url" value={settings.facebook} onChange={e => setSettings({...settings, facebook: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Twitter URL</label>
              <input type="url" value={settings.twitter} onChange={e => setSettings({...settings, twitter: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
            </div>
          </div>
        </div>

        {/* Categories Management */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-amber-600" /> Product Categories ({categories.length})</h3>

          {/* Add new category */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newCategory.trim()) {
                  setCategories(addCategory(newCategory));
                  setNewCategory('');
                }
              }}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
              placeholder="Enter new category name..."
            />
            <button
              onClick={() => {
                if (newCategory.trim()) {
                  setCategories(addCategory(newCategory));
                  setNewCategory('');
                }
              }}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Categories list */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div key={cat} className="bg-gray-50 rounded-xl border border-gray-200 p-3 flex items-center justify-between group hover:border-amber-300 transition-colors">
                {editingCategory === cat ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={e => setEditCategoryName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && editCategoryName.trim()) {
                          setCategories(updateCategory(cat, editCategoryName));
                          setEditingCategory(null);
                          setEditCategoryName('');
                        }
                        if (e.key === 'Escape') {
                          setEditingCategory(null);
                          setEditCategoryName('');
                        }
                      }}
                      className="flex-1 border border-amber-400 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-amber-500"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        if (editCategoryName.trim()) {
                          setCategories(updateCategory(cat, editCategoryName));
                          setEditingCategory(null);
                          setEditCategoryName('');
                        }
                      }}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditingCategory(null); setEditCategoryName(''); }}
                      className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : deleteCategoryConfirm === cat ? (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm text-red-600 font-medium">Delete "{cat}"?</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setCategories(deleteCategory(cat));
                          setDeleteCategoryConfirm(null);
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteCategoryConfirm(null)}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{cat}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingCategory(cat); setEditCategoryName(cat); }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                        title="Edit category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCategoryConfirm(cat)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">No categories yet. Add your first category above.</p>
          )}
        </div>

        {/* Hero Section */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-amber-600" /> Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Hero Title</label>
              <input type="text" value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Hero Subtitle</label>
              <input type="text" value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Hero Description</label>
              <textarea rows={3} value={settings.heroDescription} onChange={e => setSettings({...settings, heroDescription: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Hero Background Image URL</label>
              <input type="url" value={settings.heroImage} onChange={e => setSettings({...settings, heroImage: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500" />
            </div>
          </div>
        </div>

        {/* Footer Marquee Banner Settings */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-600" /> Footer Scrolling Banner
          </h3>

          {/* Live Preview */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Live Preview</label>
            <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
              <div className="bg-amber-600 text-white overflow-hidden py-2.5 relative">
                <style>{`
                  @keyframes adminMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  @keyframes adminBounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                  }
                  @keyframes adminFade {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                  }
                `}</style>
                {settings.footerBanner?.active !== false && (() => {
                  const mode = settings.footerBanner?.displayMode || 'marquee-left';
                  const speed = settings.footerBanner?.speed || 'normal';
                  const text = settings.footerBanner?.text || 'FREE delivery within Ibadan on orders above ₦30,000 | Call/WhatsApp: 08065653384';
                  const sep = '  ★  ';
                  const full = text + sep + text + sep + text + sep;
                  const duration = speed === 'slow' ? '30s' : speed === 'fast' ? '10s' : '18s';
                  const dir = mode === 'marquee-right' ? 'reverse' : 'normal';

                  if (mode === 'bounce') return (
                    <div className="flex whitespace-nowrap font-medium text-xs tracking-wider items-center justify-center" style={{ animation: 'adminBounce 2s ease-in-out infinite' }}>{text}</div>
                  );
                  if (mode === 'fade') return (
                    <div className="flex whitespace-nowrap font-medium text-xs tracking-wider items-center justify-center" style={{ animation: 'adminFade 3s ease-in-out infinite' }}>{text}</div>
                  );
                  if (mode === 'static') return (
                    <div className="flex whitespace-nowrap font-medium text-xs tracking-wider items-center justify-center">{text}</div>
                  );
                  return (
                    <div className="flex whitespace-nowrap font-medium text-xs tracking-wider items-center" style={{ animation: `adminMarquee ${duration} linear infinite`, animationDirection: dir }}>
                      <span>{full}</span><span>{full}</span>
                    </div>
                  );
                })()}
                {settings.footerBanner?.active === false && (
                  <div className="flex items-center justify-center py-1 text-xs opacity-60">Banner is hidden</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Banner Text</label>
              <textarea
                rows={2}
                value={settings.footerBanner?.text || ''}
                onChange={e => setSettings({...settings, footerBanner: { ...settings.footerBanner, text: e.target.value }})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 resize-none"
                placeholder="e.g. FREE delivery within Ibadan on orders above ₦30,000 | Call/WhatsApp: 08065653384"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Animation Mode</label>
              <select
                value={settings.footerBanner?.displayMode || 'marquee-left'}
                onChange={e => setSettings({...settings, footerBanner: { ...settings.footerBanner, displayMode: e.target.value as any }})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
              >
                <option value="marquee-left">⟶ Scroll Left to Right</option>
                <option value="marquee-right">⟵ Scroll Right to Left</option>
                <option value="bounce">🔵 Bounce / Pulse Effect</option>
                <option value="fade">🌫️ Fade In &amp; Out</option>
                <option value="static">📌 Static (No Animation)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Animation Speed</label>
              <select
                value={settings.footerBanner?.speed || 'normal'}
                onChange={e => setSettings({...settings, footerBanner: { ...settings.footerBanner, speed: e.target.value as any }})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
              >
                <option value="slow">🐢 Slow</option>
                <option value="normal">🚶 Normal</option>
                <option value="fast">🏃 Fast</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Enable Banner</h4>
                <p className="text-xs text-gray-500 mt-0.5">Show or hide the scrolling banner in the footer</p>
              </div>
              <button
                onClick={() => setSettings({...settings, footerBanner: { ...settings.footerBanner, active: !settings.footerBanner?.active }})}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                  settings.footerBanner?.active ? 'bg-amber-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                    settings.footerBanner?.active ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-amber-600" /> Why Choose Us</h3>

          <div className="space-y-6">
            {/* Main Content */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Section Subtitle</label>
                <input
                  type="text"
                  value={settings.whyChooseSubtitle}
                  onChange={e => setSettings({...settings, whyChooseSubtitle: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
                  placeholder="Why Choose Us"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Badge Text</label>
                <input
                  type="text"
                  value={settings.whyChooseBadge}
                  onChange={e => setSettings({...settings, whyChooseBadge: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
                  placeholder="500+ Reviews"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Main Title</label>
              <input
                type="text"
                value={settings.whyChooseTitle}
                onChange={e => setSettings({...settings, whyChooseTitle: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500"
                placeholder="Crafted with Passion & Precision"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <textarea
                rows={3}
                value={settings.whyChooseDescription}
                onChange={e => setSettings({...settings, whyChooseDescription: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 resize-none"
                placeholder="Describe your brand story..."
              />
            </div>

            {/* Features Manager */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Features ({whyFeatures.length})</label>
                <button
                  onClick={() => {
                    if (newFeature.title && newFeature.desc) {
                      const updatedFeatures = [...whyFeatures, newFeature as WhyChooseFeature];
                      setWhyFeatures(updatedFeatures);
                      setSettings({...settings, whyChooseFeatures: updatedFeatures});
                      setNewFeature({ icon: 'Award', title: '', desc: '' });
                    }
                  }}
                  className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Feature
                </button>
              </div>

              {/* Add new feature form */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3">
                    <label className="text-xs text-gray-500 block mb-1">Icon</label>
                    <select
                      value={newFeature.icon}
                      onChange={e => setNewFeature({...newFeature, icon: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="Award">🏆 Award</option>
                      <option value="Truck">🚚 Truck</option>
                      <option value="RefreshCw">🔄 Return</option>
                      <option value="Headphones">🎧 Support</option>
                      <option value="Shield">🛡️ Shield</option>
                      <option value="Star">⭐ Star</option>
                      <option value="Zap">⚡ Zap</option>
                    </select>
                  </div>
                  <div className="col-span-4">
                    <label className="text-xs text-gray-500 block mb-1">Title</label>
                    <input
                      type="text"
                      value={newFeature.title}
                      onChange={e => setNewFeature({...newFeature, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="Feature title"
                    />
                  </div>
                  <div className="col-span-5">
                    <label className="text-xs text-gray-500 block mb-1">Description</label>
                    <input
                      type="text"
                      value={newFeature.desc}
                      onChange={e => setNewFeature({...newFeature, desc: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="Short description"
                    />
                  </div>
                </div>
              </div>

              {/* Current Features */}
              <div className="space-y-3">
                {whyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 group">
                    {editingFeatureIndex === index ? (
                      <div className="flex-1 grid grid-cols-12 gap-3">
                        <div className="col-span-3">
                          <select
                            value={feature.icon}
                            onChange={e => {
                              const updated = [...whyFeatures];
                              updated[index].icon = e.target.value;
                              setWhyFeatures(updated);
                              setSettings({...settings, whyChooseFeatures: updated});
                            }}
                            className="w-full border border-amber-400 rounded-lg px-3 py-1.5 text-sm"
                          >
                            <option value="Award">🏆 Award</option>
                            <option value="Truck">🚚 Truck</option>
                            <option value="RefreshCw">🔄 Return</option>
                            <option value="Headphones">🎧 Support</option>
                            <option value="Shield">🛡️ Shield</option>
                            <option value="Star">⭐ Star</option>
                            <option value="Zap">⚡ Zap</option>
                          </select>
                        </div>
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={feature.title}
                            onChange={e => {
                              const updated = [...whyFeatures];
                              updated[index].title = e.target.value;
                              setWhyFeatures(updated);
                              setSettings({...settings, whyChooseFeatures: updated});
                            }}
                            className="w-full border border-amber-400 rounded-lg px-3 py-1.5 text-sm"
                            autoFocus
                          />
                        </div>
                        <div className="col-span-5 flex gap-2">
                          <input
                            type="text"
                            value={feature.desc}
                            onChange={e => {
                              const updated = [...whyFeatures];
                              updated[index].desc = e.target.value;
                              setWhyFeatures(updated);
                              setSettings({...settings, whyChooseFeatures: updated});
                            }}
                            className="flex-1 border border-amber-400 rounded-lg px-3 py-1.5 text-sm"
                          />
                          <button
                            onClick={() => setEditingFeatureIndex(null)}
                            className="px-3 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                          {feature.icon === 'Award' ? '🏆' : feature.icon === 'Truck' ? '🚚' : feature.icon === 'RefreshCw' ? '🔄' : feature.icon === 'Headphones' ? '🎧' : feature.icon === 'Shield' ? '🛡️' : feature.icon === 'Star' ? '⭐' : '⚡'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{feature.title}</p>
                          <p className="text-gray-500 text-xs line-clamp-1">{feature.desc}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingFeatureIndex(index)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const updated = whyFeatures.filter((_, i) => i !== index);
                              setWhyFeatures(updated);
                              setSettings({...settings, whyChooseFeatures: updated});
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-100 pt-6">
          <button onClick={handleSave}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${saved ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500'}`}>
            <Save className="w-4 h-4" /> {saved ? 'Saved Successfully! ✓' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showReset && (
        <div className="fixed inset-0 z-[70] overflow-y-auto flex py-8 px-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowReset(false)}>
          <div className="bg-white rounded-2xl m-auto max-w-sm w-full p-6 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reset All Data?</h3>
            <p className="text-gray-500 mb-6">This will delete all products, orders, testimonials, and custom settings. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowReset(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleReset}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Customers Manager ────────────────────────────────────────
function CustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>(getCustomers());
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'orders' | 'spent' | 'name'>('recent');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [editNotes, setEditNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  const filtered = customers
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent': return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
        case 'orders': return b.totalOrders - a.totalOrders;
        case 'spent': return b.totalSpent - a.totalSpent;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const totalCustomers = customers.length;
  const topCustomer = customers.length > 0 ? customers.reduce((top, c) => c.totalSpent > top.totalSpent ? c : top, customers[0]) : null;

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerOrders(getCustomerOrders(customer.phone, customer.email));
    setNotesText(customer.notes || '');
    setEditNotes(false);
  };

  const handleSaveNotes = () => {
    if (selectedCustomer) {
      const updated = { ...selectedCustomer, notes: notesText };
      updateCustomer(updated);
      setSelectedCustomer(updated);
      setCustomers(getCustomers());
      setEditNotes(false);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer? Their order history will remain.')) {
      deleteCustomer(id);
      setCustomers(getCustomers());
      setSelectedCustomer(null);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Name,Phone,Email,Total Orders,Total Spent,First Order,Last Order,Notes\n';
    const rows = customers.map(c =>
      `"${c.name}","${c.phone}","${c.email}",${c.totalOrders},${c.totalSpent},"${new Date(c.firstOrderDate).toLocaleDateString()}","${new Date(c.lastOrderDate).toLocaleDateString()}","${(c.notes || '').replace(/"/g, '""')}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gsmilebags_customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatWaNumber = (phone: string): string => {
    const cleaned = phone.replace(/[^0-9+]/g, '');
    if (cleaned.startsWith('+234')) return cleaned.substring(1);
    if (cleaned.startsWith('234')) return cleaned;
    if (cleaned.startsWith('0')) return '234' + cleaned.substring(1);
    return cleaned;
  };

  const getWhatsAppCustomerUrl = (phone: string, name: string) => {
    const text = encodeURIComponent(`Hello ${name}! 👋\n\nThank you for shopping with G-Smile Bags!\n\nWe appreciate your business. Feel free to reach out if you need anything!`);
    const waNumber = formatWaNumber(phone);
    return `https://wa.me/${waNumber}?text=${text}`;
  };

  if (selectedCustomer) {
    return (
      <div>
        <button onClick={() => setSelectedCustomer(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Customers
        </button>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                  <p className="text-white/80 text-sm">Customer since {new Date(selectedCustomer.firstOrderDate).toLocaleDateString()}</p>
                </div>
              </div>
              <a href={getWhatsAppCustomerUrl(selectedCustomer.phone, selectedCustomer.name)}
                target="_blank" rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="p-6">
            {/* Contact Info */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="font-semibold text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-gray-900">{selectedCustomer.email}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Customer ID</p>
                <p className="font-semibold text-gray-900 text-sm">{selectedCustomer.id}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Source</p>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  selectedCustomer.source === 'whatsapp' ? 'bg-green-100 text-green-700' :
                  selectedCustomer.source === 'online' ? 'bg-blue-100 text-blue-700' :
                  selectedCustomer.source === 'store' ? 'bg-amber-100 text-amber-700' :
                  selectedCustomer.source === 'referral' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedCustomer.source === 'whatsapp' && '💬'}
                  {selectedCustomer.source === 'online' && '🌐'}
                  {selectedCustomer.source === 'store' && '🏪'}
                  {selectedCustomer.source === 'referral' && '🤝'}
                  {selectedCustomer.source === 'other' && '📋'}
                  {selectedCustomer.source.charAt(0).toUpperCase() + selectedCustomer.source.slice(1)}
                </span>
              </div>
            </div>

            {/* WhatsApp Message (if from WhatsApp) */}
            {selectedCustomer.source === 'whatsapp' && selectedCustomer.whatsappMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 text-sm mb-2 flex items-center gap-2">
                  💬 Original WhatsApp Message
                </h3>
                <p className="text-sm text-green-700 whitespace-pre-wrap">{selectedCustomer.whatsappMessage}</p>
                {selectedCustomer.whatsappAddedAt && (
                  <p className="text-xs text-green-500 mt-2">Added: {new Date(selectedCustomer.whatsappAddedAt).toLocaleString()}</p>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                <p className="text-xs text-gray-500">Total Orders</p>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">{formatPrice(selectedCustomer.totalSpent)}</p>
                <p className="text-xs text-gray-500">Total Spent</p>
              </div>
              <div className="text-center bg-purple-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-purple-600">{selectedCustomer.totalOrders > 0 ? formatPrice(Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders)) : '₦0'}</p>
                <p className="text-xs text-gray-500">Avg. Order</p>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Notes</h3>
                {!editNotes && (
                  <button onClick={() => setEditNotes(true)}
                    className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                )}
              </div>
              {editNotes ? (
                <div className="space-y-2">
                  <textarea value={notesText} onChange={e => setNotesText(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-amber-500 text-sm"
                    rows={3} placeholder="Add notes about this customer..." />
                  <div className="flex gap-2">
                    <button onClick={handleSaveNotes}
                      className="bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors">
                      <Save className="w-4 h-4 inline mr-1" /> Save
                    </button>
                    <button onClick={() => setEditNotes(false)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 min-h-[60px]">
                  {selectedCustomer.notes || <span className="text-gray-400 italic">No notes yet. Click edit to add notes.</span>}
                </div>
              )}
            </div>

            {/* Order History */}
            <h3 className="font-semibold text-gray-900 mb-3">Order History ({customerOrders.length})</h3>
            {customerOrders.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No orders found for this customer.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {customerOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{order.product}</p>
                      <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()} · Qty: {order.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{formatPrice(order.total)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // WhatsApp Import sub-tab state
  const [custTab, setCustTab] = useState<'all' | 'whatsapp-add' | 'whatsapp-history'>('all');
  // WhatsApp form state
  const [waName, setWaName] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waEmail, setWaEmail] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [waNotes, setWaNotes] = useState('');
  const [waPasteText, setWaPasteText] = useState('');
  const [waParsed, setWaParsed] = useState<ParsedWhatsAppCustomer | null>(null);
  const [waAddSuccess, setWaAddSuccess] = useState(false);
  const [waBulkText, setWaBulkText] = useState('');
  const [waBulkResult, setWaBulkResult] = useState<{added: number; updated: number; skipped: number} | null>(null);
  // Source filter
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const waCustomers = getWhatsAppCustomers();
  const sourceCounts = getCustomerSourceCounts();

  const handleParseWhatsApp = () => {
    if (!waPasteText.trim()) return;
    const parsed = parseWhatsAppMessage(waPasteText);
    setWaParsed(parsed);
    setWaName(parsed.name);
    setWaPhone(parsed.phone);
    setWaEmail(parsed.email);
    setWaMessage(parsed.message);
  };

  const handleAddWhatsAppCustomer = () => {
    if (!waName.trim() && !waPhone.trim()) return;
    addCustomerFromWhatsApp(waName.trim(), waPhone.trim(), waEmail.trim(), waMessage.trim(), waNotes.trim());
    setCustomers(getCustomers());
    setWaAddSuccess(true);
    setTimeout(() => setWaAddSuccess(false), 3000);
    setWaName('');
    setWaPhone('');
    setWaEmail('');
    setWaMessage('');
    setWaNotes('');
    setWaPasteText('');
    setWaParsed(null);
  };

  const handleBulkImport = () => {
    const lines = waBulkText.split('\n').filter(l => l.trim());
    if (lines.length === 0) return;
    let added = 0;
    let updated = 0;
    let skipped = 0;
    for (const line of lines) {
      const parsed = parseWhatsAppMessage(line);
      if (!parsed.name && !parsed.phone) { skipped++; continue; }
      const existing = customers.find(c =>
        (parsed.phone && c.phone.replace(/[\s-]/g, '') === parsed.phone.replace(/[\s-]/g, '')) ||
        (parsed.email && c.email.toLowerCase() === parsed.email.toLowerCase())
      );
      if (existing) {
        updateCustomer({ ...existing, source: 'whatsapp', whatsappMessage: parsed.message, whatsappAddedAt: new Date().toISOString() });
        updated++;
      } else {
        addCustomerFromWhatsApp(parsed.name, parsed.phone, parsed.email, parsed.message);
        added++;
      }
    }
    setWaBulkResult({ added, updated, skipped });
    setCustomers(getCustomers());
    setWaBulkText('');
  };

  const sourceFiltered = sourceFilter === 'all' ? filtered : filtered.filter(c => c.source === sourceFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <button onClick={handleExportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setCustTab('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            custTab === 'all' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}>
          <UsersIcon className="w-4 h-4" /> All Customers
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${custTab === 'all' ? 'bg-white/30' : 'bg-gray-100 text-gray-500'}`}>{customers.length}</span>
        </button>
        <button onClick={() => setCustTab('whatsapp-add')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            custTab === 'whatsapp-add' ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}>
          💬 Add from WhatsApp
        </button>
        <button onClick={() => setCustTab('whatsapp-history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            custTab === 'whatsapp-history' ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}>
          💬 WhatsApp History
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${custTab === 'whatsapp-history' ? 'bg-white/30' : 'bg-gray-100 text-gray-500'}`}>{waCustomers.length}</span>
        </button>
      </div>

      {/* ─── ALL CUSTOMERS TAB ─── */}
      {custTab === 'all' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-xs text-green-600">💬 WhatsApp</p>
              <p className="text-xl font-bold text-green-700">{sourceCounts.whatsapp}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-blue-600">🌐 Online</p>
              <p className="text-xl font-bold text-blue-700">{sourceCounts.online}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-xs text-amber-600">🏪 Store</p>
              <p className="text-xl font-bold text-amber-700">{sourceCounts.store}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-xs text-purple-600">🤝 Referral</p>
              <p className="text-xl font-bold text-purple-700">{sourceCounts.referral}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Top Customer</p>
              <p className="text-sm font-bold text-amber-600 truncate">{topCustomer?.name || 'N/A'}</p>
            </div>
          </div>

          {/* Search, Sort, Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, phone, or email..."
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 text-sm" />
              </div>
              <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 text-sm bg-white">
                <option value="all">All Sources</option>
                <option value="whatsapp">💬 WhatsApp</option>
                <option value="online">🌐 Online</option>
                <option value="store">🏪 Store</option>
                <option value="referral">🤝 Referral</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:border-amber-500 text-sm bg-white">
                <option value="recent">Sort: Most Recent</option>
                <option value="orders">Sort: Most Orders</option>
                <option value="spent">Sort: Highest Spent</option>
                <option value="name">Sort: Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Customer List */}
          {sourceFiltered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No customers found</p>
              <p className="text-gray-400 text-sm mt-1">
                {sourceFilter !== 'all' ? 'Try changing the source filter' : 'Customers will appear here when they place orders or are added manually'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Table Header - Desktop */}
              <div className="hidden md:grid md:grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <div className="col-span-3">Customer</div>
                <div className="col-span-2">Phone</div>
                <div className="col-span-2">Email</div>
                <div className="col-span-1 text-center">Source</div>
                <div className="col-span-1 text-center">Orders</div>
                <div className="col-span-1 text-right">Total Spent</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {sourceFiltered.map((customer, index) => (
                <div key={customer.id}
                  className={`grid md:grid-cols-12 items-center px-4 py-3 hover:bg-amber-50/50 transition-colors cursor-pointer ${
                    index !== sourceFiltered.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  onClick={() => handleViewCustomer(customer)}>
                  {/* Customer Info */}
                  <div className="md:col-span-3 flex items-center gap-3 mb-2 md:mb-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{customer.name}</p>
                      <p className="text-xs text-gray-400 md:hidden">{customer.phone}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="hidden md:block md:col-span-2 text-sm text-gray-600">{customer.phone}</div>

                  {/* Email */}
                  <div className="hidden md:block md:col-span-2 text-sm text-gray-500 truncate">{customer.email}</div>

                  {/* Source Badge */}
                  <div className="md:col-span-1 text-center hidden md:block">
                    <span className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      customer.source === 'whatsapp' ? 'bg-green-100 text-green-700' :
                      customer.source === 'online' ? 'bg-blue-100 text-blue-700' :
                      customer.source === 'store' ? 'bg-amber-100 text-amber-700' :
                      customer.source === 'referral' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {customer.source === 'whatsapp' ? '💬' :
                       customer.source === 'online' ? '🌐' :
                       customer.source === 'store' ? '🏪' :
                       customer.source === 'referral' ? '🤝' : '📋'}
                    </span>
                  </div>

                  {/* Orders */}
                  <div className="md:col-span-1 text-center">
                    <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                      {customer.totalOrders}
                    </span>
                  </div>

                  {/* Total Spent */}
                  <div className="md:col-span-1 text-right">
                    <p className="font-bold text-gray-900 text-sm">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-xs text-gray-400 md:hidden">{customer.email}</p>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex items-center justify-end gap-2 mt-2 md:mt-0">
                    <a href={getWhatsAppCustomerUrl(customer.phone, customer.name)}
                      target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors inline-flex" title="WhatsApp">
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <button onClick={(e) => { e.stopPropagation(); handleViewCustomer(customer); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(customer.id); }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
                Showing {sourceFiltered.length} of {customers.length} customers
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── ADD FROM WHATSAPP TAB ─── */}
      {custTab === 'whatsapp-add' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Add Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              💬 Quick Add from WhatsApp
            </h3>
            <p className="text-sm text-gray-500 mb-4">Manually enter customer details from a WhatsApp conversation</p>

            {waAddSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> Customer saved successfully!
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={waName} onChange={e => setWaName(e.target.value)}
                  placeholder="e.g. Adunola Martins"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:border-green-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input type="text" value={waPhone} onChange={e => setWaPhone(e.target.value)}
                  placeholder="e.g. 08065653384 or +2348065653384"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:border-green-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input type="email" value={waEmail} onChange={e => setWaEmail(e.target.value)}
                  placeholder="e.g. customer@email.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:border-green-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message / Context</label>
                <textarea value={waMessage} onChange={e => setWaMessage(e.target.value)}
                  placeholder="What did the customer ask about? e.g. Interested in Executive Briefcase"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:border-green-500 text-sm"
                  rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea value={waNotes} onChange={e => setWaNotes(e.target.value)}
                  placeholder="Internal notes about this customer..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:border-green-500 text-sm"
                  rows={2} />
              </div>

              <button onClick={handleAddWhatsAppCustomer}
                disabled={!waName.trim() && !waPhone.trim()}
                className="w-full bg-green-500 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Customer from WhatsApp
              </button>
            </div>
          </div>

          {/* Auto-Parse WhatsApp Message */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                📋 Paste & Auto-Parse WhatsApp Message
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Paste the entire WhatsApp message or chat and the system will auto-extract customer details
              </p>

              <textarea value={waPasteText} onChange={e => setWaPasteText(e.target.value)}
                placeholder={`Paste a WhatsApp message here...\n\nExample:\nName: Adunola Martins\nPhone: 08065653384\nEmail: adunola@email.com\n\nI'm interested in your Executive Briefcase. Can I get a discount?\n\nOr just paste any WhatsApp message — the system will try to find name, phone & email automatically!`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:border-green-500 text-sm font-mono"
                rows={8} />

              <button onClick={handleParseWhatsApp}
                disabled={!waPasteText.trim()}
                className="w-full mt-3 bg-amber-500 text-black py-2.5 rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                🔍 Parse Message
              </button>

              {/* Parsed Results */}
              {waParsed && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 text-sm mb-3">📊 Parsed Results:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500">👤 Name</p>
                      <p className="font-semibold text-gray-900">{waParsed.name || <span className="text-gray-400 italic">Not found</span>}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500">📱 Phone</p>
                      <p className="font-semibold text-gray-900">{waParsed.phone || <span className="text-gray-400 italic">Not found</span>}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500">📧 Email</p>
                      <p className="font-semibold text-gray-900">{waParsed.email || <span className="text-gray-400 italic">Not found</span>}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-500">💬 Message</p>
                      <p className="text-gray-700 text-xs truncate">{waParsed.message || <span className="text-gray-400 italic">No message</span>}</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-3">✅ Review the parsed details and edit if needed, then click <strong>Add Customer from WhatsApp</strong> above.</p>
                </div>
              )}
            </div>

            {/* Bulk Import */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" /> Bulk Import
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Paste multiple customers (one per line) for bulk import
              </p>

              <textarea value={waBulkText} onChange={e => setWaBulkText(e.target.value)}
                placeholder={`One customer per line:\nName: John Doe, Phone: 08012345678\nName: Jane Smith, Phone: 09087654321\n08011112222, Michael, mike@email.com`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:border-green-500 text-sm font-mono"
                rows={5} />

              <button onClick={handleBulkImport}
                disabled={!waBulkText.trim()}
                className="w-full mt-3 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <UsersIcon className="w-4 h-4" /> Import All Customers
              </button>

              {waBulkResult && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{waBulkResult.added}</p>
                      <p className="text-xs text-green-700">New Added</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-600">{waBulkResult.updated}</p>
                      <p className="text-xs text-amber-700">Updated</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-600">{waBulkResult.skipped}</p>
                      <p className="text-xs text-gray-700">Skipped</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── WHATSAPP HISTORY TAB ─── */}
      {custTab === 'whatsapp-history' && (
        <>
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="text-3xl">💬</div>
            <div>
              <h3 className="font-bold text-green-800">WhatsApp Imported Customers</h3>
              <p className="text-sm text-green-600">{waCustomers.length} customer{waCustomers.length !== 1 ? 's' : ''} added from WhatsApp</p>
            </div>
          </div>

          {waCustomers.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-500 text-lg font-medium">No WhatsApp customers yet</p>
              <p className="text-gray-400 text-sm mt-1 mb-4">Add customers from WhatsApp conversations using the tab above</p>
              <button onClick={() => setCustTab('whatsapp-add')}
                className="bg-green-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                + Add from WhatsApp
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {waCustomers.map((customer, index) => (
                <div key={customer.id}
                  className={`px-4 py-4 hover:bg-green-50/50 transition-colors cursor-pointer ${
                    index !== waCustomers.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  onClick={() => handleViewCustomer(customer)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">WhatsApp</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span>📱 {customer.phone}</span>
                          {customer.email && customer.email !== 'N/A' && <span>📧 {customer.email}</span>}
                        </div>
                        {customer.whatsappMessage && (
                          <p className="text-xs text-gray-400 mt-1 truncate">💬 {customer.whatsappMessage}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          Added: {customer.whatsappAddedAt ? new Date(customer.whatsappAddedAt).toLocaleString() : 'N/A'}
                          {customer.totalOrders > 0 && ` · ${customer.totalOrders} orders · ${formatPrice(customer.totalSpent)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <a href={getWhatsAppCustomerUrl(customer.phone, customer.name)}
                        target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Message on WhatsApp">
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <button onClick={(e) => { e.stopPropagation(); handleViewCustomer(customer); }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(customer.id); }}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Store POS / In-Store Sales Manager ─────────────────────────
function StorePOS() {
  const [products] = useState<Product[]>(() => getProducts());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Transfer' | 'POS' | 'Card'>('Cash');
  const [successReceipt, setSuccessReceipt] = useState<Order | null>(null);
  const [saleImage, setSaleImage] = useState<string | null>(null);

  // Manual product entry state
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [manualProduct, setManualProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setManualProduct(null);
    setShowManualForm(false);
    setQuantity(1);
  };

  const handleManualProductSubmit = () => {
    if (!manualName.trim() || !manualPrice) return;
    const tempProduct: Product = {
      id: Date.now(),
      name: manualName.trim(),
      price: Number(manualPrice),
      originalPrice: 0,
      image: '',
      category: manualCategory.trim() || 'General',
      badge: 'Manual Entry',
      featured: false,
      inStock: true,
      rating: 0,
      reviews: 0,
    };
    setManualProduct(tempProduct);
    setSelectedProduct(tempProduct);
    setShowManualForm(false);
    setQuantity(1);
  };

  const resetManualForm = () => {
    setShowManualForm(false);
    setManualName('');
    setManualPrice('');
    setManualCategory('');
    setManualProduct(null);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const total = selectedProduct.price * quantity;
    const isManual = selectedProduct.badge === 'Manual Entry';
    const newOrder = addPhysicalStoreSale({
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || 'N/A',
      customerEmail: customerEmail || 'N/A',
      product: selectedProduct.name,
      quantity,
      total,
      message: isManual ? 'In-Store/POS Sale (Manual Product)' : 'In-Store/POS Sale',
      revenueCollected: true,
      revenueAmount: total,
      paymentMethod,
      saleImage: saleImage || undefined,
    });

    setSuccessReceipt(newOrder);
    setSaleImage(null);
    setSelectedProduct(null);
    setManualProduct(null);
    setQuantity(1);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    resetManualForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store POS (In-Store Sales)</h2>
          <p className="text-gray-600">Quickly process walk-in and physical store transactions.</p>
        </div>
        <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
          <Store className="w-5 h-5 text-amber-600" />
          <span className="font-semibold text-amber-900">POS Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Grid (Left Side) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-lg font-bold text-gray-900">Select Product</h3>
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                onClick={() => { setShowManualForm(true); setSelectedProduct(null); setManualProduct(null); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700 transition whitespace-nowrap"
              >
                <Pencil className="w-4 h-4" />
                Manual
              </button>
            </div>
          </div>

          {/* Manual Product Entry Form */}
          {showManualForm && (
            <div className="mb-4 bg-violet-50 border-2 border-violet-300 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-violet-900 flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  Manual Product Entry
                </h4>
                <button onClick={resetManualForm} className="text-violet-400 hover:text-violet-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-violet-600 mb-3">For products not listed online — enter details below for this transaction only.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-violet-700 uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Custom Leather Wallet"
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    className="w-full px-3 py-2 border border-violet-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-violet-700 uppercase mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    value={manualPrice}
                    onChange={e => setManualPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-violet-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-violet-700 uppercase mb-1">Category (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Accessories"
                    value={manualCategory}
                    onChange={e => setManualCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-violet-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleManualProductSubmit}
                  disabled={!manualName.trim() || !manualPrice}
                  className="flex-1 py-2 bg-violet-600 text-white font-bold rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Add to Checkout
                </button>
                <button
                  onClick={resetManualForm}
                  className="px-4 py-2 bg-white text-violet-600 font-bold rounded-lg text-sm border border-violet-200 hover:bg-violet-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Selected Manual Product Banner */}
          {manualProduct && !showManualForm && (
            <div className="mb-4 bg-violet-50 border border-violet-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-bold text-violet-800">{manualProduct.name}</span>
                <span className="text-xs bg-violet-200 text-violet-700 px-2 py-0.5 rounded-full font-semibold">Manual</span>
              </div>
              <button onClick={resetManualForm} className="text-violet-400 hover:text-violet-600 text-xs font-bold">
                Remove
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredProducts.length === 0 && !showManualForm && (
              <div className="col-span-full text-center py-12 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No products found</p>
                <p className="text-sm mt-1">Try a different search or use Manual Entry</p>
              </div>
            )}
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={`border rounded-xl p-3 cursor-pointer transition flex flex-col justify-between ${
                  selectedProduct?.id === product.id
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20'
                    : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {product.category}
                  </span>
                  <h4 className="font-bold text-gray-800 text-sm mt-1 line-clamp-1">{product.name}</h4>
                </div>
                <div className="mt-2 font-extrabold text-amber-600">
                  {formatPrice(product.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Form (Right Side) */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 flex flex-col justify-between">
          <form onSubmit={handleSubmitSale} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Checkout Detail</h3>

            {selectedProduct ? (
              <div className={`p-3 rounded-xl border ${manualProduct ? 'bg-violet-50 border-violet-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800">{selectedProduct.name}</span>
                  {manualProduct && (
                    <span className="text-xs bg-violet-200 text-violet-700 px-2 py-0.5 rounded-full font-semibold">Manual</span>
                  )}
                </div>
                <div className="text-amber-600 font-bold">{formatPrice(selectedProduct.price)}</div>
                {manualProduct && (
                  <div className="text-xs text-violet-500 mt-1">Category: {selectedProduct.category}</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center border border-dashed">
                Select a product or use Manual Entry to checkout.
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-bold hover:bg-gray-200"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center py-2 border rounded-lg font-bold"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-bold hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Cash', 'Transfer', 'POS', 'Card'] as const).map(method => (
                  <label
                    key={method}
                    className={`flex items-center justify-center py-2 px-3 border rounded-lg font-bold text-sm cursor-pointer transition ${
                      paymentMethod === method
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="hidden"
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t pt-3 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-gray-500 uppercase">Capture/Upload Photo</h4>
                {saleImage && (
                  <button
                    type="button"
                    onClick={() => setSaleImage(null)}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 border-dashed rounded-lg px-4 py-2.5 cursor-pointer hover:bg-gray-100 flex-1 transition">
                  <Camera className="w-5 h-5 text-gray-500" />
                  <span className="text-xs font-bold text-gray-600">
                    {saleImage ? 'Retake Photo' : 'Capture / Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSaleImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              {saleImage && (
                <div className="rounded-lg overflow-hidden border border-gray-200 mt-2 relative">
                  <img src={saleImage} alt="Captured product/sale" className="w-full h-32 object-cover" />
                </div>
              )}
            </div>

            <div className="border-t pt-3 space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase">Customer Details (Optional)</h4>
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-bold text-lg mb-4">
                <span>Total:</span>
                <span className="text-amber-600">
                  {selectedProduct ? formatPrice(selectedProduct.price * quantity) : '₦0'}
                </span>
              </div>

              <button
                type="submit"
                disabled={!selectedProduct}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold rounded-xl shadow hover:from-amber-700 hover:to-amber-600 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Process Sale</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Receipt Popup */}
      {successReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex py-8 px-4">
          <div className="bg-white rounded-2xl m-auto p-6 max-w-sm w-full shadow-2xl relative text-center">
            <button
              onClick={() => setSuccessReceipt(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 border border-green-200">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">Sale Completed!</h3>
            <p className="text-sm text-gray-500 mb-6">Payment and store sale logged successfully.</p>

            <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2 mb-6 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-bold text-gray-800">{successReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Product:</span>
                <span className="font-semibold text-gray-800">{successReceipt.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-semibold text-gray-800">{successReceipt.message}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Method:</span>
                <span className="font-semibold text-gray-800">{successReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total Paid:</span>
                <span className="text-green-600">{formatPrice(successReceipt.total)}</span>
              </div>
              {successReceipt.saleImage && (
                <div className="border-t pt-2 mt-2">
                  <span className="block text-gray-500 mb-1">Attached Photo:</span>
                  <img src={successReceipt.saleImage} alt="Sale snapshot" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                </div>
              )}
            </div>

            <button
              onClick={() => setSuccessReceipt(null)}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800"
            >
              New Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sales Reps Manager ──────────────────────────────────────────
function SalesRepsManager() {
  const [reps, setReps] = useState<SalesRep[]>(getSalesReps());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const newRep = addSalesRep({ name, phone, password: password || undefined, isActive: true });
    setReps([...reps, newRep]);
    setName('');
    setPhone('');
    setPassword('');
  };

  const handleToggleActive = (id: string, current: boolean) => {
    updateSalesRep(id, { isActive: !current });
    setReps(getSalesReps());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this sales rep?')) {
      deleteSalesRep(id);
      setReps(getSalesReps());
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sales Representatives</h2>
          <p className="text-violet-100 text-sm mt-1">Add sales representatives and manage their dashboard access</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-violet-600">➕</span> Add New Sales Rep
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:border-violet-500"
                placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number (Username)</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:border-violet-500"
                placeholder="e.g. 08012345678" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input type="text" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:border-violet-500"
                placeholder="Secure password" />
            </div>
            <button type="submit"
              className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-all">
              Add Sales Rep
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Manage Accounts & Performance</h3>
          {reps.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sales representatives found. Add one to get started.</p>
          ) : (
            <div className="space-y-4">
              {reps.map(rep => (
                <div key={rep.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-lg">{rep.name}</span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${rep.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {rep.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">📞 {rep.phone} | 🔑 {rep.password}</p>
                    <p className="text-xs text-violet-600 font-semibold mt-1">ID: {rep.id}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-3 rounded-xl">
                    <div>
                      <span className="text-xs text-gray-500 block">Sales Handled</span>
                      <span className="font-bold text-gray-900 text-base">{rep.totalSalesCount}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Collected Revenue</span>
                      <span className="font-bold text-green-600 text-base">{formatPrice(rep.totalRevenueCollected)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleToggleActive(rep.id, rep.isActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${rep.isActive ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {rep.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(rep.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sales Reports ────────────────────────────────────────────
function SalesReportsManager({ salesRepId }: { salesRepId?: string }) {
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
    csv += `Paid Revenue,${report.paidRevenue}\n`;
    csv += `Unpaid Revenue,${report.unpaidRevenue}\n`;
    csv += `Cancelled Orders,${report.cancelledOrders}\n`;
    csv += `Average Order Value,${report.averageOrderValue.toFixed(0)}\n\n`;
    csv += 'Top Products\nProduct,Quantity,Revenue\n';
    report.topProducts.forEach(p => { csv += `"${p.name}",${p.quantity},${p.revenue}\n`; });
    csv += '\nDaily Breakdown\nDate,Sales,Revenue\n';
    report.dailyBreakdown.forEach(d => { csv += `${d.date},${d.sales},${d.revenue}\n`; });
    csv += '\nPayment Methods\nMethod,Count,Total\n';
    report.paymentMethodBreakdown.forEach(p => { csv += `${p.method},${p.count},${p.total}\n`; });
    if (report.topSalesReps.length > 0) {
      csv += '\nSales Reps\nName,Sales,Revenue\n';
      report.topSalesReps.forEach(r => { csv += `"${r.name}",${r.sales},${r.revenue}\n`; });
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${reportType}-${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Auto-generate on mount and changes
  useState(() => { generateCurrentReport(); });

  const maxBarValue = report ? Math.max(...report.dailyBreakdown.map(d => d.revenue), 1) : 1;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              Sales Reports
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm mt-1">
              {salesRepId ? 'Your personal sales documentation' : 'Comprehensive sales analytics & documentation'}
            </p>
          </div>
          {report && (
            <button onClick={exportCSV}
              className="bg-white/20 hover:bg-white/30 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors self-start sm:self-auto">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
          {/* Period Type */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Report Period</label>
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {(['daily', 'weekly', 'monthly', 'custom'] as const).map(type => (
                <button key={type} onClick={() => setReportType(type)}
                  className={`py-2 px-1 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all capitalize ${
                    reportType === type
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          {reportType !== 'custom' ? (
            <div className="flex items-center gap-2">
              <button onClick={() => navigateDate(-1)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto" />
              </div>
              <button onClick={() => navigateDate(1)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-full" />
              </div>
              <span className="text-gray-400 text-sm text-center">to</span>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-full" />
              </div>
            </div>
          )}

          <button onClick={generateCurrentReport}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shrink-0">
            <FileText className="w-4 h-4" /> Generate
          </button>
        </div>
      </div>

      {/* Report Content */}
      {report && (
        <div className="space-y-4 sm:space-y-6">
          {/* Period Title */}
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">{report.period}</h3>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">Total Sales</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{report.totalSales}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xs text-gray-500">Total Revenue</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatPrice(report.totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-xs text-gray-500">Paid Revenue</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{formatPrice(report.paidRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xs text-gray-500">Unpaid Revenue</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{formatPrice(report.unpaidRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <X className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-xs text-gray-500">Cancelled</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{report.cancelledOrders}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500">Avg Order Value</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatPrice(Math.round(report.averageOrderValue))}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Daily Breakdown Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Revenue Breakdown
              </h4>
              {report.dailyBreakdown.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No data for this period</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {report.dailyBreakdown.map((day, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs text-gray-500 w-16 sm:w-20 shrink-0 truncate">{day.date}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 sm:h-7 relative overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${Math.max((day.revenue / maxBarValue) * 100, 8)}%` }}
                        >
                          <span className="text-[10px] sm:text-xs text-white font-medium whitespace-nowrap">
                            {formatPrice(day.revenue)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 w-6 text-right shrink-0">{day.sales}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" /> Payment Methods
              </h4>
              {report.paymentMethodBreakdown.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No data for this period</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.paymentMethodBreakdown.map((pm, i) => {
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500'];
                    const bgColors = ['bg-blue-50', 'bg-green-50', 'bg-amber-50', 'bg-purple-50', 'bg-pink-50'];
                    const textColors = ['text-blue-700', 'text-green-700', 'text-amber-700', 'text-purple-700', 'text-pink-700'];
                    const totalPm = report.paymentMethodBreakdown.reduce((s, p) => s + p.total, 0);
                    const pct = totalPm > 0 ? ((pm.total / totalPm) * 100).toFixed(1) : '0';
                    return (
                      <div key={i} className={`${bgColors[i % 5]} rounded-xl p-3`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`font-medium text-sm ${textColors[i % 5]}`}>
                            {pm.method === 'Cash' ? '💵' : pm.method === 'Transfer' ? '🏦' : pm.method === 'POS' ? '💳' : pm.method === 'Card' ? '💳' : '🌐'} {pm.method}
                          </span>
                          <span className="text-xs text-gray-500">{pm.count} orders · {pct}%</span>
                        </div>
                        <div className="w-full bg-white/60 rounded-full h-2">
                          <div className={`h-full ${colors[i % 5]} rounded-full transition-all duration-500`}
                            style={{ width: `${totalPm > 0 ? (pm.total / totalPm) * 100 : 0}%` }} />
                        </div>
                        <p className={`font-bold text-sm mt-1 ${textColors[i % 5]}`}>{formatPrice(pm.total)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" /> Top Products
              </h4>
              {report.topProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No sales in this period</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {report.topProducts.map((prod, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-indigo-600 font-bold text-xs sm:text-sm">#{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{prod.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{prod.quantity} sold</p>
                      </div>
                      <span className="font-bold text-gray-900 text-xs sm:text-sm shrink-0">{formatPrice(prod.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Types + Sales Reps */}
            <div className="space-y-4 sm:space-y-6">
              {/* Order Type Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-4 flex items-center gap-2">
                  <Store className="w-4 h-4 text-indigo-600" /> Order Types
                </h4>
                {report.orderTypeBreakdown.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No data</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {report.orderTypeBreakdown.map((ot, i) => (
                      <div key={i} className={`p-3 rounded-xl ${ot.type === 'In-Store' ? 'bg-purple-50' : 'bg-blue-50'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {ot.type === 'In-Store' ? <Store className="w-4 h-4 text-purple-600" /> : <ShoppingBag className="w-4 h-4 text-blue-600" />}
                          <span className={`text-xs font-medium ${ot.type === 'In-Store' ? 'text-purple-700' : 'text-blue-700'}`}>{ot.type}</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{ot.count}</p>
                        <p className="text-xs text-gray-500">{formatPrice(ot.total)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Sales Reps (Admin only) */}
              {!salesRepId && report.topSalesReps.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" /> Top Sales Reps
                  </h4>
                  <div className="space-y-2">
                    {report.topSalesReps.map((rep, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white font-bold text-xs">{rep.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{rep.name}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">{rep.sales} sales</p>
                        </div>
                        <span className="font-bold text-green-600 text-xs sm:text-sm shrink-0">{formatPrice(rep.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Report Yet */}
      {!report && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
          <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Generate a Report</h3>
          <p className="text-sm text-gray-500 mb-4">Select a period and click "Generate" to view your sales documentation</p>
          <button onClick={generateCurrentReport}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
            <FileText className="w-4 h-4" /> Generate Today's Report
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Financial Balance ────────────────────────────────────────
export function FinancialBalance({ salesRepId }: { salesRepId?: string }) {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const navigateDate = (dir: number) => {
    const d = new Date(selectedDate);
    if (period === 'daily') d.setDate(d.getDate() + dir);
    else if (period === 'weekly') d.setDate(d.getDate() + dir * 7);
    else if (period === 'monthly') d.setMonth(d.getMonth() + dir);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Get sales revenue
  const orders = getOrders().filter(o => {
    if (salesRepId && o.salesRepId !== salesRepId) return false;
    if (!o.revenueCollected) return false;
    if (period === 'all') return true;
    if (period === 'daily') return o.date.startsWith(selectedDate);
    if (period === 'weekly') {
      const d = new Date(selectedDate);
      const start = new Date(d); start.setDate(start.getDate() - start.getDay());
      const end = new Date(start); end.setDate(end.getDate() + 7);
      const od = new Date(o.date);
      return od >= start && od < end;
    }
    if (period === 'monthly') {
      const d = new Date(selectedDate);
      const od = new Date(o.date);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    }
    return true;
  });

  // Get expenses
  const allExpenses = getExpenses().filter(e => {
    if (salesRepId && e.salesRepId !== salesRepId) return false;
    if (period === 'all') return true;
    if (period === 'daily') return e.date === selectedDate;
    if (period === 'weekly') {
      const d = new Date(selectedDate);
      const start = new Date(d); start.setDate(start.getDate() - start.getDay());
      const end = new Date(start); end.setDate(end.getDate() + 7);
      const ed = new Date(e.date);
      return ed >= start && ed < end;
    }
    if (period === 'monthly') {
      const d = new Date(selectedDate);
      return new Date(e.date).getMonth() === d.getMonth() && new Date(e.date).getFullYear() === d.getFullYear();
    }
    return true;
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalExpenses = allExpenses.reduce((s, e) => s + e.amount, 0);
  const netBalance = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netBalance / totalRevenue) * 100) : 0;
  const balanceRatio = totalRevenue > 0 ? Math.min(totalExpenses / totalRevenue, 1) : (totalExpenses > 0 ? 1 : 0);

  // Expense breakdown by purpose
  const expenseByPurpose: Record<string, number> = {};
  allExpenses.forEach(e => {
    expenseByPurpose[e.purpose] = (expenseByPurpose[e.purpose] || 0) + e.amount;
  });
  const topExpenses = Object.entries(expenseByPurpose).sort((a, b) => b[1] - a[1]);

  // Revenue breakdown by order type
  const posRevenue = orders.filter(o => o.paymentMethod).reduce((s, o) => s + o.total, 0);
  const onlineRevenue = orders.filter(o => !o.paymentMethod).reduce((s, o) => s + o.total, 0);

  // Period label
  const periodLabel = (() => {
    if (period === 'all') return 'All Time';
    const d = new Date(selectedDate);
    if (period === 'daily') return d.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (period === 'weekly') {
      const start = new Date(d); start.setDate(start.getDate() - start.getDay());
      const end = new Date(start); end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return d.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' });
  })();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
              Financial Balance
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">Balance your sales revenue against expenses</p>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Period</label>
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {(['daily', 'weekly', 'monthly', 'all'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all capitalize ${
                    period === p ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          {period !== 'all' && (
            <div className="flex items-center gap-2">
              <button onClick={() => navigateDate(-1)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div className="text-center min-w-[140px]">
                <p className="text-sm font-bold text-gray-900">{periodLabel}</p>
              </div>
              <button onClick={() => navigateDate(1)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue */}
        <div className="bg-white rounded-xl border-2 border-green-200 p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">Sales Revenue</span>
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-green-700">{formatPrice(totalRevenue)}</p>
            <p className="text-xs text-green-500 mt-2">{orders.length} order(s) collected</p>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-xl border-2 border-red-200 p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm font-semibold text-red-700 uppercase tracking-wider">Total Expenses</span>
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-red-700">{formatPrice(totalExpenses)}</p>
            <p className="text-xs text-red-500 mt-2">{allExpenses.length} expense record(s)</p>
          </div>
        </div>

        {/* Net Balance */}
        <div className={`bg-white rounded-xl border-2 p-5 sm:p-6 relative overflow-hidden ${netBalance >= 0 ? 'border-emerald-300' : 'border-red-300'}`}>
          <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full ${netBalance >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${netBalance >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                <Scale className={`w-5 h-5 ${netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
              </div>
              <span className={`text-sm font-semibold uppercase tracking-wider ${netBalance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                Net Balance
              </span>
            </div>
            <p className={`text-3xl sm:text-4xl font-extrabold ${netBalance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {netBalance < 0 ? '-' : ''}{formatPrice(Math.abs(netBalance))}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${netBalance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {netBalance >= 0 ? '📈 PROFIT' : '📉 LOSS'}
              </span>
              {totalRevenue > 0 && (
                <span className={`text-xs font-medium ${netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {profitMargin.toFixed(1)}% margin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Balance Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Revenue vs Expenses Ratio</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Bar */}
          <div className="flex-1 w-full">
            <div className="relative w-full h-8 bg-red-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700 flex items-center justify-center"
                style={{ width: `${(1 - balanceRatio) * 100}%` }}
              >
                {totalRevenue > 0 && (
                  <span className="text-xs font-bold text-white truncate px-2">
                    {((1 - balanceRatio) * 100).toFixed(0)}% Revenue
                  </span>
                )}
              </div>
              {totalExpenses > 0 && (
                <div
                  className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-orange-500 rounded-full transition-all duration-700 flex items-center justify-end"
                  style={{ width: `${balanceRatio * 100}%` }}
                >
                  <span className="text-xs font-bold text-white truncate px-2">
                    {(balanceRatio * 100).toFixed(0)}% Expenses
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Labels */}
          <div className="flex gap-4 sm:flex-col sm:gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-xs text-gray-600 font-medium">Revenue: {formatPrice(totalRevenue)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-xs text-gray-600 font-medium">Expenses: {formatPrice(totalExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Expense Breakdown by Purpose */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-red-500" /> Expense Breakdown
          </h3>
          {topExpenses.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">No expenses recorded for this period</p>
          ) : (
            <div className="space-y-3">
              {topExpenses.map(([purpose, amount]) => {
                const pct = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-teal-500', 'bg-blue-500'];
                const colorIdx = topExpenses.findIndex(([p]) => p === purpose);
                return (
                  <div key={purpose}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{purpose}</span>
                      <span className="text-sm font-bold text-gray-900">{formatPrice(amount)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${colors[colorIdx % colors.length]}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{pct.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-green-500" /> Revenue Breakdown
          </h3>
          <div className="space-y-4">
            {/* POS Revenue */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Store className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-blue-700">In-Store / POS</span>
                </div>
                <span className="text-lg font-bold text-blue-800">{formatPrice(posRevenue)}</span>
              </div>
              <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalRevenue > 0 ? (posRevenue / totalRevenue) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-blue-500">{totalRevenue > 0 ? ((posRevenue / totalRevenue) * 100).toFixed(1) : 0}% of revenue</span>
            </div>

            {/* Online Revenue */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-purple-700">Online Orders</span>
                </div>
                <span className="text-lg font-bold text-purple-800">{formatPrice(onlineRevenue)}</span>
              </div>
              <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalRevenue > 0 ? (onlineRevenue / totalRevenue) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-purple-500">{totalRevenue > 0 ? ((onlineRevenue / totalRevenue) * 100).toFixed(1) : 0}% of revenue</span>
            </div>

            {/* Summary Row */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">Total Orders</span>
                <span className="text-lg font-bold text-gray-900">{orders.length}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-gray-700">Avg Order Value</span>
                <span className="text-lg font-bold text-gray-900">{orders.length > 0 ? formatPrice(totalRevenue / orders.length) : formatPrice(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Expenses Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Transaction Ledger</h3>
        {orders.length === 0 && allExpenses.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No transactions for this period</p>
        ) : (
          <div className="space-y-2">
            {/* Combine orders and expenses, sort by date */}
            {[
              ...orders.map(o => ({ type: 'income' as const, label: `Sale: ${o.product}`, date: o.date, amount: o.total, detail: `${o.customerName} · ${o.quantity}x` })),
              ...allExpenses.map(e => ({ type: 'expense' as const, label: `Expense: ${e.purpose}`, date: `${e.date}`, amount: e.amount, detail: e.salesRepName || 'Admin' })),
            ].sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 20)
            .map((item, i) => (
              <div key={i} className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${item.type === 'income' ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className="text-sm">{item.type === 'income' ? '↗' : '↘'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.detail}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.type === 'income' ? '+' : '-'}{formatPrice(item.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Expenses Manager ─────────────────────────────────────────
function ExpensesManager({ salesRepId, salesRepName }: { salesRepId?: string; salesRepName?: string }) {
  const [expenses, setExpenses] = useState<Expense[]>(getExpenses());
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editPurpose, setEditPurpose] = useState('');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');

  const purposes = getExpensePurposes();
  const isAdmin = !salesRepId;

  const filteredExpenses = expenses.filter(e => {
    if (salesRepId && e.salesRepId !== salesRepId) return false;
    if (filterType === 'all') return true;
    if (filterType === 'daily') return e.date === filterDate;
    if (filterType === 'weekly') {
      const d = new Date(filterDate);
      const start = new Date(d);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      const ed = new Date(e.date);
      return ed >= start && ed < end;
    }
    if (filterType === 'monthly') {
      const d = new Date(filterDate);
      return new Date(e.date).getMonth() === d.getMonth() && new Date(e.date).getFullYear() === d.getFullYear();
    }
    return true;
  });

  const totalFiltered = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const todayTotal = getDailyExpenses(new Date(), salesRepId).reduce((s, e) => s + e.amount, 0);
  const weekTotal = getWeeklyExpenses(new Date(), salesRepId).reduce((s, e) => s + e.amount, 0);
  const monthTotal = getMonthlyExpenses(new Date(), salesRepId).reduce((s, e) => s + e.amount, 0);

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    const p = purpose === 'Other' ? customPurpose : purpose;
    if (!p) return;
    addExpense(amt, p, salesRepId, salesRepName);
    setExpenses(getExpenses());
    setAmount('');
    setPurpose('');
    setCustomPurpose('');
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditAmount(expense.amount.toString());
    setEditPurpose(expense.purpose);
  };

  const handleSaveEdit = (id: string) => {
    const amt = parseFloat(editAmount);
    if (!amt || amt <= 0 || !editPurpose) return;
    updateExpense(id, amt, editPurpose);
    setExpenses(getExpenses());
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this expense?')) return;
    deleteExpense(id);
    setExpenses(getExpenses());
  };

  const exportExpensesCSV = () => {
    let csv = 'Expenses Report\n';
    csv += `Filter,${filterType}\n`;
    csv += `Total,${totalFiltered}\n\n`;
    csv += 'ID,Date,Purpose,Amount,Recorded By\n';
    filteredExpenses.forEach(e => {
      csv += `${e.id},${e.date},"${e.purpose}",${e.amount},${e.salesRepName || 'Admin'}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${filterType}-${filterDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
              {isAdmin ? 'Business Expenses' : 'My Expenses'}
            </h2>
            <p className="text-red-100 text-xs sm:text-sm mt-1">Track daily business expenses with purpose</p>
          </div>
          <button onClick={exportExpensesCSV}
            className="bg-white/20 hover:bg-white/30 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors self-start sm:self-auto">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <span className="text-xs text-gray-500">Today</span>
          <p className="text-lg sm:text-xl font-bold text-red-600 mt-1">{formatPrice(todayTotal)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <span className="text-xs text-gray-500">This Week</span>
          <p className="text-lg sm:text-xl font-bold text-orange-600 mt-1">{formatPrice(weekTotal)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <span className="text-xs text-gray-500">This Month</span>
          <p className="text-lg sm:text-xl font-bold text-amber-600 mt-1">{formatPrice(monthTotal)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <span className="text-xs text-gray-500">All Time</span>
          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">{formatPrice(getTotalExpenses(salesRepId))}</p>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-red-600" /> Add New Expense
          </h3>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">Auto-dated: {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1">Amount (₦)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Purpose</label>
            <select value={purpose} onChange={e => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500">
              <option value="">Select purpose...</option>
              {purposes.map(p => <option key={p} value={p}>{p}</option>)}
              <option value="Other">Other (custom)</option>
            </select>
          </div>
          {purpose === 'Other' && (
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Custom Purpose</label>
              <input type="text" value={customPurpose} onChange={e => setCustomPurpose(e.target.value)}
                placeholder="Describe expense..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" />
            </div>
          )}
          <div className="flex items-end">
            <button onClick={handleAdd}
              className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Filter & List */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Expense Records</h3>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex gap-1">
              {(['all', 'daily', 'weekly', 'monthly'] as const).map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    filterType === t ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
            {filterType !== 'all' && (
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500" />
            )}
          </div>
        </div>

        {/* Total bar */}
        <div className="bg-red-50 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-red-700">{filteredExpenses.length} expense(s)</span>
          <span className="text-sm font-bold text-red-700">Total: {formatPrice(totalFiltered)}</span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Wallet className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No expenses recorded for this period</p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto space-y-4">
            {(() => {
              const grouped = filteredExpenses.reduce((acc, exp) => {
                const d = exp.date;
                if (!acc[d]) acc[d] = [];
                acc[d].push(exp);
                return acc;
              }, {} as Record<string, typeof filteredExpenses>);
              const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
              return sortedDates.map(date => {
                const dayExpenses = grouped[date];
                const dayTotal = dayExpenses.reduce((s, e) => s + e.amount, 0);
                const dateObj = new Date(date + 'T00:00:00');
                const dayLabel = dateObj.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const isToday = date === new Date().toISOString().split('T')[0];
                return (
                  <div key={date}>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>{dayLabel}</span>
                        {isToday && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">TODAY</span>}
                      </div>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{dayExpenses.length} item{dayExpenses.length > 1 ? 's' : ''} · {formatPrice(dayTotal)}</span>
                    </div>
                    <div className="space-y-1.5">
                      {dayExpenses.map(expense => (
                        <div key={expense.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                            <Wallet className="w-4 h-4 text-red-600" />
                          </div>
                          {editingId === expense.id ? (
                            <div className="flex-1 flex flex-col sm:flex-row gap-2">
                              <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)}
                                className="w-28 px-2 py-1 border border-gray-300 rounded text-sm" />
                              <input type="text" value={editPurpose} onChange={e => setEditPurpose(e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" />
                              <div className="flex gap-1">
                                <button onClick={() => handleSaveEdit(expense.id)} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditingId(null)} className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <p className="font-medium text-gray-900 text-sm truncate">{expense.purpose}</p>
                                <span className="font-bold text-red-600 text-sm shrink-0">{formatPrice(expense.amount)}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-gray-500">{expense.salesRepName || 'Admin'}</span>
                                <span className="text-xs text-gray-400">·</span>
                                <span className="text-[10px] text-gray-400">{expense.id}</span>
                                {expense.createdAt && (
                                  <>
                                    <span className="text-xs text-gray-400">·</span>
                                    <span className="text-[10px] text-gray-400">{new Date(expense.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                          {editingId !== expense.id && (
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => handleEdit(expense)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDelete(expense.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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

// ─── Main Admin Dashboard ─────────────────────────────────────
interface AdminDashboardProps {
  onBack: () => void;
  isSuperAdmin?: boolean;
  currentUserName?: string;
  currentUserId?: string;
}

export default function AdminDashboard({ 
  onBack, 
  isSuperAdmin = true,
  currentUserName = 'Admin',
  currentUserId = 'ADMIN'
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const settings = getSettings();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'store-pos', label: 'Store POS', icon: Store },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
    { id: 'balance', label: 'Financial Balance', icon: Scale },
    { id: 'expenses', label: 'Expenses', icon: Wallet },
    { id: 'audit', label: 'Business Audit', icon: FileCheck },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'sales-reps', label: 'Sales Reps', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-64 bg-gray-900 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ maxHeight: '100vh', overscrollBehavior: 'contain' }}>
        {/* Sidebar Header - Fixed at top */}
        <div className="p-4 sm:p-5 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            {settings.businessLogo ? (
              <img src={settings.businessLogo} alt={settings.businessName} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-gray-700 shrink-0" />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-base sm:text-lg">{(settings.businessName || 'G').charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="min-w-0">
              <span className="text-white font-bold text-sm sm:text-base truncate block">{settings.businessName || 'G-Smile Bags'}</span>
              <p className="text-gray-500 text-[10px] sm:text-xs">Admin Panel</p>
            </div>
            {/* Close button on mobile */}
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* User Info */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-[10px] sm:text-xs">{currentUserName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs sm:text-sm font-medium truncate">{currentUserName}</p>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[10px] sm:text-xs text-gray-500 truncate">ID: {currentUserId}</span>
                  {isSuperAdmin && (
                    <span className="px-1 sm:px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] sm:text-[10px] rounded-full font-medium shrink-0">
                      SUPER
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 p-2 sm:p-4 space-y-0.5 sm:space-y-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer - Fixed at bottom */}
        <div className="p-2 sm:p-4 border-t border-gray-800 space-y-1 sm:space-y-2 shrink-0">
          <button onClick={onBack}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> View Website
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-sm sm:text-lg font-bold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={onBack}
                className="text-xs sm:text-sm text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">View Site</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{currentUserName}</p>
                  <p className="text-xs text-gray-500">{isSuperAdmin ? 'Super Admin' : 'Admin'}</p>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-[10px] sm:text-xs">{currentUserName.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'store-pos' && <StorePOS />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'reports' && <SalesReportsManager />}
          {activeTab === 'balance' && <FinancialBalance />}
          {activeTab === 'expenses' && <ExpensesManager />}
          {activeTab === 'audit' && <BusinessAuditing />}
          {activeTab === 'customers' && <CustomersManager />}
          {activeTab === 'sales-reps' && <SalesRepsManager />}
          {activeTab === 'testimonials' && <TestimonialsManager />}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab === 'my-orders' && (
            <div>
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-6">
                <h2 className="text-2xl font-bold">My Sales Log</h2>
                <p className="text-violet-100 text-sm mt-1">Review all POS and local sales logged by you</p>
              </div>
              <OrdersManager />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

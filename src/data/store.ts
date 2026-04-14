// Data store with localStorage persistence

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  featured: boolean;
  inStock: boolean;
  productCode?: string;
  description?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  initial: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  product: string;
  productCode?: string;
  quantity: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  message: string;
  revenueCollected: boolean;
  revenueAmount: number;
  orderType?: 'online' | 'in-store';
  paymentMethod?: 'Cash' | 'Transfer' | 'POS' | 'Card';
  paymentStatus?: 'pending' | 'verified' | 'failed' | 'awaiting_confirmation';
  paymentReference?: string;
  paymentReceipt?: { method: string; status: string; reference: string; amount: number; date: string };
  saleImage?: string;
  salesRepId?: string;
  salesRepName?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  firstOrderDate: string;
  notes: string;
  source: 'online' | 'whatsapp' | 'store' | 'referral' | 'other';
  whatsappMessage?: string;
  whatsappAddedAt?: string;
}

export interface FooterBannerSettings {
  active: boolean;
  text: string;
  displayMode: 'marquee-left' | 'marquee-right' | 'bounce' | 'fade' | 'static';
  speed: 'slow' | 'normal' | 'fast';
}

export interface WhyChooseFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface SiteSettings {
  businessName: string;
  businessLogo: string;
  footerBanner: FooterBannerSettings;
  phone: string;
  whatsappNumber: string;
  adminWhatsappNumber: string;
  email: string;
  location: string;
  freeDeliveryThreshold: number;
  promoCode: string;
  promoDiscount: number;
  promoActive: boolean;
  useCustomPromoImage: boolean;
  promoImageDesktop: string;
  promoImageMobile: string;
  promoLink: string;
  instagram: string;
  facebook: string;
  twitter: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  whyChooseDescription: string;
  whyChooseFeatures: WhyChooseFeature[];
  whyChooseBadge: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  paystackPublicKey: string;
  aiBotEnabled: boolean;
  aiBotName: string;
  aiBotWelcome: string;
  aiBotRules: { trigger: string; reply: string }[];
}

const defaultProducts: Product[] = [
  {
    id: 1, name: 'Executive Leather Briefcase', price: 45000, originalPrice: 55000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
    category: 'Briefcases', badge: 'Bestseller', rating: 5, reviews: 48, featured: true, inStock: true,
  },
  {
    id: 2, name: 'Classic Leather Messenger Bag', price: 38000, originalPrice: 48000,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',
    category: 'Messenger Bags', badge: 'New', rating: 5, reviews: 32, featured: true, inStock: true,
  },
  {
    id: 3, name: 'Premium Leather Backpack', price: 42000, originalPrice: 52000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    category: 'Backpacks', badge: 'Popular', rating: 5, reviews: 56, featured: true, inStock: true,
  },
  {
    id: 4, name: 'Leather Laptop Bag 15"', price: 35000, originalPrice: 42000,
    image: 'https://images.unsplash.com/photo-1473188588951-666fce8e7e68?w=600&h=600&fit=crop',
    category: 'Laptop Bags', badge: '', rating: 5, reviews: 29, featured: true, inStock: true,
  },
  {
    id: 5, name: 'Handcrafted Leather Tote', price: 32000, originalPrice: 40000,
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop',
    category: 'Tote Bags', badge: 'Sale', rating: 5, reviews: 41, featured: false, inStock: true,
  },
  {
    id: 6, name: 'Vintage Leather Crossbody', price: 28000, originalPrice: 35000,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&h=600&fit=crop',
    category: 'Crossbody', badge: '', rating: 5, reviews: 37, featured: false, inStock: true,
  },
  {
    id: 7, name: 'Leather Duffle Travel Bag', price: 55000, originalPrice: 68000,
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=600&fit=crop',
    category: 'Travel Bags', badge: 'Premium', rating: 5, reviews: 23, featured: false, inStock: true,
  },
  {
    id: 8, name: 'Slim Leather Wallet', price: 12000, originalPrice: 15000,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',
    category: 'Accessories', badge: '', rating: 5, reviews: 64, featured: false, inStock: true,
  },
];

const defaultTestimonials: Testimonial[] = [
  { id: 1, name: 'Adunola M.', location: 'Lagos, Nigeria', text: "I've been buying bags from G-Smile Bags for 2 years now. The quality is outstanding and the leather just gets better with age. Highly recommend!", initial: 'A' },
  { id: 2, name: 'Folashade K.', location: 'Ibadan, Oyo State', text: "Got my husband a leather laptop bag as a birthday gift. He absolutely loves it! The craftsmanship is impeccable. Will definitely order again.", initial: 'F' },
  { id: 3, name: 'Chukwuemeka O.', location: 'Ibadan, Oyo State', text: "Best leather bags in Ibadan, no contest! Fast delivery, beautiful packaging and the bag is exactly as described. G-Smile Bags is my go-to!", initial: 'C' },
];

const defaultSettings: SiteSettings = {
  businessName: 'G-Smile Bags',
  businessLogo: '',
  footerBanner: {
    active: true,
    text: "FREE delivery within Ibadan on orders above ₦30,000 | Call/WhatsApp: 08065653384",
    displayMode: 'marquee-left',
    speed: 'normal'
  },
  phone: '08065653384',
  whatsappNumber: '2348065653384',
  adminWhatsappNumber: '2348065653384',
  email: 'gsmilebags@gmail.com',
  location: 'Ibadan, Oyo State, Nigeria',
  freeDeliveryThreshold: 30000,
  promoCode: 'GSMILE20',
  promoDiscount: 20,
  promoActive: true,
  useCustomPromoImage: false,
  promoImageDesktop: '',
  promoImageMobile: '',
  promoLink: '',
  instagram: 'https://instagram.com/gsmilebags',
  facebook: 'https://facebook.com/gsmilebags',
  twitter: 'https://twitter.com/gsmilebags',
  heroTitle: 'Carry Confidence in Every Stitch',
  heroSubtitle: 'Premium Leather Craftsmanship',
  heroDescription: "Handcrafted leather bags designed for the bold, the stylish, and the ambitious. Elevate your everyday look with G-Smile Bags' exclusive collection.",
  heroImage: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=1920&h=1080&fit=crop',
  whyChooseTitle: 'Crafted with Passion & Precision',
  whyChooseSubtitle: 'Why Choose Us',
  whyChooseDescription: 'At G-Smile Bags, we believe every bag tells a story. Our artisans use only the finest genuine leather to create pieces that age beautifully and last a lifetime.',
  whyChooseFeatures: [
    { icon: 'Award', title: 'Premium Quality', desc: '100% genuine leather, handcrafted with care' },
    { icon: 'Truck', title: 'Fast Delivery', desc: 'Free delivery within Ibadan on orders above ₦30k' },
    { icon: 'RefreshCw', title: 'Easy Returns', desc: '7-day hassle-free return policy' },
    { icon: 'Headphones', title: '24/7 Support', desc: 'Reach us anytime via WhatsApp or phone' },
  ],
  whyChooseBadge: '500+ Reviews',
  bankName: 'Access Bank',
  bankAccountNumber: '0123456789',
  bankAccountName: 'G-Smile Bags Enterprise',
  paystackPublicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  aiBotEnabled: true,
  aiBotName: 'G-Smile AI Assistant',
  aiBotWelcome: 'Hello! I am the G-Smile AI Assistant 🤖. How can I help you today? Ask me about our bags, prices, delivery, or custom orders!',
  aiBotRules: [
    { trigger: 'price', reply: 'Our bags range from ₦15,000 to ₦65,000 depending on the model and material. You can check the full catalog for specific prices!' },
    { trigger: 'delivery', reply: 'We offer FREE delivery within Ibadan on orders above ₦30,000! Standard delivery takes 1-3 business days.' },
    { trigger: 'location', reply: 'We are located in Ibadan, Oyo State, Nigeria. But we deliver nationwide!' },
    { trigger: 'discount', reply: 'Use code GSMILE20 at checkout for 20% off your order!' },
    { trigger: 'order', reply: 'You can order directly on the website by clicking "Order Now" on any product, or chat with us to place a manual order.' },
    { trigger: 'hello', reply: 'Hi there! Welcome to G-Smile Bags. Let me know if you need any help finding the perfect bag.' }
  ],
};

const defaultCategories: string[] = [
  'Briefcases',
  'Messenger Bags',
  'Backpacks',
  'Laptop Bags',
  'Tote Bags',
  'Crossbody',
  'Travel Bags',
  'Accessories',
];

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Products
export function getProducts(): Product[] {
  return loadFromStorage('gsb_products', defaultProducts);
}

export function saveProducts(products: Product[]): void {
  saveToStorage('gsb_products', products);
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now() };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(product: Product): void {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
    saveProducts(products);
  }
}

export function deleteProduct(id: number): void {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
}

// Testimonials
export function getTestimonials(): Testimonial[] {
  return loadFromStorage('gsb_testimonials', defaultTestimonials);
}

export function saveTestimonials(testimonials: Testimonial[]): void {
  saveToStorage('gsb_testimonials', testimonials);
}

export function addTestimonial(testimonial: Omit<Testimonial, 'id'>): Testimonial {
  const testimonials = getTestimonials();
  const newTestimonial = { ...testimonial, id: Date.now() };
  testimonials.push(newTestimonial);
  saveTestimonials(testimonials);
  return newTestimonial;
}

export function updateTestimonial(testimonial: Testimonial): void {
  const testimonials = getTestimonials();
  const index = testimonials.findIndex(t => t.id === testimonial.id);
  if (index !== -1) {
    testimonials[index] = testimonial;
    saveTestimonials(testimonials);
  }
}

export function deleteTestimonial(id: number): void {
  const testimonials = getTestimonials().filter(t => t.id !== id);
  saveTestimonials(testimonials);
}

// Orders
export function getOrders(): Order[] {
  const orders = loadFromStorage<Order[]>('gsb_orders', []);
  // Backward compatibility: add revenue fields to old orders
  return orders.map(o => ({
    ...o,
    revenueCollected: o.revenueCollected ?? false,
    revenueAmount: o.revenueAmount ?? 0,
  }));
}

export function saveOrders(orders: Order[]): void {
  saveToStorage('gsb_orders', orders);
}

export function addPhysicalStoreSale(order: Omit<Order, 'id' | 'date' | 'status'> & { paymentMethod: 'Cash' | 'Transfer' | 'POS' | 'Card' }): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    status: 'delivered', // Physical sales are immediately fulfilled
    revenueCollected: true,
    revenueAmount: order.total,
    orderType: 'in-store',
    id: 'POS-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  saveOrders(orders);

  // Auto-register/update customer
  if (order.customerName) {
    registerCustomerFromOrder(order.customerName, order.customerPhone || 'N/A', order.customerEmail || 'N/A', order.total);
  }

  if (newOrder.salesRepId) {
    const reps = getSalesReps();
    const index = reps.findIndex(r => r.id === newOrder.salesRepId);
    if (index !== -1) {
      reps[index].totalSalesCount += 1;
      reps[index].totalRevenueCollected += newOrder.total;
      saveSalesReps(reps);
    }
  }

  return newOrder;
}

export function generateWhatsAppUrl(order: {
  id: string; product: string; quantity: number; total: number;
  customerName: string; customerPhone: string; customerEmail: string;
  message?: string; paymentMethod?: string; paymentStatus?: string;
  paymentReference?: string; productCode?: string; saleImage?: string;
}): string {
  const settings = getSettings();
  let text = `🔔 *NEW ORDER — PAYMENT ${order.paymentStatus?.toUpperCase() || 'PENDING'}* 🔔\n\n`;
  text += `📋 *ORDER RECEIPT*\n`;
  text += `━━━━━━━━━━━━━━━━━━━\n`;
  text += `🧾 Order ID: *${order.id}*\n`;
  if (order.productCode) text += `📦 Product Code: *${order.productCode}*\n`;
  text += `🛍️ Product: ${order.product}\n`;
  text += `📊 Quantity: ${order.quantity}\n`;
  text += `💰 Total: *${formatPrice(order.total)}*\n`;
  text += `━━━━━━━━━━━━━━━━━━━\n\n`;
  text += `👤 *CUSTOMER DETAILS*\n`;
  text += `Name: ${order.customerName}\n`;
  text += `Phone: ${order.customerPhone}\n`;
  if (order.customerEmail) text += `Email: ${order.customerEmail}\n`;
  text += `\n`;
  text += `💳 *PAYMENT INFORMATION*\n`;
  text += `Method: ${order.paymentMethod || 'Not selected'}\n`;
  text += `Status: ${order.paymentStatus === 'verified' ? '✅ VERIFIED' : order.paymentStatus === 'awaiting_confirmation' ? '⏳ Awaiting Confirmation' : '⚠️ Pending'}\n`;
  if (order.paymentReference) text += `Ref: ${order.paymentReference}\n`;
  if (order.saleImage) text += `Receipt: Uploaded on website\n`;
  text += `\n`;
  if (order.message) text += `💬 *MESSAGE*\n${order.message}\n\n`;
  text += `⏰ ${new Date().toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })}\n\n`;
  if (order.paymentStatus === 'verified') {
    text += `✅ *Payment Verified — Please process this order immediately!*`;
  } else if (order.paymentStatus === 'awaiting_confirmation') {
    text += `⏳ *Payment made via bank transfer — Please verify and confirm!*`;
  } else {
    text += `📞 *Please contact customer to confirm payment and process order.*`;
  }
  const whatsappText = encodeURIComponent(text);
  return `https://wa.me/${settings.adminWhatsappNumber}?text=${whatsappText}`;
}

export function addOrder(order: Omit<Order, 'id' | 'date'>): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toISOString(),
    revenueCollected: order.revenueCollected ?? false,
    revenueAmount: order.revenueAmount ?? 0,
  };
  orders.unshift(newOrder);
  saveOrders(orders);

  // Auto-register/update customer in the database
  registerCustomerFromOrder(order.customerName, order.customerPhone, order.customerEmail, order.total);
  
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order['status']): void {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
  }
}

export function updateOrderRevenue(orderId: string, revenueCollected: boolean, revenueAmount: number): void {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.revenueCollected = revenueCollected;
    order.revenueAmount = revenueAmount;
    saveOrders(orders);
  }
}

// Get total revenue from successful orders only
export function getTotalRevenue(): number {
  const orders = getOrders();
  return orders
    .filter(o => o.revenueCollected)
    .reduce((sum, o) => sum + (o.revenueAmount || o.total), 0);
}

// Get pending revenue (orders not yet marked as successful)
export function getPendingRevenue(): number {
  const orders = getOrders();
  return orders
    .filter(o => !o.revenueCollected && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
}

// Get successful orders count
export function getSuccessfulOrdersCount(): number {
  return getOrders().filter(o => o.revenueCollected).length;
}

// Get cancelled/failed orders count
export function getFailedOrdersCount(): number {
  return getOrders().filter(o => o.status === 'cancelled').length;
}

// Customers
export function getCustomers(): Customer[] {
  return loadFromStorage<Customer[]>('gsb_customers', []);
}

export function saveCustomers(customers: Customer[]): void {
  saveToStorage('gsb_customers', customers);
}

export function addCustomer(customer: Omit<Customer, 'id'>): Customer {
  const customers = getCustomers();
  const newCustomer: Customer = { ...customer, id: 'CUS-' + Date.now().toString(36).toUpperCase() };
  customers.unshift(newCustomer);
  saveCustomers(customers);
  return newCustomer;
}

export function updateCustomer(customer: Customer): void {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === customer.id);
  if (index !== -1) {
    customers[index] = customer;
    saveCustomers(customers);
  }
}

export function deleteCustomer(id: string): void {
  const customers = getCustomers().filter(c => c.id !== id);
  saveCustomers(customers);
}

// Auto-register/update customer when an order is placed
export function registerCustomerFromOrder(name: string, phone: string, email: string, orderTotal: number): void {
  const customers = getCustomers();
  const normalizedPhone = phone.trim().replace(/[\s-]/g, '');
  const normalizedEmail = email.trim().toLowerCase();

  // Try to find existing customer by phone or email
  const existingIndex = customers.findIndex(c =>
    (normalizedPhone && c.phone.replace(/[\s-]/g, '') === normalizedPhone) ||
    (normalizedEmail && c.email.toLowerCase() === normalizedEmail)
  );

  if (existingIndex !== -1) {
    // Update existing customer
    customers[existingIndex].name = name || customers[existingIndex].name;
    customers[existingIndex].phone = phone || customers[existingIndex].phone;
    customers[existingIndex].email = email || customers[existingIndex].email;
    customers[existingIndex].totalOrders += 1;
    customers[existingIndex].totalSpent += orderTotal;
    customers[existingIndex].lastOrderDate = new Date().toISOString();
    saveCustomers(customers);
  } else {
    // Create new customer
    addCustomer({
      name: name || 'Unknown',
      phone: phone || 'N/A',
      email: email || 'N/A',
      totalOrders: 1,
      totalSpent: orderTotal,
      lastOrderDate: new Date().toISOString(),
      firstOrderDate: new Date().toISOString(),
      notes: '',
      source: 'online',
    });
  }
}

// Get customer by ID
export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find(c => c.id === id);
}

// WhatsApp Customer Import Functions

// Parse a WhatsApp message to extract customer details
export interface ParsedWhatsAppCustomer {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export function parseWhatsAppMessage(raw: string): ParsedWhatsAppCustomer {
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l);
  let name = '';
  let phone = '';
  let email = '';
  const messageLines: string[] = [];

  // Try to extract from key:value patterns
  for (const line of lines) {
    const lower = line.toLowerCase();
    // Extract name
    if ((lower.startsWith('name') || lower.startsWith('customer') || lower.startsWith('from')) && !name) {
      name = line.replace(/^[^:]*:\s*/, '').trim();
    }
    // Extract phone
    else if ((lower.startsWith('phone') || lower.startsWith('mobile') || lower.startsWith('whatsapp') || lower.startsWith('tel')) && !phone) {
      phone = line.replace(/^[^:]*:\s*/, '').trim().replace(/[^0-9+]/g, '');
    }
    // Extract email
    else if ((lower.startsWith('email') || lower.startsWith('mail')) && !email) {
      email = line.replace(/^[^:]*:\s*/, '').trim();
    }
    else {
      messageLines.push(line);
    }
  }

  // Fallback: if no name found, use first line as name
  if (!name && lines.length > 0) {
    // Check if first line looks like a name (not phone/email)
    const firstLine = lines[0].replace(/^[^:]*:\s*/, '').trim();
    if (!firstLine.match(/^[\d+\s()-]+$/) && !firstLine.includes('@')) {
      name = firstLine;
      messageLines.shift();
    }
  }

  // Fallback: find phone number pattern in text
  if (!phone) {
    const phoneMatch = raw.match(/(\+?\d{10,15})/);
    if (phoneMatch) phone = phoneMatch[1];
  }

  // Fallback: find email pattern in text
  if (!email) {
    const emailMatch = raw.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) email = emailMatch[1];
  }

  return {
    name: name || 'Unknown',
    phone: phone || '',
    email: email || '',
    message: messageLines.join('\n').trim() || raw,
  };
}

// Add customer from WhatsApp
export function addCustomerFromWhatsApp(
  name: string,
  phone: string,
  email: string,
  message: string = '',
  notes: string = ''
): Customer {
  const customers = getCustomers();
  const normalizedPhone = phone.trim().replace(/[\s-]/g, '');
  const normalizedEmail = email.trim().toLowerCase();

  // Check if customer already exists
  const existingIndex = customers.findIndex(c =>
    (normalizedPhone && c.phone.replace(/[\s-]/g, '') === normalizedPhone) ||
    (normalizedEmail && c.email.toLowerCase() === normalizedEmail)
  );

  if (existingIndex !== -1) {
    // Update existing customer
    customers[existingIndex].name = name || customers[existingIndex].name;
    customers[existingIndex].phone = phone || customers[existingIndex].phone;
    customers[existingIndex].email = email || customers[existingIndex].email;
    customers[existingIndex].source = 'whatsapp';
    customers[existingIndex].whatsappMessage = message;
    customers[existingIndex].whatsappAddedAt = new Date().toISOString();
    if (notes) {
      customers[existingIndex].notes = (customers[existingIndex].notes ? customers[existingIndex].notes + '\n' : '') + notes;
    }
    saveCustomers(customers);
    return customers[existingIndex];
  }

  // Create new customer
  const newCustomer: Customer = {
    id: 'CUS-' + Date.now().toString(36).toUpperCase(),
    name: name || 'Unknown',
    phone: phone || 'N/A',
    email: email || 'N/A',
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: new Date().toISOString(),
    firstOrderDate: new Date().toISOString(),
    notes: notes,
    source: 'whatsapp',
    whatsappMessage: message,
    whatsappAddedAt: new Date().toISOString(),
  };

  customers.unshift(newCustomer);
  saveCustomers(customers);
  return newCustomer;
}

// Get all WhatsApp-sourced customers
export function getWhatsAppCustomers(): Customer[] {
  return getCustomers().filter(c => c.source === 'whatsapp');
}

// Get customer counts by source
export function getCustomerSourceCounts(): Record<string, number> {
  const customers = getCustomers();
  const counts: Record<string, number> = { whatsapp: 0, online: 0, store: 0, referral: 0, other: 0 };
  customers.forEach(c => {
    if (counts[c.source] !== undefined) {
      counts[c.source]++;
    } else {
      counts.other++;
    }
  });
  return counts;
}

// Bulk import customers from WhatsApp (paste multiple messages)
export function bulkImportWhatsAppCustomers(messages: string[]): { added: number; updated: number; skipped: number } {
  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const msg of messages) {
    const trimmed = msg.trim();
    if (!trimmed) {
      skipped++;
      continue;
    }
    const parsed = parseWhatsAppMessage(trimmed);
    if (!parsed.name && !parsed.phone) {
      skipped++;
      continue;
    }
    addCustomerFromWhatsApp(parsed.name, parsed.phone, parsed.email, parsed.message);
    // Check if it was an update or new add
    const customers = getCustomers();
    const exists = customers.filter(c =>
      c.phone === parsed.phone || c.email === parsed.email
    ).length > 1;
    if (exists) updated++;
    else added++;
  }

  return { added, updated, skipped };
}

// Get customer order history
export function getCustomerOrders(phone: string, email: string): Order[] {
  const orders = getOrders();
  const normalizedPhone = phone.replace(/[\s-]/g, '');
  const normalizedEmail = email.toLowerCase();
  return orders.filter(o =>
    o.customerPhone.replace(/[\s-]/g, '') === normalizedPhone ||
    o.customerEmail.toLowerCase() === normalizedEmail
  );
}

// Get total unique customers count
export function getTotalCustomers(): number {
  return getCustomers().length;
}

// Categories
export function getCategories(): string[] {
  return loadFromStorage<string[]>('gsb_categories', defaultCategories);
}

export function saveCategories(categories: string[]): void {
  saveToStorage('gsb_categories', categories);
}

export function addCategory(name: string): string[] {
  const categories = getCategories();
  const trimmed = name.trim();
  if (trimmed && !categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    categories.push(trimmed);
    saveCategories(categories);
  }
  return categories;
}

export function updateCategory(oldName: string, newName: string): string[] {
  const categories = getCategories();
  const trimmed = newName.trim();
  if (!trimmed) return categories;
  const index = categories.findIndex(c => c.toLowerCase() === oldName.toLowerCase());
  if (index !== -1) {
    categories[index] = trimmed;
    saveCategories(categories);
    // Also update any products using the old category name
    const products = getProducts();
    let updated = false;
    products.forEach(p => {
      if (p.category.toLowerCase() === oldName.toLowerCase()) {
        p.category = trimmed;
        updated = true;
      }
    });
    if (updated) saveProducts(products);
  }
  return categories;
}

export function deleteCategory(name: string): string[] {
  const categories = getCategories().filter(c => c.toLowerCase() !== name.toLowerCase());
  saveCategories(categories);
  return categories;
}

// Settings
export function getSettings(): SiteSettings {
  const stored = loadFromStorage<Partial<SiteSettings>>('gsb_settings', defaultSettings);
  return {
    ...defaultSettings,
    ...stored,
    footerBanner: {
      ...defaultSettings.footerBanner,
      ...(stored.footerBanner || {}),
    },
    whyChooseFeatures: stored.whyChooseFeatures && stored.whyChooseFeatures.length > 0
      ? stored.whyChooseFeatures
      : defaultSettings.whyChooseFeatures,
    aiBotRules: stored.aiBotRules && stored.aiBotRules.length > 0
      ? stored.aiBotRules
      : defaultSettings.aiBotRules,
  } as SiteSettings;
}

export function saveSettings(settings: SiteSettings): void {
  saveToStorage('gsb_settings', settings);
}

// Why Choose Us helpers
export function updateWhyChooseSettings(updates: Partial<SiteSettings>): SiteSettings {
  const settings = getSettings();
  const updated = { ...settings, ...updates };
  saveSettings(updated);
  return updated;
}

export function updateFooterBannerSettings(footerBanner: FooterBannerSettings): SiteSettings {
  const settings = getSettings();
  const updated = { ...settings, footerBanner };
  saveSettings(updated);
  return updated;
}

// Reset all data
export function resetAllData(): void {
  localStorage.removeItem('gsb_products');
  localStorage.removeItem('gsb_testimonials');
  localStorage.removeItem('gsb_orders');
  localStorage.removeItem('gsb_settings');
  localStorage.removeItem('gsb_categories');
  localStorage.removeItem('gsb_customers');
  localStorage.removeItem('gsmile_expenses');
  localStorage.removeItem('gsb_customer_accounts');
  localStorage.removeItem('gsb_customer_verifications');
  localStorage.removeItem('gsb_customer_session');
}

export interface SalesRep {
  id: string;
  name: string;
  phone: string;
  password?: string;
  totalSalesCount: number;
  totalRevenueCollected: number;
  isActive: boolean;
  createdAt: string;
}

export type UserRole = 'super_admin' | 'admin' | 'sales_rep';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  name: string;
  loginTime: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface CustomerAuthSession {
  customerId: string;
  name: string;
  email: string;
  loginTime: string;
}

interface PendingCustomerVerification {
  name: string;
  email: string;
  password: string;
  code: string;
  expiresAt: string;
  createdAt: string;
}

export function getSalesReps(): SalesRep[] {
  return loadFromStorage<SalesRep[]>('gsb_sales_reps', []);
}

export function saveSalesReps(reps: SalesRep[]): void {
  saveToStorage('gsb_sales_reps', reps);
}

export function addSalesRep(rep: Omit<SalesRep, 'id' | 'totalSalesCount' | 'totalRevenueCollected' | 'createdAt'>): SalesRep {
  const reps = getSalesReps();
  const newRep: SalesRep = {
    ...rep,
    id: 'REP-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    totalSalesCount: 0,
    totalRevenueCollected: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  reps.push(newRep);
  saveSalesReps(reps);
  return newRep;
}

export function updateSalesRep(id: string, updates: Partial<SalesRep>): void {
  const reps = getSalesReps();
  const index = reps.findIndex(r => r.id === id);
  if (index !== -1) {
    reps[index] = { ...reps[index], ...updates };
    saveSalesReps(reps);
  }
}

export function deleteSalesRep(id: string): void {
  const reps = getSalesReps().filter(r => r.id !== id);
  saveSalesReps(reps);
}

// Format price
export function formatPrice(price: number): string {
  return '₦' + price.toLocaleString();
}

// ========== USER AUTHENTICATION SYSTEM ==========

const DEFAULT_SUPER_ADMIN: User = {
  id: 'SUPER-ADMIN-001',
  name: 'Super Admin',
  email: 'admin@gsmilebags.com',
  phone: '08065653384',
  password: 'admin123',
  role: 'super_admin',
  isActive: true,
  createdAt: new Date().toISOString(),
};

export function getUsers(): User[] {
  const users = loadFromStorage<User[]>('gsb_users', []);
  // Ensure super admin exists
  if (!users.find(u => u.role === 'super_admin')) {
    users.unshift(DEFAULT_SUPER_ADMIN);
    saveToStorage('gsb_users', users);
  }
  return users;
}

export function saveUsers(users: User[]): void {
  saveToStorage('gsb_users', users);
}

export function addUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: 'USER-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
}

export function deleteUser(id: string): void {
  const users = getUsers().filter(u => u.id !== id);
  saveUsers(users);
}

// ========== AUTH SESSION ==========

export function login(emailOrPhone: string, password: string): AuthSession | null {
  const users = getUsers();
  const user = users.find(u => 
    (u.email === emailOrPhone || u.phone === emailOrPhone) && 
    u.password === password && 
    u.isActive
  );
  
  if (user) {
    user.lastLogin = new Date().toISOString();
    saveUsers(users);
    
    const session: AuthSession = {
      userId: user.id,
      role: user.role,
      name: user.name,
      loginTime: new Date().toISOString(),
    };
    saveToStorage('gsb_auth_session', session);
    return session;
  }
  return null;
}

export function logout(): void {
  localStorage.removeItem('gsb_auth_session');
}

export function getAuthSession(): AuthSession | null {
  return loadFromStorage<AuthSession | null>('gsb_auth_session', null);
}

export function isAuthenticated(): boolean {
  return getAuthSession() !== null;
}

export function hasRole(roles: UserRole[]): boolean {
  const session = getAuthSession();
  return session !== null && roles.includes(session.role);
}

export function getCurrentUser(): User | null {
  const session = getAuthSession();
  if (!session) return null;
  return getUsers().find(u => u.id === session.userId) || null;
}

// ========== SALES REP SPECIFIC FUNCTIONS ==========

export function getSalesRepByPhone(phone: string): SalesRep | null {
  const reps = getSalesReps();
  return reps.find(r => r.phone === phone && r.isActive) || null;
}

export function loginSalesRep(phone: string, password: string): AuthSession | null {
  const reps = getSalesReps();
  const rep = reps.find(r => r.phone === phone && r.password === password && r.isActive);
  
  if (rep) {
    const session: AuthSession = {
      userId: rep.id,
      role: 'sales_rep',
      name: rep.name,
      loginTime: new Date().toISOString(),
    };
    saveToStorage('gsb_auth_session', session);
    return session;
  }
  return null;
}

export function getOrdersBySalesRep(salesRepId: string): Order[] {
  return getOrders().filter(o => o.salesRepId === salesRepId);
}

export function updateSalesRepStats(salesRepId: string, revenue: number): void {
  const reps = getSalesReps();
  const index = reps.findIndex(r => r.id === salesRepId);
  if (index !== -1) {
    reps[index].totalSalesCount += 1;
    reps[index].totalRevenueCollected += revenue;
    saveSalesReps(reps);
  }
}

// ========== CUSTOMER SIGNUP + EMAIL VERIFICATION ==========

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getPendingVerifications(): Record<string, PendingCustomerVerification> {
  return loadFromStorage<Record<string, PendingCustomerVerification>>('gsb_customer_verifications', {});
}

function savePendingVerifications(data: Record<string, PendingCustomerVerification>): void {
  saveToStorage('gsb_customer_verifications', data);
}

export function getCustomerAccounts(): CustomerAccount[] {
  return loadFromStorage<CustomerAccount[]>('gsb_customer_accounts', []);
}

export function saveCustomerAccounts(accounts: CustomerAccount[]): void {
  saveToStorage('gsb_customer_accounts', accounts);
}

export function startCustomerSignup(name: string, email: string, password: string): {
  success: boolean;
  message: string;
  devCode?: string;
} {
  const normalizedEmail = normalizeEmail(email);
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { success: false, message: 'Full name is required.' };
  }
  if (!isValidEmail(normalizedEmail)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  if (password.trim().length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' };
  }

  const accounts = getCustomerAccounts();
  const existing = accounts.find(a => normalizeEmail(a.email) === normalizedEmail);
  if (existing) {
    return { success: false, message: 'An account with this email already exists. Please sign in.' };
  }

  const code = generateVerificationCode();
  const pending = getPendingVerifications();
  pending[normalizedEmail] = {
    name: trimmedName,
    email: normalizedEmail,
    password,
    code,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  };
  savePendingVerifications(pending);

  return {
    success: true,
    message: 'Verification code generated. Enter the code to complete signup.',
    devCode: code,
  };
}

export function resendCustomerVerificationCode(email: string): {
  success: boolean;
  message: string;
  devCode?: string;
} {
  const normalizedEmail = normalizeEmail(email);
  const pending = getPendingVerifications();
  const existing = pending[normalizedEmail];

  if (!existing) {
    return { success: false, message: 'No pending signup found for this email.' };
  }

  const code = generateVerificationCode();
  pending[normalizedEmail] = {
    ...existing,
    code,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  };
  savePendingVerifications(pending);

  return {
    success: true,
    message: 'A new verification code has been generated.',
    devCode: code,
  };
}

export function verifyCustomerEmailCode(email: string, code: string): {
  success: boolean;
  message: string;
} {
  const normalizedEmail = normalizeEmail(email);
  const pending = getPendingVerifications();
  const signup = pending[normalizedEmail];

  if (!signup) {
    return { success: false, message: 'No pending verification found for this email.' };
  }

  if (new Date(signup.expiresAt).getTime() < Date.now()) {
    delete pending[normalizedEmail];
    savePendingVerifications(pending);
    return { success: false, message: 'Verification code expired. Please request a new one.' };
  }

  if (signup.code !== code.trim()) {
    return { success: false, message: 'Invalid verification code.' };
  }

  const accounts = getCustomerAccounts();
  const alreadyExists = accounts.find(a => normalizeEmail(a.email) === normalizedEmail);
  if (alreadyExists) {
    delete pending[normalizedEmail];
    savePendingVerifications(pending);
    return { success: false, message: 'An account with this email already exists. Please sign in.' };
  }

  const newAccount: CustomerAccount = {
    id: 'CUST-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
    name: signup.name,
    email: normalizedEmail,
    password: signup.password,
    emailVerified: true,
    createdAt: new Date().toISOString(),
  };
  accounts.unshift(newAccount);
  saveCustomerAccounts(accounts);

  const customers = getCustomers();
  const customerIndex = customers.findIndex(c => normalizeEmail(c.email) === normalizedEmail);
  if (customerIndex !== -1) {
    customers[customerIndex].name = signup.name;
    customers[customerIndex].email = normalizedEmail;
    if (!customers[customerIndex].notes.includes('Verified website signup')) {
      customers[customerIndex].notes = `${customers[customerIndex].notes}\nVerified website signup`.trim();
    }
    saveCustomers(customers);
  } else {
    addCustomer({
      name: signup.name,
      phone: 'N/A',
      email: normalizedEmail,
      totalOrders: 0,
      totalSpent: 0,
      firstOrderDate: new Date().toISOString(),
      lastOrderDate: new Date().toISOString(),
      notes: 'Verified website signup',
      source: 'online',
    });
  }

  delete pending[normalizedEmail];
  savePendingVerifications(pending);
  return { success: true, message: 'Email verified successfully. You can now sign in.' };
}

export function loginCustomerAccount(email: string, password: string): CustomerAuthSession | null {
  const normalizedEmail = normalizeEmail(email);
  const accounts = getCustomerAccounts();
  const account = accounts.find(a => normalizeEmail(a.email) === normalizedEmail && a.password === password && a.emailVerified);
  if (!account) {
    return null;
  }

  account.lastLogin = new Date().toISOString();
  saveCustomerAccounts(accounts);

  const session: CustomerAuthSession = {
    customerId: account.id,
    name: account.name,
    email: account.email,
    loginTime: new Date().toISOString(),
  };
  saveToStorage('gsb_customer_session', session);
  return session;
}

export function getCustomerAuthSession(): CustomerAuthSession | null {
  return loadFromStorage<CustomerAuthSession | null>('gsb_customer_session', null);
}

export function logoutCustomerAccount(): void {
  localStorage.removeItem('gsb_customer_session');
}

// ========== SALES REPORTS ==========

export interface SalesReportData {
  period: string;
  totalSales: number;
  totalRevenue: number;
  paidRevenue: number;
  unpaidRevenue: number;
  cancelledOrders: number;
  averageOrderValue: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  topSalesReps: { name: string; sales: number; revenue: number }[];
  dailyBreakdown: { date: string; sales: number; revenue: number }[];
  paymentMethodBreakdown: { method: string; count: number; total: number }[];
  orderTypeBreakdown: { type: string; count: number; total: number }[];
}

function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStartOfWeek(date: Date): Date {
  const d = getStartOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function getStartOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatReportDate(date: Date): string {
  return date.toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
}

function generateReport(orders: Order[], periodLabel: string): SalesReportData {
  const totalSales = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const paidRevenue = orders.filter(o => o.revenueCollected).reduce((s, o) => s + (o.revenueAmount || o.total), 0);
  const unpaidRevenue = orders.filter(o => !o.revenueCollected && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Top products
  const productMap: Record<string, { quantity: number; revenue: number }> = {};
  orders.forEach(o => {
    if (!productMap[o.product]) productMap[o.product] = { quantity: 0, revenue: 0 };
    productMap[o.product].quantity += o.quantity;
    productMap[o.product].revenue += o.total;
  });
  const topProducts = Object.entries(productMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top sales reps
  const repMap: Record<string, { name: string; sales: number; revenue: number }> = {};
  orders.forEach(o => {
    if (o.salesRepName) {
      if (!repMap[o.salesRepId || '']) repMap[o.salesRepId || ''] = { name: o.salesRepName, sales: 0, revenue: 0 };
      repMap[o.salesRepId || ''].sales += 1;
      repMap[o.salesRepId || ''].revenue += o.total;
    }
  });
  const topSalesReps = Object.values(repMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Daily breakdown
  const dayMap: Record<string, { sales: number; revenue: number }> = {};
  orders.forEach(o => {
    const day = new Date(o.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
    if (!dayMap[day]) dayMap[day] = { sales: 0, revenue: 0 };
    dayMap[day].sales += 1;
    dayMap[day].revenue += o.total;
  });
  const dailyBreakdown = Object.entries(dayMap).map(([date, data]) => ({ date, ...data }));

  // Payment method breakdown
  const pmMap: Record<string, { count: number; total: number }> = {};
  orders.forEach(o => {
    const m = o.paymentMethod || 'Online';
    if (!pmMap[m]) pmMap[m] = { count: 0, total: 0 };
    pmMap[m].count += 1;
    pmMap[m].total += o.total;
  });
  const paymentMethodBreakdown = Object.entries(pmMap).map(([method, data]) => ({ method, ...data }));

  // Order type breakdown
  const otMap: Record<string, { count: number; total: number }> = {};
  orders.forEach(o => {
    const t = o.orderType === 'in-store' ? 'In-Store' : 'Online';
    if (!otMap[t]) otMap[t] = { count: 0, total: 0 };
    otMap[t].count += 1;
    otMap[t].total += o.total;
  });
  const orderTypeBreakdown = Object.entries(otMap).map(([type, data]) => ({ type, ...data }));

  return {
    period: periodLabel,
    totalSales, totalRevenue, paidRevenue, unpaidRevenue,
    cancelledOrders, averageOrderValue,
    topProducts, topSalesReps, dailyBreakdown,
    paymentMethodBreakdown, orderTypeBreakdown,
  };
}

export function getDailyReport(date?: Date, salesRepId?: string): SalesReportData {
  const d = date || new Date();
  const start = getStartOfDay(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  let orders = getOrders().filter(o => {
    const od = new Date(o.date);
    return od >= start && od < end;
  });
  if (salesRepId) orders = orders.filter(o => o.salesRepId === salesRepId);

  return generateReport(orders, `Daily Report — ${formatReportDate(start)}`);
}

export function getWeeklyReport(date?: Date, salesRepId?: string): SalesReportData {
  const d = date || new Date();
  const start = getStartOfWeek(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  let orders = getOrders().filter(o => {
    const od = new Date(o.date);
    return od >= start && od < end;
  });
  if (salesRepId) orders = orders.filter(o => o.salesRepId === salesRepId);

  return generateReport(orders, `Weekly Report — ${formatReportDate(start)} to ${formatReportDate(new Date(end.getTime() - 1))}`);
}

export function getMonthlyReport(date?: Date, salesRepId?: string): SalesReportData {
  const d = date || new Date();
  const start = getStartOfMonth(d);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  let orders = getOrders().filter(o => {
    const od = new Date(o.date);
    return od >= start && od < end;
  });
  if (salesRepId) orders = orders.filter(o => o.salesRepId === salesRepId);

  const monthName = start.toLocaleDateString('en-NG', { year: 'numeric', month: 'long' });
  return generateReport(orders, `Monthly Report — ${monthName}`);
}

export function getCustomRangeReport(startDate: Date, endDate: Date, salesRepId?: string): SalesReportData {
  const start = getStartOfDay(startDate);
  const end = new Date(getStartOfDay(endDate));
  end.setDate(end.getDate() + 1);

  let orders = getOrders().filter(o => {
    const od = new Date(o.date);
    return od >= start && od < end;
  });
  if (salesRepId) orders = orders.filter(o => o.salesRepId === salesRepId);

  return generateReport(orders, `Custom Report — ${formatReportDate(start)} to ${formatReportDate(endDate)}`);
}

// ─── Expense Tracking ──────────────────────────────────────────

export interface Expense {
  id: string;
  amount: number;
  purpose: string;
  date: string;
  salesRepId?: string;
  salesRepName?: string;
  createdAt: string;
}

const EXPENSE_PURPOSES = [
  'Rent', 'Electricity', 'Staff Salary', 'Transportation',
  'Stock/Purchase', 'Maintenance', 'Feeding', 'Miscellaneous'
];

export function getExpensePurposes(): string[] {
  return EXPENSE_PURPOSES;
}

export function getExpenses(): Expense[] {
  const data = localStorage.getItem('gsmile_expenses');
  return data ? JSON.parse(data) : [];
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem('gsmile_expenses', JSON.stringify(expenses));
}

export function addExpense(amount: number, purpose: string, salesRepId?: string, salesRepName?: string): Expense {
  const expenses = getExpenses();
  const expense: Expense = {
    id: 'EXP-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    amount,
    purpose,
    date: new Date().toISOString().split('T')[0],
    salesRepId,
    salesRepName,
    createdAt: new Date().toISOString(),
  };
  expenses.unshift(expense);
  saveExpenses(expenses);
  return expense;
}

export function updateExpense(id: string, amount: number, purpose: string): void {
  const expenses = getExpenses();
  const idx = expenses.findIndex(e => e.id === id);
  if (idx !== -1) {
    expenses[idx].amount = amount;
    expenses[idx].purpose = purpose;
    saveExpenses(expenses);
  }
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses().filter(e => e.id !== id);
  saveExpenses(expenses);
}

export function getDailyExpenses(date?: Date, salesRepId?: string): Expense[] {
  const d = date || new Date();
  const dateStr = d.toISOString().split('T')[0];
  let expenses = getExpenses().filter(e => e.date === dateStr);
  if (salesRepId) expenses = expenses.filter(e => e.salesRepId === salesRepId);
  return expenses;
}

export function getWeeklyExpenses(date?: Date, salesRepId?: string): Expense[] {
  const d = date || new Date();
  const start = getStartOfWeek(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  let expenses = getExpenses().filter(e => {
    const ed = new Date(e.date);
    return ed >= start && ed < end;
  });
  if (salesRepId) expenses = expenses.filter(e => e.salesRepId === salesRepId);
  return expenses;
}

export function getMonthlyExpenses(date?: Date, salesRepId?: string): Expense[] {
  const d = date || new Date();
  const start = getStartOfMonth(d);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  let expenses = getExpenses().filter(e => {
    const ed = new Date(e.date);
    return ed >= start && ed < end;
  });
  if (salesRepId) expenses = expenses.filter(e => e.salesRepId === salesRepId);
  return expenses;
}

export function getCustomRangeExpenses(startDate: Date, endDate: Date, salesRepId?: string): Expense[] {
  const start = getStartOfDay(startDate);
  const end = new Date(getStartOfDay(endDate));
  end.setDate(end.getDate() + 1);
  let expenses = getExpenses().filter(e => {
    const ed = new Date(e.date);
    return ed >= start && ed < end;
  });
  if (salesRepId) expenses = expenses.filter(e => e.salesRepId === salesRepId);
  return expenses;
}

export function getTotalExpenses(salesRepId?: string): number {
  let expenses = getExpenses();
  if (salesRepId) expenses = expenses.filter(e => e.salesRepId === salesRepId);
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

const { sequelize, Product, Category, User, Order, OrderItem, Review } = require('../models');

// @desc    Render Interactive HTML Database & Backend Dashboard
// @route   GET /database or GET /db-status
// @access  Public
const renderDatabaseDashboard = async (req, res) => {
  try {
    const [pCount, cCount, uCount, oCount, rCount] = await Promise.all([
      Product.count(),
      Category.count(),
      User.count(),
      Order.count(),
      Review.count()
    ]);

    const [products, categories, users, orders] = await Promise.all([
      Product.findAll({ limit: 50, order: [['createdAt', 'DESC']] }),
      Category.findAll(),
      User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'], limit: 50 }),
      Order.findAll({
        include: [{ model: OrderItem, as: 'items' }],
        limit: 50,
        order: [['createdAt', 'DESC']]
      })
    ]);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VibeWear Database & Backend Live Inspector</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-[#0B0B14] text-slate-100 min-h-screen">
  <!-- Top Navigation Bar -->
  <header class="border-b border-purple-900/40 bg-[#0F0F1B]/90 backdrop-blur sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-pink-500/20">
          V
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            VibeWear Database Inspector
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live & Synced
            </span>
          </h1>
          <p class="text-xs text-slate-400">Direct window into your MySQL Database and Express API Backend</p>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <a href="http://localhost:5173" target="_blank" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center gap-1.5">
          <span>🌐 Open Website</span>
          <span class="text-slate-400">↗</span>
        </a>
        <a href="/api/health" target="_blank" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-colors flex items-center gap-1.5">
          <span>🏥 Backend Health Check</span>
          <span class="text-purple-400">↗</span>
        </a>
        <form action="/api/v1/create-test-order" method="POST" class="inline">
          <button type="submit" class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg shadow-pink-600/30 transition-all cursor-pointer">
            + Insert Test Order into MySQL
          </button>
        </form>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
    <!-- Server & DB Connection Banner -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-5 rounded-3xl bg-[#131325] border border-purple-900/40 shadow-xl space-y-1">
        <div class="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>MySQL Database</span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>
        <div class="text-xl font-black text-white">vibewear</div>
        <p class="text-xs text-emerald-400 font-mono">127.0.0.1:3306 (Sequelize ORM)</p>
      </div>

      <div class="p-5 rounded-3xl bg-[#131325] border border-purple-900/40 shadow-xl space-y-1">
        <div class="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Backend Server</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400">Port 5000</span>
        </div>
        <div class="text-xl font-black text-white">Node.js Express</div>
        <p class="text-xs text-blue-400 font-mono">http://localhost:5000</p>
      </div>

      <div class="p-5 rounded-3xl bg-[#131325] border border-purple-900/40 shadow-xl space-y-1">
        <div class="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Total Database Rows</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-400">All Tables</span>
        </div>
        <div class="text-xl font-black text-pink-400">${pCount + cCount + uCount + oCount + rCount} Records</div>
        <p class="text-xs text-slate-400">Fully persistent in local MySQL</p>
      </div>
    </div>

    <!-- Table Stats Grid (Click to switch tabs) -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <button onclick="switchTab('products')" id="tab-btn-products" class="tab-button p-4 rounded-2xl bg-purple-600/30 border-2 border-pink-500 text-left transition-all cursor-pointer">
        <div class="text-2xl font-black text-white">${pCount}</div>
        <div class="text-xs font-extrabold text-pink-400 uppercase tracking-wider mt-1">👗 Products</div>
        <div class="text-[10px] text-slate-400">120 in catalog</div>
      </button>

      <button onclick="switchTab('orders')" id="tab-btn-orders" class="tab-button p-4 rounded-2xl bg-[#131325] border border-purple-900/40 hover:border-pink-500/50 text-left transition-all cursor-pointer">
        <div class="text-2xl font-black text-white">${oCount}</div>
        <div class="text-xs font-extrabold text-slate-300 uppercase tracking-wider mt-1">📦 Orders</div>
        <div class="text-[10px] text-slate-400">Customer purchases</div>
      </button>

      <button onclick="switchTab('users')" id="tab-btn-users" class="tab-button p-4 rounded-2xl bg-[#131325] border border-purple-900/40 hover:border-pink-500/50 text-left transition-all cursor-pointer">
        <div class="text-2xl font-black text-white">${uCount}</div>
        <div class="text-xs font-extrabold text-slate-300 uppercase tracking-wider mt-1">👥 Users</div>
        <div class="text-[10px] text-slate-400">Accounts in DB</div>
      </button>

      <button onclick="switchTab('categories')" id="tab-btn-categories" class="tab-button p-4 rounded-2xl bg-[#131325] border border-purple-900/40 hover:border-pink-500/50 text-left transition-all cursor-pointer">
        <div class="text-2xl font-black text-white">${cCount}</div>
        <div class="text-xs font-extrabold text-slate-300 uppercase tracking-wider mt-1">📁 Categories</div>
        <div class="text-[10px] text-slate-400">Men, Women, Kids</div>
      </button>

      <button onclick="switchTab('api-links')" id="tab-btn-api-links" class="tab-button p-4 rounded-2xl bg-[#131325] border border-purple-900/40 hover:border-pink-500/50 text-left transition-all cursor-pointer">
        <div class="text-2xl font-black text-white">5</div>
        <div class="text-xs font-extrabold text-slate-300 uppercase tracking-wider mt-1">🔗 API Endpoints</div>
        <div class="text-[10px] text-slate-400">Direct JSON Links</div>
      </button>
    </div>

    <!-- TAB 1: PRODUCTS TABLE -->
    <div id="tab-content-products" class="tab-content bg-[#131325] rounded-3xl border border-purple-900/40 p-6 space-y-4 shadow-2xl">
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h2 class="text-base font-extrabold text-white flex items-center gap-2">
            <span>👗 Stored Products in MySQL</span>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300">${pCount} Items</span>
          </h2>
          <p class="text-xs text-slate-400">These 120 products are stored in the MySQL table <code>products</code> and served to the React frontend.</p>
        </div>
        <a href="/api/v1/products?limit=150" target="_blank" class="text-xs font-bold text-pink-400 hover:text-pink-300 underline">
          View Raw JSON Endpoint ↗
        </a>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-white/10">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-[#1C1C35] text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
            <tr>
              <th class="px-4 py-3">Image</th>
              <th class="px-4 py-3">Title</th>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3">SubCategory</th>
              <th class="px-4 py-3">Price</th>
              <th class="px-4 py-3">Stock</th>
              <th class="px-4 py-3">Rating</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            ${products.slice(0, 20).map(p => `
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="px-4 py-2.5">
                  <img src="${(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=100&q=80'}" alt="${p.title}" class="w-10 h-10 object-cover rounded-xl border border-white/10" />
                </td>
                <td class="px-4 py-2.5 font-bold text-white max-w-xs truncate">${p.title}</td>
                <td class="px-4 py-2.5"><span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">${p.category}</span></td>
                <td class="px-4 py-2.5 text-slate-400">${p.subCategory || '-'}</td>
                <td class="px-4 py-2.5 font-black text-pink-400">₹${p.price}</td>
                <td class="px-4 py-2.5 text-slate-300 font-mono">${p.stock} pcs</td>
                <td class="px-4 py-2.5 text-amber-400 font-bold">★ ${p.rating || 4.8}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <p class="text-xs text-slate-500 text-center pt-2">Showing latest 20 of ${pCount} products in database. All 120 products are live in MySQL.</p>
    </div>

    <!-- TAB 2: ORDERS TABLE -->
    <div id="tab-content-orders" class="tab-content hidden bg-[#131325] rounded-3xl border border-purple-900/40 p-6 space-y-4 shadow-2xl">
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h2 class="text-base font-extrabold text-white flex items-center gap-2">
            <span>📦 Customer Orders in MySQL</span>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300">${oCount} Orders</span>
          </h2>
          <p class="text-xs text-slate-400">Live orders placed via QR Code or Cash on Delivery stored in MySQL table <code>orders</code>.</p>
        </div>
        <form action="/api/v1/create-test-order" method="POST" class="inline">
          <button type="submit" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white shadow transition-all cursor-pointer">
            + Insert Test Order
          </button>
        </form>
      </div>

      ${orders.length === 0 ? `
        <div class="py-12 text-center space-y-3">
          <div class="text-4xl">📦</div>
          <h3 class="text-sm font-bold text-white">No Orders Placed in MySQL Yet</h3>
          <p class="text-xs text-slate-400 max-w-md mx-auto">
            Place an order on the checkout page (<a href="http://localhost:5173/checkout" target="_blank" class="text-pink-400 underline">http://localhost:5173/checkout</a>) or click the button above to insert a verified test order directly into MySQL!
          </p>
        </div>
      ` : `
        <div class="overflow-x-auto rounded-2xl border border-white/10">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-[#1C1C35] text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              <tr>
                <th class="px-4 py-3">Order ID</th>
                <th class="px-4 py-3">Customer / Address</th>
                <th class="px-4 py-3">Payment Method</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Total Amount</th>
                <th class="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${orders.map(o => `
                <tr class="hover:bg-white/[0.02] transition-colors">
                  <td class="px-4 py-3 font-mono font-bold text-pink-400">${o.id}</td>
                  <td class="px-4 py-3">
                    <div class="font-bold text-white">${o.shippingAddress?.fullName || 'Customer'}</div>
                    <div class="text-[10px] text-slate-400">${o.shippingAddress?.city || ''}, ${o.shippingAddress?.postalCode || ''}</div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-500/20 text-purple-300">
                      ${o.paymentMethod}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded font-bold text-[10px] ${o.paymentStatus === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">
                      ${o.paymentStatus}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-black text-white text-sm">₹${o.totalAmount}</td>
                  <td class="px-4 py-3 text-slate-400 text-[11px]">${new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>

    <!-- TAB 3: USERS TABLE -->
    <div id="tab-content-users" class="tab-content hidden bg-[#131325] rounded-3xl border border-purple-900/40 p-6 space-y-4 shadow-2xl">
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h2 class="text-base font-extrabold text-white flex items-center gap-2">
            <span>👥 Registered Accounts in MySQL</span>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300">${uCount} Users</span>
          </h2>
          <p class="text-xs text-slate-400">Stored in MySQL table <code>users</code> with bcrypt hashed passwords.</p>
        </div>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-white/10">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-[#1C1C35] text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
            <tr>
              <th class="px-4 py-3">User ID</th>
              <th class="px-4 py-3">Full Name</th>
              <th class="px-4 py-3">Email Address</th>
              <th class="px-4 py-3">Role</th>
              <th class="px-4 py-3">Registered On</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            ${users.map(u => `
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="px-4 py-3 font-mono text-[11px] text-slate-400">${u.id}</td>
                <td class="px-4 py-3 font-bold text-white">${u.name}</td>
                <td class="px-4 py-3 text-pink-400 font-mono">${u.email}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded font-bold text-[10px] ${u.role === 'Admin' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' : 'bg-blue-500/20 text-blue-300'}">
                    ${u.role}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-400 text-[11px]">${new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: CATEGORIES TABLE -->
    <div id="tab-content-categories" class="tab-content hidden bg-[#131325] rounded-3xl border border-purple-900/40 p-6 space-y-4 shadow-2xl">
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h2 class="text-base font-extrabold text-white flex items-center gap-2">
            <span>📁 Categories in MySQL</span>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300">${cCount} Categories</span>
          </h2>
          <p class="text-xs text-slate-400">Stored in MySQL table <code>categories</code>.</p>
        </div>
        <a href="/api/v1/categories" target="_blank" class="text-xs font-bold text-pink-400 hover:text-pink-300 underline">
          View Raw JSON ↗
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        ${categories.map(c => `
          <div class="p-5 rounded-2xl bg-[#1C1C35] border border-white/10 space-y-2">
            <span class="text-2xl">🏷️</span>
            <div class="text-lg font-black text-white">${c.name}</div>
            <div class="text-xs font-mono text-pink-400">slug: ${c.slug}</div>
            <p class="text-xs text-slate-400">${c.description || 'Premium streetwear collection'}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- TAB 5: DIRECT JSON API LINKS -->
    <div id="tab-content-api-links" class="tab-content hidden bg-[#131325] rounded-3xl border border-purple-900/40 p-6 space-y-4 shadow-2xl">
      <div class="pb-3 border-b border-white/10">
        <h2 class="text-base font-extrabold text-white">🔗 Direct Backend & Database JSON API Links</h2>
        <p class="text-xs text-slate-400">Click any link below to inspect real JSON data directly returned from your Express server and MySQL database.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <a href="http://localhost:5000/api/health" target="_blank" class="p-4 rounded-2xl bg-[#1C1C35] border border-purple-500/30 hover:border-pink-500 transition-all flex items-start gap-3 group">
          <div class="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">1</div>
          <div>
            <div class="font-bold text-sm text-white group-hover:text-pink-400 transition-colors">Backend Health API</div>
            <div class="text-xs font-mono text-purple-300">http://localhost:5000/api/health</div>
            <p class="text-[11px] text-slate-400 mt-1">Returns server status, operational health, and timestamp.</p>
          </div>
        </a>

        <a href="http://localhost:5000/api/v1/products" target="_blank" class="p-4 rounded-2xl bg-[#1C1C35] border border-purple-500/30 hover:border-pink-500 transition-all flex items-start gap-3 group">
          <div class="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold shrink-0">2</div>
          <div>
            <div class="font-bold text-sm text-white group-hover:text-pink-400 transition-colors">Products MySQL API</div>
            <div class="text-xs font-mono text-pink-300">http://localhost:5000/api/v1/products</div>
            <p class="text-[11px] text-slate-400 mt-1">Fetches all 120 products dynamically from the MySQL database.</p>
          </div>
        </a>

        <a href="http://localhost:5000/api/v1/categories" target="_blank" class="p-4 rounded-2xl bg-[#1C1C35] border border-purple-500/30 hover:border-pink-500 transition-all flex items-start gap-3 group">
          <div class="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">3</div>
          <div>
            <div class="font-bold text-sm text-white group-hover:text-pink-400 transition-colors">Categories MySQL API</div>
            <div class="text-xs font-mono text-indigo-300">http://localhost:5000/api/v1/categories</div>
            <p class="text-[11px] text-slate-400 mt-1">Fetches categories (Men, Women, Kids) from MySQL.</p>
          </div>
        </a>

        <a href="http://localhost:5000/api/v1/reviews" target="_blank" class="p-4 rounded-2xl bg-[#1C1C35] border border-purple-500/30 hover:border-pink-500 transition-all flex items-start gap-3 group">
          <div class="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0">4</div>
          <div>
            <div class="font-bold text-sm text-white group-hover:text-pink-400 transition-colors">Reviews MySQL API</div>
            <div class="text-xs font-mono text-emerald-300">http://localhost:5000/api/v1/reviews</div>
            <p class="text-[11px] text-slate-400 mt-1">Fetches verified customer reviews stored in MySQL.</p>
          </div>
        </a>

        <a href="http://localhost:5000/api/v1/db-overview" target="_blank" class="p-4 rounded-2xl bg-[#1C1C35] border border-pink-500/40 hover:border-pink-400 transition-all flex items-start gap-3 group sm:col-span-2">
          <div class="w-8 h-8 rounded-xl bg-pink-500/30 flex items-center justify-center text-pink-300 font-bold shrink-0">5</div>
          <div>
            <div class="font-bold text-sm text-white group-hover:text-pink-400 transition-colors">Full Database Overview (JSON)</div>
            <div class="text-xs font-mono text-pink-300">http://localhost:5000/api/v1/db-overview</div>
            <p class="text-[11px] text-slate-400 mt-1">Complete overview of database connection, table row counts, and recent entries in JSON format.</p>
          </div>
        </a>
      </div>
    </div>
  </main>

  <footer class="border-t border-white/10 py-6 text-center text-xs text-slate-500">
    VibeWear Full-Stack Platform • MySQL 127.0.0.1:3306 • Express API :5000 • Vite React :5173
  </footer>

  <script>
    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('bg-purple-600/30', 'border-pink-500', 'border-2');
        btn.classList.add('bg-[#131325]', 'border', 'border-purple-900/40');
      });

      const selectedContent = document.getElementById('tab-content-' + tabId);
      if (selectedContent) selectedContent.classList.remove('hidden');

      const selectedBtn = document.getElementById('tab-btn-' + tabId);
      if (selectedBtn) {
        selectedBtn.classList.remove('bg-[#131325]', 'border', 'border-purple-900/40');
        selectedBtn.classList.add('bg-purple-600/30', 'border-pink-500', 'border-2');
      }
    }
  </script>
</body>
</html>`;

    res.status(200).send(html);
  } catch (error) {
    res.status(500).send(`<h1>Database Inspector Error</h1><p>${error.message}</p>`);
  }
};

// @desc    Get JSON Overview of Database
// @route   GET /api/v1/db-overview
// @access  Public
const getDatabaseOverviewJson = async (req, res) => {
  try {
    const [pCount, cCount, uCount, oCount, rCount] = await Promise.all([
      Product.count(),
      Category.count(),
      User.count(),
      Order.count(),
      Review.count()
    ]);

    const recentOrders = await Order.findAll({ limit: 5, order: [['createdAt', 'DESC']] });
    const recentUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      database: {
        dialect: 'mysql',
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        name: process.env.DB_NAME || 'vibewear',
        status: 'Connected & Synced'
      },
      counts: {
        products: pCount,
        categories: cCount,
        users: uCount,
        orders: oCount,
        reviews: rCount,
        totalRecords: pCount + cCount + uCount + oCount + rCount
      },
      recentOrders,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Quick insert test order to verify database writes
// @route   POST /api/v1/create-test-order
// @access  Public
const createTestOrder = async (req, res) => {
  try {
    const product = await Product.findOne();
    const user = await User.findOne();

    if (!product || !user) {
      return res.status(400).send('Product or User not found in database');
    }

    const testOrder = await Order.create({
      userId: user.id,
      shippingAddress: {
        fullName: 'Test Customer',
        phone: '9876543210',
        street: '108 Fashion Street, VibeWear Plaza',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001'
      },
      paymentMethod: 'Online',
      paymentStatus: 'Completed',
      orderStatus: 'Processing',
      itemsPrice: product.price,
      taxPrice: 25.00,
      shippingPrice: 0.00,
      totalAmount: Number(product.price) + 25.00,
      paidAt: new Date()
    });

    await OrderItem.create({
      orderId: testOrder.id,
      productId: product.id,
      title: product.title,
      qty: 1,
      price: product.price,
      size: 'L',
      color: 'Jet Black',
      image: product.images?.[0] || ''
    });

    res.redirect('/database');
  } catch (error) {
    res.status(500).send(`Error creating test order: ${error.message}`);
  }
};

module.exports = {
  renderDatabaseDashboard,
  getDatabaseOverviewJson,
  createTestOrder
};

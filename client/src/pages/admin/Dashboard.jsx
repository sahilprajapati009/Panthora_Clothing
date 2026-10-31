import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineTag,
  HiOutlineClipboardList,
  HiOutlineFolder,
  HiOutlineArrowRight,
  HiOutlineCurrencyRupee,
  HiOutlineExclamation,
} from 'react-icons/hi';
import api from '../../api/axios';
import AdminNav from '../../components/AdminNav';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    lowStockCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodRes, catRes, orderRes] = await Promise.allSettled([
          api.get('/products'),
          api.get('/categories'),
          api.get('/orders'),
        ]);

        let products = prodRes.status === 'fulfilled' && prodRes.value.data.success ? prodRes.value.data.products : [];
        let categories = catRes.status === 'fulfilled' && catRes.value.data.success ? catRes.value.data.categories : [];
        let orders = orderRes.status === 'fulfilled' && orderRes.value.data.success ? orderRes.value.data.orders : [];

        const pending = orders.filter((o) => o.status === 'pending').length;
        const revenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + (o.totalPrice || 0) : sum), 0);
        const lowStock = products.filter((p) => (p.stock || 0) < 10).length;

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          pendingOrders: pending,
          totalRevenue: revenue,
          lowStockCount: lowStock,
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <AdminNav />

      <div className="page-container pb-12 space-y-8">
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-accent">Store Performance</span>
          <h1 className="section-title mt-1">Management Overview</h1>
        </div>

        {loading ? (
          <Loader text="Calculating store metrics..." />
        ) : (
          <>
            {/* Metric KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-6 border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                  <HiOutlineCurrencyRupee className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-heading uppercase text-text-secondary">Total Revenue</span>
                  <div className="text-2xl font-bold font-heading text-text-primary mt-0.5">
                    ₹{stats.totalRevenue.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="card p-6 border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-bg-hover border border-border flex items-center justify-center text-accent">
                  <HiOutlineClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-heading uppercase text-text-secondary">Orders</span>
                  <div className="text-2xl font-bold font-heading text-text-primary mt-0.5">
                    {stats.totalOrders}{' '}
                    {stats.pendingOrders > 0 && (
                      <span className="text-xs font-normal text-amber-400">({stats.pendingOrders} pending)</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="card p-6 border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-bg-hover border border-border flex items-center justify-center text-accent">
                  <HiOutlineTag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-heading uppercase text-text-secondary">Catalog Items</span>
                  <div className="text-2xl font-bold font-heading text-text-primary mt-0.5">
                    {stats.totalProducts}
                  </div>
                </div>
              </div>

              <div className="card p-6 border border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-bg-hover border border-border flex items-center justify-center text-accent">
                  <HiOutlineFolder className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-heading uppercase text-text-secondary">Active Categories</span>
                  <div className="text-2xl font-bold font-heading text-text-primary mt-0.5">
                    {stats.totalCategories}
                  </div>
                </div>
              </div>
            </div>

            {/* Low Stock Warning Banner */}
            {stats.lowStockCount > 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-amber-400 text-sm">
                  <HiOutlineExclamation className="w-5 h-5 flex-shrink-0" />
                  <span>
                    <strong>Stock Alert:</strong> {stats.lowStockCount} product(s) are running low on inventory (&lt; 10 items).
                  </span>
                </div>
                <Link to="/admin/products" className="text-xs font-heading font-bold uppercase text-amber-400 underline hover:text-amber-300">
                  Update Stock
                </Link>
              </div>
            )}

            {/* Navigation Quick Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Products Card */}
              <Link to="/admin/products" className="card p-6 group hover-lift border border-border flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-bg-hover border border-border flex items-center justify-center text-accent">
                    <HiOutlineTag className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-heading font-bold uppercase text-text-primary group-hover:text-accent transition-colors">
                    Manage Products
                  </h2>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Create new items, set prices, edit size/color variations, update stock levels, or feature items on the homepage.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-accent">
                  Open Catalog <HiOutlineArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Categories Card */}
              <Link to="/admin/categories" className="card p-6 group hover-lift border border-border flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-bg-hover border border-border flex items-center justify-center text-accent">
                    <HiOutlineFolder className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-heading font-bold uppercase text-text-primary group-hover:text-accent transition-colors">
                    Manage Categories
                  </h2>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Define product lines (Hoodies, Tees, Lowers, Accessories), update category slugs, and organize store offerings.
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-accent">
                  Open Categories <HiOutlineArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Orders Card */}
              <Link to="/admin/orders" className="card p-6 group hover-lift border border-border flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-bg-hover border border-border flex items-center justify-center text-accent">
                    <HiOutlineClipboardList className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-heading font-bold uppercase text-text-primary group-hover:text-accent transition-colors">
                    Manage Customer Orders
                  </h2>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Track incoming COD orders, view customer shipping details, and update fulfillment statuses (shipped, delivered, cancelled).
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-accent">
                  Open Orders <HiOutlineArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

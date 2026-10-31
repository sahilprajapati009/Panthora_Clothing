import { Link } from 'react-router-dom';
import { HiOutlineTag, HiOutlineClipboardList, HiOutlineArrowRight } from 'react-icons/hi';

const Dashboard = () => {
  return (
    <div className="page-container py-12 space-y-8">
      <div>
        <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-accent">Admin Portal</span>
        <h1 className="section-title mt-1">Management Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manage Products Card */}
        <Link to="/admin/products" className="card p-8 group hover-lift border border-border flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-bg-hover border border-border flex items-center justify-center text-accent">
              <HiOutlineTag className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-heading font-bold uppercase text-text-primary group-hover:text-accent transition-colors">
              Manage Products
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Add new streetwear items, edit product specs/pricing, update stock levels, or delete discontinued items from the store catalog.
            </p>
          </div>
          <div className="pt-6 flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-accent">
            Go to Product Catalog <HiOutlineArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Manage Orders Card */}
        <Link to="/admin/orders" className="card p-8 group hover-lift border border-border flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-bg-hover border border-border flex items-center justify-center text-accent">
              <HiOutlineClipboardList className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-heading font-bold uppercase text-text-primary group-hover:text-accent transition-colors">
              Manage Customer Orders
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              View incoming COD orders across the platform, update fulfillment status (pending, shipped, delivered), and manage customer delivery info.
            </p>
          </div>
          <div className="pt-6 flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-accent">
            Go to Order Management <HiOutlineArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

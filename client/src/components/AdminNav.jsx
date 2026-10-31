import { Link, useLocation } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineTag, HiOutlineFolder, HiOutlineClipboardList } from 'react-icons/hi';

const AdminNav = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: HiOutlineViewGrid },
    { label: 'Products', path: '/admin/products', icon: HiOutlineTag },
    { label: 'Categories', path: '/admin/categories', icon: HiOutlineFolder },
    { label: 'Orders', path: '/admin/orders', icon: HiOutlineClipboardList },
  ];

  return (
    <div className="bg-bg-surface border-b border-border py-4 mb-8">
      <div className="page-container flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse" />
          <span className="font-heading font-bold uppercase text-xs tracking-[0.2em] text-accent">
            Panthora Admin Control Center
          </span>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider transition-all border ${
                  isActive
                    ? 'bg-accent text-bg border-accent shadow-md'
                    : 'text-text-secondary border-border hover:border-accent/50 hover:text-text-primary bg-bg'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminNav;

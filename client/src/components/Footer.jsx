import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-bg-surface border-t border-border mt-20">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-heading font-black text-xl tracking-[0.15em] uppercase mb-4">
              Panthora
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Premium streetwear crafted for the culture. Bold, minimal, and unapologetically authentic.
            </p>
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <HiOutlineMail className="w-4 h-4" />
              <span>hello@panthora.com</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/products?category=hoodie', label: 'Hoodies' },
                { to: '/products?category=tee', label: 'Tees' },
                { to: '/products?category=lower', label: 'Lowers' },
                { to: '/products', label: 'All Products' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-text-muted text-sm hover:text-text-primary transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">
              Info
            </h4>
            <ul className="space-y-3">
              {['About Us', 'Size Guide', 'Shipping', 'Returns'].map((label) => (
                <li key={label}>
                  <span className="text-text-muted text-sm cursor-default">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-text-secondary mb-4">
              Account
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-text-muted text-sm hover:text-text-primary transition-colors duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-text-muted text-sm hover:text-text-primary transition-colors duration-300">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-text-muted text-sm hover:text-text-primary transition-colors duration-300">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs tracking-wider">
            &copy; {new Date().getFullYear()} PANTHORA CLOTHING. ALL RIGHTS RESERVED.
          </p>
          <p className="text-text-muted text-xs tracking-wider">
            CASH ON DELIVERY ONLY
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

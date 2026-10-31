import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { selectCartCount } from '../store/slices/cartSlice';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const cartCount = useSelector(selectCartCount);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/products', label: 'Shop All' },
    { to: '/products?category=hoodie', label: 'Hoodies' },
    { to: '/products?category=tee', label: 'Tees' },
    { to: '/products?category=lower', label: 'Lowers' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="font-heading font-black text-xl md:text-2xl tracking-[0.15em] uppercase hover:text-text-primary">
            Panthora
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-text-secondary text-sm font-medium uppercase tracking-wider
                           hover:text-text-primary transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-text-secondary hover:text-text-primary transition-colors" id="cart-icon">
              <HiOutlineShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-bg text-[10px] font-bold
                               rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User / Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3 py-1 bg-accent text-bg font-heading font-bold text-xs uppercase tracking-wider hover:bg-accent/90 transition-all shadow-sm"
                  >
                    Admin Portal
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="p-2 text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
                    id="user-menu-button"
                  >
                    <HiOutlineUser className="w-5 h-5" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-bg-surface border border-border animate-slide-down"
                         onMouseLeave={() => setProfileOpen(false)}>
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-accent/20 border border-accent/40 text-accent text-[10px] font-heading uppercase font-bold">
                            Admin Account
                          </span>
                        )}
                      </div>
                      <Link to="/account" className="block px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                            onClick={() => setProfileOpen(false)}>
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2.5 text-sm text-accent hover:bg-bg-hover font-semibold transition-colors"
                              onClick={() => setProfileOpen(false)}>
                          Admin Control Center
                        </Link>
                      )}
                      <button onClick={handleLogout}
                              className="w-full text-left px-4 py-2.5 text-sm text-status-error hover:bg-bg-hover transition-colors">
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden md:block btn-ghost text-xs uppercase tracking-wider" id="login-link">
                  Login
                </Link>
                <Link to="/login?redirect=/admin" className="hidden md:block text-[11px] font-heading font-semibold uppercase tracking-wider text-accent hover:underline">
                  Admin Login
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              id="mobile-menu-toggle"
            >
              {mobileOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bg-surface border-t border-border animate-slide-down">
          <div className="page-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="block py-3 text-sm font-medium uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" className="block py-3 text-sm font-medium uppercase tracking-wider text-accent"
                    onClick={() => setMobileOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

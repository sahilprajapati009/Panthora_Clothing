import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { loginUser, clearError, logout } from '../store/slices/authSlice';
import { HiOutlineLockClosed, HiOutlineExclamation, HiOutlineLogout } from 'react-icons/hi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '';

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        toast.success(`Welcome back Admin, ${user.name}!`);
        navigate('/admin');
      } else if (redirectTarget && redirectTarget !== '/admin') {
        navigate(redirectTarget);
      }
      // If user.role !== 'admin' and redirectTarget === '/admin', stay on login page to allow switching account
    }
  }, [user, navigate, redirectTarget]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const handleSwitchToAdmin = () => {
    dispatch(logout());
    setFormData({ email: '', password: '' });
    toast.success('Signed out customer account. Please enter Admin Credentials.');
  };

  return (
    <div className="page-container py-20 flex justify-center">
      <div className="w-full max-w-md bg-bg-surface border border-border p-8 space-y-6 animate-scale-in">
        <div className="text-center space-y-2">
          <span className="text-xs font-heading uppercase tracking-[0.2em] text-accent">
            {redirectTarget === '/admin' ? 'Restricted Access' : 'Welcome Back'}
          </span>
          <h1 className="text-2xl font-heading font-bold uppercase text-text-primary">
            {redirectTarget === '/admin' ? 'Admin Authentication' : 'Account Login'}
          </h1>
        </div>

        {/* Warning if logged in as regular user while trying to access Admin */}
        {user && user.role !== 'admin' && redirectTarget === '/admin' && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-start gap-2 text-amber-400 text-xs">
              <HiOutlineExclamation className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                You are currently logged in as <strong>{user.name}</strong> (Customer Account). You must sign in with an <strong>Admin Account</strong> to access the Admin Control Center.
              </span>
            </div>
            <button
              onClick={handleSwitchToAdmin}
              className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-heading font-bold uppercase text-xs flex items-center justify-center gap-2 transition-all"
            >
              <HiOutlineLogout className="w-4 h-4" /> Log Out & Enter Admin Login
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-heading uppercase text-text-secondary block mb-1">
              {redirectTarget === '/admin' ? 'Admin Email Address' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder={redirectTarget === '/admin' ? 'admin@panthora.com' : 'user@example.com'}
              id="login-email"
            />
          </div>

          <div>
            <label className="text-xs font-heading uppercase text-text-secondary block mb-1">
              {redirectTarget === '/admin' ? 'Admin Password' : 'Password'}
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              placeholder="••••••••"
              id="login-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-4"
            id="login-submit-btn"
          >
            {loading ? 'Authenticating...' : redirectTarget === '/admin' ? 'Login to Admin Panel' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-text-muted pt-4 border-t border-border">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

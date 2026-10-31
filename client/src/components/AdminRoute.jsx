import { Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Loader from './Loader';
import { HiOutlineLockClosed, HiOutlineArrowLeft, HiOutlineLogout } from 'react-icons/hi';

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (loading) {
    return <Loader text="Verifying admin privileges..." />;
  }

  if (!token || !user) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  // If user is logged in but NOT an admin, show Access Denied card with 1-click Admin Switch
  if (user.role !== 'admin') {
    return (
      <div className="page-container py-20 flex justify-center">
        <div className="w-full max-w-lg bg-bg-surface border border-border p-8 space-y-6 text-center animate-scale-in">
          <div className="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HiOutlineLockClosed className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-amber-400">
              Access Restricted
            </span>
            <h1 className="text-2xl font-heading font-bold uppercase text-text-primary">
              Admin Privileges Required
            </h1>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto pt-1">
              You are signed in as <strong>{user.name}</strong> ({user.email}) with a standard customer account. Access to the Admin Control Center is restricted to administrative staff.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/"
              className="btn-outline flex-1 flex items-center justify-center gap-2 text-xs py-2.5"
            >
              <HiOutlineArrowLeft className="w-4 h-4" /> Return to Store
            </Link>

            <button
              onClick={() => {
                dispatch(logout());
              }}
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs py-2.5 bg-accent hover:bg-accent/90"
            >
              <HiOutlineLogout className="w-4 h-4" /> Log Out & Sign In as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;

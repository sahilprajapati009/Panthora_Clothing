import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { registerUser, clearError } from '../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="page-container py-20 flex justify-center">
      <div className="w-full max-w-md bg-bg-surface border border-border p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-heading uppercase tracking-[0.2em] text-accent">Join Panthora</span>
          <h1 className="text-2xl font-heading font-bold uppercase text-text-primary">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="John Doe"
              id="register-name"
            />
          </div>

          <div>
            <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="john@example.com"
              id="register-email"
            />
          </div>

          <div>
            <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              placeholder="+91 9876543210"
              id="register-phone"
            />
          </div>

          <div>
            <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Password</label>
            <input
              type="password"
              required
              minLength="6"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              placeholder="Minimum 6 characters"
              id="register-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-4"
            id="register-submit-btn"
          >
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </form>

        <div className="text-center text-xs text-text-muted pt-4 border-t border-border">
          Already registered?{' '}
          <Link to="/login" className="text-accent font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { selectCartItems, selectCartTotal, clearCart } from '../store/slices/cartSlice';

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your bag is empty');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        totalAmount: cartTotal,
      };

      const { data } = await api.post('/orders', orderPayload);

      if (data.success) {
        toast.success('Order placed successfully!', {
          className: 'toast-custom',
        });
        dispatch(clearCart());
        navigate('/account');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container py-12 space-y-8">
      <div>
        <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-accent">Checkout</span>
        <h1 className="section-title mt-1">Shipping & Payment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Shipping Address Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handlePlaceOrder} className="bg-bg-surface border border-border p-6 sm:p-8 space-y-6">
            <h2 className="font-heading text-lg font-bold uppercase border-b border-border pb-3">Shipping Address</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-heading uppercase text-text-secondary mb-1 block">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-xs font-heading uppercase text-text-secondary mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-heading uppercase text-text-secondary mb-1 block">Street Address</label>
              <textarea
                name="address"
                rows="3"
                required
                value={shippingAddress.address}
                onChange={handleChange}
                className="input-field"
                placeholder="House/Flat No., Apartment, Street, Locality"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-heading uppercase text-text-secondary mb-1 block">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Mumbai"
                />
              </div>

              <div>
                <label className="text-xs font-heading uppercase text-text-secondary mb-1 block">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={shippingAddress.state}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Maharashtra"
                />
              </div>

              <div>
                <label className="text-xs font-heading uppercase text-text-secondary mb-1 block">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={shippingAddress.pincode}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="400001"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h2 className="font-heading text-lg font-bold uppercase mb-3">Payment Method</h2>
              <div className="bg-bg-hover border border-accent p-4 flex items-center justify-between">
                <div>
                  <p className="font-heading font-bold text-sm text-text-primary">Cash on Delivery (COD)</p>
                  <p className="text-xs text-text-muted mt-0.5">Pay in cash when your shipment arrives at your doorstep.</p>
                </div>
                <span className="badge border-accent text-accent">Selected</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base tracking-widest mt-6"
              id="confirm-order-btn"
            >
              {loading ? 'Processing Order...' : `Confirm Order (₹${cartTotal.toLocaleString('en-IN')})`}
            </button>
          </form>
        </div>

        {/* Order Summary Side panel */}
        <div className="space-y-6">
          <div className="bg-bg-surface border border-border p-6 space-y-4">
            <h2 className="font-heading text-base font-bold uppercase border-b border-border pb-3">In Your Bag ({cartItems.length})</h2>

            <div className="divide-y divide-border max-h-96 overflow-y-auto pr-1 space-y-3">
              {cartItems.map((item, idx) => (
                <div key={idx} className="pt-3 flex gap-3 text-xs">
                  <img src={item.image} alt={item.name} className="w-12 h-16 object-cover bg-bg-hover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary truncate">{item.name}</p>
                    <p className="text-text-muted mt-0.5">
                      {item.size} / {item.color} x {item.quantity}
                    </p>
                    <p className="text-accent font-bold mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 flex justify-between font-bold text-sm">
              <span>Total Payable</span>
              <span className="text-accent">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

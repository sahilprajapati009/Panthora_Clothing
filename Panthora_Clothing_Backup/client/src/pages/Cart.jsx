import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineShoppingBag } from 'react-icons/hi';
import { selectCartItems, selectCartTotal, clearCart } from '../store/slices/cartSlice';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const cartItems = useSelector(selectCartItems) || [];
  const cartTotal = useSelector(selectCartTotal) || 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="page-container py-20 text-center space-y-6">
        <EmptyState
          title="YOUR BAG IS EMPTY"
          message="Explore our collection and add your favorite heavyweight pieces."
          icon={HiOutlineShoppingBag}
        />
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Start Shopping <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const safeTotal = Number(cartTotal) || 0;

  return (
    <div className="page-container py-12 space-y-8">
      <div>
        <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-accent">Shopping Bag</span>
        <h1 className="section-title mt-1">Review Your Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <span className="text-xs font-heading uppercase text-text-muted">Items ({cartItems.length})</span>
            <button
              onClick={() => dispatch(clearCart())}
              className="text-xs text-text-muted hover:text-status-error uppercase tracking-wider transition-colors"
            >
              Clear Bag
            </button>
          </div>

          <div className="divide-y divide-border">
            {cartItems.map((item, idx) => (
              <CartItem key={`${item.product || idx}-${item.size}-${item.color}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-bg-surface border border-border p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold uppercase border-b border-border pb-3">Order Summary</h2>

            <div className="space-y-2 text-sm text-text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-text-primary font-semibold">₹{safeTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (COD)</span>
                <span className="text-accent font-semibold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-text-primary font-semibold">Cash on Delivery</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center text-base font-bold font-heading">
              <span>Total Amount</span>
              <span className="text-accent text-xl">₹{safeTotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              id="checkout-btn"
            >
              Proceed to Checkout <HiOutlineArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-text-muted text-center leading-relaxed">
            Standard delivery takes 3-5 business days across India. Payment to be made upon package arrival.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;

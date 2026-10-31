import { useDispatch } from 'react-redux';
import { HiOutlineTrash, HiMinus, HiPlus } from 'react-icons/hi';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart({ product: item.product, size: item.size, color: item.color }));
  };

  const handleQty = (newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ product: item.product, size: item.size, color: item.color, quantity: newQty }));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-5 border-b border-border animate-fade-in" id={`cart-item-${item.product}`}>
      {/* Thumbnail */}
      <div className="w-20 h-24 sm:w-24 sm:h-32 bg-bg-surface border border-border flex-shrink-0 overflow-hidden">
        <img
          src={item.image || 'https://placehold.co/200x250/141414/a3a3a3?text=No+Image'}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Item Info & Actions */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-heading font-semibold text-sm sm:text-base text-text-primary truncate">{item.name}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted mt-1">
            <span className="badge py-0.5 px-2 bg-bg-surface">{item.size}</span>
            <span>•</span>
            <span className="text-text-secondary font-medium">{item.color}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          {/* Qty Controls */}
          <div className="flex items-center border border-border bg-bg-surface">
            <button
              onClick={() => handleQty(item.quantity - 1)}
              className="px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <HiMinus className="w-3 h-3" />
            </button>
            <span className="px-3 text-xs sm:text-sm font-semibold text-text-primary min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQty(item.quantity + 1)}
              className="px-3 py-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
              aria-label="Increase quantity"
            >
              <HiPlus className="w-3 h-3" />
            </button>
          </div>

          {/* Subtotal & Delete Action */}
          <div className="flex items-center gap-4">
            <span className="font-heading font-bold text-accent text-base sm:text-lg">
              ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
            </span>
            <button
              onClick={handleRemove}
              className="p-2 text-text-muted hover:text-status-error transition-colors"
              title="Remove item"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

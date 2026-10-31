import { createSlice } from '@reduxjs/toolkit';

// Resilient load and sanitizer for cart items from localStorage
const getInitialCart = () => {
  try {
    const raw = localStorage.getItem('panthora_cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      product: String(item.product || item._id || item.id || Date.now()),
      name: String(item.name || 'Panthora Item'),
      price: Number(item.price) || 0,
      image: String(item.image || (Array.isArray(item.images) ? item.images[0] : '')),
      size: String(item.size || 'M'),
      color: String(item.color || 'Black'),
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));
  } catch (err) {
    console.error('Error loading cart from localStorage:', err);
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem('panthora_cart', JSON.stringify(items));
  } catch (err) {
    console.error('Error saving cart to localStorage:', err);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getInitialCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, size = 'M', color = 'Black', quantity = 1 } = action.payload;

      const productId = typeof product === 'object' ? (product._id || product.id) : product;
      const name = typeof product === 'object' ? product.name : action.payload.name || 'Panthora Item';
      const price = typeof product === 'object' ? Number(product.price) || 0 : Number(action.payload.price) || 0;
      const image = typeof product === 'object' ? (product.images?.[0] || product.image || '') : action.payload.image || '';

      const existing = state.items.find(
        (item) => String(item.product) === String(productId) && item.size === size && item.color === color
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          product: String(productId),
          name,
          price,
          image,
          size,
          color,
          quantity: Math.max(1, Number(quantity) || 1),
        });
      }
      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      const { product, size, color } = action.payload;
      const targetId = typeof product === 'object' ? (product._id || product.id) : product;

      state.items = state.items.filter(
        (item) => !(String(item.product) === String(targetId) && item.size === size && item.color === color)
      );
      saveCart(state.items);
    },

    updateQuantity: (state, action) => {
      const { product, size, color, quantity } = action.payload;
      const targetId = typeof product === 'object' ? (product._id || product.id) : product;

      const item = state.items.find(
        (i) => String(i.product) === String(targetId) && i.size === size && i.color === color
      );
      if (item) {
        item.quantity = Math.max(1, Number(quantity) || 1);
      }
      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart?.items || [];
export const selectCartCount = (state) =>
  (state.cart?.items || []).reduce((total, item) => total + (Number(item.quantity) || 1), 0);
export const selectCartTotal = (state) =>
  (state.cart?.items || []).reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

export default cartSlice.reducer;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiOutlineCheck, HiOutlineShoppingBag, HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { addToCart } from '../store/slices/cartSlice';
import Loader from '../components/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        if (data.success) {
          setProduct(data.product);
          if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
          if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0]);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    dispatch(
      addToCart({
        product,
        size: selectedSize,
        color: selectedColor,
        quantity,
      })
    );
    toast.success('Added to bag', {
      className: 'toast-custom',
      iconTheme: { primary: '#d4c5a9', secondary: '#0a0a0a' },
    });
  };

  if (loading) return <Loader text="Loading product..." />;
  if (!product) return null;

  return (
    <div className="page-container py-12 space-y-8">
      {/* Back Link */}
      <Link to="/products" className="inline-flex items-center gap-2 text-xs font-heading uppercase text-text-muted hover:text-accent transition-colors">
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Column */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-bg-surface overflow-hidden border border-border">
            <img
              src={product.images?.[selectedImage] || 'https://placehold.co/600x750/141414/a3a3a3?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-24 border overflow-hidden transition-all ${
                    selectedImage === idx ? 'border-accent scale-95' : 'border-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div>
            <span className="badge mb-2">{product.category}</span>
            <h1 className="text-3xl font-heading font-black text-text-primary uppercase tracking-tight">{product.name}</h1>
            <p className="font-heading font-bold text-2xl text-accent mt-2">
              ₹{product.price?.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="border-t border-b border-border py-4">
            <p className="text-text-secondary text-sm leading-relaxed font-light">{product.description}</p>
          </div>

          {/* Size Selector */}
          {product.sizes?.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-heading uppercase text-text-secondary tracking-wider block">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[48px] h-12 px-4 border text-xs font-heading font-semibold uppercase tracking-wider transition-all ${
                      selectedSize === sz
                        ? 'bg-accent text-bg border-accent'
                        : 'bg-bg-surface border-border text-text-primary hover:border-text-secondary'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors?.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-heading uppercase text-text-secondary tracking-wider block">
                Select Color: <span className="text-text-primary font-normal">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 border text-xs font-heading uppercase tracking-wider transition-all ${
                      selectedColor === c
                        ? 'bg-bg-elevated border-accent text-accent'
                        : 'bg-bg-surface border-border text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-between sm:justify-start border border-border bg-bg-surface">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-text-secondary hover:text-text-primary text-sm"
                  aria-label="Decrease"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-text-secondary hover:text-text-primary text-sm"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 sm:py-3"
                id="add-to-cart-btn"
              >
                <HiOutlineShoppingBag className="w-5 h-5" /> Add to Bag
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="border-t border-border pt-6 space-y-3 text-xs text-text-muted font-body">
            <div className="flex items-center gap-2">
              <HiOutlineCheck className="text-accent w-4 h-4" /> Cash on Delivery Available
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineCheck className="text-accent w-4 h-4" /> 100% Heavyweight Premium Cotton
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineCheck className="text-accent w-4 h-4" /> Express Shipping Across India
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

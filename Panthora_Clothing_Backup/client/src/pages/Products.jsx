import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/products?';
        if (currentCategory !== 'all') {
          url += `category=${currentCategory}&`;
        }
        if (currentSort !== 'newest') {
          url += `sort=${currentSort}&`;
        }
        const { data } = await api.get(url);
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentSort]);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'hoodie', label: 'Hoodies' },
    { id: 'tee', label: 'Tees' },
    { id: 'lower', label: 'Lowers' },
  ];

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  return (
    <div className="page-container py-12 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-accent">Catalog</span>
        <h1 className="section-title mt-1">Shop Collection</h1>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 text-xs font-heading font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                currentCategory === cat.id
                  ? 'bg-accent text-bg'
                  : 'bg-bg-surface text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort" className="text-xs font-heading uppercase text-text-muted tracking-wider">
            Sort by:
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={handleSortChange}
            className="bg-bg-surface border border-border text-text-primary text-xs font-heading uppercase tracking-wider px-3 py-2 outline-none focus:border-accent"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <Loader text="Loading catalog..." />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" message="Try selecting another category or clear filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

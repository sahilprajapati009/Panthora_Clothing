import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const categoryLabels = { hoodie: 'Hoodie', tee: 'Tee', lower: 'Lower' };

  return (
    <Link to={`/products/${product._id}`} className="group block" id={`product-card-${product._id}`}>
      <div className="card overflow-hidden hover-lift">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-bg-hover">
          <img
            src={product.images?.[0] || 'https://placehold.co/600x750/141414/a3a3a3?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Category badge overlay */}
          <div className="absolute top-3 left-3">
            <span className="badge bg-bg/80 backdrop-blur-sm">
              {categoryLabels[product.category] || product.category}
            </span>
          </div>
          {product.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-accent/90 text-bg border-accent">Featured</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-heading font-semibold text-sm md:text-base text-text-primary truncate mb-1
                         group-hover:text-accent transition-colors duration-300">
            {product.name}
          </h3>
          <p className="font-heading font-bold text-accent text-lg">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          {/* Color dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="text-[10px] text-text-muted uppercase tracking-wider"
                >
                  {color}
                </span>
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-text-muted">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

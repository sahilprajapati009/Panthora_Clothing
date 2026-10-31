import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?featured=true');
        if (data.success) {
          setFeaturedProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-20 pb-10">
      {/* Hero Banner */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-bg-surface">
        <div className="absolute inset-0 z-0">
          <img
            src="/uploads/black-hoodie.png"
            alt="Panthora Hero"
            className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4 animate-fade-in space-y-6">
          <span className="badge border-accent text-accent">Drop 01 // Available Now</span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading uppercase tracking-tight leading-none">
            REDEFINE YOUR <span className="text-gradient">STREETWEAR</span>
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto font-body font-light leading-relaxed">
            Minimalist heavyweights, boxy silhouettes, and uncompromised aesthetic. Crafted for the relentless.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary flex items-center justify-center gap-2">
              Explore Collection <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products?category=hoodie" className="btn-outline flex items-center justify-center">
              Shop Hoodies
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-accent">Curated Selection</span>
            <h2 className="section-title mt-1">Featured Drop</h2>
          </div>
          <Link to="/products" className="text-sm font-heading font-semibold uppercase tracking-wider text-text-secondary hover:text-accent flex items-center gap-1 transition-colors">
            View All Products <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading featured drop..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Category Spotlight Banner */}
      <section className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'HOODIES',
              desc: 'Heavyweight French Terry',
              img: '/uploads/black-hoodie.png',
              category: 'hoodie',
            },
            {
              title: 'TEES',
              desc: '240gsm Boxy Fit',
              img: '/uploads/printed-oversized-tee.png',
              category: 'tee',
            },
            {
              title: 'LOWERS',
              desc: 'Tapered & Cargo Cuts',
              img: '/uploads/black-trackpants.png',
              category: 'lower',
            },
          ].map((cat) => (
            <Link
              key={cat.title}
              to={`/products?category=${cat.category}`}
              className="group relative h-96 overflow-hidden card border border-border"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs font-heading uppercase tracking-widest text-accent mb-1">{cat.desc}</p>
                <h3 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary group-hover:text-accent transition-colors">
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="bg-bg-surface border-y border-border py-20">
        <div className="page-container text-center max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-heading font-bold uppercase tracking-[0.25em] text-accent">The Culture</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading uppercase">UNCOMPROMISED QUALITY. NO FILLERS.</h2>
          <p className="text-text-secondary text-base leading-relaxed font-body font-light">
            Panthora Clothing was created out of a desire for clean, substantial streetwear. Every garment is cut from custom-milled heavy cottons, designed to age gracefully and withstand daily wear. No seasonal gimmicks—just timeless essentials.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;

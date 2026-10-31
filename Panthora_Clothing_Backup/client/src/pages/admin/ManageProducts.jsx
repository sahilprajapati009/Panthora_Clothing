import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    name: '',
    description: '',
    price: '',
    category: 'hoodie',
    sizes: 'S, M, L, XL',
    colors: 'Black',
    stock: 50,
    images: '',
    isFeatured: false,
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p._id);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      sizes: p.sizes ? p.sizes.join(', ') : '',
      colors: p.colors ? p.colors.join(', ') : '',
      stock: p.stock,
      images: p.images ? p.images.join(', ') : '',
      isFeatured: p.isFeatured || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { data } = await api.delete(`/products/${id}`);
      if (data.success) {
        toast.success('Product deleted');
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
      images: formData.images.split(',').map((img) => img.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const { data } = await api.put(`/products/${editingId}`, payload);
        if (data.success) {
          toast.success('Product updated');
          setShowModal(false);
          fetchProducts();
        }
      } else {
        const { data } = await api.post('/products', payload);
        if (data.success) {
          toast.success('Product created');
          setShowModal(false);
          fetchProducts();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  return (
    <div className="page-container py-12 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-accent">Admin Portal</span>
          <h1 className="section-title mt-1">Manage Products</h1>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <Loader text="Loading catalog..." />
      ) : products.length === 0 ? (
        <EmptyState title="No products in database" message="Click 'Add Product' to create your first item." />
      ) : (
        <div className="overflow-x-auto bg-bg-surface border border-border">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-bg-hover uppercase font-heading text-text-secondary tracking-wider">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-bg-hover/50 transition-colors">
                  <td className="p-4">
                    <img src={p.images?.[0]} alt="" className="w-10 h-12 object-cover bg-bg-elevated" />
                  </td>
                  <td className="p-4 font-semibold text-text-primary">{p.name}</td>
                  <td className="p-4 uppercase text-text-muted">{p.category}</td>
                  <td className="p-4 font-bold text-accent">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">{p.isFeatured ? <span className="badge border-accent text-accent">Yes</span> : 'No'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(p)} className="p-2 text-text-secondary hover:text-accent">
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 text-text-secondary hover:text-status-error">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-border w-full max-w-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h2 className="font-heading font-bold text-lg uppercase">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="hoodie">Hoodie</option>
                    <option value="tee">Tee</option>
                    <option value="lower">Lower</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    className="input-field"
                    placeholder="S, M, L, XL"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    className="input-field"
                    placeholder="Black, Cream"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Image URLs (comma-separated)</label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="accent-accent w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-xs font-heading uppercase text-text-secondary cursor-pointer">
                  Feature on Home Page
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;

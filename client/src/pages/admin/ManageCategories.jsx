import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlineFolder } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import AdminNav from '../../components/AdminNav';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    name: '',
    slug: '',
    description: '',
    image: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c._id);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Products assigned to it will remain unaffected.')) return;
    try {
      const { data } = await api.delete(`/categories/${id}`);
      if (data.success) {
        toast.success('Category deleted');
        setCategories(categories.filter((cat) => cat._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { data } = await api.put(`/categories/${editingId}`, formData);
        if (data.success) {
          toast.success('Category updated successfully');
          setShowModal(false);
          fetchCategories();
        }
      } else {
        const { data } = await api.post('/categories', formData);
        if (data.success) {
          toast.success('Category created successfully');
          setShowModal(false);
          fetchCategories();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  return (
    <div>
      <AdminNav />

      <div className="page-container pb-12 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-accent">Store Setup</span>
            <h1 className="section-title mt-1">Manage Categories</h1>
          </div>
          <button onClick={handleOpenAdd} className="btn-primary flex items-center gap-2">
            <HiOutlinePlus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {loading ? (
          <Loader text="Loading categories..." />
        ) : categories.length === 0 ? (
          <EmptyState title="No categories found" message="Click 'Add Category' to create your first category." />
        ) : (
          <div className="overflow-x-auto bg-bg-surface border border-border">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-bg-hover uppercase font-heading text-text-secondary tracking-wider">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Slug / Filter ID</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((c) => (
                  <tr key={c._id} className="hover:bg-bg-hover/50 transition-colors">
                    <td className="p-4 font-semibold text-text-primary flex items-center gap-3">
                      <div className="w-8 h-8 bg-bg-hover border border-border flex items-center justify-center text-accent">
                        <HiOutlineFolder className="w-4 h-4" />
                      </div>
                      {c.name}
                    </td>
                    <td className="p-4 font-mono text-accent">{c.slug}</td>
                    <td className="p-4 text-text-secondary max-w-xs truncate">{c.description || 'No description'}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(c)} className="p-2 text-text-secondary hover:text-accent">
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c._id)} className="p-2 text-text-secondary hover:text-status-error">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-bg-surface border border-border w-full max-w-lg p-6 sm:p-8 space-y-6 animate-scale-in">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <h2 className="font-heading font-bold text-lg uppercase">
                  {editingId ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-primary">
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hoodies, Oversized Tees, Jackets"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
                      setFormData({ ...formData, name, slug: editingId ? formData.slug : slug });
                    }}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Slug (URL identifier)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. hoodie, tee, lower"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-heading uppercase text-text-secondary block mb-1">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Brief description of products in this category..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingId ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;

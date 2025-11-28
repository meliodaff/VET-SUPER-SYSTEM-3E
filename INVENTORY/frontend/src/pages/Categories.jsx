import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Tag } from 'lucide-react';
import '../styles/categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Medicine', 
      description: 'Veterinary medicines, pharmaceuticals, and medications for animals', 
      productCount: 12,
      createdDate: 'Oct 4, 2025'
    },
    { 
      id: 2, 
      name: 'Supply', 
      description: 'Medical supplies, consumables, and general veterinary supplies', 
      productCount: 8,
      createdDate: 'Oct 4, 2025'
    },
    { 
      id: 3, 
      name: 'Equipment', 
      description: 'Veterinary equipment, tools, and diagnostic devices', 
      productCount: 5,
      createdDate: 'Oct 4, 2025'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, name: formData.name, description: formData.description }
          : cat
      ));
    } else {
      const newCategory = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        productCount: 0,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setCategories([...categories, newCategory]);
    }
    setShowModal(false);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="categories-container">
      {/* Header */}
      <div className="categories-header">
        <div className="header-left">
          <h1>Categories</h1>
          <p className="subtitle">Organize your veterinary products into categories for better management</p>
        </div>
        <button className="btn-add" onClick={handleAddNew}>
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Overview Section */}
      <div className="overview-card">
        <div className="overview-header">Overview</div>
        <div className="overview-content">
          <div className="overview-icon">
            <Tag size={24} />
          </div>
          <div className="overview-info">
            <div className="overview-number">{categories.length}</div>
            <div className="overview-label">Total Categories</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-header">Search Categories</div>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="categories-table-section">
        <div className="table-header">
          <div className="table-title">Categories ({filteredCategories.length})</div>
          <div className="table-subtitle">Manage product categories and their descriptions</div>
        </div>
        
        <div className="table-container">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Product Count</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(category => (
                <tr key={category.id}>
                  <td className="td-name">{category.name}</td>
                  <td className="td-description">{category.description}</td>
                  <td className="td-count">{category.productCount} products</td>
                  <td className="td-date">{category.createdDate}</td>
                  <td className="td-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(category)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(category.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCategories.length === 0 && (
            <div className="empty-state">
              <Tag size={48} />
              <p>No categories found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                <p className="modal-subtitle">
                  {editingCategory 
                    ? 'Update category information' 
                    : 'Create a new category to organize your veterinary products'}
                </p>
              </div>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description..."
                  rows="3"
                />
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn-submit" onClick={handleSubmit}>
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
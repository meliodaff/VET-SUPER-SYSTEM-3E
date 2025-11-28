import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Tag } from 'lucide-react';
import '../styles/categories.css';

const API_URL = 'http://localhost/inventory-system/backend/api.php';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  // 1. Fetch Categories on Load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    setLoading(false);
  };

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${API_URL}?action=delete_category&id=${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          alert('Category deleted successfully');
          fetchCategories(); // Refresh list
        } else {
          alert('Error: ' + data.error);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  // Helper to create FormData for PHP
  const toFormData = (obj) => {
    const form = new FormData();
    for (const key in obj) {
      form.append(key, obj[key]);
    }
    return form;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare Data
    const payload = {
        name: formData.name,
        description: formData.description
    };

    if (editingCategory) {
        payload.id = editingCategory.id;
    }

    const bodyData = toFormData(payload);
    
    // Determine Action
    const action = editingCategory ? 'update_category' : 'add_category';

    try {
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            body: bodyData
        });
        const data = await response.json();

        if (data.success) {
            alert(editingCategory ? 'Category updated!' : 'Category added!');
            setShowModal(false);
            setFormData({ name: '', description: '' });
            fetchCategories(); // Refresh list to get new data/dates
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error("Error saving category:", error);
        alert("Failed to save category");
    }
  };

  return (
    <div className="categories-container">
      {/* Header */}
      <div className="categories-header">
        <div className="header-left">
          <h1>Categories</h1>
          <p className="subtitle">Organize your products into categories for better management</p>
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
        
        {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Categories...</div>
        ) : (
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
                    {/* Display Live Product Count from Database */}
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
        )}
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
                    : 'Create a new category to organize your products'}
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
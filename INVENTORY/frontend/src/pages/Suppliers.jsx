import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import '../styles/suppliers.css';

const API_URL = 'http://localhost/inventory-system/backend/api.php';

const Suppliers = () => {
  // 1. Initialize empty state
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  // 2. Fetch Data on Load
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=suppliers`);
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
    setLoading(false);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingSupplier(null);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
    setShowModal(true);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const response = await fetch(`${API_URL}?action=delete_supplier&id=${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          alert('Supplier deleted successfully');
          fetchSuppliers();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (error) {
        console.error("Error deleting supplier:", error);
      }
    }
  };

  // Helper for PHP FormData
  const toFormData = (obj) => {
    const form = new FormData();
    for (const key in obj) {
      form.append(key, obj[key]);
    }
    return form;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data
    const payload = { ...formData };
    if (editingSupplier) {
        payload.id = editingSupplier.id;
    }

    const bodyData = toFormData(payload);
    const action = editingSupplier ? 'update_supplier' : 'add_supplier';

    try {
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            body: bodyData
        });
        const data = await response.json();

        if (data.success) {
            alert(editingSupplier ? 'Supplier updated!' : 'Supplier added!');
            setShowModal(false);
            setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
            fetchSuppliers(); // Refresh list
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error("Error saving supplier:", error);
    }
  };

  return (
    <div className="suppliers-container">
      {/* Header */}
      <div className="suppliers-header">
        <div className="header-left">
          <h1>Suppliers</h1>
          <p className="subtitle">Manage your veterinary suppliers and their contact information</p>
        </div>
        <button className="btn-add" onClick={handleAddNew}>
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      {/* Overview Section */}
      <div className="overview-card">
        <div className="overview-header">Overview</div>
        <div className="overview-content">
          <div className="overview-icon">
            <Package size={24} />
          </div>
          <div className="overview-info">
            <div className="overview-number">{suppliers.length}</div>
            <div className="overview-label">Total Suppliers</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-header">Search Suppliers</div>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="suppliers-table-section">
        <div className="table-header">
          <div className="table-title">Suppliers ({filteredSuppliers.length})</div>
          <div className="table-subtitle">Manage supplier information and contact details</div>
        </div>
        
        {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Suppliers...</div>
        ) : (
            <div className="table-container">
            <table className="suppliers-table">
                <thead>
                <tr>
                    <th>Supplier Name</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredSuppliers.map(supplier => (
                    <tr key={supplier.id}>
                    <td className="td-name">{supplier.name}</td>
                    <td className="td-contact">{supplier.contactPerson}</td>
                    <td className="td-email">
                        <a href={`mailto:${supplier.email}`}>{supplier.email}</a>
                    </td>
                    <td className="td-phone">{supplier.phone}</td>
                    <td className="td-address">{supplier.address}</td>
                    <td className="td-date">{supplier.createdDate}</td>
                    <td className="td-actions">
                        <button
                        className="btn-icon"
                        onClick={() => handleEdit(supplier)}
                        title="Edit"
                        >
                        <Edit2 size={16} />
                        </button>
                        <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(supplier.id)}
                        title="Delete"
                        >
                        <Trash2 size={16} />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {filteredSuppliers.length === 0 && (
                <div className="empty-state">
                <Package size={48} />
                <p>No suppliers found</p>
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
                <h2>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                <p className="modal-subtitle">
                  {editingSupplier 
                    ? 'Update supplier information' 
                    : 'Add a new supplier to your network'}
                </p>
              </div>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Supplier Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter full address..."
                  rows="3"
                />
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn-submit" onClick={handleSubmit}>
                  {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
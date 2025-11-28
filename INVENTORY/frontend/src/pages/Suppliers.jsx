import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import '../styles/suppliers.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'VetMed Pharmaceuticals',
      contactPerson: 'Dr. Sarah Chen',
      email: 'orders@vetmedpharma.com',
      phone: '+1-555-0123',
      address: '456 Medical Plaza, San Francisco, CA',
      createdDate: 'Oct 4, 2025'
    },
    {
      id: 2,
      name: 'Pet Care Supplies Co.',
      contactPerson: 'Michael Rodriguez',
      email: 'sales@petcaresupplies.com',
      phone: '+1-555-0456',
      address: '789 Commerce Street, Austin, TX',
      createdDate: 'Oct 4, 2025'
    },
    {
      id: 3,
      name: 'Animal Health Solutions',
      contactPerson: 'Jennifer Wu',
      email: 'contact@animalhealthsolutions.com',
      phone: '+1-555-0789',
      address: '321 Healthcare Ave, Boston, MA',
      createdDate: 'Oct 4, 2025'
    },
    {
      id: 4,
      name: 'Veterinary Equipment Inc.',
      contactPerson: 'David Thompson',
      email: 'info@vetequipment.com',
      phone: '+1-555-0321',
      address: '654 Industrial Blvd, Chicago, IL',
      createdDate: 'Oct 4, 2025'
    }
  ]);

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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(sup => sup.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSupplier) {
      setSuppliers(suppliers.map(sup =>
        sup.id === editingSupplier.id
          ? { ...sup, ...formData }
          : sup
      ));
    } else {
      const newSupplier = {
        id: Math.max(...suppliers.map(s => s.id), 0) + 1,
        ...formData,
        createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setShowModal(false);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
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
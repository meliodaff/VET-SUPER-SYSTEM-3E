import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronDown, X, Edit2, Eye, Trash2, Check } from 'lucide-react';
import '../styles/products.css';

const API_URL = 'http://localhost/inventory-system/backend/api.php';

function Products() {
  // State Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // 1. NEW STATE FOR SUPPLIERS
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    itemName: '',
    categoryId: '',
    quantity: '',
    unit: 'Pack',
    cost: '',
    sellingPrice: '',
    description: '',
    supplier: '',
    expiryDate: '',
    image: null
  });

  // Initial Fetch
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers(); // 2. FETCH SUPPLIERS ON LOAD
  }, []);

  // --- API Functions ---

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}?action=categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
        if (data.data.length > 0) {
           setFormData(prev => ({ ...prev, categoryId: data.data[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // 3. NEW FUNCTION TO FETCH SUPPLIERS
  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}?action=suppliers`);
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=all`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products');
    }
    setLoading(false);
  };

  const toFormData = (obj) => {
    const form = new FormData();
    for (const key in obj) {
      form.append(key, obj[key] === null ? '' : obj[key]);
    }
    return form;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bodyData = toFormData(formData);
      const response = await fetch(`${API_URL}?action=add`, {
        method: 'POST',
        body: bodyData 
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Product added successfully!');
        setShowAddModal(false);
        resetForm();
        fetchProducts();
      } else {
        alert('Error: ' + (data.error || 'Failed to add product'));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
    setLoading(false);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const bodyData = toFormData(formData);
      bodyData.append('id', selectedItem.id); 

      const response = await fetch(`${API_URL}?action=update`, {
        method: 'POST', 
        body: bodyData
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Product updated successfully!');
        setShowEditModal(false);
        resetForm();
        fetchProducts();
      } else {
        alert('Error: ' + (data.error || 'Failed to update product'));
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
    setLoading(false);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name} (${item.id})?`)) {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}?action=delete&id=${item.id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
          alert('Product deleted successfully!');
          fetchProducts();
        } else {
          alert('Error: ' + (data.error || 'Failed to delete product'));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
      setLoading(false);
    }
  };

  // --- Helper Functions ---

  const getLowStockItems = () => {
    return products.filter(item => parseInt(item.quantity) === 0);
  };

  const sortData = (data) => {
    const sorted = [...data];
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'quantity') {
      sorted.sort((a, b) => a.quantity - b.quantity);
    } else if (sortBy === 'expiry') {
      sorted.sort((a, b) => {
        const dateA = a.expiry === 'N/A' ? new Date('9999-12-31') : new Date(a.expiry);
        const dateB = b.expiry === 'N/A' ? new Date('9999-12-31') : new Date(b.expiry);
        return dateA - dateB;
      });
    }
    return sorted;
  };

  const filteredData = sortData(
    products.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category_name && item.category_name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const hasStock = parseInt(item.quantity) > 0;
      return matchesSearch && hasStock;
    })
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    const defaultCatId = categories.length > 0 ? categories[0].id : '';
    setFormData({
      itemName: '', categoryId: defaultCatId, quantity: '', unit: 'Pack', cost: '', sellingPrice: '', 
      description: '', supplier: '', expiryDate: '', image: null
    });
  };

  const handleView = (item) => { setSelectedItem(item); setShowViewModal(true); };
  
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setFormData({
      itemName: item.name,
      categoryId: item.category_id,
      quantity: item.quantity.toString(),
      unit: item.unit,
      cost: item.cost,
      sellingPrice: item.selling_price,
      description: item.description,
      supplier: item.supplier,
      expiryDate: item.expiry === 'N/A' ? '' : item.expiry,
      image: item.image
    });
    setShowEditModal(true);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
  };

  const lowStockCount = getLowStockItems().length;

  return (
    <div className="products-container">
      <div className="products-wrapper">
        <div className="products-header">
          <div>
            <h1 className="products-title">Products</h1>
            <p className="product-subtitle">Welcome back! Here's what's happening with your inventory.</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-add-item">
            <Plus size={20} />
            <span>Add Item</span>
          </button>
        </div>

        <div className="products-content">
          <div className="controls-row">
            <button onClick={() => setShowLowStockModal(true)} className="btn-low-stock">
              <span>Low Stock Items</span>
              <span className="low-stock-badge">{lowStockCount}</span>
            </button>

            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="search-input"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="dropdown-wrapper" style={{ position: 'relative' }}>
              <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="dropdown-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Sort by: <strong>{sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</strong></span>
                <ChevronDown size={20} />
              </button>
              
              {showSortDropdown && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowSortDropdown(false)} />
                  <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', zIndex: 50, backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', minWidth: '180px', overflow: 'hidden' }}>
                    <button onClick={() => handleSortChange('name')} className="dropdown-item" style={{ width: '100%', textAlign: 'left', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', backgroundColor: sortBy === 'name' ? '#f3f4f6' : 'transparent', border: 'none', cursor: 'pointer' }}>
                      <span>Name</span> {sortBy === 'name' && <Check size={16} />}
                    </button>
                    <button onClick={() => handleSortChange('quantity')} className="dropdown-item" style={{ width: '100%', textAlign: 'left', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', backgroundColor: sortBy === 'quantity' ? '#f3f4f6' : 'transparent', border: 'none', cursor: 'pointer' }}>
                      <span>Quantity</span> {sortBy === 'quantity' && <Check size={16} />}
                    </button>
                    <button onClick={() => handleSortChange('expiry')} className="dropdown-item" style={{ width: '100%', textAlign: 'left', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', backgroundColor: sortBy === 'expiry' ? '#f3f4f6' : 'transparent', border: 'none', cursor: 'pointer' }}>
                      <span>Expiry Date</span> {sortBy === 'expiry' && <Check size={16} />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : (
            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>CATEGORY</th>
                    <th className="text-center">QUANTITY</th>
                    <th>EXPIRY DATE</th>
                    <th className="text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                      <td>{item.name}</td>
                      <td>{item.category_name || 'Uncategorized'}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td>{item.expiry}</td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleView(item)} className="btn-action btn-view-action" title="View"><Eye size={16} /></button>
                          <button onClick={() => handleEditClick(item)} className="btn-action btn-edit-action" title="Edit"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(item)} className="btn-action btn-delete-action" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-container modal-view-large">
            <div className="modal-header">
              <h2>VIEW PRODUCT</h2>
              <button onClick={() => setShowViewModal(false)} className="btn-close"><X size={20} /></button>
            </div>
            <div className="modal-content">
              <div className="view-layout">
                <div className="view-left">
                  <div className="view-image-section">
                    <label className="view-section-label">Image</label>
                    <div className="view-image-box">
                      {selectedItem.image ? ( <img src={selectedItem.image} alt={selectedItem.name} className="view-image" /> ) : ( <div className="view-image-placeholder"><Plus size={48} /></div> )}
                    </div>
                  </div>
                  <div className="view-description-section">
                    <label className="view-section-label">Description</label>
                    <div className="view-description-box">{selectedItem.description}</div>
                  </div>
                </div>
                <div className="view-right">
                  <div className="view-field-group">
                    <label className="view-field-label">Item Name</label>
                    <div className="view-field-value">{selectedItem.name}</div>
                  </div>
                  
                  {/* Category & Quantity Row */}
                  <div className="view-field-row">
                    <div className="view-field-group">
                      <label className="view-field-label">Category</label>
                      <div className="view-field-value">{selectedItem.category_name || 'Uncategorized'}</div>
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Quantity</label>
                      <div className="view-field-value">{selectedItem.quantity}</div>
                    </div>
                  </div>

                  <div className="view-field-row">
                    <div className="view-field-group">
                      <label className="view-field-label">Unit</label>
                      <div className="view-field-value">{selectedItem.unit}</div>
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Cost</label>
                      <div className="view-field-value">{selectedItem.cost} PHP</div>
                    </div>
                  </div>
                  <div className="view-field-row">
                    <div className="view-field-group">
                      <label className="view-field-label">Selling Price</label>
                      <div className="view-field-value">{selectedItem.selling_price} PHP</div>
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Expiration Date</label>
                      <div className="view-field-value">{selectedItem.expiry}</div>
                    </div>
                  </div>
                   <div className="view-field-group view-field-grow">
                      <label className="view-field-label">Supplier / Manufacturer</label>
                      <div className="view-field-value">{selectedItem.supplier}</div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal-container modal-view-large">
            <div className="modal-header">
              <h2>{showEditModal ? 'EDIT PRODUCT' : 'ADD ITEM'}</h2>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="btn-close"><X size={20} /></button>
            </div>
            <div className="modal-content">
              <div className="view-layout">
                <div className="view-left">
                  <div className="view-image-section">
                    <label className="view-section-label">Insert Image</label>
                    <div className="view-image-box edit-mode">
                      {formData.image ? (
                        <div className="image-edit-container">
                          <img src={formData.image} alt="Preview" className="view-image" />
                          <label htmlFor="image-upload" className="image-overlay"><span>Change Image</span></label>
                        </div>
                      ) : (
                        <label htmlFor="image-upload" className="image-upload-empty">
                          <Plus size={48} />
                          <span>Click to upload image</span>
                        </label>
                      )}
                      <input type="file" onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} id="image-upload" />
                    </div>
                  </div>
                  <div className="view-description-section">
                    <label className="view-section-label">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Add description here..." className="view-description-input" />
                  </div>
                </div>
                <div className="view-right">
                  <div className="view-field-group">
                    <label className="view-field-label">Item Name</label>
                    <input type="text" value={formData.itemName} onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} className="view-field-input" placeholder="Enter item name" />
                  </div>

                  <div className="view-field-row">
                    <div className="view-field-group">
                      <label className="view-field-label">Category</label>
                      <select 
                        value={formData.categoryId} 
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} 
                        className="view-field-input"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Quantity</label>
                      <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="0" className="view-field-input" />
                    </div>
                  </div>

                  <div className="view-field-row">
                    <div className="view-field-group">
                      <label className="view-field-label">Unit</label>
                      <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="view-field-input">
                        <option>Pack</option><option>Box</option><option>Piece</option><option>Bottle</option><option>Roll</option><option>Vial</option>
                      </select>
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Cost</label>
                      <input type="text" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} placeholder="200 PHP" className="view-field-input" />
                    </div>
                  </div>
                  <div className="view-field-row">
                    <div className="view-field-group">
                      <label className="view-field-label">Selling Price</label>
                      <input type="text" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} placeholder="300 PHP" className="view-field-input" />
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Expiration Date</label>
                      <input type="text" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} placeholder="YYYY-MM-DD" className="view-field-input" />
                    </div>
                  </div>
                  
                  {/* --- 4. SUPPLIER DROPDOWN --- */}
                  <div className="view-field-group view-field-grow">
                      <label className="view-field-label">Supplier / Manufacturer</label>
                      <select 
                        value={formData.supplier} 
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} 
                        className="view-field-input"
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map(sup => (
                          <option key={sup.id} value={sup.name}>{sup.name}</option>
                        ))}
                      </select>
                  </div>

                  <div className="modal-actions-inline">
                    <button onClick={showEditModal ? handleEdit : handleSubmit} className="btn-confirm" disabled={loading}>
                      {loading ? 'Processing...' : (showEditModal ? 'Update' : 'Confirm')}
                    </button>
                    <button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="btn-cancel">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Modal */}
      {showLowStockModal && (
        <div className="modal-overlay">
          <div className="modal-container modal-low-stock">
            <div className="modal-header">
              <h2>LOW STOCK!</h2>
              <button onClick={() => setShowLowStockModal(false)} className="btn-close"><X size={20} /></button>
            </div>
            <div className="modal-content">
              <div className="low-stock-list">
                {getLowStockItems().length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No low stock items found!</p>
                ) : (
                  getLowStockItems().map((item) => (
                    <div key={item.id} className="low-stock-item">
                      <div className="low-stock-grid">
                        <div><p className="low-stock-label">ITEM ID</p><p className="low-stock-value">{item.id}</p></div>
                        <div><p className="low-stock-label">NAME</p><p className="low-stock-value">{item.name}</p></div>
                        <div><p className="low-stock-label">QUANTITY IN STOCK</p><p className="low-stock-value low-stock-quantity">{item.quantity}</p></div>
                        <div><p className="low-stock-label">EXPIRY DATE</p><p className="low-stock-value">{item.expiry}</p></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
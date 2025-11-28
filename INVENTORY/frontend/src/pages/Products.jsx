import React, { useState } from 'react';
import { Plus, Search, ChevronDown, X, Edit2, Eye, Trash2 } from 'lucide-react';
import '../styles/products.css';

// Mock data for different categories
// Mock data for veterinary items
const mockData = {
  equipment: [ 
    { id: 'EQP-0001', name: 'Digital Thermometer', quantity: 15, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '450 PHP', sellingPrice: '650 PHP', description: 'Digital pet thermometer for accurate temperature readings', supplier: 'VetMed Supply Co.', image: null },
    { id: 'EQP-0002', name: 'Stethoscope', quantity: 8, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '1,200 PHP', sellingPrice: '1,800 PHP', description: 'Professional veterinary stethoscope', supplier: 'MediVet Plus', image: null },
    { id: 'EQP-0003', name: 'Pet Scale', quantity: 5, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '3,500 PHP', sellingPrice: '5,000 PHP', description: 'Digital weighing scale for pets up to 50kg', supplier: 'VetMed Supply Co.', image: null },
    { id: 'EQP-0004', name: 'Examination Table', quantity: 3, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '8,000 PHP', sellingPrice: '12,000 PHP', description: 'Stainless steel veterinary examination table', supplier: 'Animal Care Equipment', image: null },
    { id: 'EQP-0005', name: 'Otoscope', quantity: 6, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '2,800 PHP', sellingPrice: '4,000 PHP', description: 'For examining ears of dogs and cats', supplier: 'MediVet Plus', image: null },
    { id: 'EQP-0006', name: 'Blood Pressure Monitor', quantity: 4, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '5,500 PHP', sellingPrice: '7,500 PHP', description: 'Veterinary blood pressure monitoring device', supplier: 'VetMed Supply Co.', image: null },
    { id: 'EQP-0007', name: 'Surgical Scissors', quantity: 12, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '800 PHP', sellingPrice: '1,200 PHP', description: 'Stainless steel surgical scissors', supplier: 'Animal Care Equipment', image: null },
    { id: 'EQP-0008', name: 'Nail Clippers', quantity: 20, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '250 PHP', sellingPrice: '400 PHP', description: 'Professional pet nail clippers', supplier: 'Pet Grooming Essentials', image: null },
    { id: 'EQP-0009', name: 'Syringe Pump', quantity: 2, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '15,000 PHP', sellingPrice: '22,000 PHP', description: 'Automated medication delivery system', supplier: 'MediVet Plus', image: null },
    { id: 'EQP-0010', name: 'Oxygen Concentrator', quantity: 1, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '45,000 PHP', sellingPrice: '65,000 PHP', description: 'Portable oxygen therapy device for pets', supplier: 'VetMed Supply Co.', image: null },
    { id: 'EQP-0011', name: 'Pet Carrier - Large', quantity: 0, expiry: 'N/A', category: 'Equipment', unit: 'Piece', cost: '1,800 PHP', sellingPrice: '2,500 PHP', description: 'Durable pet carrier for large dogs', supplier: 'Pet Grooming Essentials', image: null },
  ],
  medicine: [
    { id: 'MED-0001', name: 'Amoxicillin 500mg', quantity: 45, expiry: '06/15/2026', category: 'Medicine', unit: 'Box', cost: '350 PHP', sellingPrice: '500 PHP', description: 'Antibiotic for bacterial infections in dogs and cats', supplier: 'Zoetis Philippines', image: null },
    { id: 'MED-0002', name: 'Cephalexin 250mg', quantity: 28, expiry: '08/20/2025', category: 'Medicine', unit: 'Box', cost: '420 PHP', sellingPrice: '600 PHP', description: 'Treats skin and soft tissue infections', supplier: 'Virbac Animal Health', image: null },
    { id: 'MED-0003', name: 'Deworming Tablet', quantity: 60, expiry: '12/30/2025', category: 'Medicine', unit: 'Box', cost: '180 PHP', sellingPrice: '280 PHP', description: 'Broad-spectrum dewormer for dogs and cats', supplier: 'Bayer Animal Health', image: null },
    { id: 'MED-0004', name: 'Flea & Tick Treatment', quantity: 35, expiry: '03/10/2026', category: 'Medicine', unit: 'Box', cost: '550 PHP', sellingPrice: '800 PHP', description: 'Topical treatment for fleas and ticks', supplier: 'Merial Philippines', image: null },
    { id: 'MED-0005', name: 'Anti-Inflammatory Tablets', quantity: 22, expiry: '09/05/2025', category: 'Medicine', unit: 'Box', cost: '480 PHP', sellingPrice: '700 PHP', description: 'For pain and inflammation relief', supplier: 'Zoetis Philippines', image: null },
    { id: 'MED-0006', name: 'Vitamin Supplements', quantity: 50, expiry: '11/22/2026', category: 'Medicine', unit: 'Bottle', cost: '320 PHP', sellingPrice: '480 PHP', description: 'Complete multivitamin for pets', supplier: 'Virbac Animal Health', image: null },
    { id: 'MED-0007', name: 'Heartworm Prevention', quantity: 18, expiry: '07/18/2025', category: 'Medicine', unit: 'Box', cost: '650 PHP', sellingPrice: '950 PHP', description: 'Monthly heartworm preventive medication', supplier: 'Merial Philippines', image: null },
    { id: 'MED-0008', name: 'Probiotic Powder', quantity: 40, expiry: '05/30/2026', category: 'Medicine', unit: 'Box', cost: '280 PHP', sellingPrice: '420 PHP', description: 'Digestive health support for pets', supplier: 'Bayer Animal Health', image: null },
    { id: 'MED-0009', name: 'Eye Drops', quantity: 0, expiry: '04/12/2025', category: 'Medicine', unit: 'Bottle', cost: '220 PHP', sellingPrice: '350 PHP', description: 'Treats eye infections and irritations', supplier: 'Zoetis Philippines', image: null },
    { id: 'MED-0010', name: 'Ear Cleaner Solution', quantity: 32, expiry: '10/08/2025', category: 'Medicine', unit: 'Bottle', cost: '180 PHP', sellingPrice: '280 PHP', description: 'Gentle ear cleaning solution for pets', supplier: 'Virbac Animal Health', image: null },
    { id: 'MED-0011', name: 'Antibiotic Injection', quantity: 0, expiry: '02/25/2026', category: 'Medicine', unit: 'Vial', cost: '520 PHP', sellingPrice: '750 PHP', description: 'Injectable antibiotic for serious infections', supplier: 'Merial Philippines', image: null },
  ],
  supply: [
    { id: 'SUP-0001', name: 'Surgical Gloves', quantity: 200, expiry: 'N/A', category: 'Supply', unit: 'Box', cost: '450 PHP', sellingPrice: '650 PHP', description: 'Latex-free surgical gloves, size M', supplier: 'MedSupply Philippines', image: null },
    { id: 'SUP-0002', name: 'Gauze Pads', quantity: 150, expiry: 'N/A', category: 'Supply', unit: 'Pack', cost: '120 PHP', sellingPrice: '180 PHP', description: 'Sterile gauze pads 4x4 inches', supplier: 'MedSupply Philippines', image: null },
    { id: 'SUP-0003', name: 'Syringes 3ml', quantity: 300, expiry: 'N/A', category: 'Supply', unit: 'Box', cost: '280 PHP', sellingPrice: '400 PHP', description: 'Disposable syringes with needles', supplier: 'VetMed Supply Co.', image: null },
    { id: 'SUP-0004', name: 'Bandages', quantity: 80, expiry: 'N/A', category: 'Supply', unit: 'Roll', cost: '85 PHP', sellingPrice: '130 PHP', description: 'Self-adhesive bandage wrap', supplier: 'MedSupply Philippines', image: null },
    { id: 'SUP-0005', name: 'Cotton Balls', quantity: 50, expiry: 'N/A', category: 'Supply', unit: 'Pack', cost: '95 PHP', sellingPrice: '150 PHP', description: 'Sterile cotton balls for cleaning', supplier: 'MedSupply Philippines', image: null },
    { id: 'SUP-0006', name: 'Alcohol Swabs', quantity: 120, expiry: 'N/A', category: 'Supply', unit: 'Box', cost: '180 PHP', sellingPrice: '260 PHP', description: 'Pre-moistened alcohol prep pads', supplier: 'VetMed Supply Co.', image: null },
    { id: 'SUP-0007', name: 'Surgical Masks', quantity: 180, expiry: 'N/A', category: 'Supply', unit: 'Box', cost: '220 PHP', sellingPrice: '320 PHP', description: '3-ply disposable surgical masks', supplier: 'MedSupply Philippines', image: null },
    { id: 'SUP-0008', name: 'Feeding Tubes', quantity: 45, expiry: 'N/A', category: 'Supply', unit: 'Pack', cost: '380 PHP', sellingPrice: '550 PHP', description: 'Nasogastric feeding tubes for pets', supplier: 'VetMed Supply Co.', image: null },
    { id: 'SUP-0009', name: 'IV Catheters', quantity: 65, expiry: 'N/A', category: 'Supply', unit: 'Box', cost: '520 PHP', sellingPrice: '750 PHP', description: 'Intravenous catheters, various sizes', supplier: 'MedSupply Philippines', image: null },
    { id: 'SUP-0010', name: 'Specimen Containers', quantity: 90, expiry: 'N/A', category: 'Supply', unit: 'Pack', cost: '150 PHP', sellingPrice: '220 PHP', description: 'Sterile sample collection containers', supplier: 'VetMed Supply Co.', image: null },
    { id: 'SUP-0011', name: 'Pet Shampoo', quantity: 0, expiry: 'N/A', category: 'Supply', unit: 'Bottle', cost: '280 PHP', sellingPrice: '420 PHP', description: 'Medicated shampoo for skin conditions', supplier: 'Pet Grooming Essentials', image: null },
  ]
};

function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Medicine',
    quantity: '',
    unit: 'Pack',
    cost: '',
    sellingPrice: '',
    description: '',
    supplier: '',
    expiryDate: '',
    image: null
  });

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'supply', label: 'Supply' },
    { value: 'equipment', label: 'Equipment' }
  ];

  // Get data based on selected category
  const getCurrentData = () => {
    if (selectedCategory === 'all') {
      return [...mockData.equipment, ...mockData.medicine, ...mockData.supply];
    }
    return mockData[selectedCategory] || [];
  };

  const currentData = getCurrentData();
  
  // Get low stock items (quantity === 0)
  const getLowStockItems = () => {
    const allItems = [...mockData.equipment, ...mockData.medicine, ...mockData.supply];
    return allItems.filter(item => item.quantity === 0);
  };

  const lowStockCount = getLowStockItems().length;

  // Parse date for sorting
  const parseDate = (dateStr) => {
    if (dateStr === 'N/A') return new Date('9999-12-31');
    const [month, day, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  };

  // Sort data
  const sortData = (data) => {
    const sorted = [...data];
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'quantity') {
      sorted.sort((a, b) => a.quantity - b.quantity);
    } else if (sortBy === 'expiry') {
      sorted.sort((a, b) => parseDate(a.expiry) - parseDate(b.expiry));
    }
    return sorted;
  };

  const filteredData = sortData(
    currentData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
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

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = () => {
    console.log('Edit submitted:', formData);
    setShowEditModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      category: 'Medicine',
      quantity: '',
      unit: 'Pack',
      cost: '',
      sellingPrice: '',
      description: '',
      supplier: '',
      expiryDate: '',
      image: null
    });
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setFormData({
      itemName: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit,
      cost: item.cost,
      sellingPrice: item.sellingPrice,
      description: item.description,
      supplier: item.supplier,
      expiryDate: item.expiry,
      image: item.image
    });
    setShowEditModal(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name} (${item.id})?`)) {
      console.log('Delete item:', item);
      // Add delete logic here
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
  };

  return (
    <div className="products-container">
      <div className="products-wrapper">
        {/* Header */}
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

        {/* Main Content */}
        <div className="products-content">
          {/* Controls Row */}
          <div className="controls-row">
            {/* Low Stock Button */}
            <button onClick={() => setShowLowStockModal(true)} className="btn-low-stock">
              <span>Low Stock Items</span>
              <span className="low-stock-badge">{lowStockCount}</span>
            </button>

            {/* Search */}
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

            {/* Category Dropdown */}
            <div className="dropdown-wrapper">
              <button onClick={() => setShowDropdown(!showDropdown)} className="dropdown-btn">
                <span className="capitalize">{selectedCategory === 'all' ? 'All Items' : selectedCategory}</span>
                <ChevronDown size={20} />
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setShowDropdown(false);
                      }}
                      className="dropdown-item"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div className="dropdown-wrapper">
              <button onClick={() => setShowSortDropdown(!showSortDropdown)} className="dropdown-btn">
                <span>Sort by</span>
                <ChevronDown size={20} />
              </button>
              
              {showSortDropdown && (
                <div className="dropdown-menu">
                  <button onClick={() => handleSortChange('name')} className="dropdown-item">
                    Name
                  </button>
                  <button onClick={() => handleSortChange('quantity')} className="dropdown-item">
                    Quantity
                  </button>
                  <button onClick={() => handleSortChange('expiry')} className="dropdown-item">
                    Expiry Date
                  </button>
                </div>
              )}
            </div>
          </div>

        {/* Table */}
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ITEM ID</th>
                  <th>NAME</th>
                  <th className="text-center">QUANTITY IN STOCK</th>
                  <th>EXPIRY DATE</th>
                  <th className="text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td>{item.expiry}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleView(item)} className="btn-action btn-view-action" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEditClick(item)} className="btn-action btn-edit-action" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item)} className="btn-action btn-delete-action" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-container modal-view-large">
            <div className="modal-header">
              <h2>VIEW PRODUCT</h2>
              <button onClick={() => setShowViewModal(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="view-layout">
                {/* Left Side - Image and Description */}
                <div className="view-left">
                  <div className="view-image-section">
                    <label className="view-section-label">Image</label>
                    <div className="view-image-box">
                      {selectedItem.image ? (
                        <img src={selectedItem.image} alt={selectedItem.name} className="view-image" />
                      ) : (
                        <div className="view-image-placeholder">
                          <Plus size={48} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="view-description-section">
                    <label className="view-section-label">Description</label>
                    <div className="view-description-box">
                      {selectedItem.description}
                    </div>
                  </div>
                </div>

                {/* Right Side - Details */}
                <div className="view-right">
                  <div className="view-field-group">
                    <label className="view-field-label">Item Name</label>
                    <div className="view-field-value">{selectedItem.name}</div>
                  </div>

                  <div className="view-field-row">
                    <div className="view-field-group">
                      <label className="view-field-label">Category</label>
                      <div className="view-field-value">{selectedItem.category}</div>
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Quantity</label>
                      <div className="view-field-value">{selectedItem.quantity}</div>
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Unit</label>
                      <div className="view-field-value">{selectedItem.unit}</div>
                    </div>
                  </div>

                  <div className="view-field-row">
                    <div className="view-field-group">
                      <label className="view-field-label">Cost</label>
                      <div className="view-field-value">{selectedItem.cost}</div>
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Selling Price</label>
                      <div className="view-field-value">{selectedItem.sellingPrice}</div>
                    </div>
                  </div>

                  <div className="view-field-row">
                    <div className="view-field-group view-field-grow">
                      <label className="view-field-label">Supplier / Manufacturer</label>
                      <div className="view-field-value">{selectedItem.supplier}</div>
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Expiration Date</label>
                      <div className="view-field-value">{selectedItem.expiry}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal-container modal-view-large">
            <div className="modal-header">
              <h2>{showEditModal ? 'EDIT PRODUCT' : 'ADD ITEM'}</h2>
              <button onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                resetForm();
              }} className="btn-close">
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="view-layout">
                {/* Left Side - Image and Description */}
                <div className="view-left">
                  <div className="view-image-section">
                    <label className="view-section-label">Insert Image</label>
                    <div className="view-image-box edit-mode">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="view-image" />
                      ) : (
                        <div className="view-image-placeholder">
                          <label htmlFor="image-upload" className="image-upload-icon" style={{cursor: 'pointer'}}>
                            <Plus size={48} />
                          </label>
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="image-input"
                        id="image-upload"
                      />
                    </div>
                  </div>
                  <div className="view-description-section">
                    <label className="view-section-label">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add description here..."
                      className="view-description-input"
                    />
                  </div>
                </div>

                {/* Right Side - Details */}
                <div className="view-right">
                  <div className="view-field-group">
                    <label className="view-field-label">Item Name</label>
                    <input
                      type="text"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      className="view-field-input"
                    />
                  </div>

                  <div className="view-field-row">
                    <div className="view-field-group">
                      <label className="view-field-label">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="view-field-input"
                      >
                        <option>Medicine</option>
                        <option>Supply</option>
                        <option>Equipment</option>
                      </select>
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Quantity</label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder=""
                        className="view-field-input"
                      />
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Unit</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="view-field-input"
                      >
                        <option></option>
                        <option>Pack</option>
                        <option>Box</option>
                        <option>Piece</option>
                      </select>
                    </div>
                  </div>

                  <div className="view-field-row">
                    <div className="view-field-group">
                      <label className="view-field-label">Cost</label>
                      <input
                        type="text"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        placeholder="200 PHP"
                        className="view-field-input"
                      />
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Selling Price</label>
                      <input
                        type="text"
                        value={formData.sellingPrice}
                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                        placeholder="300 PHP"
                        className="view-field-input"
                      />
                    </div>
                  </div>

                  <div className="view-field-row">
                    <div className="view-field-group view-field-grow">
                      <label className="view-field-label">Supplier / Manufacturer</label>
                      <input
                        type="text"
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        placeholder="Zoetis"
                        className="view-field-input"
                      />
                    </div>
                    <div className="view-field-group">
                      <label className="view-field-label">Expiration Date</label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        placeholder="12/12/2026"
                        className="view-field-input"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="modal-actions-inline">
                    <button onClick={showEditModal ? handleEdit : handleSubmit} className="btn-confirm">
                      {showEditModal ? 'Edit' : 'Confirm'}
                    </button>
                    <button onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }} className="btn-cancel">
                      Cancel
                    </button>
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
              <button onClick={() => setShowLowStockModal(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="low-stock-list">
                {getLowStockItems().map((item) => (
                  <div key={item.id} className="low-stock-item">
                    <div className="low-stock-grid">
                      <div>
                        <p className="low-stock-label">ITEM ID</p>
                        <p className="low-stock-value">{item.id}</p>
                      </div>
                      <div>
                        <p className="low-stock-label">NAME</p>
                        <p className="low-stock-value">{item.name}</p>
                      </div>
                      <div>
                        <p className="low-stock-label">QUANTITY IN STOCK</p>
                        <p className="low-stock-value low-stock-quantity">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="low-stock-label">EXPIRY DATE</p>
                        <p className="low-stock-value">{item.expiry}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
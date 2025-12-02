import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { invoicesAPI } from '../../services/api';

const ViewInvoiceModal = ({ invoice, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [addedItems, setAddedItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  useEffect(() => {
    // Determine best identifier available (id, invoice_id, invoice_number)
    const identifier = invoice?.id || invoice?.invoice_id || invoice?.invoice_number;
    if (identifier) {
      fetchInvoiceDetails(identifier);
    } else {
      setError('Invoice identifier is missing. Cannot load details.');
      setLoading(false);
    }
  }, [invoice]);
  const fetchInvoiceDetails = async (identifier) => {
    try {
      setLoading(true);
      setError('');
      // Pass whatever identifier we have to the backend. Backend should support id or invoice_number.
      const response = await invoicesAPI.getInvoiceDetails(identifier);
      if (response.data.success) {
        setInvoiceDetails(response.data.data);
      } else {
        setError('Failed to load invoice details');
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      setError(error.response?.data?.message || 'Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  const addInclusionItem = () => {
    if (!newItemName.trim()) return;
    const price = parseFloat(newItemPrice) || 0;
    const item = {
      id: `added-${Date.now()}`,
      service_name: newItemName.trim(),
      service_category: 'Inclusion',
      quantity: 1,
      unit_price: price,
      line_total: price
    };
    setAddedItems((s) => [...s, item]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const removeAddedItem = (id) => {
    setAddedItems((s) => s.filter(i => i.id !== id));
  };

  const calculateTotal = () => {
    const base = invoiceDetails?.summary?.total_amount || 0;
    const added = addedItems.reduce((acc, it) => acc + (parseFloat(it.line_total) || 0), 0);
    return base + added;
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-blue-900 tracking-wide">RECEIPT</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 absolute right-4 top-4"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Print button (screen only) */}
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded print:hidden"
              >
                Print
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : invoiceDetails ? (
              <div className="space-y-4">
                {/* Printable receipt block (hidden on screen, visible when printing) */}
                <div className="receipt-print print-only hidden">
                  <div className="text-center">
                    <div className="font-bold text-lg">Fur Ever Care</div>
                    <div className="text-sm">RECEIPT</div>
                    <div className="text-xs mt-2">
                      {invoiceDetails.invoice.date || invoiceDetails.invoice.invoice_date || ''}
                      {invoiceDetails.invoice.time && ` ${invoiceDetails.invoice.time}`}
                    </div>
                    <div className="text-xs">Invoice: {invoiceDetails.invoice.invoice_number}</div>
                    {invoiceDetails.invoice.client_name && (
                      <div className="text-xs">Patient: {invoiceDetails.invoice.client_name}</div>
                    )}
                    {invoiceDetails.invoice.pet_name && (
                      <div className="text-xs">Pet: {invoiceDetails.invoice.pet_name}</div>
                    )}
                  </div>

                  <hr className="my-2" />
                  <div className="text-xs">
                    {(invoiceDetails.items || []).concat(addedItems).map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <div className="truncate pr-2">{it.service_name}</div>
                        <div className="text-right">{formatCurrency(it.line_total || it.unit_price)}</div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-2" />
                  <div className="flex justify-between text-sm font-semibold">
                    <div>Total</div>
                    <div>{formatCurrency(calculateTotal())}</div>
                  </div>
                  <div className="text-center text-xs mt-3">Thank you for your business!</div>
                </div>
                {/* Top details: Patient / Pet / Schedule / Service / Price */}
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-800">
                  <div className="flex justify-between">
                    <span className="font-semibold">Patient Name:</span>
                    <span>{invoiceDetails.invoice.client_name || invoiceDetails.invoice.fname || 'N/A'}</span>
                  </div>
                  {invoiceDetails.invoice.pet_name && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Pet Name:</span>
                      <span>{invoiceDetails.invoice.pet_name}</span>
                    </div>
                  )}
                  {invoiceDetails.invoice.phone && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Phone:</span>
                      <span>{invoiceDetails.invoice.phone}</span>
                    </div>
                  )}
                  {invoiceDetails.invoice.email && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Email:</span>
                      <span>{invoiceDetails.invoice.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-semibold">Date:</span>
                    <span>{invoiceDetails.invoice.date || invoiceDetails.invoice.invoice_date || '—'}</span>
                  </div>
                  {invoiceDetails.invoice.time && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Time:</span>
                      <span>{invoiceDetails.invoice.time}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-semibold">Service:</span>
                    <span className="font-medium">
                      {invoiceDetails.invoice.service || 
                       (invoiceDetails.items && invoiceDetails.items.length > 0
                        ? invoiceDetails.items.map(it => it.service_name).join(', ')
                        : '—')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Service Price:</span>
                    <span className="font-medium">{formatCurrency(invoiceDetails.summary.total_amount || invoiceDetails.invoice.service_price || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Payment Status:</span>
                    <span className={`font-medium ${
                      (invoiceDetails.invoice.payment_status || '').toLowerCase() === 'paid' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {invoiceDetails.invoice.payment_status || invoiceDetails.invoice.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Inclusion input */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700">Inclusion</h4>
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={addInclusionItem}
                      className="px-3 py-2 bg-blue-700 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>

                  <div className="mt-4">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-sm text-gray-600">
                          <th>Item</th>
                          <th className="text-right">Price</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {((invoiceDetails.items || []).concat(addedItems)).length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-4 text-center text-gray-500">No items yet</td>
                          </tr>
                        ) : (
                          (invoiceDetails.items || []).concat(addedItems).map((it) => (
                            <tr key={it.id} className="border-t">
                              <td className="py-2">{it.service_name}</td>
                              <td className="py-2 text-right">{formatCurrency(it.line_total || it.unit_price)}</td>
                              <td className="py-2 text-center">
                                {it.id && String(it.id).startsWith('added-') ? (
                                  <button onClick={() => removeAddedItem(it.id)} className="text-sm text-red-600">Remove</button>
                                ) : (
                                  <span className="text-sm text-gray-400">&nbsp;</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total and actions */}
                <div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-bold">{formatCurrency(calculateTotal())}</span>
                  </div>

                  {/* Removed APPROVE and CANCEL buttons to make the receipt view-only/printable */}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;


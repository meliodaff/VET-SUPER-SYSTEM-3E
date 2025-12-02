import React, { useEffect, useState } from "react";
import { Calendar, Package, CreditCard, Truck, CheckCircle2, Clock } from "lucide-react";
import { purchaseOrdersAPI, supplierAPI, inventoryAPI } from "../services/api";
import { formatCurrency } from "../utils/helpers";

const initialOrderForm = {
  supplier_id: "",
  preferred_delivery_date: "",
  notes: "",
  items: [
    { item_id: "", quantity: "", unit_cost: "" },
  ],
};

const initialPaymentForm = {
  supplier_id: "",
  purchase_order_id: "",
  amount: "",
  payment_method: "bank_transfer",
  payment_date: "",
  expected_delivery: "",
  notes: "",
};

const SupplierPayments = () => {
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
  const [orders, setOrders] = useState([]);
  const [supplierPayments, setSupplierPayments] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersRes, supplierRes, itemsRes] = await Promise.all([
        purchaseOrdersAPI.getPurchaseOrders({ limit: 20 }),
        supplierAPI.getSupplierPayments({ limit: 20 }),
        inventoryAPI.getItems(),
      ]);

      if (ordersRes?.data?.success && ordersRes.data.data) {
        setOrders(ordersRes.data.data.orders || []);
      }

      if (supplierRes?.data?.success && supplierRes.data.data) {
        setSupplierPayments(supplierRes.data.data.supplier_payments || []);
      }

      // inventory/get_items.php returns plain array
      if (Array.isArray(itemsRes?.data)) {
        setInventoryItems(itemsRes.data);
      }
    } catch (e) {
      console.error("Failed to load supplier data", e);
      const msg = e?.response?.data?.message || e.message || "Failed to load supplier data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOrderItemChange = (index, field, value) => {
    setOrderForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [field]: value,
      };
      return { ...prev, items };
    });
  };

  const addOrderItemRow = () => {
    setOrderForm((prev) => ({
      ...prev,
      items: [...prev.items, { item_id: "", quantity: "", unit_cost: "" }],
    }));
  };

  const handleCreatePurchaseOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const payload = {
        supplier_id: parseInt(orderForm.supplier_id, 10),
        preferred_delivery_date: orderForm.preferred_delivery_date || null,
        notes: orderForm.notes || null,
        items: orderForm.items
          .map((it) => ({
            item_id: it.item_id ? parseInt(it.item_id, 10) : null,
            quantity: it.quantity ? parseFloat(it.quantity) : null,
            unit_cost: it.unit_cost ? parseFloat(it.unit_cost) : null,
          }))
          .filter((it) => it.item_id && it.quantity && it.unit_cost),
      };

      const res = await purchaseOrdersAPI.createPurchaseOrder(payload);
      if (res?.data?.success) {
        setSuccess("Purchase order created successfully.");
        setOrderForm(initialOrderForm);
        await loadData();
      } else {
        const msg = res?.data?.message || "Failed to create purchase order";
        setError(msg);
      }
    } catch (e) {
      console.error("Create PO error", e);
      const msg = e?.response?.data?.message || e.message || "Failed to create purchase order";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplierPayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const payload = {
        supplier_id: parseInt(paymentForm.supplier_id, 10),
        purchase_order_id: paymentForm.purchase_order_id
          ? parseInt(paymentForm.purchase_order_id, 10)
          : null,
        amount: paymentForm.amount ? parseFloat(paymentForm.amount) : null,
        payment_method: paymentForm.payment_method,
        payment_date: paymentForm.payment_date || null,
        expected_delivery: paymentForm.expected_delivery || null,
        notes: paymentForm.notes || null,
      };

      const res = await supplierAPI.createSupplierPayment(payload);
      if (res?.data?.success) {
        setSuccess("Supplier payment recorded successfully.");
        setPaymentForm(initialPaymentForm);
        await loadData();
      } else {
        const msg = res?.data?.message || "Failed to record supplier payment";
        setError(msg);
      }
    } catch (e) {
      console.error("Create supplier payment error", e);
      const msg = e?.response?.data?.message || e.message || "Failed to record supplier payment";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDeliveryStatus = async (id, status) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await supplierAPI.updateSupplierDeliveryStatus({
        id,
        status,
      });

      if (res?.data?.success) {
        setSuccess("Delivery status updated.");
        await loadData();
      } else {
        const msg = res?.data?.message || "Failed to update delivery status";
        setError(msg);
      }
    } catch (e) {
      console.error("Update delivery status error", e);
      const msg = e?.response?.data?.message || e.message || "Failed to update delivery status";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryBadge = (payment) => {
    const status = payment.status || "";
    const onTime = payment.on_time;

    if (status === "Delivered") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {onTime === true ? "Delivered (On Time)" : "Delivered"}
        </span>
      );
    }

    if (status === "In Transit") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Truck className="h-3 w-3 mr-1" />
          In Transit
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Scheduled
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Purchase Orders & Supplier Deliveries</h1>
            <p className="text-blue-100">
              Create purchase orders, record supplier payments, and track delivery status against
              preferred dates.
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(error || success) && (
        <div className="space-y-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}
        </div>
      )}

      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Order Form */}
        <form
          onSubmit={handleCreatePurchaseOrder}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4"
        >
          <div className="flex items-center mb-2">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Create Purchase Order</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier ID
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={orderForm.supplier_id}
                onChange={(e) =>
                  setOrderForm((prev) => ({ ...prev, supplier_id: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Delivery Date
              </label>
              <div className="relative">
                <Calendar className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={orderForm.preferred_delivery_date}
                  onChange={(e) =>
                    setOrderForm((prev) => ({
                      ...prev,
                      preferred_delivery_date: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              value={orderForm.notes}
              onChange={(e) =>
                setOrderForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Order Items</span>
              <button
                type="button"
                onClick={addOrderItemRow}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Item
              </button>
            </div>

            {orderForm.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Item
                  </label>
                  <select
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
                    value={item.item_id}
                    onChange={(e) => {
                      const value = e.target.value;
                      const selected = inventoryItems.find(
                        (it) => String(it.id) === String(value)
                      );
                      handleOrderItemChange(index, "item_id", value);
                      if (selected && !item.unit_cost) {
                        handleOrderItemChange(index, "unit_cost", selected.unit_cost ?? "");
                      }
                    }}
                  >
                    <option value="">Select product</option>
                    {inventoryItems.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.name} {inv.sku ? `(${inv.sku})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                    value={item.quantity}
                    onChange={(e) =>
                      handleOrderItemChange(index, "quantity", e.target.value)
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Unit Cost
                  </label>
                  <input
                    type="number"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                    value={item.unit_cost}
                    onChange={(e) =>
                      handleOrderItemChange(index, "unit_cost", e.target.value)
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Package className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Create Purchase Order"}
          </button>
        </form>

        {/* Supplier Payment Form */}
        <form
          onSubmit={handleCreateSupplierPayment}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4"
        >
          <div className="flex items-center mb-2">
            <CreditCard className="h-5 w-5 text-emerald-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Record Supplier Payment</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier ID
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={paymentForm.supplier_id}
                onChange={(e) =>
                  setPaymentForm((prev) => ({ ...prev, supplier_id: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Linked Purchase Order (optional)
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={paymentForm.purchase_order_id}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    purchase_order_id: e.target.value,
                  }))
                }
              >
                <option value="">Not linked</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    PO #{o.id} • Supplier {o.supplier_id} •{" "}
                    {formatCurrency ? formatCurrency(o.total_amount || 0) : o.total_amount}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={paymentForm.payment_method}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    payment_method: e.target.value,
                  }))
                }
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={paymentForm.payment_date}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    payment_date: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Delivery Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={paymentForm.expected_delivery}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    expected_delivery: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={2}
              value={paymentForm.notes}
              onChange={(e) =>
                setPaymentForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Record Payment"}
          </button>
        </form>
      </div>

      {/* Data tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchase Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Purchase Orders</h2>
            </div>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">No purchase orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">PO #</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Supplier</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Preferred Date</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900 font-medium">#{o.id}</td>
                      <td className="px-4 py-2 text-gray-700">{o.supplier_id}</td>
                      <td className="px-4 py-2 text-gray-700">
                        {o.preferred_delivery_date || "-"}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-900 font-semibold">
                        {formatCurrency ? formatCurrency(o.total_amount || 0) : o.total_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Supplier Delivery Tracking */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Supplier Delivery Tracking</h2>
            </div>
          </div>
          {supplierPayments.length === 0 ? (
            <p className="text-sm text-gray-500">No supplier payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Payment #</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Supplier</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Preferred</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Delivered</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {supplierPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900 font-medium">#{p.id}</td>
                      <td className="px-4 py-2 text-gray-700">{p.supplier_id}</td>
                      <td className="px-4 py-2 text-gray-700">
                        {p.expected_delivery || "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {p.delivered_at || "-"}
                      </td>
                      <td className="px-4 py-2">{getDeliveryBadge(p)}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateDeliveryStatus(p.id, "Scheduled")}
                          className="px-2 py-1 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Scheduled
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateDeliveryStatus(p.id, "In Transit")}
                          className="px-2 py-1 text-xs rounded-md border border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          In Transit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateDeliveryStatus(p.id, "Delivered")}
                          className="px-2 py-1 text-xs rounded-md border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                        >
                          Delivered
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-lg shadow-lg px-4 py-3 text-sm text-gray-700 flex items-center">
            <Clock className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPayments;


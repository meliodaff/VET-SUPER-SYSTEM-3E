import React, { useEffect, useState } from "react";
import { Calendar, Package, Truck, CheckCircle2, Clock } from "lucide-react";
import { purchaseOrdersAPI, supplierAPI, inventoryAPI } from "../services/api";
import { formatCurrency } from "../utils/helpers";

const initialOrderForm = {
  preferred_delivery_date: "",
  notes: "",
  items: [{ item_id: "", quantity: "", unit_cost: "" }],
};

const SupplierPayments = () => {
  const [orderForm, setOrderForm] = useState(initialOrderForm);
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
        purchaseOrdersAPI.getPurchaseOrders({ limit: 50 }),
        supplierAPI.getSupplierPayments({ limit: 50 }),
        inventoryAPI.getItems(),
      ]);

      if (ordersRes?.data?.success && ordersRes.data.data) {
        setOrders(ordersRes.data.data.orders || []);
      }

      if (supplierRes?.data?.success && supplierRes.data.data) {
        const payments = supplierRes.data.data.supplier_payments || [];
        setSupplierPayments(payments);
        console.log("Loaded supplier payments:", payments.length, "payments");
        if (payments.length > 0) {
          console.log("Latest payment:", payments[0]);
        }
      } else {
        console.log("Supplier payments response:", supplierRes);
        // Try to handle different response structures
        if (Array.isArray(supplierRes?.data)) {
          setSupplierPayments(supplierRes.data);
        } else if (Array.isArray(supplierRes?.data?.supplier_payments)) {
          setSupplierPayments(supplierRes.data.supplier_payments);
        }
      }

      // Handle both plain array and wrapped { data: [] } responses
      let itemsPayload = [];
      if (Array.isArray(itemsRes?.data)) {
        itemsPayload = itemsRes.data;
      } else if (Array.isArray(itemsRes?.data?.data)) {
        itemsPayload = itemsRes.data.data;
      }

      console.log("Loaded inventory items:", itemsPayload);
      setInventoryItems(itemsPayload);
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

    // Validate preferred delivery date is required
    if (!orderForm.preferred_delivery_date || orderForm.preferred_delivery_date.trim() === "") {
      setError("Preferred delivery date is required. Please select a delivery date.");
      return;
    }

    // Validate items have supplier_id
    const validItems = orderForm.items
      .map((it) => ({
        item_id: it.item_id ? parseInt(it.item_id, 10) : null,
        quantity: it.quantity ? parseFloat(it.quantity) : null,
      }))
      .filter((it) => it.item_id && it.quantity);

    if (validItems.length === 0) {
      setError("Please add at least one item with quantity.");
      return;
    }

    // Check for items without supplier_id
    const itemsWithoutSupplier = validItems
      .map((it) => {
        const invItem = inventoryItems.find((inv) => inv.id === it.item_id);
        return invItem && !invItem.supplier_id ? invItem.name : null;
      })
      .filter(Boolean);

    if (itemsWithoutSupplier.length > 0) {
      setError(
        `The following items are missing supplier assignments: ${itemsWithoutSupplier.join(", ")}. Please set a supplier_id for these items in the inventory_items table.`
      );
      return;
    }

    try {
      setLoading(true);
      const payload = {
        preferred_delivery_date: orderForm.preferred_delivery_date || null,
        notes: orderForm.notes || null,
        items: validItems,
      };

      const res = await purchaseOrdersAPI.createPurchaseOrder(payload);
      if (res?.data?.success) {
        const created = res.data.data?.purchase_orders || [];
        if (created.length > 0) {
          setSuccess(
            `Generated ${created.length} purchase order${
              created.length > 1 ? "s" : ""
            } for ${created.length} supplier(s). Supplier payment entries have been automatically created for delivery tracking.`
          );
        } else {
          setSuccess("Purchase orders generated successfully.");
        }
        setOrderForm(initialOrderForm);
        
        // Force refresh data multiple times to ensure it appears
        await loadData();
        setTimeout(async () => {
          await loadData();
        }, 300);
        setTimeout(async () => {
          await loadData();
        }, 800);
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
      <div className="grid grid-cols-1 gap-6">
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
                Preferred Delivery Date <span className="text-red-500">*</span>
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
                  required
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

            {orderForm.items.map((item, index) => {
              const qty = parseFloat(item.quantity) || 0;
              const selectedItem = inventoryItems.find(
                (inv) => String(inv.id) === String(item.item_id)
              );
              // Get unit_cost from form state first, fallback to inventory item's unit_cost
              const unitCostFromForm = parseFloat(item.unit_cost);
              const unitCostFromInventory = parseFloat(selectedItem?.unit_cost) || 0;
              const unit = unitCostFromForm || unitCostFromInventory || 0;
              const lineTotal = qty * unit;
              const hasSupplier = selectedItem?.supplier_id;

              return (
                <div
                  key={index}
                  className={`grid grid-cols-4 gap-3 rounded-lg p-3 ${
                    item.item_id && !hasSupplier
                      ? "bg-red-50 border-2 border-red-300"
                      : "bg-gray-50 border border-gray-200"
                  }`}
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
                        if (selected) {
                          // Get unit_cost from inventory item
                          const unitCost = parseFloat(selected.unit_cost) || parseFloat(selected.cost) || 0;
                          handleOrderItemChange(
                            index,
                            "unit_cost",
                            unitCost > 0 ? unitCost.toFixed(2) : ""
                          );
                        } else {
                          // Clear unit_cost if no item selected
                          handleOrderItemChange(index, "unit_cost", "");
                        }
                      }}
                    >
                      <option value="">Select product</option>
                      {inventoryItems.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name}
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
                      min="1"
                      step="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Unit Cost (auto)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-100"
                      value={item.unit_cost || (selectedItem?.unit_cost ? parseFloat(selectedItem.unit_cost).toFixed(2) : "")}
                      placeholder="0.00"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Line Total
                    </label>
                    <input
                      type="number"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-gray-100"
                      value={lineTotal.toFixed(2)}
                      readOnly
                    />
                  </div>
                  {item.item_id && !hasSupplier && (
                    <div className="col-span-4 mt-2">
                      <p className="text-xs text-red-600 font-medium">
                        ⚠️ This item is missing a supplier assignment. Please set supplier_id in inventory_items table.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Order estimated total */}
            <div className="flex justify-end mt-2">
              <div className="text-sm text-gray-700">
                <span className="font-medium">Estimated Total: </span>
                {formatCurrency
                  ? formatCurrency(
                      orderForm.items.reduce((sum, it) => {
                        const q = parseFloat(it.quantity) || 0;
                        const u = parseFloat(it.unit_cost) || 0;
                        return sum + q * u;
                      }, 0)
                    )
                  : orderForm.items
                      .reduce((sum, it) => {
                        const q = parseFloat(it.quantity) || 0;
                        const u = parseFloat(it.unit_cost) || 0;
                        return sum + q * u;
                      }, 0)
                      .toFixed(2)}
              </div>
            </div>
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
                      <td className="px-4 py-2 text-gray-700">
                        {o.supplier_name || `Supplier ${o.supplier_id}`}
                      </td>
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
              {supplierPayments.length > 0 && (
                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {supplierPayments.length} {supplierPayments.length === 1 ? 'entry' : 'entries'}
                </span>
              )}
            </div>
          </div>
          {supplierPayments.length === 0 ? (
            <p className="text-sm text-gray-500">No supplier payments found. Create a purchase order to see delivery tracking entries.</p>
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
                      <td className="px-4 py-2 text-gray-700">
                        {p.supplier_name || `Supplier ${p.supplier_id}`}
                      </td>
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


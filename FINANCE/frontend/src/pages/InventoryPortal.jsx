import React from "react";

const InventoryPortal = () => {
  const inventoryUrl = "http://localhost:5173"; // Inventory System base URL

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Inventory Portal
        </h1>
        <p className="text-gray-600 mb-4">
          This Finance module is linked to the separate{" "}
          <span className="font-semibold">FUR EVER Inventory System</span> where
          you manage products, categories, suppliers, and stock.
        </p>
        <p className="text-gray-600 mb-6">
          Use the button below to open the Inventory System in a new tab and
          perform detailed inventory operations there.
        </p>
        <a
          href={inventoryUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Open Inventory System
        </a>
      </div>
    </div>
  );
};

export default InventoryPortal;



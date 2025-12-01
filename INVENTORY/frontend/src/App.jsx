import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />;
      case "Products":
        return <Products />;
      case "Categories":
        return <Categories />;
      case "Suppliers":
        return <Suppliers />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="app-main">
        <Navbar currentPage={currentPage} />
        <main className="main-content">{renderPage()}</main>
      </div>
    </div>
  );
}


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/structure/Header'; // ตรวจสอบเส้นทางให้ถูกต้อง


import Home from './pages/Home';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Reports from './pages/Reports';
import History from './pages/History';
import Create from './pages/Create';
import EditProduct from './pages/EditProduct';
import { MenuProvider } from "./contexts/MenuContext";
import { BillProvider } from './contexts/BillContext';


function App() {
  return (
    <MenuProvider>
      <BillProvider>
        <Router>
          <Header />
          <div className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/history" element={<History />} />
              <Route path="/create" element={<Create />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
            </Routes>
          </div>
        </Router>
      </BillProvider>
    </MenuProvider>
  );
}

export default App;

import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import OrderForm from './pages/OrderForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/haz-tu-pedido" element={<OrderForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
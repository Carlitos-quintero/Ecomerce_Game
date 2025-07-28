import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Catalogo";
import Cart from "./pages/CarritoCompra";
import DetalleProduct from "./pages/DetalleProducto";
import SignupUp from "./pages/SignupEndUser";
import Login from "./pages/LoginEndUser";
import Dashboard from "./pages/Dashboard";
import DashboardProductos from "./pages/DashboardProductos";
import DashboardUsuarios from "./pages/DashboardUsuario";
import DashboardTags from "./pages/DashboardTags";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Sponsors from "./components/Sponsors";


import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
  <Router>
      <NavBar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Products" element={<Product />} />
        <Route path="/Carrito" element={<Cart />} />
        <Route path="/DetalleProduct" element={<DetalleProduct />} />
        <Route path="/signup" element={<SignupUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Dashboard/productos" element={<DashboardProductos />} />
        <Route path="/Dashboard/usuarios" element={<DashboardUsuarios />} />
        <Route path="/Dashboard/tags" element={<DashboardTags />} />
      </Routes>

      <Sponsors />
      <Footer />
    </Router> 
  )
}

export default App

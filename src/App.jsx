import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
//import { useState } from "react"
function App() {
   //const [research,setResearch]=useState("");
  return (
    <BrowserRouter>

      {/* DEHORS des Routes → visible sur TOUTES les pages */}
      <Navbar />
   
      {/* DEDANS → une seule s'affiche, selon l'adresse */}
     
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart"     element={<CartPage />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  )
}

export default App
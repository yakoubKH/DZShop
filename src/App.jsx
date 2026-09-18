
import ProductDetaille from './components/ProductDetaille';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
function App() {
   //const [research,setResearch]=useState("");
  return (
     <CartProvider>
      <BrowserRouter>

        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
         <Route path="/products/:id" element={<ProductDetaille />} />
        </Routes>

        <Footer />

      </BrowserRouter>
    </CartProvider>
  )
}

export default App
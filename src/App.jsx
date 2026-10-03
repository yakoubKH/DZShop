import ProductDetaille from './components/ProductDetaille';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminProduits from './pages/admin/AdminProduits';
import AdminCommandes from './pages/admin/AdminCommandes';
import AdminUtilisateurs from './pages/admin/AdminUtilisateurs';
import AdminStats from './pages/admin/AdminStats';
function App() {
   //const [research,setResearch]=useState("");
  return (
    <AuthProvider>
     <CartProvider>
      <BrowserRouter>

        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
         <Route path="/products/:id" element={<ProductDetaille />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin/produits" element={<AdminRoute><AdminProduits /></AdminRoute>} />
          <Route path="/admin/commandes" element={<AdminRoute><AdminCommandes /></AdminRoute>} />
          <Route path="/admin/utilisateurs" element={<AdminRoute><AdminUtilisateurs /></AdminRoute>} />
          <Route path="/admin/stats" element={<AdminRoute><AdminStats /></AdminRoute>} />
        </Routes>

        <Footer />

      </BrowserRouter>
     </CartProvider>
    </AuthProvider>
  )
}

export default App
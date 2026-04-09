import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <FilterProvider>
          <div className="min-h-screen bg-white text-slate-800">
            <Header />
            <CartDrawer />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
            </Routes>
            <Footer />
          </div>
        </FilterProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

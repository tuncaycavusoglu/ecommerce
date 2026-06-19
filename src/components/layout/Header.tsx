import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const { firebaseUser, appUser, isAdmin, logout } = useAuth();
  const { totalItems, openCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 18 L7 8 Q12 2 17 8 L22 18 Q12 22 2 18Z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
              ShoeVault
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3 sm:gap-5">
            <Link to="/" className="hidden sm:block text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors">
              Ana Sayfa
            </Link>

            {firebaseUser && (
              <Link to="/orders" className="hidden sm:block text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors">
                Siparişlerim
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                Admin
              </Link>
            )}

            {/* Sepet */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-violet-600 transition-all cursor-pointer"
              id="cart-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce-once shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {firebaseUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{appUser?.displayName?.charAt(0) || firebaseUser.email?.charAt(0) || '?'}</span>
                  </div>
                  <span className="text-sm text-slate-600 font-medium max-w-[100px] truncate">
                    {appUser?.displayName || firebaseUser.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 text-sm font-medium transition-all cursor-pointer"
                  title="Çıkış Yap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-violet-600 text-sm font-medium transition-colors"
                >
                  Giriş
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import CartItemRow from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const { items, isCartOpen, closeCart } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[420px] bg-white border-l border-slate-100 shadow-2xl transition-transform duration-500 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="cart-drawer"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h2 className="text-slate-800 text-lg font-bold">Sepetim</h2>
              {items.length > 0 && (
                <span className="px-2 py-0.5 rounded-lg bg-violet-100 text-violet-600 text-xs font-semibold">
                  {items.length}
                </span>
              )}
            </div>
            <button
              onClick={closeCart}
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              id="close-cart-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-slate-500 text-lg mb-2">Sepetiniz boş</p>
                <p className="text-slate-400 text-sm">Hemen alışverişe başlayın!</p>
              </div>
            ) : (
              items.map((item) => (
                <CartItemRow key={item.variantId} item={item} />
              ))
            )}
          </div>

          {/* Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100">
              <CartSummary />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

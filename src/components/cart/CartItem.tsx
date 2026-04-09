import { useCart } from '../../context/CartContext';

interface CartItemRowProps {
  item: {
    variantId: string;
    productName: string;
    brand: string;
    color: string;
    size: number;
    price: number;
    quantity: number;
    imageUrl: string;
  };
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { removeFromCart, updateQuantity } = useCart();

  const priceFormatted = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(item.price * item.quantity);

  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100" id={`cart-item-${item.variantId}`}>
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white p-2 flex-shrink-0 border border-slate-100">
        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-slate-800 text-sm font-semibold truncate">{item.productName}</h4>
            <p className="text-slate-400 text-xs mt-0.5">{item.brand}</p>
          </div>
          <button
            onClick={() => removeFromCart(item.variantId)}
            className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 cursor-pointer"
            title="Kaldır"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500">
            {item.color} · {item.size} Numara
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm text-slate-800 font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          <span className="text-violet-600 text-sm font-bold">{priceFormatted}</span>
        </div>
      </div>
    </div>
  );
}

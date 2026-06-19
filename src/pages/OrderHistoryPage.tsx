import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchOrderHistory } from '../services/api';
import type { Order } from '../types';

export default function OrderHistoryPage() {
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [firebaseUser]);

  const loadOrders = async () => {
    try {
      const data = await fetchOrderHistory();
      setOrders(data);
    } catch (err) {
      console.error('Sipariş geçmişi yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Beklemede', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    PAID: { label: 'Ödendi', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    SHIPPED: { label: 'Kargoya Verildi', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    DELIVERED: { label: 'Teslim Edildi', color: 'bg-violet-100 text-violet-700 border-violet-200' },
    CANCELLED: { label: 'İptal Edildi', color: 'bg-red-100 text-red-700 border-red-200' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Sipariş Geçmişi</h1>
            <p className="text-slate-500 text-sm">Geçmiş siparişlerinizi görüntüleyin</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="w-8 h-8 animate-spin text-violet-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75"/></svg>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-slate-500 text-lg mb-2">Henüz siparişiniz yok</p>
            <p className="text-slate-400 text-sm mb-6">Alışveriş yaparak ilk siparişinizi oluşturun</p>
            <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold cursor-pointer">Alışverişe Başla</button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const status = statusMap[order.status] || statusMap.PENDING;
              return (
                <div key={order.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-lg overflow-hidden animate-fade-in">
                  {/* Header */}
                  <div className="p-5 sm:p-6 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Sipariş No</p>
                        <p className="text-sm font-bold text-slate-800">#{order.id}</p>
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-slate-200" />
                      <div className="hidden sm:block">
                        <p className="text-xs text-slate-400">Tarih</p>
                        <p className="text-sm font-medium text-slate-700">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Date on mobile */}
                  <div className="sm:hidden px-5 pt-3">
                    <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                  </div>

                  {/* Items */}
                  <div className="p-5 sm:p-6 space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex gap-3 sm:gap-4 items-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-50 p-1.5 border border-slate-100 flex-shrink-0">
                          <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{item.productName}</p>
                          <p className="text-xs text-slate-400">{item.productBrand} · {item.selectedSize} Numara</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-slate-400">x{item.quantity}</p>
                          <p className="text-sm font-bold text-violet-600">{formatPrice(item.unitPrice * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

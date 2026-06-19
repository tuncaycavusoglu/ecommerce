import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createPaymentIntent, createOrder } from '../services/api';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const priceFormatted = new Intl.NumberFormat('tr-TR', {
    style: 'currency', currency: 'TRY', minimumFractionDigits: 0,
  }).format(totalPrice);

  if (!firebaseUser) {
    navigate('/login');
    return null;
  }

  if (items.length === 0 && !success) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-slate-500 text-xl mb-4">Sepetiniz boş</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold cursor-pointer">Ana Sayfaya Dön</button>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Kart numarasına göre Stripe hata senaryolarını simüle et
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard === '4000000000000027') {
        throw new Error('Ödeme başarısız: Kartınız reddedildi (Your card was declined).');
      } else if (cleanCard === '4000000000000010') {
        throw new Error('Ödeme başarısız: Yetersiz bakiye (Your card has insufficient funds).');
      } else if (cleanCard === '4000000000000015') {
        throw new Error('Ödeme başarısız: Kartın süresi geçmiş (Your card has expired).');
      } else if (cleanCard === '4000000000000005') {
        throw new Error('Ödeme başarısız: Güvenlik kodu / CVC geçersiz (Your card\'s security code is incorrect).');
      }

      // 1. Stripe PaymentIntent oluştur
      const paymentData = {
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      };

      const paymentIntent = await createPaymentIntent(paymentData);

      // 2. Sipariş oluştur
      await createOrder({
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        stripePaymentId: paymentIntent.clientSecret.split('_secret_')[0],
      });

      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Ödeme işlemi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-24 px-4 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl p-10 max-w-md w-full animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Ödeme Başarılı!</h1>
          <p className="text-slate-500 mb-6">Siparişiniz başarıyla oluşturuldu.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/orders')} className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold cursor-pointer">Sipariş Geçmişi</button>
            <button onClick={() => navigate('/')} className="w-full py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors cursor-pointer">Alışverişe Devam Et</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Ödeme</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Kart Bilgileri */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Kredi Kartı Bilgileri
              </h2>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Kart Üzerindeki İsim</label>
                  <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm" placeholder="AD SOYAD" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Kart Numarası</label>
                  <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm font-mono tracking-widest" placeholder="4242 4242 4242 4242" maxLength={16} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Son Kullanma</label>
                    <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm font-mono" placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CVC</label>
                    <input type="text" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm font-mono" placeholder="123" maxLength={4} />
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75"/></svg>
                        İşleniyor...
                      </span>
                    ) : `${priceFormatted} Öde`}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Stripe ile güvenli ödeme
                </p>
              </form>
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl p-6 sticky top-28">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Sipariş Özeti</h2>
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                {items.map(item => (
                  <div key={item.variantId} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-14 h-14 rounded-lg bg-white p-1 flex-shrink-0 border border-slate-100">
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{item.productName}</p>
                      <p className="text-xs text-slate-400">{item.brand} · {item.size} Numara · x{item.quantity}</p>
                      <p className="text-sm font-bold text-violet-600 mt-1">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ara Toplam</span>
                  <span className="text-slate-700">{priceFormatted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Kargo</span>
                  <span className="text-emerald-500 font-medium">Ücretsiz</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-slate-800 font-bold">Toplam</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">{priceFormatted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

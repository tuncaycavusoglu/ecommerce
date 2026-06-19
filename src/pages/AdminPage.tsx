import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  adminFetchProducts, adminCreateProduct, adminUpdateStock,
  adminFetchUnansweredQuestions, adminAnswerQuestion, fetchCategories,
} from '../services/api';
import type { ShoeProduct, Question, Category } from '../types';

type Tab = 'products' | 'stock' | 'messages';

export default function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('products');

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/');
  }, [isAdmin, authLoading]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center pt-24"><svg className="w-8 h-8 animate-spin text-violet-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75"/></svg></div>;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'products', label: 'Ürün Ekle', icon: '📦' },
    { id: 'stock', label: 'Stok Güncelle', icon: '📊' },
    { id: 'messages', label: 'Mesajlar', icon: '💬' },
  ];

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Admin Paneli</h1>
            <p className="text-slate-500 text-sm">Ürün ve sipariş yönetimi</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'products' && <ProductForm />}
        {activeTab === 'stock' && <StockManager />}
        {activeTab === 'messages' && <MessagePanel />}
      </div>
    </main>
  );
}

// ─── Ürün Ekleme ──────────────────────────────────────
function ProductForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', brand: '', categoryId: '', basePrice: '', description: '', imageUrl: '' });
  const [variants, setVariants] = useState([{ size: '', stockQuantity: '' }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchCategories().then(setCategories).catch(console.error); }, []);

  const addVariant = () => setVariants([...variants, { size: '', stockQuantity: '' }]);
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: string, value: string) => {
    const updated = [...variants];
    (updated[i] as any)[field] = value;
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await adminCreateProduct({
        name: form.name, brand: form.brand, categoryId: Number(form.categoryId),
        basePrice: Number(form.basePrice), description: form.description, imageUrl: form.imageUrl || undefined,
        variants: variants.filter(v => v.size).map(v => ({ size: Number(v.size), stockQuantity: Number(v.stockQuantity) || 0 })),
      });
      setSuccess('Ürün başarıyla eklendi!');
      setForm({ name: '', brand: '', categoryId: '', basePrice: '', description: '', imageUrl: '' });
      setVariants([{ size: '', stockQuantity: '' }]);
    } catch (err: any) {
      setError(err.message || 'Ürün eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 animate-fade-in">
      <h2 className="text-lg font-bold text-slate-800 mb-6">Yeni Ürün Ekle</h2>
      {success && <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{success}</div>}
      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ürün Adı</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Marka</label>
            <input type="text" required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
            <select required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm">
              <option value="">Seçin</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Fiyat (₺)</label>
            <input type="number" required min="1" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Açıklama</label>
          <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Görsel URL (opsiyonel)</label>
          <input type="text" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm" placeholder="/images/shoe_default.png" />
        </div>

        {/* Varyantlar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700">Numara & Stok</label>
            <button type="button" onClick={addVariant} className="text-xs text-violet-600 font-medium hover:text-violet-700 cursor-pointer">+ Numara Ekle</button>
          </div>
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input type="number" placeholder="Numara" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-violet-400" />
                <input type="number" placeholder="Stok" value={v.stockQuantity} onChange={e => updateVariant(i, 'stockQuantity', e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-violet-400" />
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer">
          {loading ? 'Ekleniyor...' : 'Ürün Ekle'}
        </button>
      </form>
    </div>
  );
}

// ─── Stok Güncelleme ──────────────────────────────────
function StockManager() {
  const [products, setProducts] = useState<ShoeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const data = await adminFetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (variantId: number, stockQuantity: number) => {
    setUpdating(variantId);
    try {
      await adminUpdateStock({ variantId, stockQuantity });
      setSuccess(`Stok güncellendi!`);
      setTimeout(() => setSuccess(''), 3000);
      loadProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><svg className="w-8 h-8 animate-spin text-violet-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75"/></svg></div>;

  return (
    <div className="space-y-4 animate-fade-in">
      {success && <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{success}</div>}
      {products.map(product => (
        <div key={product.id} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-lg p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 p-1.5 border border-slate-100 flex-shrink-0">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{product.name}</h3>
              <p className="text-xs text-slate-400">{product.brand}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {product.variants.map(v => (
              <div key={v.id} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm text-slate-600 font-medium">{v.size}#</span>
                <input
                  type="number"
                  min="0"
                  defaultValue={v.stockQuantity}
                  onBlur={e => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val !== v.stockQuantity) handleUpdate(v.id, val);
                  }}
                  className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-center outline-none focus:border-violet-400"
                />
                {updating === v.id && <svg className="w-4 h-4 animate-spin text-violet-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75"/></svg>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Mesaj Paneli ─────────────────────────────────────
function MessagePanel() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerTexts, setAnswerTexts] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState<number | null>(null);

  useEffect(() => { loadQuestions(); }, []);

  const loadQuestions = async () => {
    try {
      const data = await adminFetchUnansweredQuestions();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId: number) => {
    const text = answerTexts[questionId];
    if (!text?.trim()) return;
    setSubmitting(questionId);
    try {
      await adminAnswerQuestion(questionId, { answerText: text });
      setQuestions(questions.filter(q => q.id !== questionId));
      setAnswerTexts({ ...answerTexts, [questionId]: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><svg className="w-8 h-8 animate-spin text-violet-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75"/></svg></div>;

  return (
    <div className="space-y-4 animate-fade-in">
      {questions.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100">
          <div className="text-5xl mb-3">✅</div>
          <p className="text-slate-500">Cevaplanmamış soru yok</p>
        </div>
      ) : (
        questions.map(q => (
          <div key={q.id} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-lg p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-violet-600 text-sm font-bold">{q.userDisplayName?.charAt(0) || '?'}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-800">{q.userDisplayName}</span>
                  <span className="text-xs text-slate-400">· {q.productName}</span>
                </div>
                <p className="text-sm text-slate-600">{q.questionText}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(q.createdAt).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={answerTexts[q.id] || ''}
                onChange={e => setAnswerTexts({ ...answerTexts, [q.id]: e.target.value })}
                placeholder="Cevabınızı yazın..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-violet-400"
              />
              <button
                onClick={() => handleAnswer(q.id)}
                disabled={submitting === q.id || !answerTexts[q.id]?.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium disabled:opacity-50 cursor-pointer"
              >
                {submitting === q.id ? '...' : 'Gönder'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

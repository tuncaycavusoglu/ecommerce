import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchQuestions, createQuestion } from '../../services/api';
import type { Question } from '../../types';

interface QuestionListProps {
  productId: number;
}

export default function QuestionList({ productId }: QuestionListProps) {
  const { firebaseUser } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionText, setQuestionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions(productId)
      .then(setQuestions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questionText.length < 10) { setError('Soru en az 10 karakter olmalıdır.'); return; }

    setSubmitting(true); setError('');
    try {
      const q = await createQuestion(productId, { questionText });
      setQuestions([q, ...questions]);
      setQuestionText('');
    } catch (err: any) {
      setError(err.message || 'Soru gönderilemedi.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Soru & Cevap</h2>

      {/* Soru Formu */}
      {firebaseUser && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl border border-slate-100 p-5 mb-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Soru Sor</h3>
          {error && <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
          <div className="flex gap-2">
            <input
              type="text"
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder="Bu ürün hakkında bir soru sorun..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold shadow-md disabled:opacity-60 cursor-pointer flex-shrink-0"
            >
              {submitting ? '...' : 'Gönder'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <svg className="w-6 h-6 animate-spin text-violet-500" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75"/></svg>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">Henüz soru sorulmamış. İlk soruyu siz sorun!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map(q => (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
              {/* Soru */}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-violet-600 text-sm font-bold">S</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-800">{q.userDisplayName}</span>
                      <span className="text-xs text-slate-400">{formatDate(q.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600">{q.questionText}</p>
                  </div>
                </div>
              </div>

              {/* Cevaplar */}
              {q.answers.length > 0 && (
                <div className="border-t border-slate-100 bg-emerald-50/30">
                  {q.answers.map(a => (
                    <div key={a.id} className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-emerald-600 text-sm font-bold">C</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-800">{a.adminDisplayName}</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-semibold">SATIŞ</span>
                            <span className="text-xs text-slate-400">{formatDate(a.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-600">{a.answerText}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {q.answers.length === 0 && (
                <div className="px-5 pb-4">
                  <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">Cevap bekleniyor</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

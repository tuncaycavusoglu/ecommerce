import { auth } from './firebase';
import type { ShoeProduct, Category, Review, Question, Order, AppUser } from '../types';

const API_BASE = 'http://localhost:8080/api';

// ─── Helper: Auth Header ─────────────────────────────
async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
  return { 'Content-Type': 'application/json' };
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Products ─────────────────────────────────────────
export async function fetchProducts(categoryId?: number): Promise<ShoeProduct[]> {
  const url = categoryId
    ? `${API_BASE}/products?categoryId=${categoryId}`
    : `${API_BASE}/products`;
  return fetchJSON<ShoeProduct[]>(url);
}

export async function fetchProductById(id: number): Promise<ShoeProduct> {
  return fetchJSON<ShoeProduct>(`${API_BASE}/products/${id}`);
}

// ─── Categories ───────────────────────────────────────
export async function fetchCategories(): Promise<Category[]> {
  return fetchJSON<Category[]>(`${API_BASE}/categories`);
}

// ─── Reviews ──────────────────────────────────────────
export async function fetchReviews(productId: number): Promise<Review[]> {
  return fetchJSON<Review[]>(`${API_BASE}/products/${productId}/reviews`);
}

export async function createReview(
  productId: number,
  data: { rating: number; comment: string }
): Promise<Review> {
  const headers = await getAuthHeaders();
  return fetchJSON<Review>(`${API_BASE}/products/${productId}/reviews`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}

// ─── Questions ────────────────────────────────────────
export async function fetchQuestions(productId: number): Promise<Question[]> {
  return fetchJSON<Question[]>(`${API_BASE}/products/${productId}/questions`);
}

export async function createQuestion(
  productId: number,
  data: { questionText: string }
): Promise<Question> {
  const headers = await getAuthHeaders();
  return fetchJSON<Question>(`${API_BASE}/products/${productId}/questions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}

// ─── Orders ───────────────────────────────────────────
export async function fetchOrderHistory(): Promise<Order[]> {
  const headers = await getAuthHeaders();
  return fetchJSON<Order[]>(`${API_BASE}/orders/history`, { headers });
}

export async function createOrder(data: {
  items: { productId: number; variantId: number; quantity: number }[];
  stripePaymentId: string;
}): Promise<Order> {
  const headers = await getAuthHeaders();
  return fetchJSON<Order>(`${API_BASE}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}

// ─── Payments ─────────────────────────────────────────
export async function createPaymentIntent(data: {
  items: { productId: number; variantId: number; quantity: number }[];
}): Promise<{ clientSecret: string; amount: number; currency: string }> {
  const headers = await getAuthHeaders();
  return fetchJSON(`${API_BASE}/payments/create-intent`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}

// ─── Auth ─────────────────────────────────────────────
export async function syncUser(data: {
  email: string;
  displayName: string;
}): Promise<AppUser> {
  const headers = await getAuthHeaders();
  return fetchJSON<AppUser>(`${API_BASE}/auth/sync`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}

export async function fetchCurrentUser(): Promise<AppUser> {
  const headers = await getAuthHeaders();
  return fetchJSON<AppUser>(`${API_BASE}/auth/me`, { headers });
}

// ─── Admin ────────────────────────────────────────────
export async function adminFetchProducts(): Promise<ShoeProduct[]> {
  const headers = await getAuthHeaders();
  return fetchJSON<ShoeProduct[]>(`${API_BASE}/admin/products`, { headers });
}

export async function adminCreateProduct(data: {
  name: string;
  brand: string;
  categoryId: number;
  basePrice: number;
  description: string;
  imageUrl?: string;
  variants: { size: number; stockQuantity: number }[];
}): Promise<ShoeProduct> {
  const headers = await getAuthHeaders();
  return fetchJSON<ShoeProduct>(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}

export async function adminUpdateStock(data: {
  variantId: number;
  stockQuantity: number;
}): Promise<{ id: number; size: number; stockQuantity: number }> {
  const headers = await getAuthHeaders();
  return fetchJSON(`${API_BASE}/admin/products/stock`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
}

export async function adminFetchUnansweredQuestions(): Promise<Question[]> {
  const headers = await getAuthHeaders();
  return fetchJSON<Question[]>(`${API_BASE}/admin/questions/unanswered`, { headers });
}

export async function adminAnswerQuestion(
  questionId: number,
  data: { answerText: string }
): Promise<{ id: number; adminDisplayName: string; answerText: string; createdAt: string }> {
  const headers = await getAuthHeaders();
  return fetchJSON(`${API_BASE}/admin/questions/${questionId}/answers`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}

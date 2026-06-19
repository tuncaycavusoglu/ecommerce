// Varyant (Sadece Numara)
export interface ShoeVariant {
  id: number;
  size: number;
  stockQuantity: number;
}

// Ana Ürün Modeli
export interface ShoeProduct {
  id: number;
  name: string;
  brand: string;
  categoryId: string;
  categoryName?: string;
  basePrice: number;
  description: string;
  imageUrl: string;
  variants: ShoeVariant[];
  averageRating?: number;
  reviewCount?: number;
}

// Kategori Modeli
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Sepet Öğesi
export interface CartItem {
  productId: number;
  variantId: number;
  productName: string;
  brand: string;
  size: number;
  price: number;
  quantity: number;
  imageUrl: string;
}

// Yorum
export interface Review {
  id: number;
  productId: number;
  userDisplayName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Soru
export interface Question {
  id: number;
  productId: number;
  productName?: string;
  userDisplayName: string;
  questionText: string;
  answers: Answer[];
  createdAt: string;
}

// Cevap
export interface Answer {
  id: number;
  adminDisplayName: string;
  answerText: string;
  createdAt: string;
}

// Sipariş
export interface Order {
  id: number;
  totalPrice: number;
  status: string;
  stripePaymentId: string;
  items: OrderItem[];
  createdAt: string;
}

// Sipariş Kalemi
export interface OrderItem {
  id: number;
  productId: number;
  variantId: number;
  productName: string;
  productBrand: string;
  productImageUrl: string;
  selectedSize: number;
  quantity: number;
  unitPrice: number;
}

// Kullanıcı
export interface AppUser {
  id: number;
  firebaseUid: string;
  email: string;
  displayName: string;
  role: 'USER' | 'ADMIN';
}

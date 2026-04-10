// Varyant (Sadece Numara)
export interface ShoeVariant {
  id: string;
  size: number;            // Örn: 42
  stockQuantity: number;   // Örn: 5 (Bu varyanta ait stok)
}

// Ana Ürün Modeli
export interface ShoeProduct {
  id: string;
  name: string;
  brand: string;
  categoryId: string;      // Kategori referansı
  basePrice: number;
  description: string;
  imageUrl: string;        // Ürüne ait görsel
  variants: ShoeVariant[]; // Ürüne ait stok numaraları
}

// Kategori Modeli
export interface Category {
  id: string;
  name: string; // Örn: "Koşu Ayakkabıları"
}

// Sepet Öğesi
export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  brand: string;
  color: string;
  size: number;
  price: number;
  quantity: number;
  imageUrl: string;
}

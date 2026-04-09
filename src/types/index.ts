// Varyant (Renk, Numara, Stok ve Görsel)
export interface ShoeVariant {
  id: string;
  color: string;           // Örn: "Kırmızı"
  colorHexCode: string;    // Örn: "#FF0000" (UI'da renk dairesi göstermek için)
  size: number;            // Örn: 42
  stockQuantity: number;   // Örn: 5 (Bu varyanta ait stok)
  imageUrl: string;        // Bu renge ait ayakkabı görseli
}

// Ana Ürün Modeli
export interface ShoeProduct {
  id: string;
  name: string;
  brand: string;
  categoryId: string;      // Kategori referansı
  basePrice: number;
  description: string;
  variants: ShoeVariant[]; // Ürüne ait tüm varyant kombinasyonları
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

import CategoryFilter from '../components/category/CategoryFilter';
import ProductGrid from '../components/product/ProductGrid';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-fuchsia-200/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] bg-amber-200/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[60vh]">
            {/* Left: Text */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 border border-violet-200 text-violet-600 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                2026 Yeni Koleksiyon
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 leading-tight mb-4 sm:mb-6">
                Adımlarınız{' '}
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
                  Bizimle
                </span>
                <br />
                Ritmini Bulsun
              </h1>

              <p className="text-slate-500 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-12 leading-relaxed">
                Erkek, kadın ve çocuk ayakkabılarında premium koleksiyonumuzla
                tarzınızı tamamlayın. Kalite, konfor ve şıklığın buluştuğu tek adres.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="#products"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Koleksiyonu Keşfet
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <a
                  href="#products"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white text-slate-600 hover:text-violet-600 font-semibold border border-slate-200 hover:border-violet-300 transition-all duration-300 hover:bg-violet-50 shadow-sm"
                >
                  Yeni Sezon
                </a>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-300/30 via-fuchsia-300/20 to-amber-300/10 rounded-full blur-[60px] scale-90" />
                <img
                  src="/images/hero_runner.png"
                  alt="Koşucu - Adımlarınız Bizimle Ritmini Bulsun"
                  className="relative z-10 w-full h-auto drop-shadow-2xl animate-fade-in rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Ürünlerimiz</h2>
            <p className="text-slate-500 text-sm mt-1">Kaliteli ayakkabılarda en iyi fırsatlar</p>
          </div>
        </div>

        <div className="mb-8">
          <CategoryFilter />
        </div>

        <ProductGrid />
      </section>
    </main>
  );
}

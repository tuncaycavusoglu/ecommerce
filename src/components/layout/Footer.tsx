export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 18 L7 8 Q12 2 17 8 L22 18 Q12 22 2 18Z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-800">ShoeVault</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Premium ayakkabı koleksiyonuyla tarzınızı tamamlayın. Kalite ve şıklığın buluştuğu adres.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-slate-800 font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-500 hover:text-violet-600 transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="text-slate-500 hover:text-violet-600 transition-colors">İletişim</a></li>
              <li><a href="#" className="text-slate-500 hover:text-violet-600 transition-colors">Kargo Bilgisi</a></li>
              <li><a href="#" className="text-slate-500 hover:text-violet-600 transition-colors">İade Politikası</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-slate-800 font-semibold mb-4">Bizi Takip Edin</h3>
            <div className="flex gap-3">
              {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white hover:bg-violet-50 border border-slate-200 hover:border-violet-300 flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-xs text-slate-500 hover:text-violet-600 font-medium">
                    {social[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 ShoeVault. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

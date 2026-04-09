interface SizeSelectorProps {
  sizes: { size: number; inStock: boolean }[];
  selectedSize: number | null;
  onSizeSelect: (size: number) => void;
}

export default function SizeSelector({ sizes, selectedSize, onSizeSelect }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-2.5">
      {sizes.map(({ size, inStock }) => (
        <button
          key={size}
          onClick={() => inStock && onSizeSelect(size)}
          disabled={!inStock}
          className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-sm font-semibold transition-all duration-300 ${
            !inStock
              ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
              : selectedSize === size
              ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 scale-105'
              : 'bg-white text-slate-700 hover:bg-violet-50 hover:text-violet-600 border border-slate-200 hover:border-violet-300 cursor-pointer'
          }`}
          id={`size-selector-${size}`}
        >
          {size}
          {!inStock && (
            <span className="absolute inset-0 flex items-center justify-center">
              <div className="w-[70%] h-px bg-slate-300 rotate-[-45deg]" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

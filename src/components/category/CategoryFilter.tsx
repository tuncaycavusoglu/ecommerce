import { categories, products } from '../../mocks/products';
import { useFilter } from '../../context/FilterContext';
import { useMemo } from 'react';

export default function CategoryFilter() {
  const { selectedCategoryId, setSelectedCategoryId } = useFilter();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { tumu: products.length };
    categories.forEach((cat) => {
      counts[cat.id] = products.filter((p) => p.categoryId === cat.id).length;
    });
    return counts;
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3" id="category-filter">
      <button
        onClick={() => setSelectedCategoryId(null)}
        className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
          selectedCategoryId === null
            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
            : 'bg-slate-100 text-slate-600 hover:text-violet-600 hover:bg-violet-50 border border-slate-200'
        }`}
      >
        <span>Tümü</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          selectedCategoryId === null ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
        }`}>
          {categoryCounts.tumu}
        </span>
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategoryId(category.id)}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
            selectedCategoryId === category.id
              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
              : 'bg-slate-100 text-slate-600 hover:text-violet-600 hover:bg-violet-50 border border-slate-200'
          }`}
        >
          <span>{category.name}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            selectedCategoryId === category.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
             {categoryCounts[category.id]}
          </span>
        </button>
      ))}
    </div>
  );
}

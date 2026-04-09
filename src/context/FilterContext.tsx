import { createContext, useContext, useState, type ReactNode } from 'react';

interface FilterContextValue {
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  return (
    <FilterContext.Provider value={{ selectedCategoryId, setSelectedCategoryId }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}

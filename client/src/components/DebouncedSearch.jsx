import React, { memo, useCallback, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useShopStore } from '../store/shopStore';

const DebouncedSearch = memo(({ onSearch, placeholder = 'Search products...' }) => {
  const { searchQuery, setSearchQuery } = useShopStore();
  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceTimerRef = React.useRef(null);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);

    // Clear previous timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timeout for debounced search (500ms)
    debounceTimerRef.current = setTimeout(() => {
      setSearchQuery(value);
      onSearch?.(value);
    }, 500);
  }, [setSearchQuery, onSearch]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setSearchQuery('');
    onSearch?.('');
  }, [setSearchQuery, onSearch]);

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded text-white placeholder-white/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

DebouncedSearch.displayName = 'DebouncedSearch';

export default DebouncedSearch;

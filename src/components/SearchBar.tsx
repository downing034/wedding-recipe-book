import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../App';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search recipes...", 
  className = "",
  initialValue = ""
}) => {
  const { currentTheme } = useTheme();
  const [query, setQuery] = useState(initialValue);

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative max-w-md mx-auto ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-12 rounded-lg focus:outline-none shadow-sm placeholder-gray-400 transition-all border-2"
        style={{
          ...currentTheme.styles.cardBackground,
          ...currentTheme.styles.text.primary,
          borderColor: query.trim() 
            ? ((currentTheme.styles.text.accent as any).color || '#3b82f6')
            : (currentTheme.styles.border as any).borderColor,
          borderWidth: '2px',
          ...(query.trim() && {
            boxShadow: `0 0 0 3px ${((currentTheme.styles.text.accent as any).color || '#3b82f6')}20`
          })
        }}
      />
      
      {/* Clear button when there's text */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 transition-all hover:opacity-80 rounded-full hover:bg-white hover:bg-opacity-10"
          style={currentTheme.styles.text.secondary}
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
      
      {/* Search button */}
      <button
        onClick={handleSearch}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 transition-colors hover:opacity-80"
        style={currentTheme.styles.text.accent}
        title="Search"
      >
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
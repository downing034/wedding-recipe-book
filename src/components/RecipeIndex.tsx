import React, { useState, useMemo } from 'react';
import { ArrowLeft, Filter, X, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../App';
import SearchBar from './SearchBar';
import RecipeCard from './RecipeCard';
import { type Recipe } from '../types';
import { recipes } from '../recipesData';

interface RecipeIndexProps {
  searchQuery: string;
  selectedCategory: string | null;
  onRecipeClick: (recipe: Recipe) => void;
  onNavigateHome: () => void;
  onSearch: (query: string) => void;
}

interface FilterState {
  type: string[];
  cuisine: string[];
  difficulty: string[];
  cookMethod: string[];
  dietary: string[];
}

const RecipeIndex: React.FC<RecipeIndexProps> = ({
  searchQuery,
  selectedCategory,
  onRecipeClick,
  onNavigateHome,
  onSearch
}) => {
  const { currentTheme } = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    cuisine: [],
    difficulty: [],
    cookMethod: [],
    dietary: []
  });

  // Add expanded sections state
  const [expandedSections, setExpandedSections] = useState({
    type: true,     // Default expanded
    cuisine: false,
    difficulty: false,
    cookMethod: false,
    dietary: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper Components
  const FilterSection = ({ title, sectionKey, isExpanded, onToggle, children, currentTheme }: any) => (
    <div className="border rounded-lg border-opacity-20" style={currentTheme.styles.border}>
      <button
        onClick={() => onToggle(sectionKey)}
        className="w-full px-4 py-3 text-left font-medium hover:bg-opacity-10 hover:bg-gray-500 transition-colors flex items-center justify-between rounded-t-lg"
        style={currentTheme.styles.text.primary}
      >
        {title}
        <ChevronDown 
          size={16} 
          className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-3 border-t border-opacity-10" style={currentTheme.styles.border}>
          {children}
        </div>
      )}
    </div>
  );

  const FilterCheckbox = ({ label, checked, onChange, currentTheme }: any) => (
    <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-opacity-10 hover:bg-gray-500 transition-colors">
      <div
        onClick={onChange}
        className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
        style={{
          borderColor: (currentTheme.styles.text.accent as any).color || '#3b82f6',
          backgroundColor: checked 
            ? ((currentTheme.styles.text.accent as any).color || '#3b82f6')
            : 'transparent'
        }}
      >
        {checked && (
          <svg 
            className="w-3 h-3 text-white" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="3" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span 
        className="text-sm capitalize"
        style={currentTheme.styles.text.secondary}
      >
        {label}
      </span>
    </label>
  );

  const FilterChip = ({ label, checked, onChange, currentTheme }: any) => (
    <button
      onClick={onChange}
      className={`px-3 py-2 text-sm rounded-full border transition-all hover:scale-105 ${
        checked ? 'ring-2 ring-opacity-50' : ''
      }`}
      style={{
        backgroundColor: checked ? currentTheme.styles.text.accent.color : 'transparent',
        borderColor: currentTheme.styles.text.accent.color,
        color: checked ? 'white' : currentTheme.styles.text.secondary.color,
        ...(checked && { ringColor: currentTheme.styles.text.accent.color })
      }}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </button>
  );

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const types = [...new Set(recipes.map(r => r.type))];
    const cuisines = [...new Set(recipes.map(r => r.cuisine))];
    const difficulties = [...new Set(recipes.map(r => r.difficulty))];
    const cookMethods = [...new Set(recipes.flatMap(r => r.cookMethod))];
    
    return { types, cuisines, difficulties, cookMethods };
  }, []);

  // Filter recipes based on search, category, and filters
  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(recipe => recipe.type === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      // Special handling for "quick" - filter by total time ≤ 30 minutes
      if (query === 'quick') {
        filtered = filtered.filter(recipe => {
          const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
          return totalTime <= 30;
        });
      } else {
        // Regular text search
        filtered = filtered.filter(recipe =>
          recipe.name.toLowerCase().includes(query) ||
          (recipe.description && recipe.description.toLowerCase().includes(query)) ||
          (recipe.attribution && recipe.attribution.toLowerCase().includes(query)) ||
          recipe.cuisine.toLowerCase().includes(query) ||
          recipe.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
          recipe.ingredients.some((ing: any) => ing.item.toLowerCase().includes(query))
        );
      }
    }

    // Additional filters
    if (filters.type.length > 0) {
      filtered = filtered.filter(recipe => 
        filters.type.includes(recipe.type)
      );
    }

    if (filters.cuisine.length > 0) {
      filtered = filtered.filter(recipe => 
        filters.cuisine.includes(recipe.cuisine)
      );
    }

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(recipe => 
        filters.difficulty.includes(recipe.difficulty)
      );
    }

    if (filters.cookMethod.length > 0) {
      filtered = filtered.filter(recipe =>
        recipe.cookMethod.some((method: string) => filters.cookMethod.includes(method))
      );
    }

    if (filters.dietary.length > 0) {
      filtered = filtered.filter(recipe => {
        return filters.dietary.every(diet => {
          switch (diet) {
            case 'vegetarian': return recipe.isVegetarian;
            case 'vegan': return recipe.isVegan;
            case 'gluten-free': return recipe.isGlutenFree;
            default: return true;
          }
        });
      });
    }

    return filtered;
  }, [searchQuery, selectedCategory, filters]);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      type: [],
      cuisine: [],
      difficulty: [],
      cookMethod: [],
      dietary: []
    });
    onSearch(''); // Also clear search query
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  // Scroll to top when component mounts or when navigating to this page
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getPageTitle = () => {
    if (selectedCategory) {
      const categoryName = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      return `${categoryName} Recipes`;
    }
    if (searchQuery.trim()) {
      return `Search Results for "${searchQuery}"`;
    }
    return 'All Recipes';
  };

  return (
    <div className="min-h-screen" style={currentTheme.styles.background}>
      {/* Header */}
      <div className="shadow-sm" style={currentTheme.styles.cardBackground}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onNavigateHome}
              className="p-2 rounded-lg hover:opacity-80 transition-colors"
              style={currentTheme.styles.text.secondary}
            >
              <ArrowLeft size={24} />
            </button>
            <h1 
              className="text-2xl md:text-3xl font-bold font-serif"
              style={currentTheme.styles.primary}
            >
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                onSearch={onSearch}
                placeholder="Search recipes..."
                initialValue={searchQuery}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:opacity-80"
              style={{
                ...currentTheme.styles.cardBackground,
                ...currentTheme.styles.text.primary,
                ...currentTheme.styles.border,
                ...(hasActiveFilters ? currentTheme.styles.secondary : {})
              }}
            >
              <Filter size={16} />
              Filters
              {(hasActiveFilters || searchQuery.trim()) && (
                <span 
                  className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: (currentTheme.styles.text.accent as any).color,
                    color: 'white'
                  }}
                >
                  {Object.values(filters).flat().length + (searchQuery.trim() ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters - Always Visible */}
          <div className="mt-4 pt-4 border-t border-opacity-20" style={currentTheme.styles.border}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2" style={currentTheme.styles.text.secondary}>
                  Active Filters:
                </p>
                {(hasActiveFilters || searchQuery.trim()) ? (
                  <div className="flex flex-wrap gap-2">
                    {/* Search Query as Filter Tag */}
                    {searchQuery.trim() && (
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: (currentTheme.styles.text.accent as any).color || '#3b82f6',
                          color: 'white'
                        }}
                      >
                        Search: "{searchQuery}"
                        <button
                          onClick={() => onSearch('')}
                          className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    
                    {/* Other Filter Tags */}
                    {Object.entries(filters).map(([category, values]) =>
                      (values as string[]).map((value: string) => (
                        <span
                          key={`${category}-${value}`}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs cursor-pointer hover:opacity-80 transition-opacity border-2"
                          style={{
                            borderColor: (currentTheme.styles.text.accent as any).color || '#3b82f6',
                            backgroundColor: 'transparent',
                            color: (currentTheme.styles.text.accent as any).color || '#3b82f6'
                          }}
                        >
                          {value}
                          <button
                            onClick={() => toggleFilter(category as keyof FilterState, value)}
                            className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                ) : (
                  <p className="text-sm italic" style={currentTheme.styles.text.secondary}>
                    None
                  </p>
                )}
              </div>
              
              {/* Clear All Button - Only show when there are active filters */}
              {(hasActiveFilters || searchQuery.trim()) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm px-4 py-2 rounded-lg border hover:opacity-80 transition-colors flex items-center gap-1 whitespace-nowrap self-start sm:self-center"
                  style={{
                    ...currentTheme.styles.border,
                    ...currentTheme.styles.text.secondary
                  }}
                >
                  <X size={14} />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="max-w-7xl mx-auto px-4">
          {showFilters && (
            <div 
              className="mb-6 p-4 md:p-6 rounded-lg border-2"
              style={{
                ...currentTheme.styles.cardBackground,
                ...currentTheme.styles.border
              }}
            >
              {/* Action Buttons at TOP */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-opacity-20" style={currentTheme.styles.border}>
                <h3 
                  className="font-semibold mb-2 sm:mb-0"
                  style={currentTheme.styles.text.primary}
                >
                  Filters {(hasActiveFilters || searchQuery.trim()) && `(${Object.values(filters).flat().length + (searchQuery.trim() ? 1 : 0)})`}
                </h3>
                <div className="flex gap-2">
                  {(hasActiveFilters || searchQuery.trim()) && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm px-4 py-2 rounded-lg border hover:opacity-80 transition-colors flex items-center gap-1"
                      style={{
                        ...currentTheme.styles.border,
                        ...currentTheme.styles.text.secondary
                      }}
                    >
                      <X size={14} />
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-sm px-4 py-2 rounded-lg hover:opacity-80 transition-colors flex items-center gap-1"
                    style={{
                      ...currentTheme.styles.button.background,
                      ...currentTheme.styles.button.text
                    }}
                  >
                    <Check size={14} />
                    Apply ({filteredRecipes.length} recipes)
                  </button>
                </div>
              </div>

              {/* Collapsible Filter Sections */}
              <div className="space-y-3">
                
                {/* Type Filter - EXPANDED BY DEFAULT */}
                <FilterSection
                  title="Recipe Type"
                  sectionKey="type"
                  isExpanded={expandedSections.type}
                  onToggle={toggleSection}
                  currentTheme={currentTheme}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 pt-2">
                    {filterOptions.types.map(type => (
                      <FilterCheckbox
                        key={type}
                        label={type}
                        checked={filters.type.includes(type)}
                        onChange={() => toggleFilter('type', type)}
                        currentTheme={currentTheme}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Cuisine Filter */}
                <FilterSection
                  title="Cuisine"
                  sectionKey="cuisine"
                  isExpanded={expandedSections.cuisine}
                  onToggle={toggleSection}
                  currentTheme={currentTheme}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-2">
                    {filterOptions.cuisines.map(cuisine => (
                      <FilterCheckbox
                        key={cuisine}
                        label={cuisine}
                        checked={filters.cuisine.includes(cuisine)}
                        onChange={() => toggleFilter('cuisine', cuisine)}
                        currentTheme={currentTheme}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Difficulty Filter */}
                <FilterSection
                  title="Difficulty"
                  sectionKey="difficulty"
                  isExpanded={expandedSections.difficulty}
                  onToggle={toggleSection}
                  currentTheme={currentTheme}
                >
                  <div className="flex flex-wrap gap-2 pt-2">
                    {filterOptions.difficulties.map(difficulty => (
                      <FilterChip
                        key={difficulty}
                        label={difficulty}
                        checked={filters.difficulty.includes(difficulty)}
                        onChange={() => toggleFilter('difficulty', difficulty)}
                        currentTheme={currentTheme}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Cook Method Filter */}
                <FilterSection
                  title="Cooking Method"
                  sectionKey="cookMethod"
                  isExpanded={expandedSections.cookMethod}
                  onToggle={toggleSection}
                  currentTheme={currentTheme}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-2">
                    {filterOptions.cookMethods.map(method => (
                      <FilterCheckbox
                        key={method}
                        label={method.replace('-', ' ')}
                        checked={filters.cookMethod.includes(method)}
                        onChange={() => toggleFilter('cookMethod', method)}
                        currentTheme={currentTheme}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Dietary Filter */}
                <FilterSection
                  title="Dietary Preferences"
                  sectionKey="dietary"
                  isExpanded={expandedSections.dietary}
                  onToggle={toggleSection}
                  currentTheme={currentTheme}
                >
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['vegetarian', 'vegan', 'gluten-free'].map(diet => (
                      <FilterChip
                        key={diet}
                        label={diet.replace('-', ' ')}
                        checked={filters.dietary.includes(diet)}
                        onChange={() => toggleFilter('dietary', diet)}
                        currentTheme={currentTheme}
                      />
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p style={currentTheme.styles.text.secondary}>
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p 
              className="text-lg mb-4"
              style={currentTheme.styles.text.secondary}
            >
              No recipes found matching your criteria
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-lg hover:opacity-80 transition-colors"
              style={{
                ...currentTheme.styles.button.background,
                ...currentTheme.styles.button.text
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={onRecipeClick}
                showFavoriteIcon={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeIndex;
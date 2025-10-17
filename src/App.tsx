import { useState, useEffect, useMemo } from 'react';
import { Search, ChefHat, Clock, Users, Star, BookOpen, Coffee, Utensils, Salad, Apple, Soup, Wine, Cookie, Droplets, Filter, Monitor } from 'lucide-react';
import { recipes, type Recipe, type Ingredient } from './recipesData';

// Recipe type icons mapping
const typeIcons = {
  breakfast: Coffee,
  appetizer: Apple,
  entree: Utensils,
  side: Salad,
  salad: Salad,
  soup: Soup,
  dessert: Cookie,
  beverage: Wine,
  snack: Apple,
  condiment: Droplets
};

// Recipe type order for sorting
const typeOrder = ['breakfast', 'appetizer', 'entree', 'side', 'salad', 'soup', 'dessert', 'beverage', 'snack', 'condiment'];

// Theme configuration
const themes = {
  classic: {
    name: 'Classic',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    headerBg: 'bg-white',
    headerBorder: 'border-amber-400',
    text: 'text-amber-900',
    textSecondary: 'text-amber-700',
    textMuted: 'text-amber-600',
    accent: 'bg-amber-600',
    accentHover: 'hover:bg-amber-700',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-200',
    tabBg: 'bg-amber-100',
    tabActive: 'bg-amber-600',
    tabText: 'text-amber-800',
    tabActiveText: 'text-white'
  }
};

function RecipeBookApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [selectedCookMethod, setSelectedCookMethod] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [keepScreenActive, setKeepScreenActive] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('classic');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileTypeSelector, setShowMobileTypeSelector] = useState(true);

  if (false) {
    setCurrentTheme('classic')
  }

  const theme = themes[currentTheme];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Wake lock functionality
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    const enableWakeLock = async () => {
      if ('wakeLock' in navigator && keepScreenActive) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.log('Wake lock failed:', err);
        }
      }
    };

    if (keepScreenActive) {
      enableWakeLock();
    }

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [keepScreenActive]);

  // Filter and search recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = !searchTerm || 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.attribution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.ingredients.some(ing => ing.item.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = !selectedType || recipe.type === selectedType;
      const matchesCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine;
      const matchesVegetarian = !isVegetarian || recipe.isVegetarian;
      const matchesVegan = !isVegan || recipe.isVegan;
      const matchesGlutenFree = !isGlutenFree || recipe.isGlutenFree;
      const matchesCookMethod = !selectedCookMethod || recipe.cookMethod.includes(selectedCookMethod as any);
      const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;

      return matchesSearch && matchesType && matchesCuisine && matchesVegetarian && 
             matchesVegan && matchesGlutenFree && matchesCookMethod && matchesDifficulty;
    });

    // Sort by type order
    return filtered.sort((a, b) => {
      const aIndex = typeOrder.indexOf(a.type);
      const bIndex = typeOrder.indexOf(b.type);
      if (aIndex !== bIndex) return aIndex - bIndex;
      return a.name.localeCompare(b.name);
    });
  }, [searchTerm, selectedType, selectedCuisine, isVegetarian, isVegan, isGlutenFree, selectedCookMethod, selectedDifficulty]);

  // Get unique values for filters
  const cuisines = [...new Set(recipes.map(r => r.cuisine).filter(Boolean))].sort();
  const cookMethods = [...new Set(recipes.flatMap(r => r.cookMethod))].sort();

  const handleTypeSelection = (type: string) => {
    setSelectedType(type === 'all' ? '' : type);
    setShowMobileTypeSelector(false);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedCuisine('');
    setIsVegetarian(false);
    setIsVegan(false);
    setIsGlutenFree(false);
    setSelectedCookMethod('');
    setSelectedDifficulty('');
  };

  // Mobile type selector
  const MobileTypeSelector = () => (
    <div className={`min-h-screen ${theme.bg} p-6`}>
      <div className="max-w-lg mx-auto">
        <h1 className={`text-3xl font-bold ${theme.text} mb-2 text-center`}>What are you hungry for?</h1>
        <p className={`${theme.textSecondary} text-center mb-8`}>Choose a category to explore recipes</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {typeOrder.map(type => {
            const Icon = typeIcons[type as keyof typeof typeIcons];
            const typeRecipes = recipes.filter(r => r.type === type);
            if (typeRecipes.length === 0) return null;
            
            return (
              <button
                key={type}
                onClick={() => handleTypeSelection(type)}
                className={`${theme.cardBg} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border-2 ${theme.cardBorder} hover:border-amber-400`}
              >
                <Icon className={`w-8 h-8 ${theme.textMuted} mx-auto mb-2`} />
                <div className={`${theme.text} font-semibold capitalize`}>{type}</div>
                <div className={`text-sm ${theme.textMuted}`}>{typeRecipes.length} recipes</div>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => handleTypeSelection('all')}
          className={`w-full ${theme.accent} text-white rounded-xl p-4 font-semibold ${theme.accentHover} transition-colors`}
        >
          <BookOpen className="w-5 h-5 inline mr-2" />
          Show Everything
        </button>
      </div>
    </div>
  );

  // Recipe card component
  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <div 
      onClick={() => setSelectedRecipe(recipe)}
      className={`${theme.cardBg} rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border ${theme.cardBorder}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className={`text-xl font-bold ${theme.text} leading-tight`}>{recipe.name}</h3>
          <div className="flex items-center gap-1 ml-2">
            {recipe.isVegetarian && <span className="text-green-600 text-xs">🌱</span>}
            {recipe.isVegan && <span className="text-green-700 text-xs">🌿</span>}
            {recipe.isGlutenFree && <span className="text-blue-600 text-xs">GF</span>}
          </div>
        </div>
        
        {recipe.description && (
          <p className={`${theme.textSecondary} text-sm mb-4 line-clamp-2`}>{recipe.description}</p>
        )}
        
        <div className={`flex items-center justify-between text-sm ${theme.textMuted}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.totalTime}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className={`w-4 h-4 ${recipe.difficulty === 'easy' ? 'text-green-500' : recipe.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'}`} />
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
          </div>
          <span className="bg-amber-100 px-2 py-1 rounded text-xs capitalize">{recipe.type}</span>
        </div>
        
        {recipe.attribution && (
          <p className={`text-xs ${theme.textMuted} mt-2 italic`}>by {recipe.attribution}</p>
        )}
      </div>
    </div>
  );

  // Recipe modal
  const RecipeModal = () => {
    if (!selectedRecipe) return null;

    const groupedIngredients = selectedRecipe.ingredients.reduce((groups, ingredient) => {
      const section = ingredient.section || 'main';
      if (!groups[section]) groups[section] = [];
      groups[section].push(ingredient);
      return groups;
    }, {} as Record<string, Ingredient[]>);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className={`${theme.cardBg} rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
          <div className={`sticky top-0 ${theme.cardBg} border-b ${theme.cardBorder} p-6 flex justify-between items-start`}>
            <div>
              <h2 className={`text-3xl font-bold ${theme.text}`}>{selectedRecipe.name}</h2>
              {selectedRecipe.attribution && (
                <p className={`${theme.textMuted} italic`}>by {selectedRecipe.attribution}</p>
              )}
            </div>
            <button 
              onClick={() => setSelectedRecipe(null)}
              className={`${theme.textMuted} hover:text-amber-800 text-2xl`}
            >
              ×
            </button>
          </div>
          
          <div className="p-6">
            {selectedRecipe.description && (
              <p className={`${theme.textSecondary} mb-6`}>{selectedRecipe.description}</p>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-xl font-bold ${theme.text} mb-4`}>Ingredients</h3>
                {Object.entries(groupedIngredients).map(([section, ingredients]) => (
                  <div key={section} className="mb-6">
                    {section !== 'main' && (
                      <h4 className={`font-semibold ${theme.textSecondary} mb-2 capitalize`}>{section}</h4>
                    )}
                    <ul className="space-y-2">
                      {ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`${theme.textMuted} font-medium min-w-0 flex-shrink-0`}>
                            {ingredient.amount} {ingredient.unit}
                          </span>
                          <span className={theme.textSecondary}>
                            {ingredient.item}
                            {ingredient.preparation && `, ${ingredient.preparation}`}
                            {ingredient.isOptional && ' (optional)'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Prep:</strong> {selectedRecipe.prepTime}m</div>
                    <div><strong>Cook:</strong> {selectedRecipe.cookTime}m</div>
                    <div><strong>Total:</strong> {selectedRecipe.totalTime}m</div>
                    <div><strong>Serves:</strong> {selectedRecipe.servings}</div>
                    <div><strong>Difficulty:</strong> <span className="capitalize">{selectedRecipe.difficulty}</span></div>
                    <div><strong>Method:</strong> {selectedRecipe.cookMethod.join(', ')}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className={`text-xl font-bold ${theme.text} mb-4`}>Instructions</h3>
                <ol className="space-y-4">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className={`${theme.accent} text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5`}>
                        {idx + 1}
                      </span>
                      <span className={theme.textSecondary}>{step}</span>
                    </li>
                  ))}
                </ol>
                
                {selectedRecipe.notes && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Notes</h4>
                    <p className="text-blue-800 text-sm">{selectedRecipe.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isMobile && showMobileTypeSelector) {
    return <MobileTypeSelector />;
  }

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Header */}
      <div className={`${theme.headerBg} shadow-lg border-b-4 ${theme.headerBorder} sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center gap-4 mb-4">
            <ChefHat className={`w-8 h-8 ${theme.textMuted}`} />
            <h1 className={`text-2xl font-bold ${theme.text}`}>Recipe Book</h1>
            <div className="ml-auto flex items-center gap-2">
              {/* <button
                onClick={() => setCurrentTheme('classic')}
                className={`p-2 rounded-lg border-2 ${currentTheme === 'classic' ? 'border-amber-600 bg-amber-50' : 'border-gray-300'}`}
                title="Classic Theme"
              >
                <Palette className="w-4 h-4" />
              </button> */}
              {isMobile && (
                <button
                  onClick={() => setShowMobileTypeSelector(true)}
                  className={`px-3 py-2 ${theme.accent} text-white rounded-lg text-sm`}
                >
                  Categories
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textMuted} w-5 h-5`} />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 flex items-center gap-2 ${showFilters ? 'bg-amber-100' : ''}`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <button
                onClick={() => setKeepScreenActive(!keepScreenActive)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  keepScreenActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Keep screen awake while cooking"
              >
                <Monitor className="w-4 h-4" />
                {keepScreenActive ? 'Keep Active' : 'Screen Active'}
              </button>
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Types</option>
                  {typeOrder.map(type => (
                    <option key={type} value={type} className="capitalize">{type}</option>
                  ))}
                </select>
                
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Cuisines</option>
                  {cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
                
                <select
                  value={selectedCookMethod}
                  onChange={(e) => setSelectedCookMethod(e.target.value)}
                  className="px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Cook Methods</option>
                  {cookMethods.map(method => (
                    <option key={method} value={method} className="capitalize">{method}</option>
                  ))}
                </select>
                
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isVegetarian}
                    onChange={(e) => setIsVegetarian(e.target.checked)}
                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm">Vegetarian</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isVegan}
                    onChange={(e) => setIsVegan(e.target.checked)}
                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm">Vegan</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isGlutenFree}
                    onChange={(e) => setIsGlutenFree(e.target.checked)}
                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm">Gluten Free</span>
                </label>
              </div>
              
              <button
                onClick={clearAllFilters}
                className="text-sm text-amber-600 hover:text-amber-800 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${theme.text} mb-2`}>
              {selectedType ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Recipes` : 'All Recipes'}
            </h2>
            <p className={theme.textSecondary}>{filteredRecipes.length} recipes found</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          
          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className={`w-16 h-16 ${theme.textMuted} mx-auto mb-4 opacity-50`} />
              <h3 className={`text-xl font-semibold ${theme.textSecondary} mb-2`}>No recipes found</h3>
              <p className={theme.textMuted}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Desktop/Tablet Binder Tabs - Reserved Right Margin */}
        {!isMobile && (
          <div className="w-32 bg-amber-50 border-l border-amber-200 flex flex-col min-h-screen">
            {/* ALL Tab */}
            <div
              onClick={() => setSelectedType('')}
              className={`cursor-pointer transition-all duration-200 w-28 flex-1 flex items-center justify-center mx-auto
                       ${selectedType === '' ? `${theme.tabActive} ${theme.tabActiveText}` : `${theme.tabBg} ${theme.tabText} hover:bg-amber-200`}
                       border-2 border-amber-300 border-r-0 border-b-0 shadow-sm`}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 25%, 100% 75%, calc(100% - 12px) 100%, 0 100%)'
              }}
            >
              <div className="font-bold text-xs tracking-widest"
                   style={{
                     writingMode: 'vertical-rl',
                     textOrientation: 'mixed'
                   }}>
                ALL
              </div>
            </div>
            
            {/* Type Tabs */}
            {typeOrder.map((type, index) => (
              <div
                key={type}
                onClick={() => setSelectedType(type)}
                className={`cursor-pointer transition-all duration-200 w-28 flex-1 flex items-center justify-center mx-auto
                         ${selectedType === type ? `${theme.tabActive} ${theme.tabActiveText}` : `${theme.tabBg} ${theme.tabText} hover:bg-amber-200`}
                         border-2 border-amber-300 border-r-0 ${index < typeOrder.length - 1 ? 'border-b-0' : ''} shadow-sm`}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 25%, 100% 75%, calc(100% - 12px) 100%, 0 100%)'
                }}
              >
                <div className="font-bold text-xs tracking-widest leading-none"
                     style={{
                       writingMode: 'vertical-rl',
                       textOrientation: 'mixed'
                     }}>
                  {type.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RecipeModal />
    </div>
  );
}

export default RecipeBookApp;
import { useState, useEffect, useMemo } from 'react';
import { Search, ChefHat, Clock, Users, Star, BookOpen, Coffee, Utensils, Salad, Apple, Soup, Wine, Cookie, Droplets } from 'lucide-react';

// Types
interface Ingredient {
  amount: string | number;
  unit: string;
  item: string;
  preparation?: string;
  notes?: string;
  isOptional?: boolean;
  section?: string;
  substitution?: string;
  conditional?: string;
  splitUsage?: { amount: string | number; step: string }[];
}

interface Recipe {
  id: string;
  name: string;
  description?: string;
  attribution?: string;
  type: 'entree' | 'side' | 'salad' | 'appetizer' | 'dessert' | 'breakfast' | 'snack' | 'soup' | 'beverage' | 'condiment';
  cuisine?: string;
  isVegetarian: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  cookMethod: ('oven' | 'stovetop' | 'grill' | 'microwave' | 'no-cook' | 'smoker' | 'slow cooker' | 'pressure cooker' | 'air fryer' | 'griddle' | 'broiler')[];
  prepTime: number;
  cookTime: number;
  totalTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  notes?: string;
  equipment?: string[];
  tags: string[];
  createdAt: string;
}

// Sample data
const recipes: Recipe[] = [
  {
    id: 'coconut-bars-mom-simon',
    name: 'Coconut Bars',
    description: 'Classic layered coconut bars with a buttery crust and coconut-pecan topping',
    attribution: 'Mom Simon',
    type: 'dessert',
    cuisine: 'American',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    cookMethod: ['oven'],
    prepTime: 15,
    cookTime: 30,
    totalTime: 45,
    difficulty: 'easy',
    servings: 12,
    ingredients: [
      { amount: 0.5, unit: 'cup', item: 'butter', section: 'crust' },
      { amount: 1, unit: 'cup', item: 'all-purpose flour', section: 'crust' },
      { amount: 0.5, unit: 'cup', item: 'brown sugar', section: 'crust' },
      { amount: 2, unit: '', item: 'eggs', preparation: 'beaten', section: 'topping' },
      { amount: 1, unit: 'cup', item: 'brown sugar', section: 'topping' },
      { amount: 0.5, unit: 'teaspoon', item: 'baking powder', section: 'topping' },
      { amount: 3, unit: 'tablespoons', item: 'all-purpose flour', section: 'topping' },
      { amount: 1.5, unit: 'cups', item: 'shredded coconut', section: 'topping' },
      { amount: 1, unit: 'cup', item: 'pecans', preparation: 'chopped', section: 'topping' }
    ],
    instructions: [
      'Preheat oven to 350°F. Grease a baking pan.',
      'For the crust: Mix together butter, flour, and brown sugar.',
      'Using your hands, crumble the mixture together until it forms coarse crumbs.',
      'Pat the mixture firmly into the bottom of the greased pan.',
      'Bake for 10 minutes.',
      'Meanwhile, prepare the topping: Beat the eggs.',
      'Add brown sugar, baking powder, and flour to the beaten eggs.',
      'Stir in the shredded coconut and chopped pecans.',
      'Remove the crust from the oven after 10 minutes.',
      'Spread the coconut-pecan mixture evenly over the hot crust.',
      'Return to oven and bake for 20 minutes or until golden brown.',
      'Cut into bars while still hot. Allow to cool before serving.'
    ],
    notes: 'Cut while hot for clean edges. These bars keep well covered at room temperature for several days.',
    tags: ['bars', 'coconut', 'pecans', 'layered', 'family recipe'],
    createdAt: '2025-10-07T00:00:00Z'
  },
  {
    id: 'scrambled-eggs-basic',
    name: 'Perfect Scrambled Eggs',
    description: 'Creamy, fluffy scrambled eggs made the right way',
    type: 'breakfast',
    cuisine: 'American',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    cookMethod: ['stovetop'],
    prepTime: 2,
    cookTime: 5,
    totalTime: 7,
    difficulty: 'easy',
    servings: 2,
    ingredients: [
      { amount: 4, unit: '', item: 'large eggs' },
      { amount: 2, unit: 'tablespoons', item: 'butter' },
      { amount: 2, unit: 'tablespoons', item: 'heavy cream' },
      { amount: 1, unit: 'pinch', item: 'salt' },
      { amount: 1, unit: 'pinch', item: 'black pepper', preparation: 'freshly ground' }
    ],
    instructions: [
      'Crack eggs into a bowl and whisk until completely combined.',
      'Add cream, salt, and pepper to eggs and whisk again.',
      'Heat butter in a non-stick pan over medium-low heat.',
      'Pour in egg mixture and let sit for 20 seconds.',
      'Gently stir with a spatula, pushing eggs from edges to center.',
      'Continue cooking and stirring gently until eggs are just set but still creamy.',
      'Remove from heat immediately and serve.'
    ],
    notes: 'The key is low heat and patience. Don\'t rush the process for the creamiest eggs.',
    tags: ['eggs', 'breakfast', 'protein', 'quick', 'classic'],
    createdAt: '2025-10-06T00:00:00Z'
  }
];

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
  // const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [wakeLockEnabled, setWakeLockEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileTypeSelector, setShowMobileTypeSelector] = useState(true);


  if (false) {
    setIsVegetarian(false)
    setIsVegan(false)
    setIsGlutenFree(false)
    setSelectedCookMethod('')
    setSelectedDifficulty('')
  }

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
      if ('wakeLock' in navigator && wakeLockEnabled) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.log('Wake lock failed:', err);
        }
      }
    };

    if (wakeLockEnabled) {
      enableWakeLock();
    }

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLockEnabled]);

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
  // const cookMethods = [...new Set(recipes.flatMap(r => r.cookMethod))].sort();

  const handleTypeSelection = (type: string) => {
    setSelectedType(type === 'all' ? '' : type);
    setShowMobileTypeSelector(false);
  };

  // Mobile type selector
  const MobileTypeSelector = () => (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-2 text-center">What are you hungry for?</h1>
        <p className="text-amber-700 text-center mb-8">Choose a category to explore recipes</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {typeOrder.map(type => {
            const Icon = typeIcons[type as keyof typeof typeIcons];
            const typeRecipes = recipes.filter(r => r.type === type);
            if (typeRecipes.length === 0) return null;
            
            return (
              <button
                key={type}
                onClick={() => handleTypeSelection(type)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border-2 border-amber-200 hover:border-amber-400"
              >
                <Icon className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-amber-900 font-semibold capitalize">{type}</div>
                <div className="text-sm text-amber-600">{typeRecipes.length} recipes</div>
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => handleTypeSelection('all')}
          className="w-full bg-amber-600 text-white rounded-xl p-4 font-semibold hover:bg-amber-700 transition-colors"
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
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-amber-200"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-amber-900 leading-tight">{recipe.name}</h3>
          <div className="flex items-center gap-1 ml-2">
            {recipe.isVegetarian && <span className="text-green-600 text-xs">🌱</span>}
            {recipe.isVegan && <span className="text-green-700 text-xs">🌿</span>}
            {recipe.isGlutenFree && <span className="text-blue-600 text-xs">GF</span>}
          </div>
        </div>
        
        {recipe.description && (
          <p className="text-amber-700 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-amber-600">
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
          <p className="text-xs text-amber-500 mt-2 italic">by {recipe.attribution}</p>
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
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-amber-200 p-6 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-amber-900">{selectedRecipe.name}</h2>
              {selectedRecipe.attribution && (
                <p className="text-amber-600 italic">by {selectedRecipe.attribution}</p>
              )}
            </div>
            <button 
              onClick={() => setSelectedRecipe(null)}
              className="text-amber-600 hover:text-amber-800 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="p-6">
            {selectedRecipe.description && (
              <p className="text-amber-700 mb-6">{selectedRecipe.description}</p>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-4">Ingredients</h3>
                {Object.entries(groupedIngredients).map(([section, ingredients]) => (
                  <div key={section} className="mb-6">
                    {section !== 'main' && (
                      <h4 className="font-semibold text-amber-800 mb-2 capitalize">{section}</h4>
                    )}
                    <ul className="space-y-2">
                      {ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-medium min-w-0 flex-shrink-0">
                            {ingredient.amount} {ingredient.unit}
                          </span>
                          <span className="text-amber-800">
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
                <h3 className="text-xl font-bold text-amber-900 mb-4">Instructions</h3>
                <ol className="space-y-4">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-amber-800">{step}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-amber-400 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center gap-4 mb-4">
            <ChefHat className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-amber-900">Recipe Book</h1>
            {isMobile && (
              <button
                onClick={() => setShowMobileTypeSelector(true)}
                className="ml-auto px-3 py-1 bg-amber-600 text-white rounded-lg text-sm"
              >
                Categories
              </button>
            )}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 w-5 h-5" />
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
              
              <button
                onClick={() => setWakeLockEnabled(!wakeLockEnabled)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  wakeLockEnabled ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Keep screen awake while cooking"
              >
                {wakeLockEnabled ? '🔒 Awake' : '💤 Sleep'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop Side Tabs */}
        {!isMobile && (
          <div className="w-48 bg-amber-100 min-h-screen p-4 shadow-inner">
            <h3 className="font-bold text-amber-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedType('')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedType === '' ? 'bg-amber-600 text-white' : 'hover:bg-amber-200 text-amber-800'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                All Recipes
              </button>
              {typeOrder.map(type => {
                const Icon = typeIcons[type as keyof typeof typeIcons];
                const count = recipes.filter(r => r.type === type).length;
                if (count === 0) return null;
                
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedType === type ? 'bg-amber-600 text-white' : 'hover:bg-amber-200 text-amber-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="capitalize">{type}</span>
                    </div>
                    <span className="text-xs opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">
              {selectedType ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Recipes` : 'All Recipes'}
            </h2>
            <p className="text-amber-700">{filteredRecipes.length} recipes found</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          
          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-700 mb-2">No recipes found</h3>
              <p className="text-amber-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      <RecipeModal />
    </div>
  );
}

export default RecipeBookApp;
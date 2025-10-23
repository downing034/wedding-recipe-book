import React from 'react';
import { useTheme } from '../App';
import { useUserFavorites } from './UserFavoritesContext';
import SearchBar from './SearchBar';
import RecipeCard from './RecipeCard';
import CategoryTile from './CategoryTile';
import { Star, Heart } from 'lucide-react';
import { type Recipe } from '../types';
import { recipes } from '../recipesData';

interface HomeProps {
  onSearch: (query: string) => void;
  onCategoryClick: (categoryKey: string) => void;
  onRecipeClick: (recipe: Recipe) => void;
}

const Home: React.FC<HomeProps> = ({
  onSearch,
  onCategoryClick,
  onRecipeClick
}) => {
  const { currentTheme } = useTheme();
  const { userFavorites } = useUserFavorites();
  
  // Filter for Paul & Paige's curated favorites
  const paulAndPaigeFavorites = recipes.filter(recipe => recipe.isFavorite);

  // Filter for user's personal favorites
  const myFavoriteRecipes = recipes.filter(recipe => userFavorites.has(recipe.id));

  // Category images from local src/images/ folder
  const categoryImages = {
    entree: '/src/images/entrees.jpg',
    soup: '/src/images/soups.jpg', 
    salad: '/src/images/salads.jpg',
    appetizer: '/src/images/appetizers.jpg',
    side: '/src/images/sides.jpg'
  };

  // Circular category images from local src/images/ folder
  const circularImages = {
    all: '/src/images/all-recipes.jpg',
    quick: '/src/images/quick-easy.jpg',
    vegetarian: '/src/images/vegetarian.jpg',
    glutenFree: '/src/images/gluten-free.jpg',
    instantPot: '/src/images/instant-pot.jpg',
    slowCooker: '/src/images/slow-cooker.jpg',
    dessert: '/src/images/desserts.jpg'
  };

  // Primary categories for large cards (removed dessert)
  const primaryCategories = [
    { key: 'entree', label: 'ENTREES', image: categoryImages.entree },
    { key: 'soup', label: 'SOUPS', image: categoryImages.soup },
    { key: 'salad', label: 'SALADS', image: categoryImages.salad },
    { key: 'appetizer', label: 'APPETIZERS', image: categoryImages.appetizer },
    { key: 'side', label: 'SIDES', image: categoryImages.side }
  ];

  // Circular categories (cooking styles/methods)
  const circularCategories = [
    { key: 'all', label: 'ALL RECIPES', image: circularImages.all },
    { key: 'quick', label: 'QUICK & EASY', image: circularImages.quick, isFilter: true },
    { key: 'vegetarian', label: 'VEGETARIAN', image: circularImages.vegetarian, isFilter: true },
    { key: 'gluten-free', label: 'GLUTEN-FREE', image: circularImages.glutenFree, isFilter: true },
    { key: 'instant-pot', label: 'INSTANT POT', image: circularImages.instantPot, isFilter: true },
    { key: 'slow-cooker', label: 'SLOW COOKER', image: circularImages.slowCooker, isFilter: true },
    { key: 'dessert', label: 'DESSERTS', image: circularImages.dessert }
  ];

  const handlePrimaryCategory = (categoryKey: string) => {
    onCategoryClick(categoryKey);
  };

  const handleCircularCategory = (categoryKey: string) => {
    if (categoryKey === 'all') {
      onCategoryClick('all');
    } else if (categoryKey === 'dessert') {
      onCategoryClick('dessert');
    } else {
      // Handle filter-based navigation (implement filtering logic later)
      onSearch(`${categoryKey}`); // Temporary - will improve this
    }
  };

  return (
    <div className="min-h-screen" style={currentTheme.styles.background}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        
        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
          {/* Asymmetrical Hero Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left side - Title and intro */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-serif leading-tight"
                style={{
                  ...currentTheme.styles.primary,
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                }}
              >
                Paul & Paige's
                <br />
                <span 
                  className="text-4xl md:text-5xl lg:text-6xl"
                  style={currentTheme.styles.text.accent}
                >
                  Recipe Collection
                </span>
              </h1>
              
              <p 
                className="text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                style={currentTheme.styles.text.secondary}
              >
                Our wedding favor to you - we asked our guests to bring something special to the table, literally. This collection mixes our favorite recipes with those lovingly shared by family and friends.
              </p>
            </div>

            {/* Right side - Search */}
            <div className="lg:col-span-5">
              <div className="max-w-md mx-auto lg:max-w-none">
                <SearchBar 
                  onSearch={onSearch}
                  placeholder="Search all recipes..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-12 text-center font-serif"
          style={currentTheme.styles.primary}
        >
          Browse by Category
        </h2>
        
        {/* Responsive Layout: Mobile 1col, Tablet 2x2, Desktop 4col */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-16">
          {/* Entrees */}
          <div className="h-64 md:h-72 xl:h-80">
            <CategoryTile
              category={primaryCategories[0]}
              onClick={handlePrimaryCategory}
              className="h-full"
            />
          </div>
          
          {/* Soups */}
          <div className="h-64 md:h-72 xl:h-80">
            <CategoryTile
              category={primaryCategories[1]}
              onClick={handlePrimaryCategory}
              className="h-full"
            />
          </div>
          
          {/* Salads */}
          <div className="h-64 md:h-72 xl:h-80">
            <CategoryTile
              category={primaryCategories[2]}
              onClick={handlePrimaryCategory}
              className="h-full"
            />
          </div>
          
          {/* Appetizers and Sides - stacked with balanced gap */}
          <div className="space-y-4 md:space-y-8">
            <div className="h-28 md:h-32 xl:h-36">
              <CategoryTile
                category={primaryCategories[3]} // Appetizers
                onClick={handlePrimaryCategory}
                className="h-full"
              />
            </div>
            <div className="h-28 md:h-32 xl:h-36">
              <CategoryTile
                category={primaryCategories[4]} // Sides
                onClick={handlePrimaryCategory}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Circular Categories Section - Honeycomb Layout */}
        <div className="mb-16">
          {/* Desktop: All 7 in one row */}
          <div className="hidden lg:grid lg:grid-cols-7 gap-6 justify-items-center">
            {circularCategories.map((category) => (
              <div
                key={category.key}
                onClick={() => handleCircularCategory(category.key)}
                className="cursor-pointer transition-all duration-300 hover-lift text-center"
              >
                {/* Circular Image */}
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 mx-auto border-2 hover-glow-blue transition-glow"
                  style={{
                    ...currentTheme.styles.border
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.label}
                    className="w-full h-full object-cover"
                    style={{
                      filter: 'brightness(0.8)'
                    }}
                  />
                </div>
                
                {/* Text Label */}
                <p 
                  className="text-xs md:text-sm font-bold tracking-wide leading-tight"
                  style={currentTheme.styles.text.primary}
                >
                  {category.label}
                </p>
              </div>
            ))}
          </div>

          {/* Tablet/Mobile: Honeycomb/Offset Layout */}
          <div className="lg:hidden">
            {/* First row: 4 items */}
            <div className="grid grid-cols-4 gap-4 md:gap-6 justify-items-center mb-6">
              {circularCategories.slice(0, 4).map((category) => (
                <div
                  key={category.key}
                  onClick={() => handleCircularCategory(category.key)}
                  className="cursor-pointer transition-all duration-300 hover-lift text-center"
                >
                  <div 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-3 mx-auto border-2 hover-glow-blue transition-glow"
                    style={{
                      ...currentTheme.styles.border
                    }}
                  >
                    <img
                      src={category.image}
                      alt={category.label}
                      className="w-full h-full object-cover"
                      style={{
                        filter: 'brightness(0.8)'
                      }}
                    />
                  </div>
                  <p 
                    className="text-xs font-bold tracking-wide leading-tight"
                    style={currentTheme.styles.text.primary}
                  >
                    {category.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Second row: 3 items offset/centered for honeycomb effect */}
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-8 md:gap-16">
                {circularCategories.slice(4).map((category) => (
                  <div
                    key={category.key}
                    onClick={() => handleCircularCategory(category.key)}
                    className="cursor-pointer transition-all duration-300 hover-lift text-center"
                  >
                    <div 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-3 mx-auto border-2 hover-glow-blue transition-glow"
                      style={{
                        ...currentTheme.styles.border
                      }}
                    >
                      <img
                        src={category.image}
                        alt={category.label}
                        className="w-full h-full object-cover"
                        style={{
                          filter: 'brightness(0.8)'
                        }}
                      />
                    </div>
                    <p 
                      className="text-xs font-bold tracking-wide leading-tight"
                      style={currentTheme.styles.text.primary}
                    >
                      {category.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Favorites Section - Only show if user has favorites */}
      {myFavoriteRecipes.length > 0 && (
        <div className="container mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4 font-serif flex items-center justify-center gap-3"
              style={currentTheme.styles.primary}
            >
              <Heart className="fill-red-500 text-red-500" size={32} />
              My Favorites
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={currentTheme.styles.text.secondary}
            >
              Your personally saved recipes - stored locally on this device.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFavoriteRecipes.map((recipe) => (
              <div key={recipe.id} className="transition-glow hover-lift">
                <RecipeCard
                  recipe={recipe}
                  onClick={onRecipeClick}
                  showFavoriteIcon={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paul & Paige's Favorites Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 font-serif flex items-center justify-center gap-3"
            style={currentTheme.styles.primary}
          >
            <Star className="fill-yellow-400 text-yellow-400" size={32} />
            Paul & Paige's Favorites
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={currentTheme.styles.text.secondary}
          >
            These are our go-to recipes that never fail to impress. 
            Perfect for special occasions or everyday cooking.
          </p>
        </div>
        
        {paulAndPaigeFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paulAndPaigeFavorites.map((recipe) => (
              <div key={recipe.id} className="transition-glow hover-lift">
                <RecipeCard
                  recipe={recipe}
                  onClick={onRecipeClick}
                  showFavoriteIcon={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="text-center py-12 rounded-lg border"
            style={{
              ...currentTheme.styles.cardBackground,
              ...currentTheme.styles.border
            }}
          >
            <p style={currentTheme.styles.text.secondary}>
              No favorite recipes selected yet.
            </p>
          </div>
        )}

        {/* Updated Favorites Disclaimer */}
        <div className="mt-8 max-w-3xl mx-auto space-y-3">
          <div 
            className="flex items-start gap-3 text-sm p-4 rounded-lg border"
            style={{
              ...currentTheme.styles.secondary,
              ...currentTheme.styles.text.secondary,
              ...currentTheme.styles.border
            }}
          >
            <Star className="fill-yellow-400 text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
            <span>
              <strong>Paul & Paige's Favorites</strong> are our personal recommendations - 
              the recipes we love and wanted to share with you.
            </span>
          </div>
          
          <div 
            className="flex items-start gap-3 text-sm p-4 rounded-lg border"
            style={{
              ...currentTheme.styles.secondary,
              ...currentTheme.styles.text.secondary,
              ...currentTheme.styles.border
            }}
          >
            <Heart className="fill-red-500 text-red-500 flex-shrink-0 mt-0.5" size={16} />
            <span>
              <strong>My Favorites</strong> are your personal collection. Click the heart icon on any recipe 
              to save it to your favorites. They're stored locally on this browser, so they'll be here 
              when you come back on the same device.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
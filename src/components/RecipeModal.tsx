import React, { useState, useEffect } from 'react';
import { X, Clock, Users, ChefHat, Utensils, Star, Monitor, Heart } from 'lucide-react';
import { useTheme } from '../App';
import { useUserFavorites } from './UserFavoritesContext';
import { type Recipe, type Ingredient } from '../types';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const { currentTheme } = useTheme();
  const { isUserFavorite, toggleUserFavorite } = useUserFavorites();
  const [keepScreenOn, setKeepScreenOn] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [isClosing, setIsClosing] = useState(false);

  const isFavorited = isUserFavorite(recipe.id);

  const handleFavoriteClick = () => {
    toggleUserFavorite(recipe.id);
  };

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  // Toggle ingredient checked state
  const toggleIngredient = (ingredientKey: string) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientKey)) {
        newSet.delete(ingredientKey);
      } else {
        newSet.add(ingredientKey);
      }
      return newSet;
    });
  };

  // Toggle step checked state
  const toggleStep = (stepIndex: number) => {
    setCheckedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  // Handle keep screen on functionality
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && keepScreenOn) {
          const wakeLockSentinel = await navigator.wakeLock.request('screen');
          setWakeLock(wakeLockSentinel);
        }
      } catch (err) {
        console.log('Wake lock failed:', err);
      }
    };

    const releaseWakeLock = () => {
      if (wakeLock) {
        wakeLock.release();
        setWakeLock(null);
      }
    };

    if (keepScreenOn) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    // Cleanup on unmount
    return () => {
      releaseWakeLock();
    };
  }, [keepScreenOn, wakeLock]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Track when main title scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show header title when main title is not visible
        setShowHeaderTitle(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px' // Account for header height
      }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);

  const getDifficultyStyles = (difficulty: string): React.CSSProperties => {
    switch (difficulty) {
      case 'easy':
        return { color: '#16a34a', backgroundColor: '#dcfce7' }; // green-600, green-100
      case 'medium':
        return { color: '#ca8a04', backgroundColor: '#fef3c7' }; // yellow-600, yellow-100
      case 'hard':
        return { color: '#dc2626', backgroundColor: '#fecaca' }; // red-600, red-100
      default:
        return { ...currentTheme.styles.text.secondary, backgroundColor: '#f3f4f6' };
    }
  };

  // Group ingredients by section
  const groupedIngredients = recipe.ingredients.reduce((groups, ingredient) => {
    const section = ingredient.section || 'Main';
    if (!groups[section]) {
      groups[section] = [];
    }
    groups[section].push(ingredient);
    return groups;
  }, {} as Record<string, Ingredient[]>);

  return (
    <>
      {/* Backdrop with fade animation */}
      <div 
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-20'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal container with slide-up animation */}
      <div 
        className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none"
      >
        <div 
          className="w-full h-full flex flex-col pointer-events-auto transform transition-transform duration-300"
          style={{
            // Use solid background for Vintage theme to avoid transparency issues
            background: currentTheme.name === 'Vintage' 
              ? 'linear-gradient(to bottom, #faf8f3 0%, #f5f1e8 100%)'
              : (currentTheme.styles.background as any).background,
            transform: isClosing ? 'translateY(100%)' : 'translateY(0)'
          }}
        >
      {/* Compact Header - Dynamic title on scroll */}
      <div 
        className="flex items-center justify-between gap-2 p-3 md:p-4 flex-shrink-0"
        style={{
          ...currentTheme.styles.cardBackground,
          borderBottom: `1px solid ${(currentTheme.styles.border as any).borderColor}`
        }}
      >
        {/* Left side: Keep Screen On Toggle + Favorite */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* Keep Screen On Toggle - Fully clickable */}
          {'wakeLock' in navigator && (
            <button
              onClick={() => setKeepScreenOn(!keepScreenOn)}
              className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 rounded-lg transition-colors hover:opacity-80"
            >
              <Monitor size={16} style={currentTheme.styles.text.secondary} />
              <span 
                className="text-xs md:text-sm whitespace-nowrap hidden sm:inline"
                style={currentTheme.styles.text.secondary}
              >
                Screen On
              </span>
              <div
                className="relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors"
                style={{
                  backgroundColor: keepScreenOn 
                    ? (currentTheme.styles.text.accent as any).color || '#3b82f6'
                    : '#d1d5db'
                }}
              >
                <span
                  className={`
                    inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform
                    ${keepScreenOn ? 'translate-x-5 md:translate-x-6' : 'translate-x-1'}
                  `}
                />
              </div>
            </button>
          )}

          {/* Favorite Star */}
          {recipe.isFavorite && (
            <div title="Paul & Paige's Favorite">
              <Star size={18} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
            </div>
          )}

          {/* User Favorite Heart */}
          <button
            onClick={handleFavoriteClick}
            className="p-1 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
            title={isFavorited ? "Remove from your favorites" : "Add to your favorites"}
          >
            <Heart 
              size={18} 
              className={`transition-all ${
                isFavorited 
                  ? 'fill-red-500 text-red-500' 
                  : 'hover:text-red-400'
              }`}
              style={!isFavorited ? currentTheme.styles.text.secondary : undefined}
            />
          </button>
        </div>

        {/* Center: Recipe Title (only shown when scrolled) */}
        <div 
          className={`
            flex-1 text-center px-2 min-w-0 transition-opacity duration-300
            ${showHeaderTitle ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          <h2 
            className="text-sm md:text-base lg:text-lg font-semibold truncate"
            style={currentTheme.styles.primary}
            title={recipe.name}
          >
            {recipe.name}
          </h2>
        </div>

        {/* Right side: Close Button */}
        <button
          onClick={handleClose}
          className="p-1.5 md:p-2 rounded-lg transition-colors hover:opacity-80 flex-shrink-0"
          style={currentTheme.styles.text.secondary}
        >
          <X size={20} className="md:w-6 md:h-6" />
        </button>
      </div>

      {/* Scrollable Content with base padding */}
      <div className="flex-1 overflow-y-auto" style={currentTheme.styles.background}>
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          {/* Recipe Header - Centered */}
          <div className="mb-8 text-center">
            <h1 
              ref={titleRef}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-serif"
              style={currentTheme.styles.primary}
            >
              {recipe.name}
            </h1>

            {recipe.description && (
              <p 
                className="text-base md:text-lg mb-4 max-w-2xl mx-auto"
                style={currentTheme.styles.text.secondary}
              >
                {recipe.description}
              </p>
            )}

            {recipe.attribution && (
              <p 
                className="text-base md:text-lg font-medium mb-4"
                style={currentTheme.styles.text.accent}
              >
                by {recipe.attribution}
              </p>
            )}

            {/* Cuisine and Cook Method - Below attribution */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Utensils size={16} style={currentTheme.styles.text.secondary} />
                <span 
                  className="font-medium"
                  style={currentTheme.styles.text.secondary}
                >
                  Cuisine:
                </span>
                <span 
                  className="font-semibold"
                  style={currentTheme.styles.text.primary}
                >
                  {recipe.cuisine}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ChefHat size={16} style={currentTheme.styles.text.secondary} />
                <span 
                  className="font-medium"
                  style={currentTheme.styles.text.secondary}
                >
                  Method:
                </span>
                <span 
                  className="font-semibold capitalize"
                  style={currentTheme.styles.text.primary}
                >
                  {recipe.cookMethod.map(method => method.replace('-', ' ')).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Recipe Stats */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 md:p-6 rounded-lg border"
            style={{
              ...currentTheme.styles.cardBackground,
              ...currentTheme.styles.border
            }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock size={20} style={currentTheme.styles.text.accent} />
              </div>
              <div className="text-xs md:text-sm" style={currentTheme.styles.text.secondary}>
                Prep Time
              </div>
              <div className="font-semibold text-sm md:text-base" style={currentTheme.styles.text.primary}>
                {recipe.prepTime} min
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ChefHat size={20} style={currentTheme.styles.text.accent} />
              </div>
              <div className="text-xs md:text-sm" style={currentTheme.styles.text.secondary}>
                Cook Time
              </div>
              <div className="font-semibold text-sm md:text-base" style={currentTheme.styles.text.primary}>
                {recipe.cookTime} min
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users size={20} style={currentTheme.styles.text.accent} />
              </div>
              <div className="text-xs md:text-sm" style={currentTheme.styles.text.secondary}>
                Servings
              </div>
              <div className="font-semibold text-sm md:text-base" style={currentTheme.styles.text.primary}>
                {recipe.servings}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Utensils size={20} style={currentTheme.styles.text.accent} />
              </div>
              <div className="text-xs md:text-sm" style={currentTheme.styles.text.secondary}>
                Difficulty
              </div>
              <div>
                <span 
                  className="inline-block px-2 py-1 rounded-full text-xs md:text-sm font-semibold capitalize"
                  style={getDifficultyStyles(recipe.difficulty)}
                >
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div 
            className="p-4 md:p-6 rounded-lg border mb-8"
            style={{
              ...currentTheme.styles.cardBackground,
              ...currentTheme.styles.border
            }}
          >
            {/* Equipment Section - Checklist Style */}
            {recipe.equipment && recipe.equipment.length > 0 && (
              <div className="mb-4">
                <h3 
                  className="text-base md:text-lg font-bold mb-3 flex items-center gap-2"
                  style={currentTheme.styles.text.primary}
                >
                  <Utensils size={18} style={currentTheme.styles.text.accent} />
                  Equipment Needed
                </h3>
                <ul className="space-y-2">
                  {recipe.equipment.map((item, index) => (
                    <li 
                      key={index} 
                      className="flex items-center gap-3 text-sm md:text-base"
                    >
                      <div 
                        className="w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: (currentTheme.styles.text.accent as any).color || '#3b82f6',
                          backgroundColor: 'transparent'
                        }}
                      >
                        <div 
                          className="w-2 h-2 rounded-sm"
                          style={{
                            backgroundColor: (currentTheme.styles.text.accent as any).color || '#3b82f6',
                            opacity: 0.3
                          }}
                        />
                      </div>
                      <span style={currentTheme.styles.text.primary}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dietary Tags */}
            {(recipe.isVegetarian || recipe.isVegan || recipe.isGlutenFree) && (
              <div className="flex flex-wrap gap-2">
                {recipe.isVegetarian && (
                  <span className="px-3 py-1 rounded-full text-xs md:text-sm bg-green-100 text-green-700">
                    Vegetarian
                  </span>
                )}
                {recipe.isVegan && (
                  <span className="px-3 py-1 rounded-full text-xs md:text-sm bg-green-200 text-green-800">
                    Vegan
                  </span>
                )}
                {recipe.isGlutenFree && (
                  <span className="px-3 py-1 rounded-full text-xs md:text-sm bg-blue-100 text-blue-700">
                    Gluten-Free
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Two Column Layout for Ingredients and Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Ingredients Section */}
            <div>
              <h2 
                className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-serif"
                style={currentTheme.styles.primary}
              >
                Ingredients
              </h2>

              <div className="space-y-6">
                {Object.entries(groupedIngredients).map(([section, ingredients]) => (
                  <div key={section}>
                    {Object.keys(groupedIngredients).length > 1 && (
                      <h3 
                        className="font-semibold mb-3 text-base md:text-lg"
                        style={currentTheme.styles.text.accent}
                      >
                        {section}
                      </h3>
                    )}
                    
                    <ul className="space-y-2">
                      {ingredients.map((ingredient, index) => {
                        const ingredientKey = `${section}-${index}`;
                        const isChecked = checkedIngredients.has(ingredientKey);
                        
                        return (
                          <li 
                            key={index} 
                            onClick={() => toggleIngredient(ingredientKey)}
                            className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:opacity-80"
                            style={{
                              ...currentTheme.styles.cardBackground,
                              ...currentTheme.styles.border
                            }}
                          >
                            <button
                              className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                              style={{
                                borderColor: (currentTheme.styles.text.accent as any).color || '#3b82f6',
                                backgroundColor: isChecked 
                                  ? ((currentTheme.styles.text.accent as any).color || '#3b82f6')
                                  : 'transparent'
                              }}
                            >
                              {isChecked && (
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
                            </button>
                            <div className="flex-1 text-sm md:text-base">
                              <span 
                                className={`font-medium transition-all ${isChecked ? 'line-through opacity-50' : ''}`}
                                style={currentTheme.styles.text.primary}
                              >
                                {ingredient.amount} {ingredient.unit} {ingredient.item}
                              </span>
                              {ingredient.preparation && (
                                <span 
                                  className={`transition-all ${isChecked ? 'line-through opacity-50' : ''}`}
                                  style={currentTheme.styles.text.secondary}
                                >
                                  , {ingredient.preparation}
                                </span>
                              )}
                              {ingredient.notes && (
                                <div 
                                  className={`text-xs md:text-sm italic mt-1 transition-all ${isChecked ? 'line-through opacity-50' : ''}`}
                                  style={currentTheme.styles.text.secondary}
                                >
                                  {ingredient.notes}
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div>
              <h2 
                className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-serif"
                style={currentTheme.styles.primary}
              >
                Instructions
              </h2>

              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => {
                  const isChecked = checkedSteps.has(index);
                  
                  return (
                    <li 
                      key={index}
                      onClick={() => toggleStep(index)}
                      className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-lg border cursor-pointer transition-all hover:opacity-80"
                      style={{
                        ...currentTheme.styles.cardBackground,
                        ...currentTheme.styles.border
                      }}
                    >
                      <button
                        className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded border-2 flex items-center justify-center text-xs md:text-sm font-bold transition-all"
                        style={{
                          borderColor: (currentTheme.styles.text.accent as any).color || '#3b82f6',
                          color: isChecked 
                            ? '#ffffff'
                            : ((currentTheme.styles.text.accent as any).color || '#3b82f6'),
                          backgroundColor: isChecked 
                            ? ((currentTheme.styles.text.accent as any).color || '#3b82f6')
                            : 'transparent'
                        }}
                      >
                        {isChecked ? (
                          <svg 
                            className="w-4 h-4 text-white" 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="3" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </button>
                      <p 
                        className={`leading-relaxed text-sm md:text-base transition-all ${isChecked ? 'line-through opacity-50' : ''}`}
                        style={currentTheme.styles.text.primary}
                      >
                        {instruction}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Notes Section */}
          {recipe.notes && (
            <div className="mt-6 md:mt-8">
              <h2 
                className="text-xl md:text-2xl font-bold mb-4 font-serif"
                style={currentTheme.styles.primary}
              >
                Notes
              </h2>
              <div 
                className="p-4 rounded-lg border"
                style={{
                  ...currentTheme.styles.cardBackground,
                  ...currentTheme.styles.border
                }}
              >
                <p 
                  className="leading-relaxed text-sm md:text-base"
                  style={currentTheme.styles.text.primary}
                >
                  {recipe.notes}
                </p>
              </div>
            </div>
          )}

          {/* Tags Section - Added bottom margin/padding */}
          {recipe.tags.length > 0 && (
            <div className="mt-6 md:mt-8 mb-8">
              <h2 
                className="text-xl md:text-2xl font-bold mb-4 font-serif"
                style={currentTheme.styles.primary}
              >
                Tags
              </h2>
              <div className="flex flex-wrap gap-2 pb-4">
                {recipe.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 rounded-full text-xs md:text-sm bg-gray-100 text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
    </>
  );
};

export default RecipeModal;
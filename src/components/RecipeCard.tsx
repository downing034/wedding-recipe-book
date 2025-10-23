import React from 'react';
import { Users, Star, Heart, Leaf, Wheat } from 'lucide-react';
import { useTheme } from '../App';
import { useUserFavorites } from './UserFavoritesContext';
import { type Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  className?: string;
  showFavoriteIcon?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onClick, 
  className = "",
  showFavoriteIcon = false
}) => {
  const { currentTheme } = useTheme();
  const { isUserFavorite, toggleUserFavorite } = useUserFavorites();
  
  const isFavorited = isUserFavorite(recipe.id);

  const handleClick = () => {
    onClick(recipe);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUserFavorite(recipe.id);
  };

  const getDifficultyColor = (difficulty: string): React.CSSProperties => {
    switch (difficulty) {
      case 'easy':
        return { color: '#16a34a' }; // green-600
      case 'medium':
        return { color: '#ca8a04' }; // yellow-600
      case 'hard':
        return { color: '#dc2626' }; // red-600
      default:
        return currentTheme.styles.text.secondary;
    }
  };

  const formatCookMethods = (methods: string[]) => {
    if (methods.length === 0) return '';
    if (methods.length === 1) return methods[0];
    return `${methods[0]}${methods.length > 1 ? ' +' + (methods.length - 1) : ''}`;
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        rounded-xl shadow-md hover:shadow-lg transition-all duration-200 
        cursor-pointer border hover:opacity-90 
        h-96 flex flex-col overflow-hidden
        ${className}
      `}
      style={{
        ...currentTheme.styles.cardBackground,
        ...currentTheme.styles.border
      }}
    >
      {/* Header - Two rows for better organization */}
      <div className="p-4 flex-shrink-0" style={{ borderBottom: `1px solid ${(currentTheme.styles.border as any).borderColor}` }}>
        
        {/* Top row: Time/Servings on left, Favorites on right */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-1 text-sm"
              style={currentTheme.styles.text.secondary}
            >
              <Users size={14} />
              <span>{recipe.servings}</span>
            </div>
          </div>

          <div className="flex-1 flex justify-center px-4">
            {recipe.cuisine && (
              <span 
                className="inline-block px-3 py-1 text-xs rounded-full font-medium bg-opacity-80 max-w-full truncate"
                style={{
                  backgroundColor: currentTheme.styles.text.accent.color + '20',
                  color: currentTheme.styles.text.accent.color
                }}
                title={recipe.cuisine}
              >
                {recipe.cuisine}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Paul & Paige's Favorite - Star (display only) */}
            {showFavoriteIcon && recipe.isFavorite && (
              <div title="Paul & Paige's Favorite">
                <Star 
                  size={18} 
                  className="fill-yellow-400 text-yellow-400"
                />
              </div>
            )}
            {/* User Favorite - Heart (clickable) */}
            <button
              onClick={handleFavoriteClick}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
              title={isFavorited ? "Remove from your favorites" : "Add to your favorites"}
            >
              <Heart 
                size={18} 
                className={`transition-all ${
                  isFavorited 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-400 hover:text-red-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom row: Cook method, Cuisine center, Dietary icons */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {recipe.cookMethod.length > 0 && (
              <span 
                className="text-xs truncate block"
                style={currentTheme.styles.text.secondary}
                title={recipe.cookMethod.join(', ')}
              >
                {formatCookMethods(recipe.cookMethod)}
              </span>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-1 h-6">
              {recipe.isVegetarian && (
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center" title="Vegetarian">
                  <Leaf size={12} className="text-green-600" />
                </div>
              )}
              {recipe.isVegan && (
                <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center" title="Vegan">
                  <Leaf size={12} className="text-green-700" />
                </div>
              )}
              {recipe.isGlutenFree && (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center" title="Gluten-Free">
                  <Wheat size={12} className="text-blue-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body - Title and Description */}
      <div className="flex-1 flex flex-col p-6">
        <div 
          className="h-12 mb-4 flex items-center justify-center"
        >
          <h3 
            className="font-bold text-lg text-center leading-tight"
            style={currentTheme.styles.text.primary}
          >
            {recipe.name.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < recipe.name.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h3>
        </div>
        
        {recipe.description && (
          <p 
            className="text-sm text-center leading-relaxed line-clamp-4 flex-1"
            style={currentTheme.styles.text.secondary}
          >
            {recipe.description}
          </p>
        )}
      </div>

      {/* Footer - Attribution and Difficulty */}
      <div className="p-4 flex-shrink-0" style={{ borderTop: `1px solid ${(currentTheme.styles.border as any).borderColor}` }}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {recipe.attribution && (
              <p 
                className="text-xs font-medium truncate"
                style={currentTheme.styles.text.accent}
                title={`by ${recipe.attribution}`}
              >
                by {recipe.attribution}
              </p>
            )}
          </div>
          
          <div className="ml-3">
            <span 
              className="font-semibold px-2 py-1 rounded-full text-xs whitespace-nowrap"
              style={{
                ...getDifficultyColor(recipe.difficulty),
                backgroundColor: `${getDifficultyColor(recipe.difficulty).color}15`
              }}
            >
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
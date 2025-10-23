import React from 'react';
import { useTheme } from '../App';

interface CategoryTileProps {
  category: { 
    key: string; 
    label: string; 
    image?: string;
  };
  onClick: (categoryKey: string) => void;
  className?: string;
}

const CategoryTile: React.FC<CategoryTileProps> = ({ 
  category, 
  onClick, 
  className = "" 
}) => {
  const { currentTheme } = useTheme();

  const handleClick = () => {
    onClick(category.key);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        rounded-lg cursor-pointer transition-all duration-300 
        hover-glow-blue hover-lift border overflow-hidden
        flex flex-col
        ${className}
      `}
      style={{
        ...currentTheme.styles.cardBackground,
        ...currentTheme.styles.border
      }}
    >
      {/* Image Section - fills most of the space */}
      <div className="flex-1 relative overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={category.label}
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.7)'
            }}
          />
        ) : (
          // Fallback pattern if no image
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, 
                rgba(59, 130, 246, 0.1) 0%, 
                rgba(59, 130, 246, 0.05) 100%)`
            }}
          >
            <div 
              className="w-8 h-8 rounded-full"
              style={{
                backgroundColor: currentTheme.styles.text.accent.color,
                opacity: 0.3
              }}
            />
          </div>
        )}
        
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      
      {/* Text Section - fixed at bottom */}
      <div className="p-3 relative z-10">
        <h3 
          className="font-bold text-center text-sm tracking-wide"
          style={{
            ...currentTheme.styles.text.primary,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
          }}
        >
          {category.label}
        </h3>
      </div>
    </div>
  );
};

export default CategoryTile;
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import Home from './components/Home';
import RecipeIndex from './components/RecipeIndex';
import RecipeModal from './components/RecipeModal';
import { UserFavoritesProvider } from './components/UserFavoritesContext';
import { type Recipe } from './types';

// Theme Interface
export interface Theme {
  name: string;
  styles: {
    primary: React.CSSProperties;
    secondary: React.CSSProperties;
    background: React.CSSProperties;
    cardBackground: React.CSSProperties;
    border: React.CSSProperties;
    text: {
      primary: React.CSSProperties;
      secondary: React.CSSProperties;
      accent: React.CSSProperties;
    };
    button: {
      background: React.CSSProperties;
      hover: React.CSSProperties;
      text: React.CSSProperties;
    };
  };
}

// Modern Theme - Clean, minimalist recipe site
const modernTheme: Theme = {
  name: 'Modern',
  styles: {
    primary: { 
      color: '#1f2937',
      textShadow: 'none' // No text shadow for clean readability
    },
    secondary: { 
      backgroundColor: '#f3f4f6',
      border: '1px solid #e5e7eb'
    },
    background: { 
      background: '#ffffff',
      minHeight: '100vh'
    },
    cardBackground: { 
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    border: { 
      borderColor: '#e5e7eb' 
    },
    text: {
      primary: { 
        color: '#111827',
        textShadow: 'none' // No text shadow on category labels
      },
      secondary: { 
        color: '#6b7280' 
      },
      accent: { 
        color: '#3b82f6'
      }
    },
    button: {
      background: { 
        backgroundColor: '#3b82f6',
        border: '1px solid #3b82f6'
      },
      hover: { 
        backgroundColor: '#2563eb',
        transform: 'translateY(-1px)'
      },
      text: { 
        color: '#ffffff' 
      }
    }
  }
};

// Dark Theme - Neon blue tech aesthetic
const darkTheme: Theme = {
  name: 'Dark',
  styles: {
    primary: { 
      color: '#ffffff',
      textShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
    },
    secondary: { 
      backgroundColor: '#1f2937',
      border: '1px solid #374151',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)'
    },
    background: { 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #111827 100%)',
      minHeight: '100vh'
    },
    cardBackground: { 
      backgroundColor: 'rgba(31, 41, 55, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.1)'
    },
    border: { 
      borderColor: 'rgba(59, 130, 246, 0.3)' 
    },
    text: {
      primary: { 
        color: '#f9fafb' 
      },
      secondary: { 
        color: '#d1d5db' 
      },
      accent: { 
        color: '#3b82f6',
        textShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
      }
    },
    button: {
      background: { 
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)',
        backdropFilter: 'blur(10px)'
      },
      hover: { 
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        boxShadow: '0 0 25px rgba(59, 130, 246, 0.2)',
        transform: 'translateY(-2px)'
      },
      text: { 
        color: '#f9fafb' 
      }
    }
  }
};

// Halloween Theme - Orange/purple spooky
const halloweenTheme: Theme = {
  name: 'Halloween',
  styles: {
    primary: { 
      color: '#ffffff',
      textShadow: '0 0 10px rgba(249, 115, 22, 0.4)'
    },
    secondary: { 
      backgroundColor: '#1c1917',
      border: '1px solid #78350f',
      boxShadow: '0 0 20px rgba(249, 115, 22, 0.1)'
    },
    background: { 
      background: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #18181b 100%)',
      minHeight: '100vh'
    },
    cardBackground: { 
      backgroundColor: 'rgba(28, 25, 23, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(249, 115, 22, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(249, 115, 22, 0.15)'
    },
    border: { 
      borderColor: 'rgba(249, 115, 22, 0.4)' 
    },
    text: {
      primary: { 
        color: '#fafaf9' 
      },
      secondary: { 
        color: '#d4d4d8' 
      },
      accent: { 
        color: '#f97316',
        textShadow: '0 0 10px rgba(249, 115, 22, 0.6)'
      }
    },
    button: {
      background: { 
        backgroundColor: 'rgba(249, 115, 22, 0.15)',
        border: '1px solid rgba(249, 115, 22, 0.4)',
        boxShadow: '0 0 15px rgba(249, 115, 22, 0.2)',
        backdropFilter: 'blur(10px)'
      },
      hover: { 
        backgroundColor: 'rgba(249, 115, 22, 0.25)',
        boxShadow: '0 0 25px rgba(249, 115, 22, 0.3)',
        transform: 'translateY(-2px)'
      },
      text: { 
        color: '#fafaf9' 
      }
    }
  }
};

// Christmas Theme - Red/green festive
const christmasTheme: Theme = {
  name: 'Christmas',
  styles: {
    primary: { 
      color: '#ffffff',
      textShadow: '0 0 10px rgba(220, 38, 38, 0.3)'
    },
    secondary: { 
      backgroundColor: '#1e5a3a', // Slightly brighter green
      border: '1px solid #16a34a',
      boxShadow: '0 0 20px rgba(220, 38, 38, 0.1)'
    },
    background: { 
      background: 'linear-gradient(135deg, #0f1e13 0%, #14532d 50%, #1e3a20 100%)',
      minHeight: '100vh'
    },
    cardBackground: { 
      backgroundColor: 'rgba(30, 90, 58, 0.9)', // Brighter, more opaque green
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(220, 38, 38, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(220, 38, 38, 0.15)'
    },
    border: { 
      borderColor: 'rgba(220, 38, 38, 0.4)' 
    },
    text: {
      primary: { 
        color: '#fef3c7' 
      },
      secondary: { 
        color: '#fde68a' 
      },
      accent: { 
        color: '#dc2626',
        textShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
      }
    },
    button: {
      background: { 
        backgroundColor: 'rgba(220, 38, 38, 0.15)',
        border: '1px solid rgba(220, 38, 38, 0.4)',
        boxShadow: '0 0 15px rgba(220, 38, 38, 0.2)',
        backdropFilter: 'blur(10px)'
      },
      hover: { 
        backgroundColor: 'rgba(220, 38, 38, 0.25)',
        boxShadow: '0 0 25px rgba(220, 38, 38, 0.3)',
        transform: 'translateY(-2px)'
      },
      text: { 
        color: '#fef3c7' 
      }
    }
  }
};

// Hanukkah Theme - Blue/white/silver elegant
const hanukkahTheme: Theme = {
  name: 'Hanukkah',
  styles: {
    primary: { 
      color: '#ffffff',
      textShadow: '0 0 10px rgba(96, 165, 250, 0.4)'
    },
    secondary: { 
      backgroundColor: '#1e3a5f',
      border: '1px solid #2563eb',
      boxShadow: '0 0 20px rgba(96, 165, 250, 0.15)'
    },
    background: { 
      background: 'linear-gradient(135deg, #0c1e3a 0%, #1e3a5f 50%, #1e293b 100%)',
      minHeight: '100vh'
    },
    cardBackground: { 
      backgroundColor: 'rgba(30, 58, 95, 0.85)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(96, 165, 250, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(96, 165, 250, 0.15)'
    },
    border: { 
      borderColor: 'rgba(96, 165, 250, 0.4)' 
    },
    text: {
      primary: { 
        color: '#f0f9ff' 
      },
      secondary: { 
        color: '#dbeafe' 
      },
      accent: { 
        color: '#60a5fa',
        textShadow: '0 0 10px rgba(96, 165, 250, 0.6)'
      }
    },
    button: {
      background: { 
        backgroundColor: 'rgba(96, 165, 250, 0.15)',
        border: '1px solid rgba(96, 165, 250, 0.4)',
        boxShadow: '0 0 15px rgba(96, 165, 250, 0.2)',
        backdropFilter: 'blur(10px)'
      },
      hover: { 
        backgroundColor: 'rgba(96, 165, 250, 0.25)',
        boxShadow: '0 0 25px rgba(96, 165, 250, 0.3)',
        transform: 'translateY(-2px)'
      },
      text: { 
        color: '#f0f9ff' 
      }
    }
  }
};

// Spring Theme - Fresh greens and bright colors
const springTheme: Theme = {
  name: 'Spring',
  styles: {
    primary: { 
      color: '#065f46', // Dark green
      textShadow: '0 0 8px rgba(16, 185, 129, 0.2)'
    },
    secondary: { 
      backgroundColor: '#f0fdf4', // Very light green
      border: '1px solid #86efac',
      boxShadow: '0 0 15px rgba(16, 185, 129, 0.08)'
    },
    background: { 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #d1fae5 100%)', // Green gradient
      minHeight: '100vh'
    },
    cardBackground: { 
      backgroundColor: 'rgba(240, 253, 244, 0.95)', // Light fresh green
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.12)'
    },
    border: { 
      borderColor: 'rgba(16, 185, 129, 0.3)' 
    },
    text: {
      primary: { 
        color: '#065f46' // Dark green
      },
      secondary: { 
        color: '#047857' // Medium green
      },
      accent: { 
        color: '#10b981', // Bright emerald green
        textShadow: '0 0 8px rgba(16, 185, 129, 0.3)'
      }
    },
    button: {
      background: { 
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        boxShadow: '0 0 12px rgba(16, 185, 129, 0.15)',
        backdropFilter: 'blur(10px)'
      },
      hover: { 
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
        transform: 'translateY(-1px)'
      },
      text: { 
        color: '#065f46' 
      }
    }
  }
};

// Go Pack Go Theme - Green Bay Packers (green and gold)
const goPackGoTheme: Theme = {
  name: 'Go Pack Go',
  styles: {
    primary: { 
      color: '#FFB612', // Packers gold
      textShadow: '0 0 10px rgba(255, 182, 18, 0.4)'
    },
    secondary: { 
      backgroundColor: '#2a4a3d', // Slightly lighter than dark green for depth
      border: '1px solid #FFB612',
      boxShadow: '0 0 20px rgba(255, 182, 18, 0.15)'
    },
    background: { 
      background: 'linear-gradient(135deg, #15261f 0%, #203731 50%, #2a4a3d 100%)', // Dark green gradient
      minHeight: '100vh'
    },
    cardBackground: { 
      backgroundColor: 'rgba(42, 74, 61, 0.9)', // Dark green with opacity
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 182, 18, 0.3)', // Gold border
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 182, 18, 0.15)'
    },
    border: { 
      borderColor: 'rgba(255, 182, 18, 0.4)' // Gold border
    },
    text: {
      primary: { 
        color: '#FFB612' // Gold text
      },
      secondary: { 
        color: '#fef3c7' // Light cream
      },
      accent: { 
        color: '#FFB612', // Gold accent
        textShadow: '0 0 10px rgba(255, 182, 18, 0.6)'
      }
    },
    button: {
      background: { 
        backgroundColor: 'rgba(255, 182, 18, 0.15)',
        border: '1px solid rgba(255, 182, 18, 0.4)',
        boxShadow: '0 0 15px rgba(255, 182, 18, 0.2)',
        backdropFilter: 'blur(10px)'
      },
      hover: { 
        backgroundColor: 'rgba(255, 182, 18, 0.25)',
        boxShadow: '0 0 25px rgba(255, 182, 18, 0.35)',
        transform: 'translateY(-2px)'
      },
      text: { 
        color: '#203731' // Dark green text on gold buttons
      }
    }
  }
};

// Vintage Theme - 1950s cookbook aesthetic with textures and warmth
const vintageTheme: Theme = {
  name: 'Vintage',
  styles: {
    primary: { 
      color: '#3e2723',
      fontFamily: '"Courier New", Courier, monospace', // Typewriter font
      textShadow: 'none'
    },
    secondary: { 
      backgroundColor: '#f5f1e8', // Aged paper
      border: '2px solid #8d6e63',
      boxShadow: '0 4px 12px rgba(62, 39, 35, 0.15), inset 0 0 60px rgba(139, 110, 99, 0.05)' // Aged effect
    },
    background: { 
      background: 'linear-gradient(to bottom, #faf8f3 0%, #f5f1e8 100%)', // Aged paper gradient
      minHeight: '100vh',
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          rgba(139, 110, 99, 0.03) 0px,
          transparent 1px,
          transparent 2px,
          rgba(139, 110, 99, 0.03) 3px
        ),
        repeating-linear-gradient(
          90deg,
          rgba(139, 110, 99, 0.03) 0px,
          transparent 1px,
          transparent 2px,
          rgba(139, 110, 99, 0.03) 3px
        )
      ` // Paper texture
    },
    cardBackground: { 
      backgroundColor: '#fffbf0', // Cream paper
      border: '2px solid #d7ccc8',
      boxShadow: `
        0 2px 8px rgba(62, 39, 35, 0.2),
        inset 0 0 80px rgba(139, 110, 99, 0.05),
        0 0 0 1px rgba(139, 110, 99, 0.1)
      `, // Layered aged effect
      backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(139, 110, 99, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(139, 110, 99, 0.03) 0%, transparent 50%)
      ` // Subtle staining
    },
    border: { 
      borderColor: '#d7ccc8',
      borderWidth: '2px',
      borderStyle: 'solid'
    },
    text: {
      primary: { 
        color: '#3e2723',
        fontFamily: '"Courier New", Courier, monospace'
      },
      secondary: { 
        color: '#5d4037',
        fontFamily: '"Courier New", Courier, monospace'
      },
      accent: { 
        color: '#8d6e63',
        fontFamily: '"Georgia", "Times New Roman", serif',
        fontWeight: 'bold' as any
      }
    },
    button: {
      background: { 
        backgroundColor: '#8d6e63',
        border: '2px solid #6d4c41',
        boxShadow: '0 2px 4px rgba(62, 39, 35, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      },
      hover: { 
        backgroundColor: '#6d4c41',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 6px rgba(62, 39, 35, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      },
      text: { 
        color: '#fafaf8',
        fontFamily: '"Courier New", Courier, monospace',
        fontWeight: 'bold' as any,
        textTransform: 'uppercase' as any,
        letterSpacing: '0.05em'
      }
    }
  }
};

// Longhorns Theme - Texas Longhorns (burnt orange and dark gray)
const longhornsTheme: Theme = {
  name: 'Longhorns',
  styles: {
    primary: { 
      color: '#ffffff',
      textShadow: '0 0 10px rgba(191, 87, 0, 0.4)'
    },
    secondary: { 
      backgroundColor: '#3d4a52', // Slightly lighter gray for depth
      border: '1px solid #BF5700',
      boxShadow: '0 0 20px rgba(191, 87, 0, 0.15)'
    },
    background: { 
      background: 'linear-gradient(135deg, #1a2329 0%, #333F48 50%, #3d4a52 100%)', // Dark gray gradient
      minHeight: '100vh'
    },
    cardBackground: { 
      backgroundColor: 'rgba(51, 63, 72, 0.9)', // Dark gray with opacity
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(191, 87, 0, 0.3)', // Burnt orange border
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(191, 87, 0, 0.15)'
    },
    border: { 
      borderColor: 'rgba(191, 87, 0, 0.4)' // Burnt orange border
    },
    text: {
      primary: { 
        color: '#ffffff' 
      },
      secondary: { 
        color: '#d1d5db' 
      },
      accent: { 
        color: '#BF5700', // Burnt orange accent
        textShadow: '0 0 10px rgba(191, 87, 0, 0.6)'
      }
    },
    button: {
      background: { 
        backgroundColor: 'rgba(191, 87, 0, 0.15)',
        border: '1px solid rgba(191, 87, 0, 0.4)',
        boxShadow: '0 0 15px rgba(191, 87, 0, 0.2)',
        backdropFilter: 'blur(10px)'
      },
      hover: { 
        backgroundColor: 'rgba(191, 87, 0, 0.25)',
        boxShadow: '0 0 25px rgba(191, 87, 0, 0.35)',
        transform: 'translateY(-2px)'
      },
      text: { 
        color: '#ffffff' 
      }
    }
  }
};

// Hoosiers Theme - Indiana Hoosiers (crimson and cream)
const hoosiersTheme: Theme = {
  name: 'Hoosiers',
  styles: {
    primary: { 
      color: '#EEEDEB', // Cream
      textShadow: '0 0 10px rgba(153, 0, 0, 0.3)'
    },
    secondary: { 
      backgroundColor: '#b30000', // Slightly lighter crimson for depth
      border: '1px solid #990000',
      boxShadow: '0 0 20px rgba(153, 0, 0, 0.15)'
    },
    background: { 
      background: 'linear-gradient(135deg, #660000 0%, #990000 50%, #b30000 100%)', // Crimson gradient
      minHeight: '100vh'
    },
    cardBackground: { 
      backgroundColor: 'rgba(179, 0, 0, 0.85)', // Crimson with opacity
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(238, 237, 235, 0.3)', // Cream border
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(238, 237, 235, 0.1)'
    },
    border: { 
      borderColor: 'rgba(238, 237, 235, 0.4)' // Cream border
    },
    text: {
      primary: { 
        color: '#EEEDEB' // Cream
      },
      secondary: { 
        color: '#fef3c7' // Light cream
      },
      accent: { 
        color: '#EEEDEB', // Cream accent
        textShadow: '0 0 10px rgba(238, 237, 235, 0.5)'
      }
    },
    button: {
      background: { 
        backgroundColor: 'rgba(238, 237, 235, 0.15)',
        border: '1px solid rgba(238, 237, 235, 0.4)',
        boxShadow: '0 0 15px rgba(238, 237, 235, 0.2)',
        backdropFilter: 'blur(10px)'
      },
      hover: { 
        backgroundColor: 'rgba(238, 237, 235, 0.25)',
        boxShadow: '0 0 25px rgba(238, 237, 235, 0.3)',
        transform: 'translateY(-2px)'
      },
      text: { 
        color: '#EEEDEB' 
      }
    }
  }
};

// 4th of July Theme - Red, white, and blue patriotic
const fourthOfJulyTheme: Theme = {
  name: '4th of July',
  styles: {
    primary: { 
      color: '#ffffff',
      textShadow: '0 0 10px rgba(239, 68, 68, 0.3)'
    },
    secondary: { 
      backgroundColor: '#1e3a8a', // Dark blue
      border: '1px solid #3b82f6',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)'
    },
    background: { 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)', // Blue gradient
      minHeight: '100vh'
    },
    cardBackground: { 
      backgroundColor: 'rgba(30, 58, 138, 0.9)', // Dark blue with opacity
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(239, 68, 68, 0.3)', // Red border
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(239, 68, 68, 0.15)'
    },
    border: { 
      borderColor: 'rgba(239, 68, 68, 0.4)' // Red border
    },
    text: {
      primary: { 
        color: '#ffffff' 
      },
      secondary: { 
        color: '#f0f9ff' 
      },
      accent: { 
        color: '#ef4444', // Red accent
        textShadow: '0 0 10px rgba(239, 68, 68, 0.6)'
      }
    },
    button: {
      background: { 
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)',
        backdropFilter: 'blur(10px)'
      },
      hover: { 
        backgroundColor: 'rgba(239, 68, 68, 0.25)',
        boxShadow: '0 0 25px rgba(239, 68, 68, 0.35)',
        transform: 'translateY(-2px)'
      },
      text: { 
        color: '#ffffff' 
      }
    }
  }
};

// All themes
const themes: Record<string, Theme> = {
  modern: modernTheme,
  dark: darkTheme,
  halloween: halloweenTheme,
  christmas: christmasTheme,
  hanukkah: hanukkahTheme,
  spring: springTheme,
  'go-pack-go': goPackGoTheme,
  longhorns: longhornsTheme,
  hoosiers: hoosiersTheme,
  'fourth-of-july': fourthOfJulyTheme,
  vintage: vintageTheme
};

// Theme Context
interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = 'recipeApp_selectedTheme';

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Load theme from localStorage or default to 'dark'
  const [currentThemeName, setCurrentThemeName] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return stored && themes[stored] ? stored : 'dark';
    } catch {
      return 'dark';
    }
  });
  
  // Save theme to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentThemeName);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }, [currentThemeName]);

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentThemeName(themeName);
    }
  };

  const value: ThemeContextType = {
    currentTheme: themes[currentThemeName],
    setTheme,
    availableThemes: Object.keys(themes)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme Toggle Component
export const ThemeToggle: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            ...currentTheme.styles.cardBackground,
            ...currentTheme.styles.text.primary
          }}
        >
          {currentTheme.name} {isOpen ? '▲' : '▼'}
        </button>
        
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown - Opens upward from bottom */}
            <div 
              className="absolute right-0 bottom-full mb-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto"
              style={currentTheme.styles.cardBackground}
            >
              {availableThemes.map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => {
                    setTheme(themeName);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-1.5 text-left text-sm hover:opacity-80 transition-colors capitalize"
                  style={{
                    ...currentTheme.styles.text.primary,
                    backgroundColor: themes[themeName].name === currentTheme.name 
                      ? (currentTheme.styles.text.accent as any).color + '20'
                      : 'transparent'
                  }}
                >
                  {themes[themeName].name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// App State Management
type ViewType = 'home' | 'index';

interface AppState {
  currentView: ViewType;
  searchQuery: string;
  selectedCategory: string | null;
  selectedRecipe: Recipe | null;
  isModalOpen: boolean;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'home',
    searchQuery: '',
    selectedCategory: null,
    selectedRecipe: null,
    isModalOpen: false
  });

  const navigateToHome = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'home',
      searchQuery: '',
      selectedCategory: null
    }));
  };

  const navigateToIndex = (searchQuery: string = '', category: string | null = null) => {
    setAppState(prev => ({
      ...prev,
      currentView: 'index',
      searchQuery,
      selectedCategory: category
    }));
  };

  const openRecipeModal = (recipe: Recipe) => {
    setAppState(prev => ({
      ...prev,
      selectedRecipe: recipe,
      isModalOpen: true
    }));
  };

  const closeRecipeModal = () => {
    setAppState(prev => ({
      ...prev,
      selectedRecipe: null,
      isModalOpen: false
    }));
  };

  const handleSearch = (query: string) => {
    navigateToIndex(query);
  };

  const handleCategoryClick = (categoryKey: string) => {
    navigateToIndex('', categoryKey === 'all' ? null : categoryKey);
  };

  return (
    <ThemeProvider>
      <UserFavoritesProvider>
        <ThemeWrapper>
          {({ currentTheme }) => (
            <div className={`min-h-screen ${currentTheme.name === 'Vintage' ? 'vintage-theme' : ''}`}>
              <ThemeToggle />
              
              {appState.currentView === 'home' && (
                <Home
                  onSearch={handleSearch}
                  onCategoryClick={handleCategoryClick}
                  onRecipeClick={openRecipeModal}
                />
              )}

              {appState.currentView === 'index' && (
                <RecipeIndex
                  searchQuery={appState.searchQuery}
                  selectedCategory={appState.selectedCategory}
                  onRecipeClick={openRecipeModal}
                  onNavigateHome={navigateToHome}
                  onSearch={handleSearch}
                />
              )}

              {appState.isModalOpen && appState.selectedRecipe && (
                <RecipeModal
                  recipe={appState.selectedRecipe}
                  onClose={closeRecipeModal}
                />
              )}
            </div>
          )}
        </ThemeWrapper>
      </UserFavoritesProvider>
    </ThemeProvider>
  );
};

// Helper component to access theme inside the provider
const ThemeWrapper: React.FC<{ children: (props: { currentTheme: Theme }) => React.ReactNode }> = ({ children }) => {
  const { currentTheme } = useTheme();
  return <>{children({ currentTheme })}</>;
};

export default App;
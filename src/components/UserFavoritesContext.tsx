import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface UserFavoritesContextType {
  userFavorites: Set<string>; // Set of recipe IDs
  toggleUserFavorite: (recipeId: string) => void;
  isUserFavorite: (recipeId: string) => boolean;
  userFavoriteCount: number;
}

const UserFavoritesContext = createContext<UserFavoritesContextType | undefined>(undefined);

export const useUserFavorites = () => {
  const context = useContext(UserFavoritesContext);
  if (!context) {
    throw new Error('useUserFavorites must be used within a UserFavoritesProvider');
  }
  return context;
};

interface UserFavoritesProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'recipeApp_userFavorites';

export const UserFavoritesProvider: React.FC<UserFavoritesProviderProps> = ({ children }) => {
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const favoritesArray = JSON.parse(stored) as string[];
        setUserFavorites(new Set(favoritesArray));
      }
    } catch (error) {
      console.error('Failed to load user favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      const favoritesArray = Array.from(userFavorites);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Failed to save user favorites to localStorage:', error);
    }
  }, [userFavorites]);

  const toggleUserFavorite = (recipeId: string) => {
    setUserFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

  const isUserFavorite = (recipeId: string): boolean => {
    return userFavorites.has(recipeId);
  };

  const value: UserFavoritesContextType = {
    userFavorites,
    toggleUserFavorite,
    isUserFavorite,
    userFavoriteCount: userFavorites.size
  };

  return (
    <UserFavoritesContext.Provider value={value}>
      {children}
    </UserFavoritesContext.Provider>
  );
};
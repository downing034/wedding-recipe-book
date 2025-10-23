export interface Ingredient {
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

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  attribution?: string;
  type: 'entree' | 'side' | 'salad' | 'appetizer' | 'dessert' | 'breakfast' | 'snack' | 'soup' | 'beverage' | 'condiment';
  cuisine: string;
  isFavorite: boolean;
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
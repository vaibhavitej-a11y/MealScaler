export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes: string;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface RecipeResponse {
  recipeName: string;
  funnyDescription: string;
  ingredients: Ingredient[];
  macros: Macros;
  healthEffects: string[];
}

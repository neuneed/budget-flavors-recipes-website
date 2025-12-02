export type Language = 'es' | 'en';

export interface Ingredient {
  item: string;
  itemEn?: string;
  quantity: string;
}

export interface InstructionStep {
  stepNumber: number;
  description: string;
  descriptionEn?: string;
}

export interface Recipe {
  id: string; // Unique ID (can be generated from URL or title)
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  originalUrl: string;
  imageUrl?: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  costEstimate?: string; // e.g. "$1.50 per serving"
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  nutrition?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  tags: string[];
  createdAt: number; // Timestamp for sorting
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface SearchState {
  query: string;
  results: Recipe[];
  status: LoadingState;
  error?: string;
}

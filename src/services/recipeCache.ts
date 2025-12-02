import { Recipe } from '../types';

// Simple in-memory store for recipes
// In a real app, this would be a database or API call
let recipesCache: Recipe[] = [];

export const storeRecipes = (recipes: Recipe[]) => {
    recipesCache = recipes;
};

export const getRecipeById = (id: string): Recipe | undefined => {
    return recipesCache.find(r => r.id === id);
};

export const getAllRecipes = (): Recipe[] => {
    return recipesCache;
};

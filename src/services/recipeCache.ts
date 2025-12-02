import { Recipe } from '../types';
import { getRecipeById } from './recipeService';

// Simple in-memory store for recipes (used as cache layer)
const recipeCache: Map<number, Recipe> = new Map();

export const storeRecipes = (recipes: Recipe[]) => {
    recipes.forEach(recipe => {
        recipeCache.set(recipe.id, recipe);
    });
};

export const getRecipe = async (id: number, locale: string = 'en'): Promise<Recipe | undefined> => {
    // Check cache first
    if (recipeCache.has(id)) {
        return recipeCache.get(id);
    }

    // Fetch from database if not in cache
    const recipe = await getRecipeById(id, locale);
    if (recipe) {
        recipeCache.set(id, recipe);
    }

    return recipe || undefined;
};

export const getRecipeBySlug = async (slug: string, locale: string = 'en'): Promise<Recipe | undefined> => {
    // Extract ID from slug (format: "123-recipe-name")
    const id = parseInt(slug.split('-')[0], 10);
    return getRecipe(id, locale);
};

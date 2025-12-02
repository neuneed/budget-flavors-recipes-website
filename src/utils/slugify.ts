import { Recipe } from '../types';

// Generate URL-friendly slug from recipe title
export const generateRecipeSlug = (recipe: Recipe): string => {
    const titleEn = recipe.titleEn || recipe.title;

    // Convert to lowercase, replace spaces with underscores, remove special chars
    const slug = titleEn
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/-+/g, '_'); // Replace hyphens with underscores

    // Combine slug with ID: recipe_name_id
    return `${slug}_${recipe.id}`;
};

// Extract ID from slug (last part after final underscore)
export const getIdFromSlug = (slug: string): string => {
    const parts = slug.split('_');
    return parts[parts.length - 1];
};

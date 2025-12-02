import { Recipe } from '../types';

// Generate URL-friendly slug from recipe title
export function generateRecipeSlug(recipe: Recipe): string {
    // Use English title for URL (it's now the default)
    const title = recipe.title;

    // Create slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${slug}-${recipe.id}`;
}

// Extract ID from slug (format: "recipe-name-123")
export const getIdFromSlug = (slug: string): number => {
    // ID is at the end after the last hyphen
    const parts = slug.split('-');
    const id = parseInt(parts[parts.length - 1], 10);
    return isNaN(id) ? 0 : id;
};

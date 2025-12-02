'use client';

import React, { useState } from 'react';
import { useRouter } from '@/navigation';
import { useLocale } from 'next-intl';
import { searchAndTranslateRecipes, getRecipeById } from '@/services/recipeService';
import { getIdFromSlug } from '@/utils/slugify';
import RecipeDetail from '@/components/RecipeDetail';
import Layout from '@/components/Layout';
import SearchModal from '@/components/SearchModal';
import { Recipe } from '@/types';
import { storeRecipes } from '@/services/recipeCache';
import { generateRecipeSlug } from '@/utils/slugify';

interface Props {
    params: Promise<{ id: string; locale: string }>;
}

export default function RecipePage({ params }: Props) {
    const router = useRouter();
    const locale = useLocale();
    const [recipe, setRecipe] = React.useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    React.useEffect(() => {
        const loadRecipe = async () => {
            const resolvedParams = await params;
            const { id } = resolvedParams;
            const recipeId = getIdFromSlug(id);
            try {
                const loadedRecipe = await getRecipeById(recipeId, locale);
                setRecipe(loadedRecipe || null);
            } catch (error) {
                console.error('Failed to load recipe:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadRecipe();
    }, [params, locale]);

    const handleSearch = async (query: string) => {
        setIsSearchOpen(false);
        try {
            const recipes = await searchAndTranslateRecipes(query);
            storeRecipes(recipes);
            const slug = generateRecipeSlug(recipes[0]);
            router.push(`/${locale}/recipes/${slug}`);
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleBack = () => {
        router.push(`/${locale}`);
    };

    if (isLoading) {
        return (
            <Layout onSearchClick={() => setIsSearchOpen(true)}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-stone-500">Loading...</div>
                </div>
            </Layout>
        );
    }

    if (!recipe) {
        return (
            <Layout onSearchClick={() => setIsSearchOpen(true)}>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="text-stone-500 mb-4">Recipe not found</div>
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition-all"
                    >
                        Back to Recipes
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout onSearchClick={() => setIsSearchOpen(true)}>
            <RecipeDetail recipe={recipe} onBack={handleBack} />
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSearch={handleSearch}
                isLoading={false}
            />
        </Layout>
    );
}

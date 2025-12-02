'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Layout from '@/components/Layout';
import RecipeDetail from '@/components/RecipeDetail';
import { Recipe } from '@/types';
import { getRecipeById } from '@/services/recipeCache';
import { getIdFromSlug } from '@/utils/slugify';
import { Loader2 } from 'lucide-react';

export default function RecipePage() {
    const params = useParams();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('recipe');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecipe = () => {
            try {
                const slug = params.id as string;
                const recipeId = getIdFromSlug(slug);
                const foundRecipe = getRecipeById(recipeId);

                if (foundRecipe) {
                    setRecipe(foundRecipe);
                } else {
                    router.push(`/${locale}`);
                }
            } catch (error) {
                console.error('Error loading recipe:', error);
                router.push(`/${locale}`);
            } finally {
                setLoading(false);
            }
        };

        loadRecipe();
    }, [params.id, router, locale]);

    if (loading) {
        return (
            <Layout onSearchClick={() => router.push(`/${locale}`)}>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 size={48} className="animate-spin text-primary-500 mb-4" />
                    <p className="text-stone-500">{t('loadingRecipe')}</p>
                </div>
            </Layout>
        );
    }

    if (!recipe) {
        return null;
    }

    return (
        <Layout onSearchClick={() => router.push(`/${locale}`)}>
            <RecipeDetail
                recipe={recipe}
                onBack={() => router.push(`/${locale}`)}
            />
        </Layout>
    );
}

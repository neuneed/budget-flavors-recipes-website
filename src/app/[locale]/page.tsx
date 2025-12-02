'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Recipe, SearchState, LoadingState } from '@/types';
import { searchAndTranslateRecipes, getFeaturedRecipes } from '@/services/recipeService';
import { storeRecipes } from '@/services/recipeCache';
import { generateRecipeSlug } from '@/utils/slugify';

import Layout from '@/components/Layout';
import RecipeCard from '@/components/RecipeCard';
import SearchModal from '@/components/SearchModal';
import { Sparkles, ChefHat, ArrowRight } from 'lucide-react';

export default function Home() {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('home');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchState, setSearchState] = useState<SearchState>({
        query: '',
        results: [],
        status: LoadingState.IDLE
    });

    React.useEffect(() => {
        const loadFeatured = async () => {
            setSearchState(prev => ({ ...prev, status: LoadingState.LOADING }));
            try {
                const recipes = await getFeaturedRecipes();
                storeRecipes(recipes);
                setSearchState({
                    query: t('featured'),
                    results: recipes,
                    status: LoadingState.SUCCESS
                });
            } catch (error) {
                console.error(error);
                setSearchState(prev => ({ ...prev, status: LoadingState.ERROR, error: 'Failed to load initial recipes.' }));
            }
        };
        loadFeatured();
    }, [t]);

    const handleSearch = async (query: string) => {
        setIsSearchOpen(false);
        setSearchState(prev => ({ ...prev, query, status: LoadingState.LOADING }));

        try {
            const recipes = await searchAndTranslateRecipes(query);
            storeRecipes(recipes);
            setSearchState({
                query,
                results: recipes,
                status: LoadingState.SUCCESS
            });
        } catch (error) {
            setSearchState(prev => ({
                ...prev,
                status: LoadingState.ERROR,
                error: locale === 'es'
                    ? 'Ocurrió un error al buscar las recetas. Por favor, intenta de nuevo.'
                    : 'An error occurred while searching for recipes. Please try again.'
            }));
        }
    };

    const handleRecipeClick = (recipe: Recipe) => {
        const slug = generateRecipeSlug(recipe);
        router.push(`/${locale}/recipes/${slug}`);
    };

    const renderContent = () => {
        if (searchState.status === LoadingState.LOADING) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 relative">
                        <ChefHat size={40} className="text-primary-500 animate-bounce" />
                        <div className="absolute inset-0 border-4 border-primary-100 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <h3 className="text-3xl font-bold text-stone-900 mb-2">
                        {t('cooking')}
                    </h3>
                    <p className="text-stone-500">
                        {t('findingRecipes')}
                    </p>
                </div>
            );
        }

        if (searchState.status === LoadingState.ERROR) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <Sparkles size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-800 mb-2">{t('error')}</h3>
                    <p className="text-stone-500 mb-6 max-w-sm">{searchState.error}</p>
                    <button
                        onClick={() => handleSearch('recetas fáciles')}
                        className="px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition-all font-medium"
                    >
                        {t('tryAgain')}
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-16 animate-fade-in">
                {searchState.query === t('featured') && (
                    <div className="bg-[#FFF8F1] rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <div className="inline-block px-4 py-2 bg-white rounded-full text-xs font-bold uppercase tracking-widest text-primary-600 mb-6 shadow-sm">
                                    {t('badge')}
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold text-stone-900 leading-[1.1] mb-8">
                                    {t('heroTitle1')} <span className="text-primary-500">{t('heroTitle2')}</span>, <br />
                                    {t('heroTitle3')} <span className="text-stone-400 decoration-4 underline decoration-primary-300">{t('heroTitle4')}</span>.
                                </h1>
                                <p className="text-stone-600 text-lg mb-10 max-w-md leading-relaxed">
                                    {t('heroDescription')}
                                </p>
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="px-8 py-5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-200 transition-all transform hover:-translate-y-1 flex items-center gap-3"
                                >
                                    {t('ctaButton')}
                                    <ArrowRight size={20} />
                                </button>
                            </div>

                            <div className="relative h-[400px] hidden md:block">
                                <img
                                    src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80"
                                    className="absolute right-0 top-0 w-3/4 h-3/4 object-cover rounded-[2.5rem] shadow-2xl z-20 rotate-3 hover:rotate-6 transition-transform duration-500"
                                    alt="Healthy Food"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
                                    className="absolute left-0 bottom-0 w-2/3 h-2/3 object-cover rounded-[2.5rem] shadow-xl z-10 -rotate-3 hover:-rotate-6 transition-transform duration-500"
                                    alt="Salad"
                                />
                                <div className="absolute right-10 bottom-20 z-30 bg-white p-4 rounded-2xl shadow-lg animate-float">
                                    <div className="text-xs font-bold text-stone-400 uppercase">Calories</div>
                                    <div className="text-xl font-bold text-stone-900">320 kcal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-end justify-between px-2 pb-4 border-b border-stone-100">
                    <div>
                        <h2 className="text-3xl font-bold text-stone-900">
                            {searchState.query === t('featured')
                                ? t('popularThisWeek')
                                : `${t('results')}: ${searchState.query}`
                            }
                        </h2>
                    </div>
                    {searchState.query === t('featured') && (
                        <button className="text-primary-600 font-bold text-sm hover:underline">
                            {t('viewAll')}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                    {searchState.results.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onClick={handleRecipeClick}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Layout onSearchClick={() => setIsSearchOpen(true)}>
            {renderContent()}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSearch={handleSearch}
                isLoading={searchState.status === LoadingState.LOADING}
            />
        </Layout>
    );
}

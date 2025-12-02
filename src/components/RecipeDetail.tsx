'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Users, Play, PauseCircle, Check, Flame, Link2, Star, StarHalf } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Recipe } from '../types';

interface RecipeDetailProps {
    recipe: Recipe;
    onBack: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
    const t = useTranslations('recipe');
    const locale = useLocale();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const prevLocaleRef = useRef(locale);

    useEffect(() => { return () => window.speechSynthesis.cancel(); }, []);
    useEffect(() => {
        if (prevLocaleRef.current !== locale) {
            window.speechSynthesis.cancel();
            prevLocaleRef.current = locale;
            // Reset state on next tick to avoid synchronous setState in effect
            setTimeout(() => {
                setIsSpeaking(false);
                setIsPaused(false);
            }, 0);
        }
    }, [locale]);

    const toggleIngredient = (index: number) => {
        const next = new Set(checkedIngredients);
        if (next.has(index)) {
            next.delete(index);
        } else {
            next.add(index);
        }
        setCheckedIngredients(next);
    };

    const handleSpeak = () => {
        if (isSpeaking && isPaused) { window.speechSynthesis.resume(); setIsPaused(false); return; }
        if (isSpeaking && !isPaused) { window.speechSynthesis.pause(); setIsPaused(true); return; }
        window.speechSynthesis.cancel();
        setIsSpeaking(true); setIsPaused(false);

        // Recipe is already localized by the service
        const title = recipe.title;
        const description = recipe.description;
        let textToRead = `${title}. ${description}. `;

        if (locale === 'es') {
            textToRead += "Ingredientes: "; recipe.ingredients.forEach(i => textToRead += `${i.quantity} de ${i.item}. `);
            textToRead += "Instrucciones: "; recipe.instructions.forEach((step, idx) => textToRead += `Paso ${idx + 1}: ${step.description}. `);
        } else {
            textToRead += "Ingredients: "; recipe.ingredients.forEach(i => textToRead += `${i.quantity} of ${i.item}. `);
            textToRead += "Instructions: "; recipe.instructions.forEach((step, idx) => textToRead += `Step ${idx + 1}: ${step.description}. `);
        }

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = locale === 'es' ? 'es-ES' : 'en-US';
        utterance.rate = 0.95;
        utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    // Recipe is already localized by the service
    const title = recipe.title;
    const description = recipe.description;

    const titleWords = title.split(' ');
    const firstHalf = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
    const secondHalf = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

    return (
        <div className="animate-fade-in pb-20 pt-4 md:pt-8">
            <div className="bg-stone-50 rounded-[3rem] p-8 md:p-12 relative overflow-hidden mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="order-2 md:order-1 animate-slide-up">
                        <span className="text-stone-400 font-medium tracking-widest text-sm uppercase mb-4 block">
                            — {t('letsCook')}
                        </span>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.1] mb-6">
                            {firstHalf} <span className="text-primary-500">{secondHalf}</span>
                        </h1>

                        {recipe.rating && recipe.rating > 0 && (
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => {
                                        const ratingValue = i + 1;
                                        const currentRating = recipe.rating || 0;
                                        return (
                                            <span key={i}>
                                                {currentRating >= ratingValue ? (
                                                    <Star size={20} className="fill-amber-400 text-amber-400" />
                                                ) : currentRating >= ratingValue - 0.5 ? (
                                                    <StarHalf size={20} className="fill-amber-400 text-amber-400" />
                                                ) : (
                                                    <Star size={20} className="text-stone-300" />
                                                )}
                                            </span>
                                        );
                                    })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-stone-900 text-lg">{recipe.rating.toFixed(1)}</span>
                                    {!!recipe.ratingCount && (
                                        <span className="text-stone-500 text-sm font-medium">
                                            ({recipe.ratingCount} {t('reviews', { fallback: 'reviews' })})
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <p className="text-stone-600 text-lg leading-relaxed mb-8 max-w-md">
                            {description}
                        </p>

                        <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-stone-200">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-stone-400 font-bold uppercase">{t('servings')}</p>
                                    <p className="font-bold text-stone-800">{recipe.servings} {t('pp')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-stone-400 font-bold uppercase">{t('prepTime')}</p>
                                    <p className="font-bold text-stone-800">{recipe.prepTime}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Flame size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-stone-400 font-bold uppercase">{t('cookTime')}</p>
                                    <p className="font-bold text-stone-800">{recipe.cookTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 md:order-2 relative h-[400px] md:h-[500px]">
                        <div className="absolute inset-0 bg-primary-200/50 rounded-full blur-[80px] scale-75"></div>
                        <img
                            src={recipe.imageUrl}
                            alt={title}
                            className="relative w-full h-full object-cover rounded-[2rem] shadow-2xl shadow-stone-200 transform rotate-2 hover:rotate-0 transition-all duration-700"
                        />

                        <div className="absolute -bottom-6 -right-6 z-20">
                            <button
                                onClick={handleSpeak}
                                className="flex items-center gap-3 bg-stone-900 text-white p-4 pr-6 rounded-full shadow-xl hover:bg-stone-800 transition-all hover:scale-105"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                                    {isSpeaking && !isPaused ? <PauseCircle size={20} /> : <Play size={20} className="ml-1" />}
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-stone-400 font-bold uppercase">{t('listen')}</p>
                                    <p className="text-sm font-bold">{t('instructions')}</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    <div>
                        <h2 className="text-3xl font-bold text-stone-900 mb-8">{t('ingredients')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {recipe.ingredients.map((ing, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => toggleIngredient(idx)}
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors border-b border-stone-100 md:border-none"
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checkedIngredients.has(idx) ? 'bg-primary-500 border-primary-500 text-white' : 'border-stone-300'}`}>
                                        {checkedIngredients.has(idx) && <Check size={14} strokeWidth={3} />}
                                    </div>
                                    <p className={`text-lg ${checkedIngredients.has(idx) ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                                        <span className="flex-1 text-stone-700 font-medium">
                                            {ing.quantity} {ing.item}
                                        </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-stone-900">
                                {t('cookingInstructions')}
                            </h2>
                            <span className="hidden md:block h-px flex-1 bg-stone-200 mx-6"></span>
                            <span className="text-primary-500 font-bold bg-primary-50 px-3 py-1 rounded-full text-sm">
                                {recipe.instructions.length} {t('steps')}
                            </span>
                        </div>

                        <div className="space-y-6">
                            {recipe.instructions.map((step, index) => (
                                <li key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <p className="flex-1 text-stone-700 leading-relaxed pt-1">
                                        {step.description}
                                    </p>
                                </li>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#FFE4C4] rounded-[2.5rem] p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10"></div>
                        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 p-1 shadow-lg">
                            <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=200&q=80" className="w-full h-full rounded-full object-cover" alt="Chef" />
                        </div>
                        <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-1">{t('recipeBy')}</p>
                        <h3 className="text-xl font-bold text-stone-800 mb-6">Chef Maria Rodriguez</h3>
                    </div>

                    <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-lg shadow-stone-100">
                        <h3 className="text-lg font-bold text-stone-900 mb-6">{t('nutritionalInfo')}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                <span className="text-stone-500">{t('calories')}</span>
                                <span className="font-bold text-stone-800">{recipe.nutrition?.calories || '320'} kcal</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                <span className="text-stone-500">{t('protein')}</span>
                                <span className="font-bold text-stone-800">{recipe.nutrition?.protein || '25g'}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                <span className="text-stone-500">{t('fat')}</span>
                                <span className="font-bold text-stone-800">{recipe.nutrition?.fat || '15g'}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                                <span className="text-stone-500">{t('carbs')}</span>
                                <span className="font-bold text-stone-800">{recipe.nutrition?.carbs || '40g'}</span>
                            </div>
                        </div>
                    </div>

                    <a
                        href={recipe.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-6 bg-stone-900 text-white rounded-[2rem] hover:bg-stone-800 transition-colors group"
                    >
                        <div>
                            <p className="text-xs text-stone-400 uppercase font-bold mb-1">{t('source')}</p>
                            <p className="font-bold">{t('originalRecipe')}</p>
                        </div>
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <Link2 size={20} />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;

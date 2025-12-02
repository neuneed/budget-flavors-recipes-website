'use client';

import React from 'react';
import { Clock, Users } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const locale = useLocale();
  const title = locale === 'es' ? recipe.title : (recipe.titleEn || recipe.title);

  return (
    <div
      className="group cursor-pointer flex flex-col"
      onClick={() => onClick(recipe)}
    >
      {/* Image Container - Rounded and Standalone */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] mb-5 bg-stone-100">
        <img
          src={recipe.imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Cost Badge - Floating */}
        {recipe.costEstimate && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-lg px-3 py-1.5 rounded-full text-xs font-bold text-stone-800 flex items-center gap-1">
            <span className="text-primary-500">$</span>
            {recipe.costEstimate.split(' ')[0]}
          </div>
        )}
      </div>

      {/* Content - Below Image */}
      <div className="px-2">
        {/* Meta Line */}
        <div className="flex items-center gap-4 mb-3 text-xs font-bold text-stone-400 uppercase tracking-wider">
          <span className="flex items-center gap-1 text-orange-500">
            <Clock size={12} /> {recipe.cookTime}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} /> {recipe.servings} pp
          </span>
        </div>

        <h3 className="text-2xl font-bold text-stone-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors font-serif">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 mt-2">
          {recipe.tags?.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[10px] uppercase tracking-wide font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

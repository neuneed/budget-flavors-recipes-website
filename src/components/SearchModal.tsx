'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ChefHat, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch, isLoading }) => {
  const t = useTranslations('search');
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all animate-slide-up ring-1 ring-black/5">

        {/* Header / Input Section */}
        <form onSubmit={handleSubmit} className="relative p-8 md:p-10 pb-0">
          <div className="relative flex items-center">
            <Search className="absolute left-0 text-primary-500" size={32} strokeWidth={2.5} />
            <input
              ref={inputRef}
              type="text"
              className="w-full py-4 pl-14 pr-16 text-3xl md:text-4xl font-serif font-bold text-stone-900 placeholder-stone-300 focus:outline-none bg-transparent"
              placeholder={t('placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="submit"
                className="absolute right-0 bg-stone-900 text-white p-4 rounded-full hover:bg-primary-500 transition-colors shadow-lg hover:shadow-primary-200"
              >
                <ArrowRight size={20} />
              </button>
            )}
          </div>
          <div className="h-px w-full bg-stone-100 mt-8"></div>
        </form>

        {/* Results / Suggestions Area */}
        <div className="p-8 md:p-10 bg-white min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-stone-100 border-t-primary-500 rounded-full animate-spin"></div>
                <ChefHat className="absolute inset-0 m-auto text-stone-300" size={32} />
              </div>
              <p className="text-xl font-bold text-stone-800 animate-pulse font-serif">
                {t('searching')}
              </p>
              <p className="text-stone-400 mt-2">
                {t('browsingRecipes')}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6 px-1">
                {t('trendingDishes')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(t.raw('suggestions') as string[]).map((term) => (
                  <button
                    key={term}
                    onClick={() => onSearch(term)}
                    className="group flex items-center justify-between px-6 py-5 bg-stone-50 hover:bg-primary-50 rounded-2xl transition-all duration-300 text-left border border-transparent hover:border-primary-100 hover:shadow-md hover:shadow-primary-100/50"
                  >
                    <span className="font-medium text-stone-700 group-hover:text-primary-800 text-lg">
                      {term}
                    </span>
                    <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-primary-500" />
                  </button>
                ))}
              </div>

              {/* Footer Tip */}
              <div className="mt-10 pt-6 border-t border-stone-100 flex items-start gap-4 text-stone-400 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-serif italic font-bold shrink-0">i</div>
                <p>
                  Tip: Our AI searches for the best budget-friendly recipes in real-time and translates them for you.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Close Button Absolute */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-stone-50 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default SearchModal;

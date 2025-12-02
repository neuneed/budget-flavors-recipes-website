'use client';

import React from 'react';
import { ChefHat, Search, Globe } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/navigation';

interface LayoutProps {
  children: React.ReactNode;
  onSearchClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearchClick }) => {
  const t = useTranslations('common');
  const tLayout = useTranslations('layout');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLang = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="min-h-screen flex flex-col text-stone-800 bg-white font-sans">
      {/* Navbar - Clean White */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 transition-transform group-hover:rotate-12">
              <ChefHat size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-stone-900 leading-none tracking-tight">
                {t('siteNameAlt')} <span className="text-primary-500">{t('siteNameHighlight')}</span>
              </h1>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Desktop */}
            <button
              onClick={onSearchClick}
              className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full text-stone-400 transition-all text-sm group w-64 justify-between"
            >
              <div className="flex items-center gap-2">
                <Search size={16} className="text-stone-400 group-hover:text-primary-500" />
                <span className="font-medium text-stone-500 group-hover:text-stone-700">
                  {t('search')}
                </span>
              </div>
              <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded border border-stone-200">⌘K</span>
            </button>

            {/* Search Icon - Mobile */}
            <button
              onClick={onSearchClick}
              className="md:hidden p-3 bg-stone-50 rounded-full text-stone-600"
            >
              <Search size={20} />
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-all text-sm font-bold shadow-lg shadow-stone-200"
            >
              <Globe size={14} />
              <span>{t('language')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
        {children}
      </main>

      {/* Footer - Minimal */}
      <footer className="bg-white border-t border-stone-100 py-12 mt-20">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-2 text-stone-300">
            <ChefHat size={24} />
            <span className="font-serif italic">{tLayout('footerTagline')}</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-stone-400 mb-6">
            <Link href="/privacy" className="hover:text-stone-900 transition-colors">{tLayout('privacy')}</Link>
            <Link href="/contact" className="hover:text-stone-900 transition-colors">{tLayout('contact')}</Link>
            <Link href="/about" className="hover:text-stone-900 transition-colors">{tLayout('about')}</Link>
          </div>
          <p className="text-stone-300 text-xs">
            {tLayout('copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

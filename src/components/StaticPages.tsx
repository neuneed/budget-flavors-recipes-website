'use client';

import React from 'react';
import { ChefHat, Mail, MapPin, Shield, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const AboutPage: React.FC = () => {
    const t = useTranslations('about');

    return (
        <div className="animate-fade-in max-w-5xl mx-auto pb-20">
            <div className="bg-[#FFF8F1] rounded-[3rem] p-12 md:p-16 text-center mb-16 relative overflow-hidden">
                <div className="relative z-10">
                    <span className="text-primary-600 font-bold tracking-widest uppercase text-xs mb-4 block">
                        {t('ourStory')}
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-stone-900 mb-6 font-serif">
                        {t('title1')}{' '}
                        <span className="text-primary-500">{t('title2')}</span>
                    </h1>
                    <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('description')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 space-y-8">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-primary-500 shrink-0">
                            <ChefHat size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">
                                {t('budgetFriendly')}
                            </h3>
                            <p className="text-stone-500">
                                {t('budgetFriendlyDesc')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-primary-500 shrink-0">
                            <Heart size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">
                                {t('noBarriers')}
                            </h3>
                            <p className="text-stone-500">
                                {t('noBarriersDesc')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <img
                        src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=800&q=80"
                        alt="Team cooking"
                        className="rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500"
                    />
                </div>
            </div>
        </div>
    );
};

export const ContactPage: React.FC = () => {
    const t = useTranslations('contact');

    return (
        <div className="animate-fade-in max-w-4xl mx-auto pb-20">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-stone-900 mb-6 font-serif">
                    {t('title')}
                </h1>
                <p className="text-stone-500 text-lg">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-stone-900 text-white p-10 rounded-[2.5rem] flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-6 font-serif">
                            {t('information')}
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-stone-300">
                                <Mail size={20} />
                                <span>hello@saboreseconomicos.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-stone-300">
                                <MapPin size={20} />
                                <span>Mexico City, MX</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12">
                        <p className="text-stone-400 text-sm">
                            {t('replyTime')}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-100">
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">
                                {t('name')}
                            </label>
                            <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-primary-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">{t('email')}</label>
                            <input type="email" className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-primary-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">
                                {t('message')}
                            </label>
                            <textarea rows={4} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:border-primary-500 transition-colors"></textarea>
                        </div>
                        <button type="button" className="w-full py-4 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center gap-2">
                            {t('sendMessage')}
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const PrivacyPage: React.FC = () => {
    const t = useTranslations('privacy');

    return (
        <div className="animate-fade-in max-w-3xl mx-auto pb-20">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 rounded-full text-sm font-bold mb-6">
                    <Shield size={16} />
                    {t('legal')}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 font-serif">
                    {t('title')}
                </h1>
                <p className="text-stone-500 text-lg">
                    {t('lastUpdated')}
                </p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-50 prose prose-stone prose-lg">
                <h3 className="text-xl font-bold text-stone-900 mb-4">1. Data Collection</h3>
                <p className="text-stone-600 mb-8 leading-relaxed">
                    {t('dataCollection')}
                </p>

                <h3 className="text-xl font-bold text-stone-900 mb-4">2. Cookies</h3>
                <p className="text-stone-600 mb-8 leading-relaxed">
                    {t('cookies')}
                </p>

                <h3 className="text-xl font-bold text-stone-900 mb-4">3. Third Party Services</h3>
                <p className="text-stone-600 mb-8 leading-relaxed">
                    {t('thirdPartyServices')}
                </p>

                <div className="bg-stone-50 p-6 rounded-2xl flex items-start gap-4">
                    <CheckCircle className="text-primary-500 mt-1" />
                    <p className="text-sm text-stone-500 font-medium m-0">
                        {t('agreement')}
                    </p>
                </div>
            </div>
        </div>
    );
};

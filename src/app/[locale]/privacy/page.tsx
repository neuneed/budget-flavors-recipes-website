'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { PrivacyPage as PrivacyContent } from '@/components/StaticPages';

export default function Privacy() {
    return (
        <Layout onSearchClick={() => window.location.href = '/'}>
            <PrivacyContent />
        </Layout>
    );
}

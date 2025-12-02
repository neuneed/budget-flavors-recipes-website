'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { AboutPage as AboutContent } from '@/components/StaticPages';

export default function About() {
    return (
        <Layout onSearchClick={() => window.location.href = '/'}>
            <AboutContent />
        </Layout>
    );
}

'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { ContactPage as ContactContent } from '@/components/StaticPages';

export default function Contact() {
    return (
        <Layout onSearchClick={() => window.location.href = '/'}>
            <ContactContent />
        </Layout>
    );
}

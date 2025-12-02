import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    style: ["normal", "italic"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: locale === 'es' ? "Sabores Económicos" : "Budget Flavors",
        description: locale === 'es'
            ? "Descubre recetas deliciosas y económicas para toda la familia"
            : "Discover delicious and budget-friendly recipes for the whole family",
    };
}

export default async function LocaleLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body
                className={`${poppins.variable} ${playfair.variable} antialiased font-sans`}
            >
                <NextIntlClientProvider messages={messages} locale={locale}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

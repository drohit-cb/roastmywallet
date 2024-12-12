import React from 'react';
import { Metadata } from 'next';
import { Database } from '../../../lib/db';
import { baseSepolia } from 'viem/chains';
import { RoastCard } from '../../components/RoastCard';

type PageParams = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const db = new Database();
    const { id } = await params;
    const roast = await db.getRoast(baseSepolia.name, id);

    if (!roast) return {};

    return {
        title: 'RoastMyWallet 🔥',
        description: roast.roast_text,
        openGraph: {
            title: 'RoastMyWallet 🔥',
            description: roast.roast_text,
            type: 'article',
            url: `https://roastwallet.xyz/roast/${id}`,
            images: [{
                url: '/api/og',
                width: 1200,
                height: 630,
                alt: 'RoastMyWallet',
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'RoastMyWallet 🔥',
            description: roast.roast_text,
            images: ['/api/og'],
            creator: '@roastwallet',
        },
    };
}

export default async function RoastPage({ params }: { params: Promise<{ id: string }> }) {
    const db = new Database();
    const { id } = await params;
    const roast = await db.getRoast(baseSepolia.name, id);

    if (!roast) return <div>Roast not found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <RoastCard roast={roast} />
                </div>
            </main>
        </div>
    );
} 
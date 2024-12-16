'use client';

import { Navigation } from '@/app/components/Navigation';
import { MyRoasts } from '@/app/components/MyRoasts';

export default function MyRoastsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            <main className="container mx-auto px-4 py-16">
                <Navigation />
                <h1 className="text-4xl font-bold text-center mb-12">
                    My Roasts 🎯
                </h1>
                <MyRoasts />
            </main>
        </div>
    );
} 
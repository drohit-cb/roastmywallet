'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import type { Roast } from '@/lib/db';
import { RoastCard } from './RoastCard';

interface RoastWithRank extends Roast {
    rank: number;
    total_count: number;
}

export function MyRoasts() {
    const { address } = useAccount();
    const [myRoasts, setMyRoasts] = useState<RoastWithRank[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!address) {
            setIsLoading(false);
            return;
        }

        fetch(`/api/roasts/by-wallet/${address}`)
            .then(res => res.json())
            .then(data => setMyRoasts(data.roasts))
            .catch(error => {
                console.error('Failed to fetch roasts:', error);
                setMyRoasts([]);
            })
            .finally(() => setIsLoading(false));
    }, [address]);

    if (!address) {
        return (
            <div className="text-center p-12 rounded-lg bg-gray-800/50 border border-gray-700 max-w-2xl mx-auto">
                <p className="text-gray-400">
                    Connect your wallet to see your roasts
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-2xl mx-auto">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-full" />
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-4" />
                                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!myRoasts || !myRoasts.length) {
        return (
            <div className="text-center p-12 rounded-lg bg-gray-800/50 border border-gray-700 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-2">No Roasts Yet 🔥</h3>
                <p className="text-gray-400">
                    Generate your first roast to see it here!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {myRoasts.map((roast) => (
                <div key={roast.token_id} className="relative">
                    <div className="absolute -top-3 -right-3 px-3 py-1 bg-pink-500 rounded-full text-sm font-bold z-10">
                        Rank #{roast.rank} of {roast.total_count}
                    </div>
                    <RoastCard roast={roast} />
                </div>
            ))}
        </div>
    );
} 
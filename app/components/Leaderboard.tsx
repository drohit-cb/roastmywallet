'use client';

import { useEffect, useState } from 'react';
import { formatAddress } from '../../lib/utils';
import { Avatar } from '@coinbase/onchainkit/identity';
import { useLikeRoast } from '../../contracts/hooks/useLikeRoast';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { trackEvent, events } from '@/lib/analytics';
import type { Roast } from '@/lib/db';
import { baseSepolia } from 'viem/chains';

export function Leaderboard() {
    const { address, } = useAccount();
    const [topRoasts, setTopRoasts] = useState<Roast[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/roasts/top')
            .then(res => res.json())
            .then(data => setTopRoasts(data))
            .finally(() => setIsLoading(false));
    }, []);

    const { likeRoast } = useLikeRoast(() => {
        // Refetch leaderboard when like transaction succeeds
        fetch('/api/roasts/top')
            .then(res => res.json())
            .then(data => setTopRoasts(data));
    });

    const handleLike = async (tokenId: string) => {
        try {
            // First like on chain
            const hash = await likeRoast(BigInt(tokenId));
            if (!hash) throw new Error('Failed to like');

            // Optimistically update DB
            await fetch('/api/roasts/db', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'like',
                    data: {
                        tokenId,
                        network: baseSepolia.name,
                        liker: address
                    }
                })
            });

            // Refetch leaderboard
            const res = await fetch('/api/roasts/top');
            const data = await res.json();
            setTopRoasts(data);

            trackEvent(events.ROAST_LIKED, { tokenId });
        } catch (error) {
            toast.error('Failed to like roast');
            trackEvent(events.ERROR_OCCURRED, {
                error: error instanceof Error ? error.message : 'Unknown error',
                action: 'like_roast'
            });
        }
    };

    if (isLoading) return (
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
            ))}
        </div>
    );

    if (!topRoasts?.length) return (
        <div className="text-center p-12 rounded-lg bg-gray-800/50 border border-gray-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">No Roasts Yet 🔥</h3>
            <p className="text-gray-400">
                Be the first to mint a roast and start the fire!
            </p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {topRoasts.map((roast, index) => (
                <div
                    key={roast.token_id.toString()}
                    className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700/50"
                >
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-12 h-12">
                            <Avatar address={roast.wallet_address as `0x${string}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-400">
                                    Roasting: {formatAddress(roast.wallet_address)}
                                </span>
                                {index === 0 && (
                                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                                        🔥 Hottest Roast
                                    </span>
                                )}
                            </div>
                            <p className="text-lg font-medium">{roast.roast_text}</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                        <span className="text-gray-500">
                            {new Date(roast.block_timestamp).toLocaleDateString()}
                        </span>
                        <button
                            onClick={() => handleLike(roast.token_id.toString())}
                            className="flex items-center gap-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 px-3 py-1 rounded-full transition-colors"
                        >
                            <span>❤️</span>
                            <span>{roast.likes_count.toString()}</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
} 
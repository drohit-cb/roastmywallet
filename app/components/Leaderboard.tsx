'use client';

import { useTopRoasts } from '../../contracts/hooks/useTopRoasts';
import { formatAddress } from '../../lib/utils';
import { Avatar } from '@coinbase/onchainkit/identity';
import { useLikeRoast } from '../../contracts/hooks/useLikeRoast';
import { toast } from 'react-hot-toast';

export function Leaderboard() {
    const { topRoasts, isLoading, error, refetch } = useTopRoasts(10);

    const { likeRoast } = useLikeRoast(() => {
        // Refetch leaderboard when like transaction succeeds
        refetch();
        toast.success('Roast liked!');
    });

    const handleLike = async (tokenId: bigint) => {
        try {
            await likeRoast(tokenId);
            toast.success('Liking roast...');
        } catch (error) {
            console.error('Failed to like:', error);
            toast.error('Failed to like roast');
        }
    };

    if (isLoading) return (
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
            ))}
        </div>
    );

    if (error) return <div>Failed to load roasts</div>;
    if (!topRoasts?.length) return <div>No roasts yet</div>;

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {topRoasts.map((roast, index) => (
                <div
                    key={roast.tokenId.toString()}
                    className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700/50"
                >
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-12 h-12">
                            <Avatar address={roast.wallet as `0x${string}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-400">
                                    Roasting: {formatAddress(roast.wallet)}
                                </span>
                                {index === 0 && (
                                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                                        🔥 Hottest Roast
                                    </span>
                                )}
                            </div>
                            <p className="text-lg font-medium">{roast.roastText}</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                        <span className="text-gray-500">
                            {new Date(Number(roast.timestamp) * 1000).toLocaleDateString()}
                        </span>
                        <button
                            onClick={() => handleLike(roast.tokenId)}
                            className="flex items-center gap-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 px-3 py-1 rounded-full transition-colors"
                        >
                            <span>❤️</span>
                            <span>{roast.likes.toString()}</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
} 
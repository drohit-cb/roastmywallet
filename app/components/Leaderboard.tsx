'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const [target] = entries;
        if (target.isIntersecting && !isLoadingMore && hasMore) {
            loadRoasts(page + 1);
        }
    }, [isLoadingMore, hasMore, page]);

    useEffect(() => {
        const element = observerTarget.current;
        if (!element) return;

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.5,
        });

        observer.observe(element);
        return () => observer.unobserve(element);
    }, [handleObserver]);

    useEffect(() => {
        loadRoasts(1);
    }, []);

    const loadRoasts = async (pageNum: number) => {
        setIsLoadingMore(true);
        try {
            const res = await fetch(`/api/roasts/top?page=${pageNum}`);
            const data = await res.json();
            if (pageNum === 1) {
                setTopRoasts(data.roasts);
            } else {
                setTopRoasts(prev => [...prev, ...data.roasts]);
            }
            setHasMore(data.hasMore);
            setPage(pageNum);
        } finally {
            setIsLoadingMore(false);
        }
    };

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

    const shareToX = (roast: Roast) => {
        const shareUrl = `${window.location.origin}/roast/${roast.token_id}`;
        const text = `Check out this roast on RoastMyWallet! 🔥`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

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
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => shareToX(roast)}
                                className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleLike(roast.token_id.toString())}
                                className="flex items-center gap-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 px-3 py-1 rounded-full transition-colors"
                            >
                                <span>❤️</span>
                                <span>{roast.likes_count.toString()}</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {hasMore && (
                <div ref={observerTarget} className="h-10">
                    {isLoadingMore && (
                        <div className="animate-pulse space-y-4">
                            <div className="h-24 bg-gray-800 rounded-lg"></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 
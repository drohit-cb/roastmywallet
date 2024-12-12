'use client';

import React from 'react';
import { Avatar } from '@coinbase/onchainkit/identity';
import { formatAddress } from '../../lib/utils';
import type { Roast } from '@/lib/db';

export function RoastCard({ roast }: { roast: Roast }) {
    return (
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700/50">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12">
                    <Avatar address={roast.wallet_address as `0x${string}`} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-400">
                            Roasting: {formatAddress(roast.wallet_address)}
                        </span>
                    </div>
                    <p className="text-lg font-medium">{roast.roast_text}</p>
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                <span className="text-gray-500">
                    {new Date(roast.block_timestamp).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                    <span>❤️</span>
                    <span>{roast.likes_count}</span>
                </div>
            </div>
        </div>
    );
} 
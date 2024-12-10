'use client';
import React from 'react';
import { useState } from 'react';
import { useRoastNFT } from '../../contracts/hooks/useRoastNFT';

interface MintButtonProps {
    roastText: string;
    onSuccess?: () => void;
}

export function MintButton({ roastText, onSuccess }: MintButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { mintRoast } = useRoastNFT();

    async function handleMint() {
        if (!roastText) return;

        setIsLoading(true);
        try {
            console.log('Starting mint...');
            const hash = await mintRoast(roastText);
            console.log('Mint result:', hash);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to mint roast:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            onClick={handleMint}
            disabled={isLoading || !roastText}
            className="px-12 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 text-lg"
        >
            {isLoading ? 'Minting...' : 'Mint as NFT'}
        </button>
    );
} 
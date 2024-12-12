'use client';
import React from 'react';
import { useState } from 'react';
import { useRoastNFT } from '../../contracts/hooks/useRoastNFT';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { trackEvent, events } from '@/lib/analytics';
import { createPublicClient, http, decodeEventLog } from 'viem';
import { baseSepolia } from 'viem/chains';
import { RoastMintedEvent } from '@/contracts/lib/RoastNFT';

interface MintButtonProps {
    roastText: string;
    onSuccess?: () => void;
}

// Create client
const client = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)
});

export function MintButton({ roastText, onSuccess }: MintButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { address, } = useAccount();
    const { mintRoast } = useRoastNFT();

    async function handleMint() {
        if (!roastText) return;

        setIsLoading(true);
        try {
            // First mint on chain
            // TODO(rohit): maybe have mintRoast contract call return the tokenId
            const hash = await mintRoast(roastText);
            if (!hash) throw new Error('Failed to mint');

            const receipt = await client.waitForTransactionReceipt({ hash });

            // Get tokenId from event
            const log = receipt.logs[2];
            const event = decodeEventLog({
                abi: [RoastMintedEvent],
                data: log.data,
                topics: log.topics
            }) as unknown as { args: { tokenId: bigint; wallet: string; roastText: string; } };

            const tokenId = event.args.tokenId.toString()

            // Optimistically update DB
            await fetch('/api/roasts/db', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'mint',
                    data: {
                        tokenId,
                        network: baseSepolia.name,
                        wallet: address,
                        text: roastText
                    }
                })
            });

            toast.success('Roast minted successfully! 🎉');
            trackEvent(events.ROAST_MINTED, {
                roastText,
                timestamp: new Date().toISOString()
            });
            onSuccess?.();
        } catch (error) {
            toast.error('Failed to mint roast');
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
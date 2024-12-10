import { useWriteContract } from 'wagmi';
import { ROAST_NFT_ADDRESS, ROAST_NFT_ABI } from '../lib/RoastNFT';
import { useState } from 'react';

export function useRoastNFT() {
    const { writeContractAsync } = useWriteContract();
    const [isLoading, setIsLoading] = useState(false);

    const mintRoast = async (text: string): Promise<`0x${string}` | undefined> => {
        setIsLoading(true);
        try {
            if (!writeContractAsync) throw new Error('Contract write not ready');

            console.log('address', ROAST_NFT_ADDRESS);
            console.log('abi', ROAST_NFT_ABI);
            console.log('functionName', 'mintRoast');
            console.log('args', [text]);

            const hash = await writeContractAsync({
                address: ROAST_NFT_ADDRESS as `0x${string}`,
                abi: ROAST_NFT_ABI,
                functionName: 'mintRoast',
                args: [text]
            });

            console.log('Transaction sent:', hash);
            return hash;
        } catch (error) {
            console.error('Mint error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        mintRoast,
        isLoading
    } as const;
}
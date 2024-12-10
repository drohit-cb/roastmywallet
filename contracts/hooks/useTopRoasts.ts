import { useReadContract } from 'wagmi';
import { ROAST_NFT_ADDRESS, ROAST_NFT_ABI, RoastEntry } from '../lib/RoastNFT';

export function useTopRoasts(limit: number = 10) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: ROAST_NFT_ADDRESS as `0x${string}`,
        abi: ROAST_NFT_ABI,
        functionName: 'getTopRoasts',
        args: [BigInt(limit)]
    });

    return {
        topRoasts: data as RoastEntry[],
        isLoading,
        error,
        refetch
    };
}
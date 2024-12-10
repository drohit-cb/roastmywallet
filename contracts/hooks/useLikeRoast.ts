import { useWriteContract, useTransaction } from 'wagmi';
import { ROAST_NFT_ADDRESS, ROAST_NFT_ABI } from '../lib/RoastNFT';
import { useState } from 'react';

export function useLikeRoast(onSuccess?: () => void) {
    const { writeContractAsync } = useWriteContract();
    const [hash, setHash] = useState<`0x${string}`>();

    const { isSuccess } = useTransaction({
        hash,
        query: {
            enabled: !!hash
        }
    });

    // Call onSuccess when transaction succeeds
    if (isSuccess) {
        onSuccess?.();
        setHash(undefined);
    }

    const likeRoast = async (tokenId: bigint) => {
        if (!writeContractAsync) throw new Error('Contract write not ready');

        const txHash = await writeContractAsync({
            address: ROAST_NFT_ADDRESS as `0x${string}`,
            abi: ROAST_NFT_ABI,
            functionName: 'likeRoast',
            args: [tokenId]
        });

        setHash(txHash);
        return txHash;
    };

    return { likeRoast };
} 
import { ethers } from 'ethers';
import { ROAST_NFT_ABI, ROAST_NFT_ADDRESS, RoastNFTContract } from './RoastNFT';

export function getRoastContract(signer?: ethers.Signer): RoastNFTContract {
    const provider = new ethers.JsonRpcProvider();
    const contract = new ethers.Contract(ROAST_NFT_ADDRESS, ROAST_NFT_ABI, provider);
    return (signer ? contract.connect(signer) : contract) as unknown as RoastNFTContract;
} 
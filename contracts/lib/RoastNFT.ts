import { BaseContract, ContractTransactionResponse, BigNumberish } from 'ethers';

export const ROAST_NFT_ADDRESS = '0xa8a4443Cbc6F91f01B53439C6bfEdDa25eEfa096'; // After deployment

export const ROAST_NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "roastText",
        "type": "string"
      }
    ],
    "name": "mintRoast",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "getTopRoasts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "wallet",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "likes",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "roastText",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct RoastNFT.RoastEntry[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "likeRoast",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export type RoastEntry = {
  tokenId: bigint;
  wallet: string;
  likes: bigint;
  roastText: string;
  timestamp: bigint;
};

export interface RoastNFTContract extends BaseContract {
  mintRoast(roastText: string): Promise<ContractTransactionResponse>;
  likeRoast(tokenId: BigNumberish): Promise<ContractTransactionResponse>;
  getTopRoasts(limit: BigNumberish): Promise<RoastEntry[]>;
  getRoast(tokenId: BigNumberish): Promise<RoastEntry>;
  hasLiked(tokenId: BigNumberish, address: string): Promise<boolean>;
}
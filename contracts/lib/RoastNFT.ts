import { BaseContract, ContractTransactionResponse, BigNumberish } from 'ethers';
import { AbiEvent, parseAbiItem } from 'viem';

// v1 - 0xa8a4443Cbc6F91f01B53439C6bfEdDa25eEfa096
// v2 - 0x9B65d484BB1081Fc597EA6CB256eba9748d1FE0b
export const ROAST_NFT_ADDRESS = '0x9B65d484BB1081Fc597EA6CB256eba9748d1FE0b';

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
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "likeRoast",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "liker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalLikes",
        "type": "uint256"
      }
    ],
    "name": "RoastLiked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "roastText",
        "type": "string"
      }
    ],
    "name": "RoastMinted",
    "type": "event"
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
  getRoast(tokenId: BigNumberish): Promise<RoastEntry>;
  totalRoasts(): Promise<bigint>;
  hasLiked(tokenId: BigNumberish, address: string): Promise<boolean>;
}

export const RoastMintedEvent = parseAbiItem('event RoastMinted(uint256 tokenId, address wallet, string roastText)') as AbiEvent;
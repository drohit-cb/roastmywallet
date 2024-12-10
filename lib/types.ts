export interface RoastNFT {
  id: number;
  roastText: string;
  walletAddress: string;  // The wallet that was roasted (verified by SIWE)
  timestamp: number;
  likes: number;
  metadata: {
    ensName?: string;
    avatarUrl?: string;
  }
}

export interface LeaderboardEntry extends RoastNFT {
  rank: number;
  hasLiked: boolean;
} 
import { RoastNFT, LeaderboardEntry } from './types';

// Mock contract storage
let roasts = new Map<number, RoastNFT>();
let hasLiked = new Map<number, Set<string>>();
let totalRoasts = 0;

// Initial mock data
const INITIAL_ROASTS = [
  {
    roastText: "This wallet's got more failed transactions than I've got excuses for being late 😅",
    wallet: "0x1234...5678",
    likes: 42
  },
  {
    roastText: "Found more dust in this wallet than under my couch 🧹",
    wallet: "0xabcd...efgh",
    likes: 28
  },
  {
    roastText: "Holding onto those SHIB tokens like they're gonna make a comeback 🐕",
    wallet: "0x9876...5432",
    likes: 15
  },
  {
    roastText: "Paper hands so weak they make tissue paper look strong 🧻",
    wallet: "0xijkl...mnop",
    likes: 7
  }
];

export async function mockMintRoast(
  roastText: string,
  wallet: string,  // msg.sender in contract
): Promise<RoastNFT> {
  const tokenId = totalRoasts + 1;

  const roast: RoastNFT = {
    id: tokenId,
    walletAddress: wallet,
    likes: 0,
    roastText,
    timestamp: Date.now(),
    metadata: {
      ensName: Math.random() > 0.5 ? `user${Math.floor(Math.random() * 1000)}.eth` : undefined,
      avatarUrl: Math.random() > 0.5 ? `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000)}` : undefined
    }
  };

  roasts.set(tokenId, roast);
  hasLiked.set(tokenId, new Set());
  totalRoasts = tokenId;

  return roast;
}

export async function mockLikeRoast(tokenId: number, liker: string): Promise<void> {
  const roast = roasts.get(tokenId);
  if (!roast) throw new Error("Roast doesn't exist");

  const likers = hasLiked.get(tokenId);
  if (!likers) throw new Error("Likes not initialized");

  if (liker === roast.walletAddress) throw new Error("Can't like own roast");
  if (likers.has(liker)) throw new Error("Already liked");

  likers.add(liker);
  roast.likes++;
}

export async function mockGetTopRoasts(limit: number = 10): Promise<LeaderboardEntry[]> {
  return Array.from(roasts.values())
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit)
    .map((roast, index) => ({
      ...roast,
      rank: index + 1,
      hasLiked: false // Will be set based on user address
    }));
}
// Initialize mock data
INITIAL_ROASTS.forEach((roast, index) => {
  mockMintRoast(roast.roastText, roast.wallet).then(entry => {
    // Add some initial likes
    for (let i = 0; i < roast.likes; i++) {
      mockLikeRoast(entry.id, `0xliker${i}`);
    }
  });
}); 

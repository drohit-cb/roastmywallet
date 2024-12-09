export interface WalletStats {
  eth: {
    balance: string;
    nftCount: number;
    lastTxTimestamp: number;
    topTokens: Array<{
      symbol: string;
      balance: string;
    }>;
    isEOA: boolean;
    transactionCount: number;
    dustTokenCount: number;    // Number of tokens worth < $1
    failedTxCount: number;
    oldestTxTimestamp: number;
  };
  base: {
    balance: string;
    nftCount: number;
    lastTxTimestamp: number;
    topTokens: Array<{
      symbol: string;
      balance: string;
    }>;
    transactionCount: number;
  };
}

// Just returns raw stats without any interpretation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMockWalletStats(address: string): Promise<WalletStats> {
  return Promise.resolve({
    eth: {
      balance: (Math.random() * 10).toFixed(4),
      nftCount: Math.floor(Math.random() * 100),
      lastTxTimestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
      topTokens: [
        { symbol: 'USDC', balance: (Math.random() * 1000).toFixed(2) },
        { symbol: 'PEPE', balance: (Math.random() * 1000000).toFixed(2) },
        { symbol: 'SHIB', balance: (Math.random() * 1000000).toFixed(2) },
      ],
      isEOA: true,
      transactionCount: Math.floor(Math.random() * 500),
      dustTokenCount: Math.floor(Math.random() * 20),
      failedTxCount: Math.floor(Math.random() * 50),
      oldestTxTimestamp: Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
    },
    base: {
      balance: (Math.random() * 2).toFixed(4),
      nftCount: Math.floor(Math.random() * 10),
      lastTxTimestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      topTokens: [
        { symbol: 'USDbC', balance: (Math.random() * 100).toFixed(2) },
        { symbol: 'cbETH', balance: (Math.random() * 1).toFixed(4) },
      ],
      transactionCount: Math.floor(Math.random() * 50),
    }
  });
}
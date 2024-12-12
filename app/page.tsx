'use client';

import { Login } from './components/Login';
import { RoastDisplay } from './components/RoastDisplay';
import { WalletConnect } from './components/WalletConnect';
import { useAccount, useChainId } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { base, baseSepolia } from 'viem/chains';

export default function Home() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);
  const [roastText, setRoastText] = useState<string>();
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleDisconnect = useCallback(async () => {
    // Reset all states
    setIsSignedIn(false);
    setRoastText(undefined);
    setIsLoading(false);
    // Call logout API
    await fetch('/api/auth/logout', { method: 'POST' });
  }, []);

  // Check SIWE session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const { isValid } = await res.json();
        setIsSignedIn(isValid);
      } catch (error) {
        console.error('Failed to check session:', error);
        setIsSignedIn(false);
      }
    };

    if (isConnected) {
      checkSession();
    }
  }, [isConnected]);

  const generateRoast = async () => {
    setIsLoading(true);
    try {
      // Call generate api to generate roast for given address
      const response = await fetch('/api/roasts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          network: chainId === 84532 ? baseSepolia.network : 'base-mainnet'
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setRoastText(data.roast);
    } catch (error) {
      console.error('Failed to generate roast:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = isConnected && isSignedIn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <nav className="p-4">
        {isAuthenticated && <WalletConnect onDisconnect={handleDisconnect} />}
      </nav>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-6xl font-bold text-center mb-8">
          Roast My <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Wallet</span>
        </h1>

        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-8 backdrop-blur-sm">
          {!isAuthenticated ? (
            <Login onLoginComplete={() => setIsSignedIn(true)} />
          ) : (
            <>
              <p className="text-xl text-center text-gray-400 mb-8">
                Ready to get roasted based on your on-chain activity!
              </p>
              <RoastDisplay
                isConnected={true}
                isLoading={isLoading}
                roastText={roastText}
                onGenerate={generateRoast}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

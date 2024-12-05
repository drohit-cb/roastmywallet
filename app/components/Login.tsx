'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { createSiweMessage } from 'viem/siwe';
import { base } from 'wagmi/chains';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';

interface LoginProps {
  onLoginComplete: () => void;
}

export function Login({ onLoginComplete }: LoginProps) {
  const { isConnected, address } = useAccount();
  const { signMessage } = useSignMessage();
  const { disconnect } = useDisconnect();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Watch for wallet connection and trigger SIWE
  useEffect(() => {
    if (isConnected && address && !isSigningIn) {
      handleSIWE();
    }
  }, [isConnected, address]);

  const handleSIWE = async () => {
    if (!isConnected || !address) return;
    
    setIsSigningIn(true);
    try {
      const message = createSiweMessage({
        domain: window.location.host,
        address: address as `0x${string}`,
        chainId: base.id,
        uri: window.location.origin,
        version: '1',
        nonce: Date.now().toString(),
        statement: 'Sign in to RoastMyWallet. By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.',
      });

      await signMessage({ message });
      console.log('SIWE successful, calling onLoginComplete');
      onLoginComplete();
      console.log('onLoginComplete called');
    } catch (error) {
      console.error('Failed to sign message:', error);
      disconnect();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome to RoastMyWallet</h2>
        <p className="text-gray-400">Connect your wallet to start getting roasted</p>
      </div>

      {hasError ? (
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg font-bold text-xl hover:opacity-90 text-white"
        >
          Reload to Connect Wallet
        </button>
      ) : (
        <Wallet>
          <ConnectWallet />
        </Wallet>
      )}

      <p className="text-sm text-gray-400 max-w-md text-center">
        By connecting, you'll sign a message to verify wallet ownership. 
        No transaction fees involved.
      </p>
    </div>
  );
}
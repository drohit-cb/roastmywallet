'use client';

import { useState } from 'react';
import { useAccount, useSignMessage, useDisconnect, usePublicClient } from 'wagmi';
import { SiweMessage } from 'siwe';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';

interface LoginProps {
  onLoginComplete: () => void;
}

export function Login({ onLoginComplete }: LoginProps) {
  const account = useAccount();
  const { isConnected, address, } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const publicClient = usePublicClient();
  if (!publicClient) {
    throw new Error('Public client not found');
  }

  const handleSIWE = async () => {
    if (!isConnected || !address) return;
    
    setIsSigningIn(true);
    try {
      // Get nonce
      const nonceRes = await fetch('/api/auth/nonce');
      const nonce = await nonceRes.text();
      
      const message = new SiweMessage({
        domain: window.location.host,
        address: address as `0x${string}`,
        chainId: account.chainId,
        uri: window.location.origin,
        version: '1',
        nonce,
        statement: 'Sign in to RoastMyWallet. By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.',
      });

      const messageToSign = message.prepareMessage();
      
      // Sign message
      const signature = await signMessageAsync({ 
        message: messageToSign
      });  

      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chainId: account.chainId,
          address: address,
          message: messageToSign,
          signature: signature,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.ok) {
        throw new Error(verifyData.error || 'Error verifying message');
      }

      onLoginComplete();
    } catch (error) {
      console.error('Failed to sign and verify message:', error);
      disconnect();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6" role="main">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome to RoastMyWallet</h2>
        <p className="text-gray-400">
          {isSigningIn 
            ? 'Signing in...' 
            : 'Connect your wallet to start getting roasted'}
        </p>
      </div>

      <Wallet>
        <ConnectWallet 
          onConnect={handleSIWE}
          aria-label="Connect Wallet"
        />
      </Wallet>

      <p className="text-sm text-gray-400 max-w-md text-center" aria-live="polite">
        By connecting, you will sign a message to verify wallet ownership. 
        No transaction fees involved.
      </p>
    </div>
  );
}
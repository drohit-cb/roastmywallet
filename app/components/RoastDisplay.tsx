'use client';

import { useState } from 'react';

interface RoastDisplayProps {
  isConnected: boolean;
  isLoading?: boolean;
  roastText?: string;
  onGenerate: () => void;
}

export function RoastDisplay({ isConnected, isLoading, roastText, onGenerate }: RoastDisplayProps) {
  const [isMinting, setIsMinting] = useState(false);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
      ) : roastText ? (
        <>
          <div className="text-2xl font-bold text-center p-6 rounded-lg bg-gray-800/50 border border-gray-700">
            {roastText}
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsMinting(true)}
              disabled={isMinting}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {isMinting ? 'Minting...' : 'Mint as NFT'}
            </button>
            
            <button
              className="px-6 py-2 bg-gray-700 rounded-full font-semibold hover:bg-gray-600"
            >
              Share 🐦
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={onGenerate}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg font-bold text-xl hover:opacity-90"
        >
          Generate Roast 🔥
        </button>
      )}
    </div>
  );
} 
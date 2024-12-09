'use client';

import { useState } from 'react';
import { ShareButton } from './ShareButton';

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
              className="px-12 py-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 text-lg"
            >
              Mint as NFT
            </button>
            
            <ShareButton roastText={roastText} />
          </div>
        </>
      ) : (
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg font-bold text-xl hover:opacity-90 disabled:opacity-50"
        >
          Generate Roast 🔥
        </button>
      )}
    </div>
  );
} 
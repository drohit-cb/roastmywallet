'use client';

import { WalletConnect } from './components/WalletConnect';
import { RoastDisplay } from './components/RoastDisplay';
import { useAccount } from 'wagmi';
import { useState } from 'react';

const MOCK_ROASTS = [
  "Bro's wallet is so inactive, even his dust is collecting dust 💤",
  "Trading like a drunk monkey with a dartboard would've given better returns 🎯",
  "Your portfolio is more volatile than my ex's mood swings 📈📉",
  "Paper hands so weak they make tissue paper look strong 🧻",
];

export default function Home() {
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [roastText, setRoastText] = useState<string>();

  const generateRoast = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRoastText(MOCK_ROASTS[Math.floor(Math.random() * MOCK_ROASTS.length)]);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <nav className="p-4">
        <WalletConnect />
      </nav>
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-6xl font-bold text-center mb-8">
          Roast My <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Wallet</span>
        </h1>
        
        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-8 backdrop-blur-sm">
          <p className="text-xl text-center text-gray-300 mb-8">
            Connect your wallet to get roasted based on your on-chain activity!
          </p>
          
          <RoastDisplay 
            isConnected={isConnected}
            isLoading={isLoading}
            roastText={roastText}
            onGenerate={generateRoast}
          />
        </div>
      </div>
    </main>
  );
}

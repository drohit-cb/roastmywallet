'use client';

import { useAccount } from 'wagmi';
import { Leaderboard } from '@/app/components/Leaderboard';
import { Navigation } from '@/app/components/Navigation';

export default function LeaderboardPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <main className="container mx-auto px-4 py-16">
        <Navigation />
        <h1 className="text-4xl font-bold text-center mb-12">
          Top Roasts 🔥
        </h1>
        <Leaderboard />
      </main>
    </div>
  );
} 
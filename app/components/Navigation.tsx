'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex justify-center gap-4 mb-8">
      <Link 
        href="/"
        className={`px-4 py-2 rounded-full ${
          pathname === '/' 
            ? 'bg-pink-500 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Roast My Wallet
      </Link>
      <Link 
        href="/leaderboard"
        className={`px-4 py-2 rounded-full ${
          pathname === '/leaderboard' 
            ? 'bg-pink-500 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Top Roasts
      </Link>
    </div>
  );
} 
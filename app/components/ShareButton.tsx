'use client';

import { useCallback } from 'react';

interface ShareButtonProps {
  roastText: string;
}

export function ShareButton({ roastText }: ShareButtonProps) {
  const handleShare = useCallback(() => {
    const text = encodeURIComponent(`${roastText}\n\nGet your wallet roasted at`);
    const url = encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL || 'https://roastwallet.xyz');
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(shareUrl, '_blank');
  }, [roastText]);

  return (
    <button
      onClick={handleShare}
      className="px-12 py-3 bg-[#1D9BF0] rounded-full font-semibold hover:opacity-90 text-lg"
    >
      Share on X
    </button>
  );
} 
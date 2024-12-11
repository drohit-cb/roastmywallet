import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from './providers';
import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'RoastMyWallet - Get Your Wallet Roasted',
  description: 'RoastMyWallet is a fun dApp that analyzes your on-chain activity and generates witty, personalized roasts about your trading habits, NFT collections, and wallet behavior. Connect your wallet and get roasted!',
  keywords: 'web3, crypto, wallet, ethereum, base, nft, blockchain',
  openGraph: {
    title: 'RoastMyWallet',
    description: 'RoastMyWallet is a fun dApp that analyzes your on-chain activity and generates witty, personalized roasts about your trading habits, NFT collections, and wallet behavior. Connect your wallet and get roasted!',
    url: 'https://roastwallet.xyz',
    siteName: 'RoastMyWallet',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'RoastMyWallet Preview',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoastMyWallet',
    description: 'RoastMyWallet is a fun dApp that analyzes your on-chain activity and generates witty, personalized roasts about your trading habits, NFT collections, and wallet behavior. Connect your wallet and get roasted!',
    images: ['/api/og'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid rgba(75, 85, 99, 0.3)',
              maxWidth: '500px',
              margin: '0 auto',
            },
            success: {
              iconTheme: {
                primary: '#ec4899',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#8b5cf6',
                secondary: '#fff',
              },
            },
            duration: 2500,
          }}
        />
      </body>
    </html>
  );
}
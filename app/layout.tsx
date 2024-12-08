import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from './providers';
import { Metadata } from 'next';

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
      </body>
    </html>
  );
}
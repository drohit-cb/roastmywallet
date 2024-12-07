import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RoastMyWallet - Get Your Wallet Roasted',
  description: 'A fun dApp that roasts your wallet based on your on-chain activity.',
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
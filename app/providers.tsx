'use client';
 
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
 
export function Providers(props: { children: ReactNode }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          name: 'RoastMyWallet',
          logo: `${baseUrl}/api/wallet-icon`,
          mode: 'dark',
          theme: 'default',
        },
        wallet: { 
          display: 'modal',
          termsUrl: '/terms',
          privacyUrl: '/privacy',
        },
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}
'use client';

import type { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { createClient } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from '@wagmi/connectors';

const queryClient = new QueryClient();

// Create wagmi config that uses Coinbase's wallet
const config = createConfig({
  chains: [baseSepolia],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'RoastMyWallet',
      appLogoUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/icon.png`,
    })
  ],
});

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              name: 'RoastMyWallet',
              logo: '/icon.png',
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
      </QueryClientProvider>
    </WagmiProvider>
  );
}
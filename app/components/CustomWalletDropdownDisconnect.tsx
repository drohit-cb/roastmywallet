'use client';

import { useDisconnect } from 'wagmi';
import { useCallback } from 'react';
import { WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';

/**
 * Custom wrapper for OnchainKit's WalletDropdownDisconnect component.
 * 
 * OnchainKit's default disconnect only handles wallet disconnection but doesn't provide:
 * 1. Hooks/callbacks for cleanup before disconnect
 * 2. Session management (SIWE cleanup)
 * 3. Application state reset
 * 
 * This wrapper:
 * - Preserves the original UI/UX of OnchainKit
 * - Intercepts the disconnect action to perform cleanup
 * - Allows parent components to reset their state
 * - Ensures SIWE session is properly cleared
 * - Then triggers the original wallet disconnect
 */
export function CustomWalletDropdownDisconnect({ 
  onDisconnect 
}: { 
  onDisconnect: () => Promise<void> 
}) {
  const { disconnect } = useDisconnect();

  const handleDisconnect = useCallback(async () => {
    await onDisconnect();
    disconnect();
  }, [disconnect, onDisconnect]);

  return (
    <div onClick={handleDisconnect}>
      <WalletDropdownDisconnect />
    </div>
  );
} 
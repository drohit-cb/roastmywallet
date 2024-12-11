'use client';

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';
import { CustomWalletDropdownDisconnect } from './CustomWalletDropdownDisconnect';

export function WalletConnect({ onDisconnect }: { onDisconnect: () => Promise<void> }) {
  return (
    <div className="flex justify-end p-4">
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
          </Identity>
          <CustomWalletDropdownDisconnect onDisconnect={onDisconnect} />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
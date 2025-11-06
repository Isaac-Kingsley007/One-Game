'use client';

import { useWallets, useCurrentWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { WalletWithRequiredFeatures } from '@mysten/wallet-standard';

export function WalletInfo() {

  const wallet = useCurrentWallet();
  const isConnected = wallet.isConnected;
  const currentAccount = useCurrentAccount();
  
  if (!isConnected || !currentAccount) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please connect your One Wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Wallet Information</h2>
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-600">Wallet Name:</span>
          <p className="text-gray-900 font-mono">{wallet.currentWallet?.name || 'Unknown'}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Address:</span>
          <p className="text-gray-900 font-mono break-all">{currentAccount.address}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <p className="text-green-600 font-medium">Connected ✓</p>
        </div>
      </div>
    </div>
  );
}


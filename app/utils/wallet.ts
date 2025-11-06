'use client';

import { useWallets } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { WalletWithRequiredFeatures } from '@mysten/wallet-standard';

/**
 * Get the OneChain RPC client for the current network
 */
export function getOneChainClient(network: 'testnet' | 'devnet' | 'mainnet' = 'testnet') {
  const rpcUrls = {
    testnet: 'https://rpc-testnet.onelabs.cc:443',
    devnet: 'https://rpc-devnet.onelabs.cc:443',
    mainnet: 'https://rpc-mainnet.onelabs.cc:443',
  };

  return new SuiClient({ url: rpcUrls[network] });
}

/**
 * Hook to get wallet utilities
 */
export function useWalletUtils() {
  const wallet = useWallets()[0] as WalletWithRequiredFeatures & { currentAccount: any; isConnected: any; signAndExecuteTransaction: any }  ;
  const { currentAccount, isConnected, signAndExecuteTransaction } = wallet;

  /**
   * Execute a transaction with sponsored gas (if available)
   * This is a placeholder for sponsored transaction implementation
   */
  const executeSponsoredTransaction = async (transaction: Transaction) => {
    if (!isConnected || !currentAccount) {
      throw new Error('Wallet not connected');
    }

    // TODO: Implement sponsored transaction logic
    // For now, execute normally
    return await signAndExecuteTransaction({
      transaction,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });
  };

  /**
   * Create a transaction for game actions
   */
  const createGameTransaction = () => {
    const tx = new Transaction();
    // Add game-specific transaction logic here
    return tx;
  };

  return {
    currentAccount,
    isConnected,
    executeSponsoredTransaction,
    createGameTransaction,
    signAndExecuteTransaction,
  };
}

/**
 * Format address for display
 */
export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}


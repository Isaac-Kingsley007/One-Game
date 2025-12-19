'use client';

// import { useWallets, ConnectButton } from '@mysten/dapp-kit';
// import { WalletWithRequiredFeatures } from '@mysten/wallet-standard';
// import { useState } from 'react';

// export function WalletButton() {
//   const wallet = useWallets()[0] as WalletWithRequiredFeatures & { currentAccount: any; isConnected: any; connect: any; disconnect: any };
//   if(!wallet) {
//     throw new Error('No wallet found');
//   }
//   const { isConnected, connect, disconnect } = wallet;
//   const [isConnecting, setIsConnecting] = useState(false);

//   const handleConnect = async () => {
//     try {
//       setIsConnecting(true);
//       await connect();
//     } catch (error) {
//       console.error('Failed to connect wallet:', error);
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   const handleDisconnect = async () => {
//     try {
//       await disconnect();
//     } catch (error) {
//       console.error('Failed to disconnect wallet:', error);
//     }
//   };

//   if (isConnected && wallet.currentAccount) {
//     return (
//       <div className="flex items-center gap-4">
//         <div className="flex flex-col items-end">
//           <span className="text-sm font-medium text-gray-700">Connected</span>
//           <span className="text-xs text-gray-500 font-mono">
//             {wallet.currentAccount.address.slice(0, 6)}...{wallet.currentAccount.address.slice(-4)}
//           </span>
//         </div>
//         <button
//           onClick={handleDisconnect}
//           className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//         >
//           Disconnect
//         </button>
//       </div>
//     );
//   }

//   return (
//     <button
//       onClick={handleConnect}
//       disabled={isConnecting}
//       className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//     >
//       {isConnecting ? 'Connecting...' : 'Connect One Wallet'}
//     </button>
//   );
// }

import { ConnectButton } from '@onelabs/dapp-kit';

export function WalletButton(){
  return <ConnectButton />;
}
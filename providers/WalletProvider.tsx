'use client';

import '@onelabs/dapp-kit/dist/index.css'; // css importantly for the wallet button to work

import { createNetworkConfig, SuiClientProvider, WalletProvider as SuiWalletProvider } from '@onelabs/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl, type SuiClientOptions } from '@onelabs/sui/client';
import { useMemo } from 'react';

// // Config options for the networks you want to connect to
// const { networkConfig } = createNetworkConfig({
// 	localnet: { url: getFullnodeUrl('localnet') },
// 	mainnet: { url: getFullnodeUrl('mainnet') },
//   devnet: { url: getFullnodeUrl('devnet') },
//   testnet: { url: getFullnodeUrl('testnet') },
// });


// // Create a query client for React Query
// function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         refetchOnWindowFocus: false,
//         retry: false,
//       },
//     },
//   });
// }

// let browserQueryClient: QueryClient | undefined = undefined;

// function getQueryClient() {
//   if (typeof window === 'undefined') {
//     // Server: always make a new query client
//     return makeQueryClient();
//   } else {
//     // Browser: use singleton pattern to keep the same query client
//     if (!browserQueryClient) browserQueryClient = makeQueryClient();
//     return browserQueryClient;
//   }
// }



// export function WalletProvider({ children }: { children: React.ReactNode }) {
//   const queryClient = useMemo(() => getQueryClient(), []);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <SuiClientProvider networks={networkConfig} defaultNetwork="localnet">
//       <SuiWalletProvider>
//         {children}
// 				</SuiWalletProvider>
//       </SuiClientProvider>
//     </QueryClientProvider>
//   );
// }

// Config options for the networks you want to connect to
// See OneChain TypeScript SDK docs: https://doc-testnet.onelabs.cc/typescript
const { networkConfig } = createNetworkConfig({
	localnet: { url: getFullnodeUrl('localnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
	testnet: { url: getFullnodeUrl('testnet') },
});


const queryClient = new QueryClient();


export function WalletProvider({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
				<SuiWalletProvider>
					{children}
				</SuiWalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
}

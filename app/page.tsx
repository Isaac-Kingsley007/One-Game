'use client';

import { useRouter } from 'next/navigation';
import { WalletButton } from './components/WalletButton';
import { WalletInfo } from './components/WalletInfo';
import { useCurrentWallet, useCurrentAccount } from '@onelabs/dapp-kit';

export default function Home() {
  const router = useRouter();
  const wallet = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  const isConnected = Boolean(wallet?.isConnected && currentAccount);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-4xl uppercase tracking-wide text-blue-500 font-semibold">One Game</p>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Welcome to The Decentralized Game World</h1>
              <p className="text-gray-600">Powered By One Chain</p>
            </div>
            <WalletButton />
          </div>
        </header>

        <main className="space-y-8">
          <section className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="space-y-5">
                <div>
                  <p className="text-sm uppercase font-semibold tracking-wide text-blue-500">Step 1</p>
                  <h2 className="text-3xl font-bold text-gray-900">Connect your wallet</h2>
                  <p className="text-gray-600 mt-2">
                    We only need one One Wallet connection to get you into the arena. All transactions are sponsored, so
                    you can focus on the fun.
                  </p>
                </div>

                {!isConnected && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-blue-900">
                    Tap the connect button above to link your wallet and unlock the game lobby.
                  </div>
                )}

                {isConnected && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-900">
                      Wallet connected—you&apos;re ready to join the match!
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push('/game')}
                      className="w-full rounded-2xl bg-linear-to-r from-indigo-500 to-purple-500 px-5 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-200 transition hover:translate-y-0.5 hover:shadow-xl"
                    >
                      Join coin flip game
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                <p className="text-sm uppercase tracking-wide text-indigo-200">What to expect</p>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li>• 50/50 match: you vs computer</li>
                  <li>• Slick coin animation for every flip</li>
                  <li>• Instant feedback when you win or lose</li>
                  <li>• Jump back home or replay in one tap</li>
                </ul>
                <div className="rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-100">
                  Need a One Wallet? Download it from OneLabs to get started.
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
              <p className="text-sm uppercase font-semibold tracking-wide text-blue-500 mb-2">Step 2</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Verify connection</h3>
              <p className="text-gray-600 mb-4">
                Once your wallet is linked we surface the account info below so you know you&apos;re ready.
              </p>
              <WalletInfo />
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
              <p className="text-sm uppercase font-semibold tracking-wide text-purple-500 mb-2">Step 3</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Join the lobby</h3>
              <p className="text-gray-600 mb-4">
                You&apos;ll launch into a responsive coin flip experience featuring playful motion and instant results.
              </p>
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                <div className="text-5xl mb-3">🪙</div>
                <p className="text-sm text-slate-500">
                  Connect your wallet to reveal the <span className="font-semibold text-slate-700">Join coin flip game</span> button.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
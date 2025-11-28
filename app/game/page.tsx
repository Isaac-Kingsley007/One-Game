'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useCurrentWallet,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@onelabs/dapp-kit';
import { Transaction } from '@onelabs/sui/transactions';

type Result = 'win' | 'lose' | null;

const flipDurationMs = 1800;
const ENTRY_AMOUNT = 1000_000; // must match Move `ENTRY_AMOUNT` expectations (in OCT's smallest unit)
const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID as string;
const CHAIN = 'sui:testnet';

function extractGameId(result: any) {
  const changes = result?.objectChanges as any[] | undefined;
  if (!changes) return null;
  const createdGame = changes.find(
    (c) =>
      c.type === 'created' &&
      typeof c.objectType === 'string' &&
      c.objectType.includes('::escrow::GameEscrow'),
  );
  return createdGame?.objectId ?? null;
}

export default function CoinFlipGame() {
  const router = useRouter();
  const wallet = useCurrentWallet();
  const account = useCurrentAccount();
  const client = useSuiClient();

  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });
  const isConnected = Boolean(wallet?.isConnected && account);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [rounds, setRounds] = useState(0);

  const statusLabel = useMemo(() => {
    if (isFlipping) return 'The coin is in the air...';
    if (result === 'win') return 'You won! 🎉';
    if (result === 'lose') return 'Computer won this round.';
    return 'Ready when you are.';
  }, [isFlipping, result]);

  const handleFlip = async () => {
    if (!account || !PACKAGE_ID) return;
    if (isFlipping) return;

    setIsFlipping(true);
    setResult(null);

    try {
      // 1. Create game (conceptually with "computer" as opponent; on-chain this is created for the current wallet)
      const createTx = new Transaction();
      const [coinForCreate] = createTx.splitCoins(createTx.gas, [createTx.pure.u64(ENTRY_AMOUNT)]);
      createTx.moveCall({
        target: `${PACKAGE_ID}::escrow::create_game`,
        arguments: [coinForCreate, createTx.pure.u64(ENTRY_AMOUNT)],
      });

      const createResult = await signAndExecuteTransaction({
        transaction: createTx,
        chain: CHAIN,
      });

      const gameId = extractGameId(createResult);
      if (!gameId) {
        throw new Error('Unable to find created GameEscrow object id');
      }

      // 2. Join game with user as the second participant
      const joinTx = new Transaction();
      const [coinForJoin] = joinTx.splitCoins(joinTx.gas, [joinTx.pure.u64(ENTRY_AMOUNT)]);
      joinTx.moveCall({
        target: `${PACKAGE_ID}::escrow::join_game`,
        arguments: [joinTx.object(gameId), coinForJoin],
      });

      await signAndExecuteTransaction({
        transaction: joinTx,
        chain: CHAIN,
      }, {
        onError: (error) => {
          console.error("Error : " + "\n" + error.message + "\n" + error.cause + "\n" + error.stack)
        }
      });

      // 3. Flip locally and then finish game on-chain with the winner address
      setTimeout(async () => {
        const didWin = Math.random() >= 0.5;
        const userAddress = account.address;
        const computerAddress =
          (process.env.NEXT_PUBLIC_COMPUTER_ADDRESS as string | undefined) || userAddress;
        const winnerAddress = didWin ? userAddress : computerAddress;

        setResult(didWin ? 'win' : 'lose');
        setRounds((prev) => prev + 1);
        setIsFlipping(false);

        try {
          const finishTx = new Transaction();
          finishTx.moveCall({
            target: `${PACKAGE_ID}::escrow::finish_game`,
            arguments: [finishTx.object(gameId), finishTx.pure.address(winnerAddress)],
          });

          await signAndExecuteTransaction({
            transaction: finishTx,
            chain: CHAIN,
          });
        } catch (finishError) {
          // Log but don't interrupt UI flow
          console.error('Error finishing game on-chain:', finishError);
        }
      }, flipDurationMs);
    } catch (error) {
      console.error('Error running escrow flow for flip:', error);
      setIsFlipping(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900">Connect your One Wallet</h1>
          <p className="text-gray-600">
            You need an active wallet session before entering the coin flip arena. Head back home to connect.
          </p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full rounded-2xl bg-linear-to-r from-indigo-500 to-purple-500 px-5 py-3 text-white font-semibold shadow-md hover:translate-y-0.5 transition"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Coin Flip Arena</p>
            <h1 className="text-4xl font-bold">Player vs Computer</h1>
            <p className="text-slate-200 mt-2">50/50 odds. Smooth animation. Instant bragging rights.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="self-start rounded-2xl border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to home
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-white flex flex-col items-center text-center space-y-8">
            <div className="relative h-52 w-52 flex items-center justify-center">
              <div className={`coin ${isFlipping ? 'coin--flipping' : result === 'win' ? 'coin--win' : result === 'lose' ? 'coin--lose' : ''}`}>
                <div className="coin__face coin__face--front">You</div>
                <div className="coin__face coin__face--back">CPU</div>
              </div>
            </div>

            <div>
              <p className="text-sm uppercase tracking-widest text-indigo-200">Status</p>
              <p className="text-2xl font-semibold mt-1">{statusLabel}</p>
            </div>

            <button
              type="button"
              onClick={handleFlip}
              disabled={isFlipping}
              className="w-full rounded-2xl bg-white text-slate-900 px-6 py-4 text-lg font-bold shadow-2xl shadow-indigo-500/30 transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isFlipping ? 'Flipping...' : result ? 'Flip again' : 'Flip the coin'}
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-6">
            <div>
              <p className="text-sm uppercase font-semibold tracking-wide text-indigo-500">Round info</p>
              <h2 className="text-3xl font-bold text-slate-900">{rounds}</h2>
              <p className="text-sm text-slate-500">Total rounds played</p>
            </div>

            <div className="rounded-2xl border border-slate-100 p-5 space-y-3">
              <p className="text-sm font-semibold uppercase text-slate-500">Result</p>
              {result ? (
                <p className={`text-2xl font-bold ${result === 'win' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {result === 'win' ? 'You outsmarted the computer! 🔥' : 'Computer takes the round. Try again!'}
                </p>
              ) : (
                <p className="text-slate-500">Flip the coin to see who wins.</p>
              )}
            </div>

            <div className="rounded-2xl bg-slate-900 text-white p-5 space-y-3">
              <p className="text-sm uppercase tracking-wide text-indigo-300">Connected wallet</p>
              <p className="font-mono text-sm text-indigo-100 break-all">{account?.address}</p>
              <p className="text-xs text-slate-400">We only display this locally to confirm you&apos;re in the arena.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


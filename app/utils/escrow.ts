import { Transaction } from '@onelabs/sui/transactions';
import { SuiClient } from '@onelabs/sui/client';

const PACKAGE_ID = process.env.PACKAGE_ID;
const ENTRY_AMOUNT = 1000; // in MIST

// 1. Create Game
async function createGame(client: SuiClient, signer: any) {
  const tx = new Transaction();
  
  const [coin] = tx.splitCoins(tx.gas, [tx.pure(ENTRY_AMOUNT)]);
  
  tx.moveCall({
    target: `${PACKAGE_ID}::escrow::create_game`,
    arguments: [coin, tx.pure(ENTRY_AMOUNT)],
  });
  
  const result = await client.signAndExecuteTransaction({
    signer,
    transaction: tx,
  });
  
  return result;
}

// 2. Join Game
async function joinGame(client: SuiClient, signer: any, gameId: string) {
  const tx = new Transaction();
  
  const [coin] = tx.splitCoins(tx.gas, [tx.pure(ENTRY_AMOUNT)]);
  
  tx.moveCall({
    target: `${PACKAGE_ID}::escrow::join_game`,
    arguments: [tx.object(gameId), coin],
  });
  
  const result = await client.signAndExecuteTransaction({
    signer,
    transaction: tx,
  });
  
  return result;
}

// 3. Finish Game
async function finishGame(
  client: SuiClient,
  signer: any,
  gameId: string,
  winnerAddress: string
) {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::escrow::finish_game`,
    arguments: [tx.object(gameId), tx.pure(winnerAddress)],
  });
  
  const result = await client.signAndExecuteTransaction({
    signer,
    transaction: tx,
  });
  
  return result;
}

// 4. Query Game State
async function getGameState(client: SuiClient, gameId: string) {
  const game = await client.getObject({
    id: gameId,
    options: { showContent: true },
  });
  
  return game.data?.content;
}

import { Transaction } from '@mysten/sui/transactions';
import { DifficultyLevel } from '../../types/sudoku';
import { getCurrentWallet, hasFeature } from '../wallet/walletUtils';

export async function executeTransaction(tx: Transaction, expectedChain: string = 'sui:testnet'): Promise<any> {
  const wallet = getCurrentWallet();
  
  if (!wallet) {
    throw new Error('No Sui wallets detected');
  }
  
  if (!hasFeature(wallet, 'standard:signAndExecuteTransactionBlock')) {
    throw new Error('Wallet does not support signAndExecuteTransactionBlock feature');
  }
  
  const account = wallet.accounts[0];
  
  const signExecuteFeature = wallet.features['standard:signAndExecuteTransactionBlock'];
  return signExecuteFeature.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    account,
    chain: expectedChain,
    options: {
      showEvents: true,
      showEffects: true,
    },
  });
}

export function createMintGameTransaction(
  difficulty: DifficultyLevel,
  showCommentary: boolean,
  creatorAddress: string
): Transaction {
  const tx = new Transaction();
  
  const difficultyParam = tx.pure(Buffer.from(difficulty));
  
  const showCommentaryBuffer = Buffer.alloc(1);
  showCommentaryBuffer.writeUInt8(showCommentary ? 1 : 0);
  const showCommentaryParam = tx.pure(showCommentaryBuffer);
  
  const creatorAddressParam = tx.pure(Buffer.from(creatorAddress));
  
  tx.moveCall({
    target: '0x2::sudoku::mint_game',
    arguments: [difficultyParam, showCommentaryParam, creatorAddressParam],
  });

  return tx;
}

export function createTransferGameTransaction(gameId: string, toAddress: string): Transaction {
  const tx = new Transaction();
  
  const gameIdParam = tx.pure(Buffer.from(gameId));
  const toAddressParam = tx.pure(Buffer.from(toAddress));
  
  tx.moveCall({
    target: '0x2::sudoku::transfer',
    arguments: [gameIdParam, toAddressParam],
  });

  return tx;
}

export function createSetBountyTransaction(gameId: string, amount: number): Transaction {
  const tx = new Transaction();
  
  const gameIdParam = tx.pure(Buffer.from(gameId));
  const amountParam = tx.pure(Buffer.from(amount.toString()));
  
  tx.moveCall({
    target: '0x2::sudoku::set_bounty',
    arguments: [gameIdParam, amountParam],
  });

  return tx;
}


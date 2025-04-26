
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SudokuGame, DifficultyLevel } from '../types/sudoku';

// Initialize Sui client (using testnet by default)
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export const suiBlockchain = {
  connectWallet: async (): Promise<{ address: string }> => {
    if (!('suiWallet' in window)) {
      throw new Error('Sui wallet extension not detected. Please install a Sui wallet extension.');
    }

    try {
      // @ts-ignore - the wallet API exists but TypeScript doesn't know about it
      await window.suiWallet.requestPermissions();
      // @ts-ignore
      const accounts = await window.suiWallet.getAccounts();
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in wallet');
      }

      return { address: accounts[0] };
    } catch (error) {
      console.error('Failed to connect to Sui wallet:', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<{ address: string }> => {
    if (!('suiWallet' in window)) {
      throw new Error('Sui wallet extension not detected');
    }

    try {
      // @ts-ignore
      const accounts = await window.suiWallet.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('Not connected to Sui wallet');
      }
      return { address: accounts[0] };
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },

  mintGame: async (
    difficulty: DifficultyLevel, 
    showCommentary: boolean,
    creatorAddress: string
  ): Promise<SudokuGame> => {
    // Create a new transaction block
    const tx = new TransactionBlock();
    
    // Example of minting a new game NFT
    // Note: This requires having the proper Move contract deployed
    // with a mint_game function
    tx.moveCall({
      target: '0x2::sudoku::mint_game', // Replace with your actual package ID
      arguments: [
        tx.pure(difficulty),
        tx.pure(showCommentary),
        tx.pure(creatorAddress)
      ],
    });

    try {
      // @ts-ignore
      const result = await window.suiWallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      // Parse the response and create a game object
      // This structure would depend on your actual Move contract
      const newGame: SudokuGame = {
        id: result.digest,
        board: Array(9).fill(null).map(() => Array(9).fill(null)),
        solution: Array(9).fill(null).map(() => Array(9).fill(null)),
        difficulty,
        showCommentary,
        creator: creatorAddress,
        currentOwner: creatorAddress,
        dateCreated: new Date().toISOString(),
        bounty: 0,
        isComplete: false
      };

      return newGame;
    } catch (error) {
      console.error('Failed to mint game:', error);
      throw error;
    }
  },

  transferGame: async (gameId: string, toAddress: string): Promise<boolean> => {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: '0x2::sudoku::transfer', // Replace with your actual package ID
      arguments: [
        tx.pure(gameId),
        tx.pure(toAddress)
      ],
    });

    try {
      // @ts-ignore
      await window.suiWallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });
      return true;
    } catch (error) {
      console.error('Failed to transfer game:', error);
      throw error;
    }
  },

  setBounty: async (gameId: string, amount: number): Promise<boolean> => {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: '0x2::sudoku::set_bounty', // Replace with your actual package ID
      arguments: [
        tx.pure(gameId),
        tx.pure(amount.toString())
      ],
    });

    try {
      // @ts-ignore
      await window.suiWallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });
      return true;
    } catch (error) {
      console.error('Failed to set bounty:', error);
      throw error;
    }
  }
};


import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { DifficultyLevel } from '../types/sudoku';
import { 
  connectWallet, 
  getCurrentWallet, 
  disconnectWallet 
} from './wallet/walletUtils';
import {
  executeTransaction,
  createMintGameTransaction,
  createTransferGameTransaction,
  createSetBountyTransaction
} from './transactions/transactionUtils';

// Initialize Sui client (using testnet by default)
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export const suiBlockchain = {
  connectWallet,

  getCurrentUser: async (): Promise<{ address: string }> => {
    try {
      const wallet = getCurrentWallet();
      
      if (!wallet) {
        throw new Error('No Sui wallets detected');
      }
      
      const accounts = wallet.accounts;
      
      if (!accounts || accounts.length === 0) {
        throw new Error('Not connected to Sui wallet');
      }
      
      return { address: accounts[0].address };
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },

  mintGame: async (
    difficulty: DifficultyLevel, 
    showCommentary: boolean,
    creatorAddress: string
  ) => {
    try {
      const tx = createMintGameTransaction(difficulty, showCommentary, creatorAddress);
      const result = await executeTransaction(tx);

      return {
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
    } catch (error) {
      console.error('Failed to mint game:', error);
      throw error;
    }
  },

  transferGame: async (gameId: string, toAddress: string): Promise<boolean> => {
    try {
      const tx = createTransferGameTransaction(gameId, toAddress);
      await executeTransaction(tx);
      return true;
    } catch (error) {
      console.error('Failed to transfer game:', error);
      throw error;
    }
  },

  setBounty: async (gameId: string, amount: number): Promise<boolean> => {
    try {
      const tx = createSetBountyTransaction(gameId, amount);
      await executeTransaction(tx);
      return true;
    } catch (error) {
      console.error('Failed to set bounty:', error);
      throw error;
    }
  },

  disconnectWallet
};


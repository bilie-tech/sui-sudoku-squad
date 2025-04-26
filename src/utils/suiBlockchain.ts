
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useWalletKit } from '@mysten/wallet-kit';
import { DifficultyLevel } from '../types/sudoku';

// Initialize Sui client (using testnet by default)
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export const suiBlockchain = {
  connectWallet: async (): Promise<{ address: string }> => {
    try {
      // Get the wallet adapter - note this requires being in a React context
      // with WalletProvider
      if (typeof window === 'undefined' || !window.suiWallet) {
        throw new Error('No Sui wallets detected. Please install a Sui wallet extension.');
      }
      
      // For non-React contexts, we can use window.suiWallet
      const wallet = window.suiWallet;
      
      // Request connection
      await wallet.requestPermissions();
      const accounts = await wallet.getAccounts();
      
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
    try {
      if (typeof window === 'undefined' || !window.suiWallet) {
        throw new Error('No Sui wallets detected');
      }
      
      const wallet = window.suiWallet;
      const accounts = await wallet.getAccounts();
      
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
  ) => {
    const tx = new TransactionBlock();
    
    // Example of minting a new game NFT
    tx.moveCall({
      target: '0x2::sudoku::mint_game', // Replace with your actual package ID
      arguments: [
        tx.pure(difficulty),
        tx.pure(showCommentary),
        tx.pure(creatorAddress)
      ],
    });

    try {
      if (typeof window === 'undefined' || !window.suiWallet) {
        throw new Error('No Sui wallets detected');
      }
      
      const wallet = window.suiWallet;
      
      const result = await wallet.signAndExecuteTransaction({
        transaction: tx,
        options: {
          showEvents: true,
          showEffects: true,
        },
      });

      // Return the transaction digest as the game ID
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
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: '0x2::sudoku::transfer', // Replace with your actual package ID
      arguments: [
        tx.pure(gameId),
        tx.pure(toAddress)
      ],
    });

    try {
      if (typeof window === 'undefined' || !window.suiWallet) {
        throw new Error('No Sui wallets detected');
      }
      
      const wallet = window.suiWallet;
      
      await wallet.signAndExecuteTransaction({
        transaction: tx
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
      if (typeof window === 'undefined' || !window.suiWallet) {
        throw new Error('No Sui wallets detected');
      }
      
      const wallet = window.suiWallet;
      
      await wallet.signAndExecuteTransaction({
        transaction: tx
      });
      
      return true;
    } catch (error) {
      console.error('Failed to set bounty:', error);
      throw error;
    }
  }
};

// Add this for TypeScript support
declare global {
  interface Window {
    suiWallet?: {
      requestPermissions: () => Promise<void>;
      getAccounts: () => Promise<string[]>;
      signAndExecuteTransaction: (params: {
        transaction: TransactionBlock;
        options?: {
          showEvents?: boolean;
          showEffects?: boolean;
        };
      }) => Promise<{
        digest: string;
        [key: string]: any;
      }>;
    };
  }
}

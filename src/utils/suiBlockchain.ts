
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { WalletStandardProvider } from '@mysten/wallet-standard';
import { DifficultyLevel } from '../types/sudoku';

// Initialize Sui client (using testnet by default)
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Initialize wallet standard
const walletKit = new WalletStandardProvider();

export const suiBlockchain = {
  connectWallet: async (): Promise<{ address: string }> => {
    try {
      // Get available wallets
      const availableWallets = await walletKit.getWallets();
      
      if (availableWallets.length === 0) {
        throw new Error('No Sui wallets detected. Please install a Sui wallet extension.');
      }
      
      // Use the first available wallet (in production, you might want to let users choose)
      const wallet = availableWallets[0];
      
      // Request permissions and get accounts
      const accounts = await wallet.features['standard:connect'].connect();
      
      if (!accounts || accounts.accounts.length === 0) {
        throw new Error('No accounts found in wallet');
      }

      return { address: accounts.accounts[0].address };
    } catch (error) {
      console.error('Failed to connect to Sui wallet:', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<{ address: string }> => {
    try {
      const availableWallets = await walletKit.getWallets();
      
      if (availableWallets.length === 0) {
        throw new Error('No Sui wallets detected');
      }
      
      const wallet = availableWallets[0];
      const currentAccounts = await wallet.features['standard:connect'].connect();
      
      if (!currentAccounts || currentAccounts.accounts.length === 0) {
        throw new Error('Not connected to Sui wallet');
      }
      
      return { address: currentAccounts.accounts[0].address };
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
      const availableWallets = await walletKit.getWallets();
      const wallet = availableWallets[0];
      
      const result = await wallet.features['standard:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
        transactionBlock: tx,
        chain: 'sui:testnet', // or 'sui:mainnet' for production
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
      const availableWallets = await walletKit.getWallets();
      const wallet = availableWallets[0];
      
      await wallet.features['standard:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
        transactionBlock: tx,
        chain: 'sui:testnet', // or 'sui:mainnet' for production
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
      const availableWallets = await walletKit.getWallets();
      const wallet = availableWallets[0];
      
      await wallet.features['standard:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
        transactionBlock: tx,
        chain: 'sui:testnet', // or 'sui:mainnet' for production
      });
      
      return true;
    } catch (error) {
      console.error('Failed to set bounty:', error);
      throw error;
    }
  }
};

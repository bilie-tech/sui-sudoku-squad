import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { getWallets, Wallet, WalletAccount } from '@mysten/wallet-standard';
import { DifficultyLevel } from '../types/sudoku';

// Initialize Sui client (using testnet by default)
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Function to get available wallets
function getAvailableWallets(): Wallet[] {
  const walletStandard = getWallets();
  return walletStandard.get();
}

// Function to get the current wallet
function getCurrentWallet(): Wallet | undefined {
  const wallets = getAvailableWallets();
  // Return the first wallet or undefined if none are available
  return wallets.length > 0 ? wallets[0] : undefined;
}

export const suiBlockchain = {
  connectWallet: async (): Promise<{ address: string }> => {
    try {
      const wallet = getCurrentWallet();
      
      if (!wallet) {
        throw new Error('No Sui wallets detected. Please install a Sui wallet extension.');
      }
      
      // Check if the wallet supports the required features
      if (!wallet.features['standard:connect']) {
        throw new Error('Wallet does not support connect feature');
      }
      
      // Connect to the wallet
      const connectResult = await wallet.features['standard:connect'].connect();
      
      // Get accounts after connecting
      const accounts = wallet.accounts;
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in wallet');
      }

      return { address: accounts[0].address };
    } catch (error) {
      console.error('Failed to connect to Sui wallet:', error);
      throw error;
    }
  },

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
      const wallet = getCurrentWallet();
      
      if (!wallet) {
        throw new Error('No Sui wallets detected');
      }
      
      if (!wallet.features['standard:signAndExecuteTransactionBlock']) {
        throw new Error('Wallet does not support signAndExecuteTransactionBlock feature');
      }
      
      // Get the current account
      const account = wallet.accounts[0];
      
      // Sign and execute the transaction
      const result = await wallet.features['standard:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
        transactionBlock: tx,
        account,
        chain: 'sui:testnet',
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
      const wallet = getCurrentWallet();
      
      if (!wallet) {
        throw new Error('No Sui wallets detected');
      }
      
      if (!wallet.features['standard:signAndExecuteTransactionBlock']) {
        throw new Error('Wallet does not support signAndExecuteTransactionBlock feature');
      }
      
      // Get the current account
      const account = wallet.accounts[0];
      
      // Sign and execute the transaction
      await wallet.features['standard:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
        transactionBlock: tx,
        account,
        chain: 'sui:testnet',
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
      const wallet = getCurrentWallet();
      
      if (!wallet) {
        throw new Error('No Sui wallets detected');
      }
      
      if (!wallet.features['standard:signAndExecuteTransactionBlock']) {
        throw new Error('Wallet does not support signAndExecuteTransactionBlock feature');
      }
      
      // Get the current account
      const account = wallet.accounts[0];
      
      // Sign and execute the transaction
      await wallet.features['standard:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
        transactionBlock: tx,
        account,
        chain: 'sui:testnet',
      });
      
      return true;
    } catch (error) {
      console.error('Failed to set bounty:', error);
      throw error;
    }
  }
};

// Type definitions for the Wallet Standard
declare module '@mysten/wallet-standard' {
  export function getWallets(): {
    get: () => Wallet[];
    on: (event: string, callback: (wallets: Wallet[]) => void) => void;
  };

  export interface Wallet {
    name: string;
    icon: string;
    accounts: WalletAccount[];
    chains: string[];
    features: {
      'standard:connect'?: {
        connect: () => Promise<{ accounts: WalletAccount[] }>;
      };
      'standard:events'?: {
        on: (event: string, callback: (data: any) => void) => void;
      };
      'standard:signAndExecuteTransactionBlock'?: {
        signAndExecuteTransactionBlock: (params: {
          transactionBlock: TransactionBlock;
          account: WalletAccount;
          chain: string;
          options?: {
            showEvents?: boolean;
            showEffects?: boolean;
          };
        }) => Promise<{
          digest: string;
          [key: string]: any;
        }>;
      };
    };
  }

  export interface WalletAccount {
    address: string;
    publicKey: Uint8Array;
    chains: string[];
    features: string[];
  }
}
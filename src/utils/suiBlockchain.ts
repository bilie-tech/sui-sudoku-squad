
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { getWallets } from '@mysten/wallet-standard';
import { DifficultyLevel } from '../types/sudoku';
import { bcs } from '@mysten/sui/bcs';

// Initialize Sui client (using testnet by default)
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Function to get available wallets
function getAvailableWallets() {
  const walletStandard = getWallets();
  return walletStandard.get();
}

// Function to get the current wallet
function getCurrentWallet() {
  const wallets = getAvailableWallets();
  // Return the first wallet or undefined if none are available
  return wallets.length > 0 ? wallets[0] : undefined;
}

// Type guard to check if wallet has specific feature
function hasFeature<T extends string>(wallet: any, feature: T): wallet is { features: { [key in T]: any } } {
  return wallet && wallet.features && feature in wallet.features;
}

export const suiBlockchain = {
  connectWallet: async (): Promise<{ address: string }> => {
    try {
      const wallet = getCurrentWallet();
      
      if (!wallet) {
        throw new Error('No Sui wallets detected. Please install a Sui wallet extension.');
      }
      
      // Check if the wallet supports the required features
      if (!hasFeature(wallet, 'standard:connect')) {
        throw new Error('Wallet does not support connect feature');
      }
      
      // Connect to the wallet
      const connectFeature = wallet.features['standard:connect'];
      const connectResult = await connectFeature.connect();
      
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
    const tx = new Transaction();
    
    // Correctly create transaction arguments with proper typing
    // Convert string values to Buffer for binary data
    const difficultyParam = tx.pure(Buffer.from(difficulty));
    
    // Convert boolean to a Buffer containing 0 or 1
    const showCommentaryBuffer = Buffer.alloc(1);
    showCommentaryBuffer.writeUInt8(showCommentary ? 1 : 0);
    const showCommentaryParam = tx.pure(showCommentaryBuffer);
    
    const creatorAddressParam = tx.pure(Buffer.from(creatorAddress));
    
    // Example of minting a new game NFT
    tx.moveCall({
      target: '0x2::sudoku::mint_game', // Replace with your actual package ID
      arguments: [
        difficultyParam,
        showCommentaryParam,
        creatorAddressParam
      ],
    });

    try {
      const wallet = getCurrentWallet();
      
      if (!wallet) {
        throw new Error('No Sui wallets detected');
      }
      
      if (!hasFeature(wallet, 'standard:signAndExecuteTransactionBlock')) {
        throw new Error('Wallet does not support signAndExecuteTransactionBlock feature');
      }
      
      // Get the current account
      const account = wallet.accounts[0];
      
      // Sign and execute the transaction
      const signExecuteFeature = wallet.features['standard:signAndExecuteTransactionBlock'];
      const result = await signExecuteFeature.signAndExecuteTransactionBlock({
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
    const tx = new Transaction();
    
    // Convert parameters to appropriate types for Transaction
    const gameIdParam = tx.pure(Buffer.from(gameId));
    const toAddressParam = tx.pure(Buffer.from(toAddress));
    
    tx.moveCall({
      target: '0x2::sudoku::transfer', // Replace with your actual package ID
      arguments: [
        gameIdParam,
        toAddressParam
      ],
    });

    try {
      const wallet = getCurrentWallet();
      
      if (!wallet) {
        throw new Error('No Sui wallets detected');
      }
      
      if (!hasFeature(wallet, 'standard:signAndExecuteTransactionBlock')) {
        throw new Error('Wallet does not support signAndExecuteTransactionBlock feature');
      }
      
      // Get the current account
      const account = wallet.accounts[0];
      
      // Sign and execute the transaction
      const signExecuteFeature = wallet.features['standard:signAndExecuteTransactionBlock'];
      await signExecuteFeature.signAndExecuteTransactionBlock({
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
    const tx = new Transaction();
    
    // Convert parameters to appropriate types for Transaction
    const gameIdParam = tx.pure(Buffer.from(gameId));
    const amountParam = tx.pure(Buffer.from(amount.toString()));
    
    tx.moveCall({
      target: '0x2::sudoku::set_bounty', // Replace with your actual package ID
      arguments: [
        gameIdParam,
        amountParam
      ],
    });

    try {
      const wallet = getCurrentWallet();
      
      if (!wallet) {
        throw new Error('No Sui wallets detected');
      }
      
      if (!hasFeature(wallet, 'standard:signAndExecuteTransactionBlock')) {
        throw new Error('Wallet does not support signAndExecuteTransactionBlock feature');
      }
      
      // Get the current account
      const account = wallet.accounts[0];
      
      // Sign and execute the transaction
      const signExecuteFeature = wallet.features['standard:signAndExecuteTransactionBlock'];
      await signExecuteFeature.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        account,
        chain: 'sui:testnet',
      });
      
      return true;
    } catch (error) {
      console.error('Failed to set bounty:', error);
      throw error;
    }
  },

  disconnectWallet: async (): Promise<boolean> => {
    try {
      const wallet = getCurrentWallet();
      
      if (!wallet) {
        throw new Error('No Sui wallet detected');
      }

      // Check if the wallet has a disconnect feature
      if (hasFeature(wallet, 'standard:disconnect')) {
        const disconnectFeature = wallet.features['standard:disconnect'];
        await disconnectFeature.disconnect();
      }

      return true;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      return false;
    }
  }
};

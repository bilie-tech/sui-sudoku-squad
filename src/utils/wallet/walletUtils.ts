
import { getWallets } from '@mysten/wallet-standard';

// Function to get available wallets
export function getAvailableWallets() {
  const walletStandard = getWallets();
  return walletStandard.get();
}

// Function to get the current wallet
export function getCurrentWallet() {
  const wallets = getAvailableWallets();
  // Return the first wallet or undefined if none are available
  return wallets.length > 0 ? wallets[0] : undefined;
}

// Type guard to check if wallet has specific feature
export function hasFeature<T extends string>(wallet: any, feature: T): wallet is { features: { [key in T]: any } } {
  return wallet && wallet.features && feature in wallet.features;
}

export async function connectWallet(): Promise<{ address: string }> {
  try {
    const wallet = getCurrentWallet();
    
    if (!wallet) {
      throw new Error('No Sui wallets detected. Please install a Sui wallet extension.');
    }
    
    if (!hasFeature(wallet, 'standard:connect')) {
      throw new Error('Wallet does not support connect feature');
    }
    
    const connectFeature = wallet.features['standard:connect'];
    const connectResult = await connectFeature.connect();
    
    const accounts = wallet.accounts;
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found in wallet');
    }

    return { address: accounts[0].address };
  } catch (error) {
    console.error('Failed to connect to Sui wallet:', error);
    throw error;
  }
}

export async function disconnectWallet(): Promise<boolean> {
  try {
    const wallet = getCurrentWallet();
    
    if (!wallet) {
      throw new Error('No Sui wallet detected');
    }

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


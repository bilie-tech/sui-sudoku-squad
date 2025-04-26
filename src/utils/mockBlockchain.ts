
import { SudokuGame, DifficultyLevel, UserProfile } from '../types/sudoku';
import { generateSudokuGame } from './sudokuGenerator';
import { toast } from 'sonner';

// Mocked user profiles
const mockProfiles: Record<string, UserProfile> = {
  '0x123': {
    address: '0x123',
    displayName: 'Player One',
    gamesCreated: 5,
    gamesCompleted: 3,
    gamesHelped: 2
  },
  '0x456': {
    address: '0x456',
    displayName: 'Player Two',
    gamesCreated: 2,
    gamesCompleted: 1,
    gamesHelped: 3
  }
};

// Mock Sui blockchain games
let mockGames: SudokuGame[] = [
  {
    id: '0x1',
    board: Array(9).fill(null).map(() => Array(9).fill(null).map(() => Math.random() > 0.5 ? Math.floor(Math.random() * 9) + 1 : null)),
    solution: Array(9).fill(null).map(() => Array(9).fill(null).map(() => Math.floor(Math.random() * 9) + 1)),
    difficulty: 'easy',
    showCommentary: true,
    creator: '0x123',
    currentOwner: '0x123',
    dateCreated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    bounty: 0,
    isComplete: false
  },
  {
    id: '0x2',
    board: Array(9).fill(null).map(() => Array(9).fill(null).map(() => Math.random() > 0.6 ? Math.floor(Math.random() * 9) + 1 : null)),
    solution: Array(9).fill(null).map(() => Array(9).fill(null).map(() => Math.floor(Math.random() * 9) + 1)),
    difficulty: 'medium',
    showCommentary: false,
    creator: '0x123',
    currentOwner: '0x123',
    dateCreated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    bounty: 2.5,
    isComplete: false
  },
  {
    id: '0x3',
    board: Array(9).fill(null).map(() => Array(9).fill(null).map(() => Math.random() > 0.3 ? Math.floor(Math.random() * 9) + 1 : null)),
    solution: Array(9).fill(null).map(() => Array(9).fill(null).map(() => Math.floor(Math.random() * 9) + 1)),
    difficulty: 'hard',
    showCommentary: true,
    creator: '0x456',
    currentOwner: '0x456',
    dateCreated: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    bounty: 5,
    isComplete: false
  }
];

// This would be replaced by actual Sui blockchain API calls
export const mockBlockchainApi = {
  // Connect to wallet
  connectWallet: async (): Promise<{ address: string }> => {
    // Simulate connecting to a wallet
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { address: '0x123' };
  },
  
  // Get current user
  getCurrentUser: async (): Promise<{ address: string }> => {
    // Return mocked connected address
    return { address: '0x123' };
  },
  
  // Get user profile
  getUserProfile: async (address: string): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProfiles[address] || {
      address,
      displayName: `User-${address.substring(0, 4)}`,
      gamesCreated: 0,
      gamesCompleted: 0,
      gamesHelped: 0
    };
  },
  
  // Mint a new game
  mintGame: async (difficulty: DifficultyLevel, showCommentary: boolean, creatorAddress: string): Promise<SudokuGame> => {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { board, solution } = generateSudokuGame(difficulty);
    
    const newGame: SudokuGame = {
      id: `0x${Math.floor(Math.random() * 1000000).toString(16)}`,
      board,
      solution,
      difficulty,
      showCommentary,
      creator: creatorAddress,
      currentOwner: creatorAddress,
      dateCreated: new Date().toISOString(),
      bounty: 0,
      isComplete: false
    };
    
    mockGames.push(newGame);
    
    // Update user stats
    if (mockProfiles[creatorAddress]) {
      mockProfiles[creatorAddress].gamesCreated += 1;
    }
    
    return newGame;
  },
  
  // Get games for an address
  getGames: async (address?: string): Promise<SudokuGame[]> => {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    if (address) {
      return mockGames.filter(game => game.currentOwner === address);
    }
    
    return mockGames;
  },
  
  // Get a specific game
  getGame: async (gameId: string): Promise<SudokuGame | null> => {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const game = mockGames.find(g => g.id === gameId);
    return game || null;
  },
  
  // Transfer a game to another address
  transferGame: async (gameId: string, toAddress: string): Promise<boolean> => {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const gameIndex = mockGames.findIndex(g => g.id === gameId);
    if (gameIndex >= 0) {
      mockGames[gameIndex].currentOwner = toAddress;
      return true;
    }
    
    return false;
  },
  
  // Update a game's state
  updateGame: async (gameId: string, updatedBoard: number[][]): Promise<SudokuGame | null> => {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const gameIndex = mockGames.findIndex(g => g.id === gameId);
    if (gameIndex >= 0) {
      mockGames[gameIndex].board = updatedBoard;
      
      // Check if the game is complete
      let isComplete = true;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (updatedBoard[row][col] === null) {
            isComplete = false;
            break;
          }
        }
        if (!isComplete) break;
      }
      
      mockGames[gameIndex].isComplete = isComplete;
      
      if (isComplete) {
        const ownerAddress = mockGames[gameIndex].currentOwner;
        if (mockProfiles[ownerAddress]) {
          mockProfiles[ownerAddress].gamesCompleted += 1;
        }
        toast.success("Congratulations! You've completed the Sudoku puzzle!");
      }
      
      return mockGames[gameIndex];
    }
    
    return null;
  },
  
  // Set a bounty on a game
  setBounty: async (gameId: string, amount: number): Promise<boolean> => {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const gameIndex = mockGames.findIndex(g => g.id === gameId);
    if (gameIndex >= 0) {
      mockGames[gameIndex].bounty = amount;
      return true;
    }
    
    return false;
  },
  
  // Request to help with a game
  requestHelp: async (gameId: string, helperAddress: string): Promise<boolean> => {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const gameIndex = mockGames.findIndex(g => g.id === gameId);
    if (gameIndex >= 0) {
      // Add helper to the game
      if (!mockGames[gameIndex].helpers) {
        mockGames[gameIndex].helpers = [];
      }
      
      if (!mockGames[gameIndex].helpers.includes(helperAddress)) {
        mockGames[gameIndex].helpers.push(helperAddress);
      }
      
      return true;
    }
    
    return false;
  }
};

// Helper function to generate commentary
export const generateCommentary = (board: (number | null)[][], row: number, col: number, value: number | null): string => {
  if (value === null) {
    return "Removing that number opens up new possibilities.";
  }
  
  const filledCells = board.flat().filter(cell => cell !== null).length;
  const totalCells = 81;
  const progressPercentage = Math.floor((filledCells / totalCells) * 100);
  
  const messages = [
    `Placed ${value} at position [${row+1},${col+1}]. You're ${progressPercentage}% complete!`,
    `Good move! ${value} fits perfectly in this position.`,
    `That ${value} creates interesting constraints for nearby cells.`,
    `${value} is a strategic choice here. Watch how it affects the board.`,
    `Placing ${value} here narrows down possibilities in this section.`,
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

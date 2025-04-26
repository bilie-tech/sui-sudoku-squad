
import { useState, useEffect } from 'react';
import { SudokuBoard, CellValue } from '../types/sudoku';
import { isValidMove, isBoardComplete } from '../utils/sudokuGenerator';
import { generateCommentary, mockBlockchainApi } from '../utils/mockBlockchain';
import { toast } from 'sonner';
import { useToast } from '@/components/ui/use-toast';

export const useSudokuGame = (gameId: string | null) => {
  const [board, setBoard] = useState<SudokuBoard | null>(null);
  const [solution, setSolution] = useState<SudokuBoard | null>(null);
  const [initialBoard, setInitialBoard] = useState<SudokuBoard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cellErrors, setCellErrors] = useState<{ [key: string]: boolean }>({});
  const [commentary, setCommentary] = useState<string[]>([]);
  const [showCommentary, setShowCommentary] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<string>('');
  const [bounty, setBounty] = useState(0);
  const { toast: uiToast } = useToast();

  // Load game data
  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const game = await mockBlockchainApi.getGame(gameId);
        
        if (!game) {
          setError('Game not found');
          return;
        }

        setBoard(JSON.parse(JSON.stringify(game.board)));
        setSolution(JSON.parse(JSON.stringify(game.solution)));
        setInitialBoard(JSON.parse(JSON.stringify(game.board)));
        setShowCommentary(game.showCommentary);
        setIsComplete(game.isComplete);
        setDifficulty(game.difficulty);
        setBounty(game.bounty);
        
        // Reset commentary
        setCommentary([]);
      } catch (err) {
        setError('Failed to load game');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  // Handle cell changes
  const handleCellChange = (row: number, col: number, value: CellValue) => {
    if (!board || !solution || isComplete) return;
    
    // Create a copy of the board
    const newBoard = board.map(r => [...r]);
    
    // Update the cell
    newBoard[row][col] = value;
    
    // Check if the move is valid
    const errorKey = `${row}-${col}`;
    const errors = { ...cellErrors };

    if (value !== null && !isValidMove(newBoard, row, col, value, solution)) {
      errors[errorKey] = true;
      toast.error("That's not correct. Try again!");
    } else {
      delete errors[errorKey];
      
      // Add commentary if enabled
      if (showCommentary && value !== null) {
        const message = generateCommentary(newBoard, row, col, value);
        setCommentary(prev => [message, ...prev]);
      }
    }
    
    setCellErrors(errors);
    setBoard(newBoard);
    
    // Save the move to the blockchain
    saveGameState(newBoard);
  };

  // Save the game state to the blockchain
  const saveGameState = async (updatedBoard: SudokuBoard) => {
    if (!gameId) return;
    
    try {
      const savedGame = await mockBlockchainApi.updateGame(gameId, updatedBoard);
      
      if (savedGame?.isComplete) {
        setIsComplete(true);
        uiToast({
          title: "Puzzle Complete!",
          description: "Congratulations! You've solved the Sudoku puzzle!",
        });
      }
    } catch (err) {
      console.error('Failed to save game state', err);
    }
  };

  // Check if a cell is fixed (part of the initial puzzle)
  const isFixedCell = (row: number, col: number): boolean => {
    if (!initialBoard) return false;
    return initialBoard[row][col] !== null;
  };

  // Check if a cell has an error
  const hasError = (row: number, col: number): boolean => {
    return cellErrors[`${row}-${col}`] === true;
  };

  // Get unavailable numbers (already used 9 times)
  const getUnavailableNumbers = (): Set<number> => {
    if (!board) return new Set();

    const numberCounts: Record<number, number> = {};
    
    for (let i = 1; i <= 9; i++) {
      numberCounts[i] = 0;
    }
    
    for (const row of board) {
      for (const cell of row) {
        if (cell !== null) {
          numberCounts[cell]++;
        }
      }
    }
    
    const unavailable = new Set<number>();
    for (const [num, count] of Object.entries(numberCounts)) {
      if (count >= 9) {
        unavailable.add(parseInt(num));
      }
    }
    
    return unavailable;
  };

  // Set a bounty on the game
  const setBountyOnGame = async (amount: number): Promise<boolean> => {
    if (!gameId) return false;
    
    try {
      const success = await mockBlockchainApi.setBounty(gameId, amount);
      if (success) {
        setBounty(amount);
        uiToast({
          title: "Bounty Set",
          description: `A bounty of ${amount} SUI has been set on this game.`,
        });
      }
      return success;
    } catch (err) {
      console.error('Failed to set bounty', err);
      return false;
    }
  };

  return {
    board,
    initialBoard,
    isLoading,
    error,
    handleCellChange,
    isFixedCell,
    hasError,
    commentary,
    showCommentary,
    isComplete,
    difficulty,
    bounty,
    getUnavailableNumbers,
    setBountyOnGame,
  };
};

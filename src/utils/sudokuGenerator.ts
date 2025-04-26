
import { SudokuBoard, DifficultyLevel } from '../types/sudoku';

// Creates a valid, solved Sudoku board
const generateSolvedBoard = (): SudokuBoard => {
  const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
  
  // Simple backtracking algorithm to fill the board
  const fillBoard = (board: SudokuBoard): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          // Try to place a number
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              
              if (fillBoard(board)) {
                return true;
              }
              
              board[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  
  fillBoard(board);
  return board;
};

// Checks if placing a number at a position is valid
const isValid = (board: SudokuBoard, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }
  
  // Check column
  for (let y = 0; y < 9; y++) {
    if (board[y][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (board[boxRow + y][boxCol + x] === num) return false;
    }
  }
  
  return true;
};

// Shuffles an array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Create a puzzle by removing numbers from the solved board
const createPuzzle = (solution: SudokuBoard, difficulty: DifficultyLevel): SudokuBoard => {
  // Copy the solution
  const puzzle: SudokuBoard = solution.map(row => [...row]);
  
  // Define how many cells to remove based on difficulty
  const cellsToRemove = {
    'easy': 30,
    'medium': 40,
    'hard': 50,
    'expert': 60
  }[difficulty];
  
  // Remove random cells
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      removed++;
    }
  }
  
  return puzzle;
};

// Generate a full sudoku game
export const generateSudokuGame = (difficulty: DifficultyLevel): { board: SudokuBoard, solution: SudokuBoard } => {
  const solution = generateSolvedBoard();
  const board = createPuzzle(solution, difficulty);
  
  return { board, solution };
};

// Check if a move is valid against the solution
export const isValidMove = (board: SudokuBoard, row: number, col: number, value: number, solution: SudokuBoard): boolean => {
  return solution[row][col] === value;
};

// Check if the board is complete
export const isBoardComplete = (board: SudokuBoard): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        return false;
      }
    }
  }
  return true;
};

// Get a hint - returns the correct value for a random empty cell
export const getHint = (board: SudokuBoard, solution: SudokuBoard): { row: number, col: number, value: number } | null => {
  const emptyCells: { row: number, col: number }[] = [];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }
  
  if (emptyCells.length === 0) {
    return null;
  }
  
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return {
    row: randomCell.row,
    col: randomCell.col,
    value: solution[randomCell.row][randomCell.col] as number
  };
};

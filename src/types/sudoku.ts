
export type CellValue = number | null;

export type SudokuBoard = CellValue[][];

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface SudokuGame {
  id: string;
  board: SudokuBoard;
  solution: SudokuBoard;
  difficulty: DifficultyLevel;
  showCommentary: boolean;
  creator: string;
  currentOwner: string;
  dateCreated: string;
  bounty: number;
  isComplete: boolean;
  helpers?: string[];
}

export interface UserProfile {
  address: string;
  displayName: string;
  gamesCreated: number;
  gamesCompleted: number;
  gamesHelped: number;
}

export interface MintGameParams {
  difficulty: DifficultyLevel;
  showCommentary: boolean;
}

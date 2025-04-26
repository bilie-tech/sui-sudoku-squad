
import React, { useState } from 'react';
import { SudokuBoard as SudokuBoardType, CellValue } from '../types/sudoku';
import { cn } from '@/lib/utils';

interface SudokuBoardProps {
  board: SudokuBoardType;
  initialBoard: SudokuBoardType;
  onCellChange: (row: number, col: number, value: CellValue) => void;
  isFixedCell: (row: number, col: number) => boolean;
  hasError?: (row: number, col: number) => boolean;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  initialBoard,
  onCellChange,
  isFixedCell,
  hasError = () => false
}) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    if (!isFixedCell(row, col)) {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      onCellChange(row, col, null);
      return;
    }

    const num = parseInt(e.key);
    if (num >= 1 && num <= 9) {
      onCellChange(row, col, num);
    }

    // Arrow key navigation
    if (e.key === 'ArrowUp' && row > 0) {
      setSelectedCell({ row: row - 1, col });
    } else if (e.key === 'ArrowDown' && row < 8) {
      setSelectedCell({ row: row + 1, col });
    } else if (e.key === 'ArrowLeft' && col > 0) {
      setSelectedCell({ row, col: col - 1 });
    } else if (e.key === 'ArrowRight' && col < 8) {
      setSelectedCell({ row, col: col + 1 });
    }
  };

  // Calculate if a cell is in the same row, column or 3x3 box as the selected cell
  const isRelatedToSelectedCell = (row: number, col: number) => {
    if (!selectedCell) return false;
    
    const { row: selectedRow, col: selectedCol } = selectedCell;
    
    const sameRow = row === selectedRow;
    const sameCol = col === selectedCol;
    
    const sameBox = 
      Math.floor(row / 3) === Math.floor(selectedRow / 3) &&
      Math.floor(col / 3) === Math.floor(selectedCol / 3);
      
    return sameRow || sameCol || sameBox;
  };

  return (
    <div 
      className="sudoku-board" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "sudoku-cell",
              isFixedCell(rowIndex, colIndex) ? "sudoku-cell-fixed" : "cursor-pointer",
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? "sudoku-cell-selected" : "",
              isRelatedToSelectedCell(rowIndex, colIndex) ? "sudoku-cell-highlighted" : "",
              hasError(rowIndex, colIndex) ? "sudoku-cell-error" : ""
            )}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {cell !== null ? cell : ""}
          </div>
        ))
      )}
    </div>
  );
};

export default SudokuBoard;

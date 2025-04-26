
import React from 'react';
import { Card } from '@/components/ui/card';
import { SudokuGame } from '@/types/sudoku';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share, Award } from 'lucide-react';

interface GameNftCardProps {
  game: SudokuGame;
  onClick: () => void;
  onShare: () => void;
  onHelp: () => void;
  truncateAddress?: (address: string) => string;
}

const GameNftCard: React.FC<GameNftCardProps> = ({
  game,
  onClick,
  onShare,
  onHelp,
  truncateAddress = (addr) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
}) => {
  const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      case 'expert': return 'difficulty-expert';
      default: return '';
    }
  };

  const getCompletionPercentage = (): number => {
    let filledCells = 0;
    let totalCells = 0;
    
    game.board.forEach(row => {
      row.forEach(cell => {
        totalCells++;
        if (cell !== null) {
          filledCells++;
        }
      });
    });
    
    return Math.floor((filledCells / totalCells) * 100);
  };

  return (
    <Card className="nft-card p-4">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <Badge className={cn("difficulty-badge", getDifficultyClass(game.difficulty))}>
            {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
          </Badge>
          
          {game.bounty > 0 && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              {game.bounty} SUI Bounty
            </Badge>
          )}
        </div>
        
        <div className="relative mb-3 aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
          {/* Mini Sudoku preview */}
          <div className="grid grid-cols-3 gap-0.5 w-3/4 h-3/4">
            {Array(9).fill(null).map((_, index) => (
              <div key={index} className="bg-blue-200 rounded-sm" />
            ))}
          </div>
          
          {game.isComplete && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-400/30 rounded-lg">
              <Badge className="bg-green-500">Completed</Badge>
            </div>
          )}
          
          {!game.isComplete && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="outline" className="bg-white/80">
                {getCompletionPercentage()}% Complete
              </Badge>
            </div>
          )}
        </div>
        
        <div className="text-sm text-slate-600 mb-1">
          Owner: {truncateAddress(game.currentOwner)}
        </div>
        
        <div className="text-xs text-slate-500 mb-3">
          Created: {new Date(game.dateCreated).toLocaleDateString()}
        </div>
        
        <div className="mt-auto flex space-x-2">
          <Button 
            variant="default" 
            className="flex-1" 
            onClick={onClick}
          >
            Play
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={onShare}
            title="Transfer Game"
          >
            <Share className="h-4 w-4" />
          </Button>
          
          {game.bounty > 0 && !game.isComplete && (
            <Button 
              variant="outline" 
              size="icon" 
              className="text-amber-600"
              onClick={onHelp}
              title="Offer Help"
            >
              <Award className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GameNftCard;

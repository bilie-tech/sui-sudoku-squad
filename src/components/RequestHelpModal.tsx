
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SudokuGame } from '@/types/sudoku';
import { Badge } from '@/components/ui/badge';

interface RequestHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmHelp: () => void;
  game: SudokuGame | null;
  isProcessing: boolean;
}

const RequestHelpModal: React.FC<RequestHelpModalProps> = ({
  isOpen,
  onClose,
  onConfirmHelp,
  game,
  isProcessing
}) => {
  if (!game) return null;

  const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      case 'expert': return 'difficulty-expert';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Help With Puzzle</DialogTitle>
          <DialogDescription>
            Request to help solve this puzzle and earn the bounty if you complete it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Difficulty:</span>
            <Badge className={getDifficultyClass(game.difficulty)}>
              {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium">Bounty:</span>
            <span className="font-mono">{game.bounty} SUI</span>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-md text-sm">
            <p className="text-amber-800">
              By continuing, you'll be requesting access to help solve this puzzle. 
              The bounty will be awarded to you upon successful completion.
            </p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirmHelp}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Request to Help'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestHelpModal;

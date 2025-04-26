
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SudokuBoard from '@/components/SudokuBoard';
import NumberControls from '@/components/NumberControls';
import { useSudokuGame } from '@/hooks/useSudokuGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CellValue } from '@/types/sudoku';
import CommentaryPanel from '@/components/CommentaryPanel';
import { Award, ArrowLeft, Share } from 'lucide-react';
import TransferGameModal from '@/components/TransferGameModal';
import SetBountyModal from '@/components/SetBountyModal';
import { mockBlockchainApi } from '@/utils/mockBlockchain';
import { toast } from 'sonner';

const Game = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
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
  } = useSudokuGame(id || null);
  
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showBountyModal, setShowBountyModal] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSettingBounty, setIsSettingBounty] = useState(false);
  
  const handleNumberSelect = (number: number) => {
    if (selectedCell) {
      handleCellChange(selectedCell.row, selectedCell.col, number);
    }
  };
  
  const handleClear = () => {
    if (selectedCell) {
      handleCellChange(selectedCell.row, selectedCell.col, null);
    }
  };
  
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  
  const handleCellSelect = (row: number, col: number, value: CellValue) => {
    setSelectedCell({ row, col });
    // No automatic value setting here, just selection
  };
  
  const handleTransferGame = async (recipient: string) => {
    if (!id) return;
    
    setIsTransferring(true);
    
    try {
      const success = await mockBlockchainApi.transferGame(id, recipient);
      
      if (success) {
        toast.success("Game transferred successfully!");
        setShowTransferModal(false);
        // Redirect to gallery after short delay
        setTimeout(() => navigate('/games'), 1500);
      } else {
        toast.error("Failed to transfer game.");
      }
    } catch (err) {
      console.error('Transfer error', err);
      toast.error("An error occurred during transfer.");
    } finally {
      setIsTransferring(false);
    }
  };
  
  const handleSetBounty = async (amount: number) => {
    setIsSettingBounty(true);
    
    try {
      const success = await setBountyOnGame(amount);
      
      if (success) {
        toast.success(`Bounty of ${amount} SUI set successfully!`);
        setShowBountyModal(false);
      } else {
        toast.error("Failed to set bounty.");
      }
    } catch (err) {
      console.error('Bounty setting error', err);
      toast.error("An error occurred while setting bounty.");
    } finally {
      setIsSettingBounty(false);
    }
  };
  
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
    <div className="container max-w-4xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/games')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Games
        </Button>
        
        <div className="flex items-center gap-2">
          {!isLoading && difficulty && (
            <Badge className={getDifficultyClass(difficulty)}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          )}
          
          {!isLoading && bounty > 0 && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              {bounty} SUI Bounty
            </Badge>
          )}
          
          {!isLoading && isComplete && (
            <Badge className="bg-green-500">Completed</Badge>
          )}
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => navigate('/games')}>Back to Gallery</Button>
            </div>
          ) : (
            <>
              {board && initialBoard && (
                <div>
                  <SudokuBoard
                    board={board}
                    initialBoard={initialBoard}
                    onCellChange={handleCellChange}
                    isFixedCell={isFixedCell}
                    hasError={hasError}
                  />
                  
                  <NumberControls
                    onNumberSelect={handleNumberSelect}
                    onClear={handleClear}
                    unavailableNumbers={getUnavailableNumbers()}
                  />
                  
                  <CommentaryPanel messages={commentary} show={showCommentary} />
                  
                  <div className="mt-6 flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => setShowTransferModal(true)}
                    >
                      <Share className="h-4 w-4" /> Transfer
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => setShowBountyModal(true)}
                      disabled={isComplete}
                    >
                      <Award className="h-4 w-4" /> 
                      {bounty > 0 ? `Update Bounty (${bounty} SUI)` : 'Set Bounty'}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      <TransferGameModal 
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransfer={handleTransferGame}
        isTransferring={isTransferring}
      />
      
      <SetBountyModal
        isOpen={showBountyModal}
        onClose={() => setShowBountyModal(false)}
        onSetBounty={handleSetBounty}
        isProcessing={isSettingBounty}
        currentBounty={bounty}
      />
    </div>
  );
};

export default Game;

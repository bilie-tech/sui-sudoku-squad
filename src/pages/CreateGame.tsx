
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameOptions from '@/components/GameOptions';
import { DifficultyLevel } from '@/types/sudoku';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { suiBlockchain } from '@/utils/suiBlockchain';
import { toast } from 'sonner';

const CreateGame: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [showCommentary, setShowCommentary] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  
  const handleMint = async () => {
    setIsMinting(true);
    
    try {
      // Get the current user
      const user = await suiBlockchain.getCurrentUser();
      
      // Mint a new game on the Sui blockchain
      const newGame = await suiBlockchain.mintGame(difficulty, showCommentary, user.address);
      
      toast.success("Sudoku NFT game created successfully!");
      
      // Navigate to the new game
      setTimeout(() => navigate(`/game/${newGame.id}`), 500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Sudoku NFT game.");
      setIsMinting(false);
    }
  };
  
  return (
    <div className="container max-w-xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Sudoku NFT</CardTitle>
          <CardDescription>
            Mint a new Sudoku puzzle as an NFT and start playing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GameOptions 
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            showCommentary={showCommentary}
            setShowCommentary={setShowCommentary}
            onMint={handleMint}
            isMinting={isMinting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGame;

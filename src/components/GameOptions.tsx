
import React from 'react';
import { DifficultyLevel } from '../types/sudoku';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface GameOptionsProps {
  difficulty: DifficultyLevel;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  showCommentary: boolean;
  setShowCommentary: (show: boolean) => void;
  onMint: () => void;
  isMinting: boolean;
}

const GameOptions: React.FC<GameOptionsProps> = ({
  difficulty,
  setDifficulty,
  showCommentary,
  setShowCommentary,
  onMint,
  isMinting
}) => {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <h2 className="text-lg font-medium mb-3">Select Difficulty</h2>
        <RadioGroup 
          value={difficulty}
          onValueChange={(value) => setDifficulty(value as DifficultyLevel)}
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="easy" id="easy" />
            <Label htmlFor="easy" className="cursor-pointer">
              <span className="difficulty-badge difficulty-easy">Easy</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="cursor-pointer">
              <span className="difficulty-badge difficulty-medium">Medium</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hard" id="hard" />
            <Label htmlFor="hard" className="cursor-pointer">
              <span className="difficulty-badge difficulty-hard">Hard</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expert" id="expert" />
            <Label htmlFor="expert" className="cursor-pointer">
              <span className="difficulty-badge difficulty-expert">Expert</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-4">
        <Switch
          id="commentary"
          checked={showCommentary}
          onCheckedChange={setShowCommentary}
        />
        <Label htmlFor="commentary">Enable Commentary</Label>
      </div>

      <Button 
        className="w-full" 
        onClick={onMint} 
        disabled={isMinting}
      >
        {isMinting ? "Creating Sudoku NFT..." : "Mint Sudoku NFT Game"}
      </Button>
    </div>
  );
};

export default GameOptions;


import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SetBountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetBounty: (amount: number) => void;
  isProcessing: boolean;
  currentBounty?: number;
}

const SetBountyModal: React.FC<SetBountyModalProps> = ({
  isOpen,
  onClose,
  onSetBounty,
  isProcessing,
  currentBounty = 0
}) => {
  const [bountyAmount, setBountyAmount] = useState(currentBounty.toString());
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bountyAmount);
    if (!isNaN(amount) && amount > 0) {
      onSetBounty(amount);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Reward Bounty</DialogTitle>
          <DialogDescription>
            Set a SUI token reward for players who help solve this puzzle.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bounty">Bounty Amount (SUI)</Label>
            <Input
              id="bounty"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={bountyAmount}
              onChange={(e) => setBountyAmount(e.target.value)}
            />
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing || isNaN(parseFloat(bountyAmount)) || parseFloat(bountyAmount) <= 0}
            >
              {isProcessing ? 'Setting Bounty...' : 'Set Bounty'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SetBountyModal;

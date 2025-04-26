
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

interface TransferGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (recipient: string) => void;
  isTransferring: boolean;
}

const TransferGameModal: React.FC<TransferGameModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  isTransferring
}) => {
  const [recipient, setRecipient] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipient.trim()) {
      onTransfer(recipient.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Sudoku Game</DialogTitle>
          <DialogDescription>
            Send this game to another player's wallet address.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isTransferring}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!recipient.trim() || isTransferring}
            >
              {isTransferring ? 'Transferring...' : 'Transfer Game'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferGameModal;


import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface NumberControlsProps {
  onNumberSelect: (number: number) => void;
  onClear: () => void;
  unavailableNumbers?: Set<number>;
}

const NumberControls: React.FC<NumberControlsProps> = ({
  onNumberSelect,
  onClear,
  unavailableNumbers = new Set()
}) => {
  return (
    <div className="flex flex-col items-center mt-4">
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            className={cn(
              "w-12 h-12 text-xl font-mono",
              unavailableNumbers.has(num) ? "opacity-50" : ""
            )}
            onClick={() => onNumberSelect(num)}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          className="w-12 h-12 text-sm font-mono"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default NumberControls;

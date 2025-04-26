
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CommentaryPanelProps {
  messages: string[];
  show: boolean;
}

const CommentaryPanel: React.FC<CommentaryPanelProps> = ({ messages, show }) => {
  if (!show || messages.length === 0) return null;
  
  return (
    <div className="mt-4 bg-slate-50 rounded-lg p-3 border border-slate-200">
      <div className="flex items-center gap-2 text-slate-700 mb-2">
        <MessageSquare className="h-4 w-4" />
        <h3 className="text-sm font-medium">Commentary</h3>
      </div>
      
      <ScrollArea className="h-32">
        <div className="space-y-2 pr-4">
          {messages.map((message, index) => (
            <p key={index} className="text-sm text-slate-600">
              {message}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CommentaryPanel;

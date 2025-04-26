
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SudokuGame } from '@/types/sudoku';
import { mockBlockchainApi } from '@/utils/mockBlockchain';
import GameNftCard from '@/components/GameNftCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import TransferGameModal from '@/components/TransferGameModal';
import { toast } from 'sonner';
import RequestHelpModal from '@/components/RequestHelpModal';

const GameGallery: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<SudokuGame[]>([]);
  const [myGames, setMyGames] = useState<SudokuGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRequestHelpModal, setShowRequestHelpModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<SudokuGame | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ address: string } | null>(null);
  
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      
      try {
        // Get current user
        const user = await mockBlockchainApi.getCurrentUser();
        setCurrentUser(user);
        
        // Get all games
        const allGames = await mockBlockchainApi.getGames();
        setGames(allGames);
        
        // Get user's games
        const userGames = await mockBlockchainApi.getGames(user.address);
        setMyGames(userGames);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load games.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGames();
  }, []);
  
  const handleTransferGame = async (recipient: string) => {
    if (!selectedGame) return;
    
    setIsTransferring(true);
    
    try {
      const success = await mockBlockchainApi.transferGame(selectedGame.id, recipient);
      
      if (success) {
        toast.success("Game transferred successfully!");
        setShowTransferModal(false);
        
        // Update games list
        const updatedGames = games.map(game => 
          game.id === selectedGame.id ? { ...game, currentOwner: recipient } : game
        );
        setGames(updatedGames);
        
        // Update my games list
        const updatedMyGames = myGames.filter(game => game.id !== selectedGame.id);
        setMyGames(updatedMyGames);
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
  
  const handleRequestHelp = async () => {
    if (!selectedGame || !currentUser) return;
    
    setIsProcessing(true);
    
    try {
      const success = await mockBlockchainApi.requestHelp(selectedGame.id, currentUser.address);
      
      if (success) {
        toast.success("Help request sent! You can now help solve this puzzle.");
        setShowRequestHelpModal(false);
        
        // Navigate to the game
        navigate(`/game/${selectedGame.id}`);
      } else {
        toast.error("Failed to request help.");
      }
    } catch (err) {
      console.error('Help request error', err);
      toast.error("An error occurred while requesting help.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const filteredGames = (activeTab === 'all' ? games : myGames).filter(game => {
    if (!searchQuery) return true;
    
    // Simple search by difficulty or id
    return (
      game.difficulty.includes(searchQuery.toLowerCase()) ||
      game.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  const handleShare = (game: SudokuGame) => {
    setSelectedGame(game);
    setShowTransferModal(true);
  };
  
  const handleHelp = (game: SudokuGame) => {
    setSelectedGame(game);
    setShowRequestHelpModal(true);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sudoku Games</h1>
          <p className="text-slate-600">Explore and play Sudoku games on the Sui blockchain</p>
        </div>
        
        <Button 
          className="flex items-center gap-2" 
          onClick={() => navigate('/create')}
        >
          <PlusCircle className="h-4 w-4" /> Create New Game
        </Button>
      </div>
      
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="mine">My Games</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search games..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <p className="text-center py-8">Loading games...</p>
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">No games found</p>
                <Button onClick={() => navigate('/create')}>Create Your First Game</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map(game => (
                  <GameNftCard
                    key={game.id}
                    game={game}
                    onClick={() => navigate(`/game/${game.id}`)}
                    onShare={() => handleShare(game)}
                    onHelp={() => handleHelp(game)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="mine" className="mt-6">
            {isLoading ? (
              <p className="text-center py-8">Loading your games...</p>
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">You don't have any games yet</p>
                <Button onClick={() => navigate('/create')}>Create Your First Game</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map(game => (
                  <GameNftCard
                    key={game.id}
                    game={game}
                    onClick={() => navigate(`/game/${game.id}`)}
                    onShare={() => handleShare(game)}
                    onHelp={() => handleHelp(game)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <TransferGameModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransfer={handleTransferGame}
        isTransferring={isTransferring}
      />
      
      <RequestHelpModal
        isOpen={showRequestHelpModal}
        onClose={() => setShowRequestHelpModal(false)}
        onConfirmHelp={handleRequestHelp}
        game={selectedGame}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default GameGallery;

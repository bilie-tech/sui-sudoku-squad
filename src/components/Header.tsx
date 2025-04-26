
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { suiBlockchain } from '@/utils/suiBlockchain';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const user = await suiBlockchain.getCurrentUser();
        setUserAddress(user.address);
      } catch (error) {
        console.error('Not connected', error);
        // Silently fail on initial load
      }
    };
    
    checkConnection();
  }, []);
  
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      const { address } = await suiBlockchain.connectWallet();
      setUserAddress(address);
      toast.success('Connected to Sui wallet successfully!');
    } catch (error) {
      console.error('Failed to connect wallet', error);
      toast.error('Failed to connect to Sui wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = async () => {
    try {
      const success = await suiBlockchain.disconnectWallet();
      if (success) {
        setUserAddress(null);
        toast.success('Wallet disconnected successfully');
      }
    } catch (error) {
      console.error('Failed to disconnect wallet', error);
      toast.error('Failed to disconnect wallet. Please try again.');
    }
  };
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="container flex justify-between items-center h-16">
        <div className="flex items-center gap-1">
          <Link to="/" className="text-xl font-bold text-blue-600">
            SUI Sudoku Squad
          </Link>
        </div>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/games" 
            className={`text-sm font-medium transition-colors ${
              isActive('/games') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Games
          </Link>
          
          <Link 
            to="/create" 
            className={`text-sm font-medium transition-colors ${
              isActive('/create') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Create
          </Link>
          
          {userAddress ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="font-mono">
                {truncateAddress(userAddress)}
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={handleDisconnect}
                title="Disconnect Wallet"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

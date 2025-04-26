
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900">
                  Sudoku on the <span className="text-blue-600">Sui</span> Blockchain
                </h1>
                
                <p className="text-xl text-slate-600">
                  Mint, play, and trade Sudoku puzzles as NFTs. Earn rewards by helping others complete challenging puzzles.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    size="lg"
                    className="px-8"
                    onClick={() => navigate('/games')}
                  >
                    Browse Games
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8"
                    onClick={() => navigate('/create')}
                  >
                    Create New Game
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto">
                  <div className="grid grid-cols-3 gap-1 aspect-square">
                    {Array(9).fill(null).map((_, index) => (
                      <div 
                        key={index}
                        className={`rounded ${
                          [0, 2, 6, 8].includes(index) 
                            ? 'bg-blue-200' 
                            : index === 4 
                              ? 'bg-blue-500' 
                              : 'bg-blue-300'
                        } aspect-square flex items-center justify-center text-white font-bold text-2xl`}
                      >
                        {index === 4 ? 'SUI' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Mint NFT Puzzles</h3>
                <p className="text-slate-600">Create unique Sudoku puzzles with varying difficulty levels and own them as NFTs on the Sui blockchain.</p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Share & Trade</h3>
                <p className="text-slate-600">Transfer puzzles to friends or trade them with other players in the Sui Sudoku community.</p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
                <p className="text-slate-600">Set bounties for difficult puzzles and earn rewards by helping others complete challenging games.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-slate-50">
          <div className="container max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-8">Ready to Play?</h2>
            <Button 
              size="lg" 
              className="px-8"
              onClick={() => navigate('/create')}
            >
              Create Your First Sudoku NFT
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="container text-center">
          <p>SUI Sudoku Squad © 2023 - A blockchain-based Sudoku game powered by the Sui network</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

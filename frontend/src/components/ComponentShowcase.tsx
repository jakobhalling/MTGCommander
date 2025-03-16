import React, { useState } from 'react';
import Card from './Card';
import Zone from './Zone';
import PlayerArea from './PlayerArea';
import GameBoard from './GameBoard';
import { mockCards, mockPlayers, mockGameState } from '../mockData';
import { CardType } from '../types/game';

const ComponentShowcase: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('cards');
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };

  return (
    <div className="component-showcase p-4">
      <h1 className="text-2xl font-bold mb-4">MTG Commander Component Showcase</h1>
      
      {/* Tab Navigation */}
      <div className="tabs flex border-b mb-4">
        <button 
          className={`px-4 py-2 ${selectedTab === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('cards')}
        >
          Cards
        </button>
        <button 
          className={`px-4 py-2 ${selectedTab === 'zones' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('zones')}
        >
          Zones
        </button>
        <button 
          className={`px-4 py-2 ${selectedTab === 'players' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('players')}
        >
          Player Areas
        </button>
        <button 
          className={`px-4 py-2 ${selectedTab === 'gameboard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedTab('gameboard')}
        >
          Game Board
        </button>
      </div>
      
      {/* Selected Card Display */}
      {selectedCard && (
        <div className="selected-card-details bg-gray-100 p-4 mb-4 rounded-md">
          <h2 className="text-xl font-bold">{selectedCard.name}</h2>
          <div className="flex">
            <div className="w-1/4">
              {selectedCard.imageUrl && (
                <img 
                  src={selectedCard.imageUrl} 
                  alt={selectedCard.name} 
                  className="w-full rounded-md"
                />
              )}
            </div>
            <div className="w-3/4 pl-4">
              <p><strong>Type:</strong> {selectedCard.type}</p>
              {selectedCard.manaCost && <p><strong>Mana Cost:</strong> {selectedCard.manaCost}</p>}
              {selectedCard.power && selectedCard.toughness && (
                <p><strong>P/T:</strong> {selectedCard.power}/{selectedCard.toughness}</p>
              )}
              {selectedCard.text && (
                <div>
                  <strong>Text:</strong>
                  <p className="whitespace-pre-line">{selectedCard.text}</p>
                </div>
              )}
              <button 
                className="mt-2 px-2 py-1 bg-red-500 text-white rounded-md"
                onClick={() => setSelectedCard(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Content based on selected tab */}
      <div className="tab-content">
        {selectedTab === 'cards' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Card Components</h2>
            <div className="card-examples grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mockCards.map(card => (
                <div key={card.id} className="card-example">
                  <Card card={card} onClick={handleCardClick} />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold">Card States</h3>
              <div className="card-states grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div>
                  <p className="mb-1">Normal</p>
                  <Card card={mockCards[0]} onClick={handleCardClick} />
                </div>
                <div>
                  <p className="mb-1">Tapped</p>
                  <Card card={mockCards[0]} isTapped={true} onClick={handleCardClick} />
                </div>
                <div>
                  <p className="mb-1">Selected</p>
                  <Card card={mockCards[0]} isSelected={true} onClick={handleCardClick} />
                </div>
                <div>
                  <p className="mb-1">Tapped & Selected</p>
                  <Card card={mockCards[0]} isTapped={true} isSelected={true} onClick={handleCardClick} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'zones' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Zone Components</h2>
            <div className="zone-examples grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold">Hand Zone</h3>
                <Zone 
                  name="hand" 
                  playerId="player1" 
                  cards={mockCards.slice(0, 3)} 
                  onCardClick={handleCardClick}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">Battlefield Zone</h3>
                <Zone 
                  name="battlefield" 
                  playerId="player1" 
                  cards={mockCards.slice(5, 7)} 
                  onCardClick={handleCardClick}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">Graveyard Zone</h3>
                <Zone 
                  name="graveyard" 
                  playerId="player1" 
                  cards={[mockCards[3]]} 
                  onCardClick={handleCardClick}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">Exile Zone</h3>
                <Zone 
                  name="exile" 
                  playerId="player1" 
                  cards={[]} 
                  onCardClick={handleCardClick}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">Command Zone</h3>
                <Zone 
                  name="command-zone" 
                  playerId="player1" 
                  cards={[mockCards[6]]} 
                  onCardClick={handleCardClick}
                />
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'players' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Player Area Components</h2>
            <div className="player-examples grid grid-cols-1 gap-4">
              {mockPlayers.map((player, index) => (
                <div key={player.id}>
                  <h3 className="text-lg font-bold">{player.name} ({player.isActive ? 'Active' : 'Inactive'})</h3>
                  <PlayerArea 
                    player={player} 
                    position={index === 0 ? 'bottom' : 'top'} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedTab === 'gameboard' && (
          <div>
            <h2 className="text-xl font-bold mb-2">Game Board Component</h2>
            <div className="game-board-example">
              <GameBoard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentShowcase; 
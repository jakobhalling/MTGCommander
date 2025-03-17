import React from 'react';
import { useSelector } from 'react-redux';
import { GameBoardProps, PlayerType, CardType, PlayerPosition } from '../types/game';
import PlayerArea from './PlayerArea';
import Zone from './Zone';
import { RootState } from '../store';

const GameBoard: React.FC<GameBoardProps> = () => {
  // Get game state from Redux store
  const gameState = useSelector((state: RootState) => state.game.currentGame);
  
  // Convert players record to array for rendering
  const players: PlayerType[] = gameState ? 
    Object.values(gameState.players).map(player => ({
      id: player.id,
      name: player.name,
      life: player.life,
      isActive: player.id === gameState.activePlayer,
      poisonCounters: 0, // Add this from player state when implemented
      hand: [], // These will be populated from the zones when implemented
      graveyard: [],
      exile: [],
      battlefield: [],
      commandZone: []
    })) : [];
  
  // For now, we'll use empty arrays for shared zones
  const battlefield: CardType[] = [];
  const commandZone: CardType[] = [];
  
  const handleCardClick = (card: CardType) => {
    // This will be implemented later with game actions
    console.log('Card clicked:', card);
  };

  // Determine player positions based on number of players
  const getPlayerPosition = (index: number, totalPlayers: number): PlayerPosition => {
    if (totalPlayers <= 2) {
      return index === 0 ? 'bottom' : 'top';
    } else if (totalPlayers <= 4) {
      const positions: PlayerPosition[] = ['bottom', 'top', 'left', 'right'];
      return positions[index % positions.length];
    } else {
      // For more than 4 players, we'd need a more complex layout
      return 'bottom';
    }
  };

  return (
    <div className="game-board grid" data-testid="game-board">
      {/* Player areas */}
      <div className="player-areas">
        {players.map((player: PlayerType, index: number) => (
          <PlayerArea 
            key={player.id} 
            player={player} 
            position={getPlayerPosition(index, players.length)} 
          />
        ))}
      </div>
      
      {/* Shared zones */}
      <div className="shared-zones">
        <Zone 
          name="battlefield" 
          playerId="shared" 
          cards={battlefield} 
          onCardClick={handleCardClick}
        />
        
        <Zone 
          name="command-zone" 
          playerId="shared" 
          cards={commandZone} 
          onCardClick={handleCardClick}
        />
      </div>
      
      {/* Game info and phase indicators will be added here */}
      <div className="game-info">
        <div className="turn-indicator">
          Turn: {gameState?.turnNumber || 1}
        </div>
        <div className="phase-indicator">
          Phase: {gameState?.phase || 'main1'}
        </div>
        <div className="active-player-indicator">
          Active Player: {players.find((p: PlayerType) => p.id === gameState?.activePlayer)?.name || 'None'}
        </div>
      </div>
    </div>
  );
};

export default GameBoard; 
import React from 'react';
import { PlayerAreaProps, CardType } from '../types/game';
import Zone from './Zone';

const PlayerArea: React.FC<PlayerAreaProps> = ({ player, position }) => {
  const handleCardClick = (card: CardType) => {
    // This will be implemented later with game actions
    console.log('Card clicked:', card);
  };

  const playerClasses = [
    'player-area',
    `player-position-${position}`,
    player.isActive ? 'active-player' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={playerClasses}
      data-testid={`player-area-${player.id}`}
    >
      <div className="player-info">
        <div className="player-name">{player.name}</div>
        <div className="player-life">
          <span className="life-label">Life:</span>
          <span className="life-value">{player.life}</span>
        </div>
        {player.poisonCounters && player.poisonCounters > 0 && (
          <div className="player-poison">
            <span className="poison-label">Poison:</span>
            <span className="poison-value">{player.poisonCounters}</span>
          </div>
        )}
      </div>
      
      <div className="player-zones">
        <Zone 
          name="hand" 
          playerId={player.id} 
          cards={player.hand || []} 
          onCardClick={handleCardClick}
        />
        
        <Zone 
          name="graveyard" 
          playerId={player.id} 
          cards={player.graveyard || []} 
          onCardClick={handleCardClick}
        />
        
        <Zone 
          name="exile" 
          playerId={player.id} 
          cards={player.exile || []} 
          onCardClick={handleCardClick}
        />
      </div>
    </div>
  );
};

export default PlayerArea; 
import React from 'react';
import { ZoneProps, CardType } from '../types/game';
import Card from './Card';

const Zone: React.FC<ZoneProps> = ({ 
  name, 
  playerId, 
  cards, 
  onCardClick 
}) => {
  const handleCardClick = (card: CardType) => {
    if (onCardClick) {
      onCardClick(card);
    }
  };

  // Format zone name for display (capitalize first letter)
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  
  // Apply zone-specific styles
  const zoneClasses = [
    'zone',
    `zone-${name}`
  ].join(' ');

  return (
    <div 
      className={zoneClasses}
      data-testid={`${name}-${playerId}`}
    >
      <div className="zone-header">
        <h3>{displayName}</h3>
        <span className="card-count">{cards.length}</span>
      </div>
      <div className="zone-content">
        {cards.map(card => (
          <Card 
            key={card.id} 
            card={card} 
            isTapped={card.isTapped}
            onClick={handleCardClick}
          />
        ))}
        {cards.length === 0 && (
          <div className="zone-empty">Empty</div>
        )}
      </div>
    </div>
  );
};

export default Zone; 
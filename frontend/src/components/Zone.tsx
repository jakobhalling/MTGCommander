import React from 'react';
import { ZoneProps, CardType } from '../types/game';
import Card from './Card';
import {
  Tile,
  Tag,
  OverflowMenu,
  OverflowMenuItem
} from '@carbon/react';

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
  ].filter(Boolean).join(' ');

  return (
    <Tile 
      className={zoneClasses}
      data-testid={`${name}-${playerId}`}
    >
      <div className="zone-header">
        <div className="flex items-center">
          <h3>{displayName}</h3>
          <Tag type="gray" className="ml-2">{cards.length}</Tag>
        </div>
        <OverflowMenu flipped>
          <OverflowMenuItem itemText="View All" />
          <OverflowMenuItem itemText="Sort" />
          <OverflowMenuItem itemText="Filter" />
        </OverflowMenu>
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
    </Tile>
  );
};

export default Zone;
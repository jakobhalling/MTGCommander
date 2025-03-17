import React from 'react';
import { CardProps } from '../types/game';

const Card: React.FC<CardProps> = ({ 
  card, 
  isTapped = false, 
  isSelected = false,
  onClick,
  onContextMenu
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onContextMenu) {
      onContextMenu(card, e);
    }
  };

  const cardClasses = [
    'card',
    isTapped ? 'tapped' : '',
    isSelected ? 'selected' : '',
    card.type ? `card-type-${card.type.toLowerCase().replace(/\s+/g, '-')}` : 'card-type-unknown'
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      data-testid={`card-${card.id}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {card.imageUrl ? (
        <div className="card-with-image">
          <img 
            src={card.imageUrl} 
            alt={card.name} 
            className="card-image"
          />
          <div className="card-name-overlay">{card.name}</div>
        </div>
      ) : (
        <div className="card-fallback">
          <div className="card-name">{card.name}</div>
          <div className="card-type">{card.type || 'Unknown'}</div>
          {card.manaCost && <div className="card-mana-cost">{card.manaCost}</div>}
          {card.text && <div className="card-text">{card.text}</div>}
          {(card.power && card.toughness) && (
            <div className="card-pt">{card.power}/{card.toughness}</div>
          )}
          {card.loyalty && <div className="card-loyalty">{card.loyalty}</div>}
        </div>
      )}
    </div>
  );
};

export default Card; 
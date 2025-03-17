import React from 'react';
import { CardType } from '../types/game';
import {
  AspectRatio,
  Tile,
  Tag
} from '@carbon/react';

interface CardProps {
  card: CardType;
  isTapped?: boolean;
  isSelected?: boolean;
  onClick?: (card: CardType) => void;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  isTapped = false, 
  isSelected = false,
  onClick 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  const cardClasses = [
    'card',
    isTapped ? 'tapped' : '',
    isSelected ? 'selected' : ''
  ].filter(Boolean).join(' ');

  return (
    <Tile 
      className={cardClasses}
      onClick={handleClick}
      interactive
      light
    >
      <AspectRatio ratio="2x3">
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.name}
            className="card-image"
          />
        ) : (
          <div className="card-placeholder">
            <h4>{card.name}</h4>
            {card.manaCost && (
              <Tag type="blue">{card.manaCost}</Tag>
            )}
            {card.type && (
              <Tag type="gray">{card.type}</Tag>
            )}
            {card.power && card.toughness && (
              <Tag type="magenta">{card.power}/{card.toughness}</Tag>
            )}
          </div>
        )}
      </AspectRatio>

      {/* Status Indicators */}
      {isTapped && (
        <Tag type="magenta" className="card-status">
          Tapped
        </Tag>
      )}
      {isSelected && (
        <Tag type="purple" className="card-status">
          Selected
        </Tag>
      )}
      {card.counters && Object.entries(card.counters).map(([type, count]) => (
        <Tag key={type} type="cyan" className="card-counter">
          {type}: {count}
        </Tag>
      ))}
    </Tile>
  );
};

export default Card;
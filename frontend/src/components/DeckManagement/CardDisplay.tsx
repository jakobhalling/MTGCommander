import React from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import { Card } from '../../store/slices/deckSlice';
import { Tile } from '@carbon/react';

interface CardDisplayProps {
  card: Card;
  isCommander?: boolean;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, isCommander = false }) => {
  return (
    <Tile className={`card-display ${isCommander ? 'commander-card' : ''}`}>
      {card.imageUrl ? (
        <img 
          src={card.imageUrl} 
          alt={card.name} 
          className="card-image"
        />
      ) : (
        <div className="card-placeholder">
          <h4>{card.name}</h4>
          {card.manaCost && <p className="mana-cost">{card.manaCost}</p>}
          {card.type && <p className="card-type">{card.type}</p>}
          {card.text && <p className="card-text">{card.text}</p>}
          {(card.power && card.toughness) && (
            <p className="power-toughness">{card.power}/{card.toughness}</p>
          )}
          {card.loyalty && <p className="loyalty">Loyalty: {card.loyalty}</p>}
        </div>
      )}
    </Tile>
  );
};

export default CardDisplay;

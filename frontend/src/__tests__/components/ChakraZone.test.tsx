import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ChakraZone from '../../components/ChakraZone';
import theme from '../../theme';

// Mock the ChakraCard component to simplify testing
jest.mock('../../components/ChakraCard', () => {
  return function MockChakraCard({ card, isSelected, isTapped, onClick, onContextMenu }: any) {
    return (
      <div 
        data-testid={`card-${card.id}`}
        data-selected={isSelected}
        data-tapped={isTapped}
        onClick={() => onClick && onClick(card)}
        onContextMenu={(e) => onContextMenu && onContextMenu(e)}
      >
        {card.name}
      </div>
    );
  };
});

// Mock card data
const mockCards = [
  {
    id: 'card-1',
    name: 'Test Card 1',
    type: 'Creature',
    imageUrl: 'https://example.com/card1.jpg',
  },
  {
    id: 'card-2',
    name: 'Test Card 2',
    type: 'Instant',
    imageUrl: 'https://example.com/card2.jpg',
  },
];

describe('ChakraZone Component', () => {
  const renderZone = (props = {}) => {
    return render(
      <ChakraProvider theme={theme}>
        <ChakraZone
          id="test-zone"
          name="Test Zone"
          cards={mockCards}
          {...props}
        />
      </ChakraProvider>
    );
  };

  it('renders the zone with correct name and card count', () => {
    renderZone();
    
    expect(screen.getByText('Test Zone (2)')).toBeInTheDocument();
  });

  it('renders all cards in the zone', () => {
    renderZone();
    
    expect(screen.getByText('Test Card 1')).toBeInTheDocument();
    expect(screen.getByText('Test Card 2')).toBeInTheDocument();
  });

  it('displays "Empty" when there are no cards', () => {
    renderZone({ cards: [] });
    
    expect(screen.getByText('Test Zone (0)')).toBeInTheDocument();
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('calls onCardClick when a card is clicked', () => {
    const handleCardClick = jest.fn();
    renderZone({ onCardClick: handleCardClick });
    
    fireEvent.click(screen.getByTestId('card-card-1'));
    expect(handleCardClick).toHaveBeenCalledWith(mockCards[0]);
  });

  it('calls onCardContextMenu when right-clicking a card', () => {
    const handleCardContextMenu = jest.fn();
    renderZone({ onCardContextMenu: handleCardContextMenu });
    
    fireEvent.contextMenu(screen.getByTestId('card-card-1'));
    expect(handleCardContextMenu).toHaveBeenCalled();
  });

  it('passes selectedCardIds to cards correctly', () => {
    renderZone({ selectedCardIds: ['card-1'] });
    
    const card1 = screen.getByTestId('card-card-1');
    const card2 = screen.getByTestId('card-card-2');
    
    expect(card1).toHaveAttribute('data-selected', 'true');
    expect(card2).toHaveAttribute('data-selected', 'false');
  });

  it('passes tappedCardIds to cards correctly', () => {
    renderZone({ tappedCardIds: ['card-2'] });
    
    const card1 = screen.getByTestId('card-card-1');
    const card2 = screen.getByTestId('card-card-2');
    
    expect(card1).toHaveAttribute('data-tapped', 'false');
    expect(card2).toHaveAttribute('data-tapped', 'true');
  });
}); 
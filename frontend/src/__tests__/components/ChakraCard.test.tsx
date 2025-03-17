import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ChakraCard from '../../components/ChakraCard';
import theme from '../../theme';

// Mock card data
const mockCard = {
  id: 'test-card-1',
  name: 'Test Card',
  type: 'Creature - Human Wizard',
  imageUrl: 'https://example.com/card.jpg',
  power: '2',
  toughness: '3',
  text: 'When this creature enters the battlefield, draw a card.',
  colorIdentity: ['U'],
  counters: {
    '+1/+1': 2,
  },
};

describe('ChakraCard Component', () => {
  // Helper function to render the component with Chakra Provider
  const renderCard = (props = {}) => {
    return render(
      <ChakraProvider theme={theme}>
        <ChakraCard 
          card={mockCard} 
          {...props} 
        />
      </ChakraProvider>
    );
  };

  it('renders the card with correct name and type', () => {
    renderCard();
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Creature - Human Wizard')).toBeInTheDocument();
  });

  it('displays the card image when imageUrl is provided', () => {
    renderCard();
    
    const image = screen.getByAltText('Test Card');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/card.jpg');
  });

  it('displays a color placeholder when no imageUrl is provided', () => {
    const cardWithoutImage = { ...mockCard, imageUrl: undefined };
    render(
      <ChakraProvider theme={theme}>
        <ChakraCard card={cardWithoutImage} />
      </ChakraProvider>
    );
    
    // The card name should appear in the placeholder
    const placeholderText = screen.getAllByText('Test Card');
    expect(placeholderText.length).toBeGreaterThan(0);
  });

  it('applies tapped styling when isTapped is true', () => {
    renderCard({ isTapped: true });
    
    const card = screen.getByTestId('card-test-card-1');
    expect(card).toHaveStyle('transform: rotate(90deg)');
  });

  it('applies selected styling when isSelected is true', () => {
    renderCard({ isSelected: true });
    
    const card = screen.getByTestId('card-test-card-1');
    expect(card).toHaveStyle('box-shadow: var(--chakra-shadows-lg)');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    renderCard({ onClick: handleClick });
    
    fireEvent.click(screen.getByTestId('card-test-card-1'));
    expect(handleClick).toHaveBeenCalledWith(mockCard);
  });

  it('calls onContextMenu handler when right-clicked', () => {
    const handleContextMenu = jest.fn();
    renderCard({ onContextMenu: handleContextMenu });
    
    fireEvent.contextMenu(screen.getByTestId('card-test-card-1'));
    expect(handleContextMenu).toHaveBeenCalled();
  });

  it('displays power/toughness badge', () => {
    renderCard();
    
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('displays counters when present', () => {
    renderCard();
    
    expect(screen.getByText('2 +1/+1')).toBeInTheDocument();
  });
}); 
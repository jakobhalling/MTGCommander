import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../../components/Card';

describe('Card Component', () => {
  const mockCard = {
    id: 'card1',
    name: 'Test Card',
    imageUrl: 'test-url.jpg',
    type: 'Creature',
    power: '2',
    toughness: '2',
    manaCost: '{1}{G}',
    text: 'Test card text'
  };

  test('renders card with correct name', () => {
    render(<Card card={mockCard} />);
    
    const cardElement = screen.getByTestId(`card-${mockCard.id}`);
    expect(cardElement).toBeInTheDocument();
    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
  });

  test('shows card image when available', () => {
    render(<Card card={mockCard} />);
    
    const cardImage = screen.getByAltText(mockCard.name);
    expect(cardImage).toBeInTheDocument();
    expect(cardImage).toHaveAttribute('src', mockCard.imageUrl);
  });

  test('shows fallback when image not available', () => {
    const cardWithoutImage = { ...mockCard, imageUrl: undefined };
    render(<Card card={cardWithoutImage} />);
    
    // Should show card name as fallback
    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockCard.power}/${mockCard.toughness}`)).toBeInTheDocument();
  });

  test('applies tapped class when card is tapped', () => {
    render(<Card card={mockCard} isTapped={true} />);
    
    const cardElement = screen.getByTestId(`card-${mockCard.id}`);
    expect(cardElement).toHaveClass('tapped');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Card card={mockCard} onClick={handleClick} />);
    
    const cardElement = screen.getByTestId(`card-${mockCard.id}`);
    fireEvent.click(cardElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockCard);
  });
}); 
import React from 'react';
import { render, screen } from '@testing-library/react';
import Zone from '../../components/Zone';

describe('Zone Component', () => {
  test('renders zone with correct name', () => {
    render(
      <Zone 
        name="hand" 
        playerId="player1" 
        cards={[]} 
      />
    );
    
    const zoneElement = screen.getByTestId('hand-player1');
    expect(zoneElement).toBeInTheDocument();
    expect(screen.getByText('Hand')).toBeInTheDocument();
  });

  test('renders cards when provided', () => {
    const mockCards = [
      { id: 'card1', name: 'Test Card 1', imageUrl: 'test-url-1.jpg', type: 'Creature' },
      { id: 'card2', name: 'Test Card 2', imageUrl: 'test-url-2.jpg', type: 'Instant' }
    ];
    
    render(
      <Zone 
        name="hand" 
        playerId="player1" 
        cards={mockCards} 
      />
    );
    
    // Check that cards are rendered
    expect(screen.getAllByTestId(/card-/)).toHaveLength(2);
  });

  test('applies correct zone-specific styles', () => {
    render(
      <Zone 
        name="battlefield" 
        playerId="player1" 
        cards={[]} 
      />
    );
    
    const zoneElement = screen.getByTestId('battlefield-player1');
    expect(zoneElement).toHaveClass('zone-battlefield');
  });
}); 
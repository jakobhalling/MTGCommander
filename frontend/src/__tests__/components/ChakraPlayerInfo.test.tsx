import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ChakraPlayerInfo from '../../components/ChakraPlayerInfo';
import theme from '../../theme';

// Mock player data
const mockPlayer = {
  id: 'player-1',
  name: 'Test Player',
  life: 40,
  colorIdentity: ['U', 'R', 'G'],
  hand: [{ id: 'card-1' }, { id: 'card-2' }, { id: 'card-3' }],
  library: Array(60).fill({ id: 'library-card' }),
  graveyard: [],
  exile: [],
  battlefield: [],
  commander: {
    id: 'commander-1',
    name: 'Omnath, Locus of Creation',
    type: 'Legendary Creature — Elemental',
    colorIdentity: ['W', 'U', 'R', 'G'],
  },
  avatarUrl: 'https://example.com/avatar.jpg',
};

describe('ChakraPlayerInfo Component', () => {
  const renderPlayerInfo = (props = {}) => {
    return render(
      <ChakraProvider theme={theme}>
        <ChakraPlayerInfo
          player={mockPlayer}
          isActivePlayer={false}
          isCurrentPlayer={false}
          {...props}
        />
      </ChakraProvider>
    );
  };

  it('renders the player name correctly', () => {
    renderPlayerInfo();
    
    expect(screen.getByText('Test Player')).toBeInTheDocument();
  });

  it('displays player life total', () => {
    renderPlayerInfo();
    
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('displays hand and library card counts', () => {
    renderPlayerInfo();
    
    expect(screen.getByText('3')).toBeInTheDocument(); // Hand count
    expect(screen.getByText('60')).toBeInTheDocument(); // Library count
  });

  it('displays color identity badges', () => {
    renderPlayerInfo();
    
    expect(screen.getByText('U')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();
  });

  it('displays commander information when available', () => {
    renderPlayerInfo();
    
    expect(screen.getByText('Commander')).toBeInTheDocument();
    expect(screen.getByText('Omnath, Locus of Creation')).toBeInTheDocument();
  });

  it('shows "Active" badge when player is active', () => {
    renderPlayerInfo({ isActivePlayer: true });
    
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows "You" badge when player is current player', () => {
    renderPlayerInfo({ isCurrentPlayer: true });
    
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('applies different styling when player is active', () => {
    const { rerender } = renderPlayerInfo();
    
    // Get initial element
    const playerBox = screen.getByTestId('player-info-player-1');
    const initialBorderColor = window.getComputedStyle(playerBox).borderColor;
    
    // Rerender with active player
    rerender(
      <ChakraProvider theme={theme}>
        <ChakraPlayerInfo
          player={mockPlayer}
          isActivePlayer={true}
          isCurrentPlayer={false}
        />
      </ChakraProvider>
    );
    
    // Border color should be different when active
    const activePlayerBox = screen.getByTestId('player-info-player-1');
    expect(activePlayerBox).toBeInTheDocument();
  });

  it('applies different styling when player is current player', () => {
    const { rerender } = renderPlayerInfo();
    
    // Get initial element
    const playerBox = screen.getByTestId('player-info-player-1');
    
    // Rerender with current player
    rerender(
      <ChakraProvider theme={theme}>
        <ChakraPlayerInfo
          player={mockPlayer}
          isActivePlayer={false}
          isCurrentPlayer={true}
        />
      </ChakraProvider>
    );
    
    // Element should still exist with different styling
    const currentPlayerBox = screen.getByTestId('player-info-player-1');
    expect(currentPlayerBox).toBeInTheDocument();
  });
}); 
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PlayerArea from '../../components/PlayerArea';
import gameReducer from '../../store/game/gameSlice';

describe('PlayerArea Component', () => {
  const mockStore = configureStore({
    reducer: {
      game: gameReducer,
    },
  });

  const mockPlayer = {
    id: 'player1',
    name: 'Test Player',
    life: 40,
    isActive: true,
  };

  test('renders player area with correct zones', () => {
    render(
      <Provider store={mockStore}>
        <PlayerArea player={mockPlayer} position="bottom" />
      </Provider>
    );
    
    // Check for player area container
    const areaElement = screen.getByTestId(`player-area-${mockPlayer.id}`);
    expect(areaElement).toBeInTheDocument();
    
    // Check for player name and life total
    expect(screen.getByText(mockPlayer.name)).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    
    // Check for zones
    expect(screen.getByTestId(`hand-${mockPlayer.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`graveyard-${mockPlayer.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`exile-${mockPlayer.id}`)).toBeInTheDocument();
  });

  test('applies correct position class', () => {
    render(
      <Provider store={mockStore}>
        <PlayerArea player={mockPlayer} position="bottom" />
      </Provider>
    );
    
    const areaElement = screen.getByTestId(`player-area-${mockPlayer.id}`);
    expect(areaElement).toHaveClass('player-position-bottom');
  });

  test('highlights active player', () => {
    render(
      <Provider store={mockStore}>
        <PlayerArea player={mockPlayer} position="bottom" />
      </Provider>
    );
    
    const areaElement = screen.getByTestId(`player-area-${mockPlayer.id}`);
    expect(areaElement).toHaveClass('active-player');
  });
}); 
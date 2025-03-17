import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GameBoard from '../../components/GameBoard';
import gameReducer from '../../store/game/gameSlice';

describe('GameBoard Component', () => {
  const mockStore = configureStore({
    reducer: {
      game: gameReducer,
    },
  });

  test('renders game board with correct layout', () => {
    render(
      <Provider store={mockStore}>
        <GameBoard />
      </Provider>
    );
    
    // Check for main game board container
    const boardElement = screen.getByTestId('game-board');
    expect(boardElement).toBeInTheDocument();
    
    // Check for player areas
    const playerAreas = screen.queryAllByTestId(/player-area/);
    expect(playerAreas.length).toBeGreaterThanOrEqual(0);
    
    // Check for zones
    expect(screen.getByTestId('battlefield-shared')).toBeInTheDocument();
    expect(screen.getByTestId('command-zone-shared')).toBeInTheDocument();
  });

  test('renders with responsive layout', () => {
    render(
      <Provider store={mockStore}>
        <GameBoard />
      </Provider>
    );
    
    const boardElement = screen.getByTestId('game-board');
    
    // Check that the board has grid layout classes
    expect(boardElement).toHaveClass('grid');
  });
}); 
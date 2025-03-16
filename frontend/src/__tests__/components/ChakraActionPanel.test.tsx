import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import configureStore from 'redux-mock-store';
import ChakraActionPanel from '../../components/ChakraActionPanel';
import theme from '../../theme';

// Mock the ChakraActionButton component
jest.mock('../../components/ChakraActionButton', () => {
  return function MockActionButton({ action, onActionClick }: any) {
    return (
      <button
        data-testid={`action-button-${action.id}`}
        onClick={() => onActionClick(action)}
      >
        {action.name}
      </button>
    );
  };
});

// Create mock store
const mockStore = configureStore([]);

// Mock actions
const mockActions = [
  {
    id: 'draw-1',
    type: 'DRAW',
    name: 'Draw Card',
    description: 'Draw a card from your library',
    targets: [],
    validate: () => ({ valid: true }),
    execute: () => {},
  },
  {
    id: 'play-1',
    type: 'PLAY',
    name: 'Play Land',
    description: 'Play a land from your hand',
    targets: ['land-1'],
    validate: () => ({ valid: true }),
    execute: () => {},
  },
  {
    id: 'attack-1',
    type: 'ATTACK',
    name: 'Attack with Creature',
    description: 'Attack with selected creature',
    targets: ['creature-1'],
    validate: () => ({ valid: true }),
    execute: () => {},
  },
];

describe('ChakraActionPanel Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      game: {
        availableActions: mockActions,
        phase: 'MAIN_1',
      },
    });
    
    // Mock the selectors
    jest.mock('../../store/game/selectors', () => ({
      selectAvailableActions: (state: any) => state.game.availableActions,
      selectGamePhase: (state: any) => state.game.phase,
    }));
  });

  const renderPanel = () => {
    return render(
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <ChakraActionPanel />
        </ChakraProvider>
      </Provider>
    );
  };

  it('renders the action panel with correct heading', () => {
    renderPanel();
    
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays the current game phase', () => {
    renderPanel();
    
    expect(screen.getByText('Phase: MAIN_1')).toBeInTheDocument();
  });

  it('renders action buttons for each available action', () => {
    renderPanel();
    
    expect(screen.getByText('Draw Card')).toBeInTheDocument();
    expect(screen.getByText('Play Land')).toBeInTheDocument();
    expect(screen.getByText('Attack with Creature')).toBeInTheDocument();
  });

  it('groups actions by type', () => {
    renderPanel();
    
    expect(screen.getByText('Draw Actions')).toBeInTheDocument();
    expect(screen.getByText('Play Actions')).toBeInTheDocument();
    expect(screen.getByText('Attack Actions')).toBeInTheDocument();
  });

  it('dispatches executeAction when an action button is clicked', () => {
    renderPanel();
    
    fireEvent.click(screen.getByTestId('action-button-draw-1'));
    
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe('EXECUTE_ACTION');
    expect(actions[0].payload).toEqual(mockActions[0]);
  });

  it('displays "No actions available" when there are no actions', () => {
    store = mockStore({
      game: {
        availableActions: [],
        phase: 'MAIN_1',
      },
    });
    
    renderPanel();
    
    expect(screen.getByText('No actions available in this phase')).toBeInTheDocument();
  });

  it('shows the last selected action', () => {
    renderPanel();
    
    fireEvent.click(screen.getByTestId('action-button-draw-1'));
    
    expect(screen.getByText('Last action: Draw Card')).toBeInTheDocument();
  });
}); 
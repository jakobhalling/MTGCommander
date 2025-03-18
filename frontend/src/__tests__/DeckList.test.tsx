import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import deckReducer from '../store/slices/deckSlice';
import DeckList from '../components/DeckManagement/DeckList';
import { BrowserRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ 
    data: [
      { 
        id: 1, 
        name: 'Test Deck 1', 
        cards: [], 
        commander: null, 
        createdAt: '2025-03-17T12:00:00Z' 
      },
      { 
        id: 2, 
        name: 'Test Deck 2', 
        cards: [{ id: 1, name: 'Sol Ring' }], 
        commander: { id: 1, name: 'Sol Ring' }, 
        createdAt: '2025-03-17T13:00:00Z' 
      }
    ] 
  })),
  delete: jest.fn(() => Promise.resolve({})),
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('DeckList Component', () => {
  const renderComponent = () => {
    const store = configureStore({
      reducer: {
        decks: deckReducer,
      },
      preloadedState: {
        decks: {
          decks: [],
          currentDeck: null,
          loading: false,
          error: null,
          importStatus: 'idle'
        }
      }
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <DeckList />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders deck list when data is loaded', async () => {
    renderComponent();
    
    // Initially should show loading
    expect(screen.getByText('Loading decks...')).toBeInTheDocument();
    
    // After data is loaded, should show deck list
    await waitFor(() => {
      expect(screen.getByText('My Decks')).toBeInTheDocument();
      expect(screen.getByText('Test Deck 1')).toBeInTheDocument();
      expect(screen.getByText('Test Deck 2')).toBeInTheDocument();
    });
  });

  test('navigates to deck detail when View button is clicked', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Test Deck 1')).toBeInTheDocument();
    });
    
    // Find and click the View button for the first deck
    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);
    
    // Should navigate to deck detail page
    expect(mockNavigate).toHaveBeenCalledWith('/decks/1');
  });

  test('opens delete modal when delete button is clicked', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Test Deck 1')).toBeInTheDocument();
    });
    
    // Find and click the delete button for the first deck
    const deleteButtons = screen.getAllByRole('button', { name: /TrashCan/ });
    fireEvent.click(deleteButtons[0]);
    
    // Should open delete confirmation modal
    expect(screen.getByText('Are you sure you want to delete this deck?')).toBeInTheDocument();
  });
});

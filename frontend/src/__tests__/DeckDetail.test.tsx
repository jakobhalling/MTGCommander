import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import deckReducer from '../store/slices/deckSlice';
import DeckDetail from '../components/DeckManagement/DeckDetail';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ 
    data: { 
      id: 1, 
      name: 'Test Deck', 
      cards: [
        { id: 1, name: 'Sol Ring', type: 'Artifact', text: 'Tap: Add {C}{C}.', imageUrl: null },
        { id: 2, name: 'Command Tower', type: 'Land', text: 'Tap: Add one mana of any color in your commander\'s color identity.', imageUrl: null }
      ],
      commanderId: 1,
      commander: { id: 1, name: 'Sol Ring', type: 'Artifact', text: 'Tap: Add {C}{C}.', imageUrl: null },
      createdAt: '2025-03-17T12:00:00Z'
    } 
  })),
  put: jest.fn(() => Promise.resolve({})),
  delete: jest.fn(() => Promise.resolve({})),
}));

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

describe('DeckDetail Component', () => {
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
          <Routes>
            <Route path="*" element={<DeckDetail />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders deck details when data is loaded', async () => {
    renderComponent();
    
    // Initially should show loading
    expect(screen.getByText('Loading deck...')).toBeInTheDocument();
    
    // After data is loaded, should show deck details
    await waitFor(() => {
      expect(screen.getByText('Test Deck')).toBeInTheDocument();
      expect(screen.getByText('Commander: Sol Ring')).toBeInTheDocument();
      expect(screen.getByText('Cards: 2')).toBeInTheDocument();
    });
  });

  test('opens edit name modal when Edit Name button is clicked', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Test Deck')).toBeInTheDocument();
    });
    
    // Find and click the Edit Name button
    const editNameButton = screen.getByText('Edit Name');
    fireEvent.click(editNameButton);
    
    // Should open edit name modal
    await waitFor(() => {
      expect(screen.getByText('Edit Deck Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Deck Name')).toBeInTheDocument();
    });
  });

  test('opens set commander modal when Set Commander button is clicked', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Test Deck')).toBeInTheDocument();
    });
    
    // Find and click the Set Commander button
    const setCommanderButton = screen.getByText('Set Commander');
    fireEvent.click(setCommanderButton);
    
    // Should open set commander modal
    await waitFor(() => {
      expect(screen.getByText('Set Commander')).toBeInTheDocument();
      expect(screen.getByText('Select Commander')).toBeInTheDocument();
    });
  });
});

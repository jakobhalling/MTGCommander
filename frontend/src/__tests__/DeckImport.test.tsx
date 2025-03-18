import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import deckReducer from '../store/slices/deckSlice';
import DeckImport from '../components/DeckManagement/DeckImport';
import { BrowserRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { id: 1, name: 'Test Deck', cards: [] } })),
  get: jest.fn(() => Promise.resolve({ data: [] })),
}));

describe('DeckImport Component', () => {
  const renderComponent = () => {
    const store = configureStore({
      reducer: {
        decks: deckReducer,
      },
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <DeckImport />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders import form', () => {
    renderComponent();
    expect(screen.getByText('Import Deck')).toBeInTheDocument();
    expect(screen.getByLabelText('Deck Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Deck List')).toBeInTheDocument();
    expect(screen.getByText('Import Deck')).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    renderComponent();
    
    // Try to submit without filling the form
    const submitButton = screen.getByText('Import Deck');
    fireEvent.click(submitButton);
    
    // Form should not submit with empty fields
    expect(screen.queryByText('Importing deck...')).not.toBeInTheDocument();
    
    // Fill the form
    fireEvent.change(screen.getByLabelText('Deck Name'), {
      target: { value: 'My Test Deck' },
    });
    
    fireEvent.change(screen.getByLabelText('Deck List'), {
      target: { value: '1 Sol Ring\n1 Command Tower' },
    });
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.queryByText('Importing deck...')).toBeInTheDocument();
    });
  });
});

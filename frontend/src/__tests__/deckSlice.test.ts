import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import deckReducer, {
  fetchDecks,
  fetchDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
  importDeck,
  setCommander,
  addCardToDeck,
  removeCardFromDeck
} from '../store/slices/deckSlice';

// Mock axios
jest.mock('axios');

describe('Deck Slice', () => {
  const initialState = {
    decks: [],
    currentDeck: null,
    loading: false,
    error: null,
    importStatus: 'idle'
  };

  test('should return the initial state', () => {
    expect(deckReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test('should handle fetchDecks.pending', () => {
    const action = { type: fetchDecks.pending.type };
    const state = deckReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('should handle fetchDecks.fulfilled', () => {
    const mockDecks = [
      { id: 1, name: 'Test Deck 1', cards: [] },
      { id: 2, name: 'Test Deck 2', cards: [] }
    ];
    const action = { type: fetchDecks.fulfilled.type, payload: mockDecks };
    const state = deckReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.decks).toEqual(mockDecks);
  });

  test('should handle fetchDecks.rejected', () => {
    const action = { type: fetchDecks.rejected.type, payload: 'Error message' };
    const state = deckReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error message');
  });

  test('should handle fetchDeckById.fulfilled', () => {
    const mockDeck = { id: 1, name: 'Test Deck', cards: [] };
    const action = { type: fetchDeckById.fulfilled.type, payload: mockDeck };
    const state = deckReducer(initialState, action);
    expect(state.currentDeck).toEqual(mockDeck);
  });

  test('should handle createDeck.fulfilled', () => {
    const mockDeck = { id: 1, name: 'New Deck', cards: [] };
    const action = { type: createDeck.fulfilled.type, payload: mockDeck };
    const state = deckReducer(initialState, action);
    expect(state.decks).toContain(mockDeck);
    expect(state.currentDeck).toEqual(mockDeck);
  });

  test('should handle deleteDeck.fulfilled', () => {
    const stateWithDecks = {
      ...initialState,
      decks: [
        { id: 1, name: 'Test Deck 1', cards: [] },
        { id: 2, name: 'Test Deck 2', cards: [] }
      ]
    };
    const action = { type: deleteDeck.fulfilled.type, payload: 1 };
    const state = deckReducer(stateWithDecks, action);
    expect(state.decks).toHaveLength(1);
    expect(state.decks[0].id).toBe(2);
  });

  test('should handle importDeck.fulfilled', () => {
    const mockDeck = { id: 1, name: 'Imported Deck', cards: [] };
    const action = { type: importDeck.fulfilled.type, payload: mockDeck };
    const state = deckReducer(initialState, action);
    expect(state.importStatus).toBe('succeeded');
    expect(state.decks).toContain(mockDeck);
    expect(state.currentDeck).toEqual(mockDeck);
  });
});

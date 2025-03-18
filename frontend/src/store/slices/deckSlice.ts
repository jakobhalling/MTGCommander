import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import meta from 'vite-meta';

const API_URL = import.meta.env.VITE_API_URL;
const base_url = API_URL;

// Types
export interface Card {
  id: number;
  name: string;
  scryfallId: string;
  imageUrl?: string;
  manaCost?: string;
  type?: string;
  text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  isCommander: boolean;
}

export interface Deck {
  id: number;
  name: string;
  commanderId: number;
  commander?: Card;
  cards: Card[];
  createdAt: string;
  updatedAt?: string;
}

interface DeckState {
  decks: Deck[];
  currentDeck: Deck | null;
  loading: boolean;
  error: string | null;
  importStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Initial state
const initialState: DeckState = {
  decks: [],
  currentDeck: null,
  loading: false,
  error: null,
  importStatus: 'idle'
};

// Thunks
export const fetchDecks = createAsyncThunk(
  'decks/fetchDecks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(base_url + '/decks');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch decks');
    }
  }
);

export const fetchDeckById = createAsyncThunk(
  'decks/fetchDeckById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(base_url + `/decks/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(`Failed to fetch deck with id ${id}`);
    }
  }
);

export const createDeck = createAsyncThunk(
  'decks/createDeck',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(base_url + '/decks', { name });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create deck');
    }
  }
);

export const updateDeck = createAsyncThunk(
  'decks/updateDeck',
  async ({ id, name }: { id: number; name: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(base_url + `/decks/${id}`, { name });
      return response.data;
    } catch (error) {
      return rejectWithValue(`Failed to update deck with id ${id}`);
    }
  }
);

export const deleteDeck = createAsyncThunk(
  'decks/deleteDeck',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/decks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(`Failed to delete deck with id ${id}`);
    }
  }
);

export const importDeck = createAsyncThunk(
  'decks/importDeck',
  async ({ name, deckText }: { name: string; deckText: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(base_url + '/api/decks/import', { name, deckText });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to import deck');
    }
  }
);

export const setCommander = createAsyncThunk(
  'decks/setCommander',
  async ({ deckId, cardId }: { deckId: number; cardId: number }, { rejectWithValue }) => {
    try {
      await axios.put(base_url + `/decks/${deckId}/commander`, { cardId });
      return { deckId, cardId };
    } catch (error) {
      return rejectWithValue(`Failed to set commander for deck with id ${deckId}`);
    }
  }
);

export const addCardToDeck = createAsyncThunk(
  'decks/addCardToDeck',
  async ({ deckId, cardName, set }: { deckId: number; cardName: string; set?: string }, { rejectWithValue }) => {
    try {
      await axios.post(base_url + `/decks/${deckId}/cards`, { cardName, set });
      // Refetch the deck to get the updated card list
      const response = await axios.get(`/api/decks/${deckId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(`Failed to add card to deck with id ${deckId}`);
    }
  }
);

export const removeCardFromDeck = createAsyncThunk(
  'decks/removeCardFromDeck',
  async ({ deckId, cardId }: { deckId: number; cardId: number }, { rejectWithValue }) => {
    try {
      await axios.delete(base_url + `/decks/${deckId}/cards/${cardId}`);
      // Refetch the deck to get the updated card list
      const response = await axios.get(`/api/decks/${deckId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(`Failed to remove card from deck with id ${deckId}`);
    }
  }
);

// Slice
const deckSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    clearCurrentDeck: (state) => {
      state.currentDeck = null;
    },
    resetImportStatus: (state) => {
      state.importStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch decks
      .addCase(fetchDecks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDecks.fulfilled, (state, action: PayloadAction<Deck[]>) => {
        state.loading = false;
        state.decks = action.payload;
      })
      .addCase(fetchDecks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch deck by id
      .addCase(fetchDeckById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeckById.fulfilled, (state, action: PayloadAction<Deck>) => {
        state.loading = false;
        state.currentDeck = action.payload;
      })
      .addCase(fetchDeckById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create deck
      .addCase(createDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeck.fulfilled, (state, action: PayloadAction<Deck>) => {
        state.loading = false;
        state.decks.push(action.payload);
        state.currentDeck = action.payload;
      })
      .addCase(createDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update deck
      .addCase(updateDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeck.fulfilled, (state, action: PayloadAction<Deck>) => {
        state.loading = false;
        const index = state.decks.findIndex(deck => deck.id === action.payload.id);
        if (index !== -1) {
          state.decks[index] = action.payload;
        }
        if (state.currentDeck?.id === action.payload.id) {
          state.currentDeck = action.payload;
        }
      })
      .addCase(updateDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete deck
      .addCase(deleteDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeck.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.decks = state.decks.filter(deck => deck.id !== action.payload);
        if (state.currentDeck?.id === action.payload) {
          state.currentDeck = null;
        }
      })
      .addCase(deleteDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Import deck
      .addCase(importDeck.pending, (state) => {
        state.importStatus = 'loading';
        state.error = null;
      })
      .addCase(importDeck.fulfilled, (state, action: PayloadAction<Deck>) => {
        state.importStatus = 'succeeded';
        state.decks.push(action.payload);
        state.currentDeck = action.payload;
      })
      .addCase(importDeck.rejected, (state, action) => {
        state.importStatus = 'failed';
        state.error = action.payload as string;
      })
      
      // Set commander
      .addCase(setCommander.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setCommander.fulfilled, (state, action: PayloadAction<{ deckId: number; cardId: number }>) => {
        state.loading = false;
        // We'll need to refetch the deck to get the updated commander
        // This is handled in the component after this action completes
      })
      .addCase(setCommander.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add card to deck
      .addCase(addCardToDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCardToDeck.fulfilled, (state, action: PayloadAction<Deck>) => {
        state.loading = false;
        const index = state.decks.findIndex(deck => deck.id === action.payload.id);
        if (index !== -1) {
          state.decks[index] = action.payload;
        }
        if (state.currentDeck?.id === action.payload.id) {
          state.currentDeck = action.payload;
        }
      })
      .addCase(addCardToDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove card from deck
      .addCase(removeCardFromDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCardFromDeck.fulfilled, (state, action: PayloadAction<Deck>) => {
        state.loading = false;
        const index = state.decks.findIndex(deck => deck.id === action.payload.id);
        if (index !== -1) {
          state.decks[index] = action.payload;
        }
        if (state.currentDeck?.id === action.payload.id) {
          state.currentDeck = action.payload;
        }
      })
      .addCase(removeCardFromDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentDeck, resetImportStatus } = deckSlice.actions;
export default deckSlice.reducer;

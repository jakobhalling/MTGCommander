import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '../../types/game/GameState';
import {
  GAME_ACTIONS,
  SetPhasePayload,
  UpdatePlayerPayload,
  UpdateLifeTotalPayload,
  UpdateCommanderDamagePayload,
  UpdateZonePayload,
  MoveCardPayload,
  UpdateCardPayload,
  CardCounterPayload,
  CardAttachmentPayload
} from './types';

interface GameSliceState {
  currentGame: GameState | null;
}

const initialState: GameSliceState = {
  currentGame: null
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Game Flow Actions
    setGame: (state, action: PayloadAction<GameState>) => {
      state.currentGame = action.payload;
    },
    clearGame: (state) => {
      state.currentGame = null;
    },
    setPhase: (state, action: PayloadAction<SetPhasePayload>) => {
      if (state.currentGame) {
        state.currentGame.phase = action.payload.phase;
      }
    },
    setActivePlayer: (state, action: PayloadAction<string>) => {
      if (state.currentGame) {
        state.currentGame.activePlayer = action.payload;
      }
    },
    incrementTurn: (state) => {
      if (state.currentGame) {
        state.currentGame.turnNumber += 1;
      }
    },

    // Player Actions
    updatePlayer: (state, action: PayloadAction<UpdatePlayerPayload>) => {
      if (state.currentGame?.players[action.payload.playerId]) {
        Object.assign(
          state.currentGame.players[action.payload.playerId],
          action.payload.updates
        );
      }
    },
    updateLifeTotal: (state, action: PayloadAction<UpdateLifeTotalPayload>) => {
      if (state.currentGame?.players[action.payload.playerId]) {
        state.currentGame.players[action.payload.playerId].life += action.payload.delta;
      }
    },
    updateCommanderDamage: (state, action: PayloadAction<UpdateCommanderDamagePayload>) => {
      if (state.currentGame?.players[action.payload.playerId]) {
        state.currentGame.players[action.payload.playerId].commanderDamage[action.payload.commanderId] = 
          action.payload.damage;
      }
    },

    // Zone Actions
    updateZone: (state, action: PayloadAction<UpdateZonePayload>) => {
      if (state.currentGame) {
        const zone = Object.values(state.currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .find(zone => zone.id === action.payload.zoneId);
        
        if (zone) {
          Object.assign(zone, action.payload.updates);
        }
      }
    },
    moveCard: (state, action: PayloadAction<MoveCardPayload>) => {
      if (state.currentGame) {
        const { cardId, fromZoneId, toZoneId } = action.payload;
        
        // Find the zones
        const fromZone = Object.values(state.currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .find(zone => zone.id === fromZoneId);
        
        const toZone = Object.values(state.currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .find(zone => zone.id === toZoneId);

        if (fromZone && toZone) {
          // Remove from source zone
          fromZone.cards = fromZone.cards.filter(id => id !== cardId);
          // Add to destination zone
          toZone.cards.push(cardId);
        }
      }
    },

    // Card Actions
    updateCard: (state, action: PayloadAction<UpdateCardPayload>) => {
      if (state.currentGame) {
        const card = Object.values(state.currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .flatMap(zone => zone.cards)
          .find(card => card === action.payload.cardId);

        if (card) {
          Object.assign(card, action.payload.updates);
        }
      }
    },
    tapCard: (state, action: PayloadAction<string>) => {
      if (state.currentGame) {
        const cardId = action.payload;
        // Find the card and toggle its tapped state
        Object.values(state.currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .flatMap(zone => zone.cards)
          .filter(card => card === cardId)
          .forEach(card => {
            if (typeof card === 'object' && card !== null) {
              (card as any).isTapped = !(card as any).isTapped;
            }
          });
      }
    },
    addCounter: (state, action: PayloadAction<CardCounterPayload>) => {
      if (state.currentGame) {
        const { cardId, counterType, amount } = action.payload;
        // Find the card and add counters
        Object.values(state.currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .flatMap(zone => zone.cards)
          .filter(card => card === cardId)
          .forEach(card => {
            if (typeof card === 'object' && card !== null) {
              const cardState = card as any;
              cardState.counters = cardState.counters || {};
              cardState.counters[counterType] = (cardState.counters[counterType] || 0) + amount;
            }
          });
      }
    },
    removeCounter: (state, action: PayloadAction<CardCounterPayload>) => {
      if (state.currentGame) {
        const { cardId, counterType, amount } = action.payload;
        // Find the card and remove counters
        Object.values(state.currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .flatMap(zone => zone.cards)
          .filter(card => card === cardId)
          .forEach(card => {
            if (typeof card === 'object' && card !== null) {
              const cardState = card as any;
              if (cardState.counters?.[counterType]) {
                cardState.counters[counterType] = Math.max(0, cardState.counters[counterType] - amount);
                if (cardState.counters[counterType] === 0) {
                  delete cardState.counters[counterType];
                }
              }
            }
          });
      }
    },
    attachCard: (state, action: PayloadAction<CardAttachmentPayload>) => {
      if (state.currentGame) {
        const { cardId, attachmentId } = action.payload;
        // Find the card and add attachment
        Object.values(state.currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .flatMap(zone => zone.cards)
          .filter(card => card === cardId)
          .forEach(card => {
            if (typeof card === 'object' && card !== null) {
              const cardState = card as any;
              if (!cardState.attachments.includes(attachmentId)) {
                cardState.attachments.push(attachmentId);
              }
            }
          });
      }
    },
    detachCard: (state, action: PayloadAction<CardAttachmentPayload>) => {
      if (state.currentGame) {
        const { cardId, attachmentId } = action.payload;
        // Find the card and remove attachment
        Object.values(state.currentGame.players)
          .flatMap(player => Object.values(player.zones))
          .flatMap(zone => zone.cards)
          .filter(card => card === cardId)
          .forEach(card => {
            if (typeof card === 'object' && card !== null) {
              const cardState = card as any;
              cardState.attachments = cardState.attachments.filter(
                (id: string) => id !== attachmentId
              );
            }
          });
      }
    }
  }
});

export const {
  setGame,
  clearGame,
  setPhase,
  setActivePlayer,
  incrementTurn,
  updatePlayer,
  updateLifeTotal,
  updateCommanderDamage,
  updateZone,
  moveCard,
  updateCard,
  tapCard,
  addCounter,
  removeCounter,
  attachCard,
  detachCard
} = gameSlice.actions;

export default gameSlice.reducer; 
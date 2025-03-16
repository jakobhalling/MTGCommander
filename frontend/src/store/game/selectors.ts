import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { GameState, PlayerState, ZoneState, CardState } from '../../types/game/GameState';

// Basic Selectors
export const selectCurrentGame = (state: RootState): GameState | null => state.game.currentGame;

export const selectGameId = createSelector(
  selectCurrentGame,
  (game): string | null => game?.id ?? null
);

export const selectActivePlayer = createSelector(
  selectCurrentGame,
  (game): string | null => game?.activePlayer ?? null
);

export const selectCurrentPhase = createSelector(
  selectCurrentGame,
  (game): string | null => game?.phase ?? null
);

export const selectTurnNumber = createSelector(
  selectCurrentGame,
  (game): number | null => game?.turnNumber ?? null
);

// Player Selectors
export const selectPlayers = createSelector(
  selectCurrentGame,
  (game): Record<string, PlayerState> => game?.players ?? {}
);

export const selectPlayerById = (playerId: string) => createSelector(
  selectPlayers,
  (players): PlayerState | null => players[playerId] ?? null
);

export const selectPlayerLife = (playerId: string) => createSelector(
  selectPlayerById(playerId),
  (player): number | null => player?.life ?? null
);

export const selectPlayerCommanderDamage = (playerId: string) => createSelector(
  selectPlayerById(playerId),
  (player): Record<string, number> => player?.commanderDamage ?? {}
);

// Zone Selectors
export const selectAllZones = createSelector(
  selectPlayers,
  (players): ZoneState[] => 
    Object.values(players).flatMap(player => Object.values(player.zones))
);

export const selectZoneById = (zoneId: string) => createSelector(
  selectAllZones,
  (zones): ZoneState | null => 
    zones.find(zone => zone.id === zoneId) ?? null
);

export const selectZonesByType = (zoneType: string) => createSelector(
  selectAllZones,
  (zones): ZoneState[] => 
    zones.filter(zone => zone.type === zoneType)
);

export const selectPlayerZones = (playerId: string) => createSelector(
  selectPlayerById(playerId),
  (player): Record<string, ZoneState> | null => player?.zones ?? null
);

// Card Selectors
export const selectCardsByZone = (zoneId: string) => createSelector(
  selectZoneById(zoneId),
  (zone): string[] => zone?.cards ?? []
);

export const selectCardById = (cardId: string) => createSelector(
  selectAllZones,
  (zones): CardState | null => {
    for (const zone of zones) {
      const card = zone.cards.find(c => typeof c === 'object' && (c as CardState).id === cardId);
      if (card) return card as CardState;
    }
    return null;
  }
);

export const selectCardLocation = (cardId: string) => createSelector(
  selectAllZones,
  (zones): { zoneId: string; ownerId: string } | null => {
    for (const zone of zones) {
      if (zone.cards.includes(cardId)) {
        return { zoneId: zone.id, ownerId: zone.ownerId };
      }
    }
    return null;
  }
);

export const selectCardsByOwner = (playerId: string) => createSelector(
  selectAllZones,
  (zones): string[] =>
    zones
      .filter(zone => zone.ownerId === playerId)
      .flatMap(zone => zone.cards)
);

// Game State Queries
export const selectIsPlayerTurn = (playerId: string) => createSelector(
  selectCurrentGame,
  (game): boolean => game?.activePlayer === playerId
);

export const selectCanPlayerAct = (playerId: string) => createSelector(
  [selectCurrentGame, selectCurrentPhase],
  (game, phase): boolean => {
    if (!game) return false;
    // Add your game-specific logic here
    return game.activePlayer === playerId && phase !== 'untap' && phase !== 'draw';
  }
);

export const selectGameStatus = createSelector(
  selectCurrentGame,
  (game): 'not_started' | 'in_progress' | 'finished' => {
    if (!game) return 'not_started';
    // Add your game-specific logic here
    return 'in_progress';
  }
); 
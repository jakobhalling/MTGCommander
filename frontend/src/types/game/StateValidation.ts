import { GameState, PlayerState, ZoneState, CardState, ZoneType, GamePhase } from './GameState';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateCardState(card: CardState): void {
  if (!card.id) {
    throw new ValidationError('Card must have a non-empty ID');
  }
  if (!card.name) {
    throw new ValidationError('Card must have a name');
  }
  if (!Array.isArray(card.types) || card.types.length === 0) {
    throw new ValidationError('Card must have at least one type');
  }
  if (!card.currentZone) {
    throw new ValidationError('Card must be in a zone');
  }
  if (!card.ownerId) {
    throw new ValidationError('Card must have an owner');
  }
  if (typeof card.isTapped !== 'boolean') {
    throw new ValidationError('Card must have a valid tapped state');
  }
  if (!card.counters || typeof card.counters !== 'object') {
    throw new ValidationError('Card must have a counters object');
  }
  if (!Array.isArray(card.attachments)) {
    throw new ValidationError('Card must have an attachments array');
  }
}

const validZoneTypes: ZoneType[] = ['hand', 'library', 'graveyard', 'exile', 'battlefield', 'command'];

export function validateZoneState(zone: ZoneState): void {
  if (!zone.id) {
    throw new ValidationError('Zone must have a non-empty ID');
  }
  if (!validZoneTypes.includes(zone.type)) {
    throw new ValidationError(`Invalid zone type: ${zone.type}`);
  }
  if (!Array.isArray(zone.cards)) {
    throw new ValidationError('Zone cards must be an array');
  }
  if (!zone.ownerId) {
    throw new ValidationError('Zone must have an owner');
  }
}

export function validatePlayerState(player: PlayerState): void {
  if (!player.id) {
    throw new ValidationError('Player must have a non-empty ID');
  }
  if (!player.name) {
    throw new ValidationError('Player must have a name');
  }
  if (typeof player.life !== 'number' || player.life < 0) {
    throw new ValidationError('Player must have a valid life total');
  }
  if (!player.zones || typeof player.zones !== 'object') {
    throw new ValidationError('Player must have zones object');
  }

  // Validate all required zones exist
  for (const zoneType of validZoneTypes) {
    if (!player.zones[zoneType]) {
      throw new ValidationError(`Player is missing required zone: ${zoneType}`);
    }
    validateZoneState(player.zones[zoneType]);
  }

  if (!player.commanderDamage || typeof player.commanderDamage !== 'object') {
    throw new ValidationError('Player must have a commanderDamage object');
  }
}

const validGamePhases: GamePhase[] = ['untap', 'upkeep', 'draw', 'main1', 'combat', 'main2', 'end', 'cleanup'];

export function validateGameState(game: GameState): void {
  if (!game.id) {
    throw new ValidationError('Game must have a non-empty ID');
  }
  if (!game.players || typeof game.players !== 'object') {
    throw new ValidationError('Game must have a players object');
  }
  if (!game.activePlayer) {
    throw new ValidationError('Game must have an active player');
  }
  if (!Object.keys(game.players).includes(game.activePlayer)) {
    throw new ValidationError('Active player must be a valid player ID');
  }
  if (typeof game.turnNumber !== 'number' || game.turnNumber < 1) {
    throw new ValidationError('Game must have a valid turn number');
  }
  if (!validGamePhases.includes(game.phase)) {
    throw new ValidationError(`Invalid game phase: ${game.phase}`);
  }
  if (!Array.isArray(game.stack)) {
    throw new ValidationError('Game stack must be an array');
  }
  if (!Array.isArray(game.turnOrder) || game.turnOrder.length === 0) {
    throw new ValidationError('Game must have a non-empty turn order');
  }

  // Validate all players
  Object.values(game.players).forEach(validatePlayerState);

  // Validate turn order contains only valid player IDs
  for (const playerId of game.turnOrder) {
    if (!game.players[playerId]) {
      throw new ValidationError(`Turn order contains invalid player ID: ${playerId}`);
    }
  }
} 
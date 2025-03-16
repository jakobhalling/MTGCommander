# API Documentation

This document describes the external APIs used by the MTG Commander application and internal service interfaces.

## External APIs

### Scryfall API

The application uses the [Scryfall API](https://scryfall.com/docs/api) to fetch card data.

#### Card Search

```typescript
// Example usage
import { ScryfallClient } from '../services/api/ScryfallClient';

const client = new ScryfallClient();
const cards = await client.searchCards('commander:EDH type:creature color:G');
```

#### Card Details

```typescript
// Example usage
const card = await client.getCard('f295b713-1d6a-43fd-910d-fb35414bf58a');
```

## Internal Services

### Storage Service

The `StorageService` provides an interface for persistent data storage using browser APIs.

#### Game State Storage

```typescript
// Save game state
await storageService.saveGameState(gameState);

// Retrieve game state
const state = await storageService.getGameState(gameId);
```

#### Card Storage

```typescript
// Save card data
await storageService.saveCard(cardData);

// Retrieve card data
const card = await storageService.getCard(cardId);

// Get all cards
const allCards = await storageService.getAllCards();

// Clear card data
await storageService.clearCards();
```

### Game Engine API

The game engine provides methods for game state manipulation.

#### Game Creation

```typescript
// Create a new game
const game = gameEngine.createGame({
  players: [
    { id: 'p1', name: 'Player 1', life: 40 },
    { id: 'p2', name: 'Player 2', life: 40 }
  ]
});
```

#### Game Actions

```typescript
// Perform a game action
gameEngine.performAction({
  type: 'DRAW_CARD',
  playerId: 'p1',
  count: 1
});

// Advance game phase
gameEngine.advancePhase();

// Pass priority
gameEngine.passPriority('p1');
```

## Redux Store API

### Game Slice

```typescript
// Dispatch game actions
dispatch(gameActions.setActivePlayer('p1'));
dispatch(gameActions.advancePhase());
dispatch(gameActions.moveCard({
  cardId: 'c1',
  fromZone: 'hand',
  toZone: 'battlefield',
  playerId: 'p1'
}));

// Select from game state
const activePlayer = useSelector(selectActivePlayer);
const currentPhase = useSelector(selectCurrentPhase);
const playerHand = useSelector(state => selectPlayerZone(state, 'p1', 'hand'));
```

### Card Slice

```typescript
// Dispatch card actions
dispatch(cardActions.addCard(cardData));
dispatch(cardActions.updateCard({ id: 'c1', tapped: true }));
dispatch(cardActions.removeCard('c1'));

// Select card data
const card = useSelector(state => selectCardById(state, 'c1'));
const playerCards = useSelector(state => selectCardsByOwner(state, 'p1'));
```

## WebSocket API (Future Implementation)

For multiplayer functionality, the application will use WebSockets for real-time communication.

```typescript
// Example WebSocket message format
{
  type: 'GAME_ACTION',
  payload: {
    actionType: 'PLAY_CARD',
    playerId: 'p1',
    cardId: 'c1',
    targetZone: 'battlefield'
  },
  gameId: 'game123',
  timestamp: 1625097600000
}
``` 
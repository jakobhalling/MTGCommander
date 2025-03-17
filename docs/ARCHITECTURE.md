# MTG Commander Architecture

This document provides an overview of the MTG Commander application architecture.

## High-Level Architecture

The application follows a modern frontend architecture with the following key components:

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Components  │  │   Hooks     │  │      Utilities      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      State Management                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Actions   │  │  Reducers   │  │      Selectors      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      Service Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ API Client  │  │   Storage   │  │  Game Logic Engine  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Core Technologies

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Redux**: State management
- **Redux Toolkit**: Simplified Redux development
- **React Router**: Navigation
- **Jest**: Testing framework

## Key Components

### UI Layer

- **Components**: Reusable UI elements
- **Pages**: Top-level route components
- **Hooks**: Custom React hooks for shared logic

### State Management

- **Store**: Central Redux store configuration
- **Slices**: Feature-based state management
- **Selectors**: Memoized state queries
- **Actions**: Type-safe action creators

### Service Layer

- **API Client**: External API communication
- **Storage Service**: Local data persistence
- **Game Engine**: Core game logic implementation

## Data Flow

1. **User Interaction**: User interacts with a component
2. **Action Dispatch**: Component dispatches an action
3. **Reducer Processing**: Reducer updates state based on action
4. **State Update**: Components re-render with new state
5. **Side Effects**: Middleware handles side effects (API calls, storage, etc.)

## State Structure

```typescript
interface RootState {
  game: GameState;
  cards: CardState;
  ui: UIState;
  // Additional slices as needed
}

interface GameState {
  id: string;
  players: Player[];
  turn: number;
  phase: GamePhase;
  activePlayer: string;
  zones: Record<ZoneId, Zone>;
  // Additional game state properties
}
```

## Storage Strategy

- **SessionStorage**: Stores active game state
- **IndexedDB**: Stores card data and user preferences
- **Redux Persistence**: Selective state persistence

## Testing Strategy

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Testing component interactions
- **State Tests**: Verifying reducer and selector behavior

## Performance Considerations

- Memoized selectors for efficient state access
- Component optimization with React.memo and useMemo
- Lazy loading for route-based code splitting 
# Deck Management Todo List

This document outlines the tasks required to implement the deck management functionality for the MTG Commander game.

## Backend Tasks

### 1. Domain Models
- [ ] Create `Deck` model with properties:
  - Id
  - Name
  - OwnerId (hardcoded for now)
  - Cards collection
  - Commander card reference
  - Creation date
  - Last modified date

- [ ] Create `Card` model with properties:
  - Id
  - Name
  - Set (optional)
  - Scryfall ID
  - Mana cost
  - Type
  - Oracle text
  - Power/Toughness (if creature)
  - Loyalty (if planeswalker)
  - Colors
  - Image URLs
  - Other relevant card data

### 2. Repository Pattern Implementation
- [ ] Create `IDeckRepository` interface in Core layer
  - Define CRUD operations for decks
  - Define methods for card management within decks

- [ ] Implement `InMemoryDeckRepository` in Infrastructure layer
  - Implement all interface methods
  - Use in-memory collection for storage
  - Ensure thread safety

### 3. API Endpoints
- [ ] Create `DeckController` with the following endpoints:
  - GET `/api/decks` - List all decks
  - GET `/api/decks/{id}` - Get deck by ID
  - POST `/api/decks` - Create new deck
  - PUT `/api/decks/{id}` - Update deck
  - DELETE `/api/decks/{id}` - Delete deck
  - POST `/api/decks/import` - Import deck from plaintext
  - PUT `/api/decks/{id}/commander` - Set commander for deck
  - POST `/api/decks/{id}/cards` - Add card to deck
  - DELETE `/api/decks/{id}/cards/{cardId}` - Remove card from deck

### 4. Services
- [ ] Create `IDeckService` interface in Core layer
  - Define business logic operations for deck management

- [ ] Implement `DeckService` in Core layer
  - Implement deck import parsing logic
  - Implement commander promotion logic
  - Implement validation rules

### 5. Scryfall API Integration
- [ ] Create `IScryfallService` interface in Core layer
  - Define methods for card data retrieval

- [ ] Implement `ScryfallService` in Infrastructure layer
  - Implement card search by name
  - Implement card search by name and set
  - Implement rate limiting to avoid API abuse
  - Implement response caching

## Frontend Tasks

### 1. State Management
- [ ] Create deck management slice in Redux store
  - Define state interface
  - Implement reducers for CRUD operations
  - Implement selectors

- [ ] Create async thunks for API communication
  - Implement deck listing
  - Implement deck creation/update/deletion
  - Implement deck import
  - Implement card management

### 2. Components
- [ ] Create `DeckList` component using Carbon Design System
  - Display all user decks
  - Implement deck selection
  - Implement deck deletion

- [ ] Create `DeckDetail` component
  - Display deck name and stats
  - Display commander card
  - Display card list with grouping options
  - Implement edit functionality

- [ ] Create `DeckImport` component
  - Create text area for plaintext import
  - Implement import button
  - Display import progress
  - Handle import errors

- [ ] Create `DeckEditor` component
  - Implement deck name editing
  - Implement commander selection
  - Implement card addition/removal
  - Display card details

- [ ] Create `CardSearch` component
  - Implement search by name
  - Display search results
  - Allow adding cards to deck

### 3. Card Display
- [ ] Create `Card` component
  - Display card image
  - Display card details
  - Handle loading states
  - Implement hover effects

- [ ] Create `CardGrid` component
  - Display cards in grid layout
  - Implement filtering and sorting
  - Implement pagination

### 4. Scryfall API Integration
- [ ] Create service for Scryfall API communication
  - Implement card search
  - Implement card data retrieval
  - Implement caching mechanism

- [ ] Create hooks for card data
  - Implement useCard hook
  - Implement useCardSearch hook

### 5. Import/Export
- [ ] Implement plaintext parser
  - Handle quantity and card name format
  - Handle set specification
  - Validate input format

- [ ] Implement export functionality
  - Export deck as plaintext
  - Include commander information

## Testing Tasks

### 1. Backend Tests
- [ ] Unit tests for domain models
- [ ] Unit tests for repositories
- [ ] Unit tests for services
- [ ] Integration tests for controllers
- [ ] Tests for Scryfall API integration

### 2. Frontend Tests
- [ ] Unit tests for reducers and selectors
- [ ] Unit tests for components
- [ ] Integration tests for deck management flow
- [ ] Tests for import/export functionality

## Documentation Tasks

- [ ] Update API documentation
- [ ] Document deck import format
- [ ] Document Scryfall API integration
- [ ] Create user guide for deck management

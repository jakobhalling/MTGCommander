# MTG Commander Project TODO List

## Backend (.NET)

### 1. Project Setup
- [x] Configure Entity Framework Core
- [x] Set up dependency injection
- [x] Configure CORS policies
- [x] Set up logging (Serilog)
- [x] Configure Swagger/OpenAPI documentation

### 2. Card Management
- [ ] Create Card model and DTOs
- [ ] Implement Scryfall API integration service
- [ ] Create card caching system
- [ ] Implement card image storage and retrieval
- [ ] Create card search and filtering endpoints

### 3. Deck Management
- [ ] Create Deck model and DTOs
- [ ] Implement deck import parser
- [ ] Create deck validation service (Commander rules)
- [ ] Implement deck persistence
- [ ] Create deck CRUD endpoints

### 4. Game State
- [ ] Design game state models
- [ ] Implement zone management
- [ ] Create turn structure system
- [ ] Implement priority system
- [ ] Create game state persistence

### 5. AI System
- [ ] Design AI player model
- [ ] Implement basic decision making
- [ ] Create combat logic
- [ ] Implement targeting system
- [ ] Add predefined deck configurations

## Frontend (React)

### 1. Project Setup
- [ ] Configure TypeScript
- [ ] Set up React Router
- [ ] Configure state management (Redux)
- [ ] Set up API client (Axios)
- [ ] Configure environment variables

### 2. UI Components
- [ ] Create Card component
- [ ] Implement GameBoard component
- [ ] Create Zone components
- [ ] Design Player Info display
- [ ] Implement Stack visualization

### 3. Game Mechanics
- [ ] Implement drag and drop system
- [ ] Create manual controls menu
- [ ] Implement card action system
- [ ] Create targeting interface
- [ ] Design phase/turn indicators

### 4. Deck Management
- [ ] Create deck import interface
- [ ] Implement deck validation feedback
- [ ] Design deck viewer
- [ ] Create commander selection UI

### 5. Game State
- [ ] Implement game state synchronization
- [ ] Create reconnection handling
- [ ] Design error handling
- [ ] Implement game action history

### 6. Styling
- [ ] Set up Tailwind CSS
- [ ] Create base theme
- [ ] Design responsive layouts
- [ ] Implement animations
- [ ] Create loading states

## Infrastructure

### 1. Database
- [ ] Design database schema
- [ ] Create migrations
- [ ] Set up indexes
- [ ] Configure backup strategy

### 2. Caching
- [ ] Configure Redis
- [ ] Implement card cache
- [ ] Set up session storage
- [ ] Create cache invalidation strategy

### 3. API
- [ ] Design RESTful endpoints
- [ ] Implement rate limiting
- [ ] Set up API versioning
- [ ] Create API documentation

### 4. Testing
- [ ] Set up unit testing
- [ ] Create integration tests
- [ ] Implement E2E testing
- [ ] Set up CI/CD pipeline

## Documentation

### 1. Technical Documentation
- [ ] Create API documentation
- [ ] Document database schema
- [ ] Create architecture diagrams
- [ ] Document deployment process

### 2. User Documentation
- [ ] Create user guide
- [ ] Document game rules
- [ ] Create AI opponent guide
- [ ] Document keyboard shortcuts

## Phase 1 Priority Items
1. Basic card display and game board
2. Simple deck import
3. Basic game state management
4. Manual card movement
5. Simple AI opponent 
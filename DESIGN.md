# Magic: The Gathering Commander Web Application
## Game Design Document

### Project Overview
An online web application for playing Magic: The Gathering Commander (EDH) format against AI opponents. The application will feature a modern React frontend with a .NET backend, focusing on providing a smooth, Archidekt-like playtest experience with manual controls and AI opposition.

### Core Features

#### 1. Deck Management
- **Deck Import**
  - Text-based import in the format:
    ```
    quantity cardname
    1 Mox Diamond
    1 Sol Ring
    ```
  - Validation against Commander format rules
  - Support for Commander/Commander Identity rules
  - Automatic card data fetching from Scryfall API

- **Card Caching**
  - Local storage of card images and data
  - Fetch and cache on deck import
  - Automatic caching of new cards encountered

#### 2. Game Interface

##### Visual Layout
- Top-down 2D view similar to Archidekt's playtester
- Clearly defined zones:
  - Battlefield
  - Hand
  - Graveyard
  - Exile
  - Command Zone
  - Stack
  - Library
- Player information displays:
  - Life totals
  - Commander damage
  - Poison counters
  - Mana pool
  - Experience counters
  - Other special counters

##### Interaction System
- **Drag and Drop Interface**
  - Card movement between zones
  - Targeting system for spells and abilities (later)
  - Attachment management (Auras, Equipment) (later)

- **Manual Controls**
  - Context menus for card actions
  - Life total adjustment
  - Counter management
  - Token creation
  - Card state toggles (tap/untap)
  - Manual scry interface
  - Stack management (later)

#### 3. Game Mechanics

##### Core Systems
- **Turn Structure**
  - Beginning Phase (Untap, Upkeep, Draw)
  - Main Phases
  - Combat Phase
  - End Step
  - Cleanup

- **Priority System**
  - Player/AI priority passing
  - Stack resolution
  - Response windows

- **Zone Management**
  - Zone transfer rules
  - Command zone alternatives
  - Face-down cards
  - Revealed cards

##### Manual Operations
- **Card Manipulation**
  - Scry (manual top/bottom decisions)
  - Shuffle
  - Reveal cards
  - Look at face-down cards
  - Create tokens
  - Add/remove counters

#### 4. AI System

##### AI Opponents
- **Predefined Commander Decks**
  - Multiple archetypal strategies
  - Varying difficulty levels
  - Preset decklists

##### AI Behavior Tiers
1. **Basic (Initial Implementation)**
   - Simple decision trees
   - Basic priority management
   - Combat math
   - Resource management

2. **Advanced (Future Development)**
   - Threat assessment
   - Complex interaction timing
   - Strategic planning
   - Meta-knowledge application

#### 5. Technical Features

##### State Management
- **Game State Persistence**
  - Automatic save on disconnection
  - Game state recovery
  - Action history

##### Performance
- **Optimization Targets**
  - < 100ms response time for basic actions
  - < 2s for AI decision making
  - < 5s for initial game load
  - < 1s for card image loading (cached)

### Technology Stack

#### Frontend
- React
- TypeScript
- Modern CSS (Tailwind/styled-components)
- React DnD (drag and drop)
- Redux/Context (state management)

#### Backend
- .NET Core Web API
- Storage TBD

#### External Services
- Scryfall API (card data)
- Cloud Storage (game state persistence - tbd)

### Development Phases

#### Phase 1: Foundation
1. Project setup and architecture
2. Basic game board UI
3. Card rendering system
4. Zone management
5. Deck import functionality

#### Phase 2: Core Gameplay
1. Manual controls implementation
2. Drag and drop system
3. Basic game rules
4. Turn structure
5. State management

#### Phase 3: AI Implementation
1. Basic AI framework
2. Simple decision making
3. Priority management
4. Combat decisions
5. Predefined deck integration

#### Phase 4: Enhancement
1. Advanced game mechanics
2. UI polish
3. Animation system
4. Performance optimization
5. Bug fixes and refinements

### Future Considerations
- Multiplayer support
- Advanced AI behaviors
- User authentication
- Deck storage
- Game statistics
- Tournament mode
- Custom rule sets

### Success Metrics
1. Game completion rate
2. AI response time
3. User session length
4. System stability
5. Feature usage statistics

### Notes
- All manual operations should have both mouse and keyboard shortcuts
- UI should be intuitive and similar to existing playtest tools
- Performance is critical for smooth gameplay
- AI should be challenging but not frustrating
- System should gracefully handle edge cases and errors 
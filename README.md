# MTG Commander

A digital implementation of the Magic: The Gathering Commander format, built with React, TypeScript, and .NET 8.0.

## Documentation

- [Project Roadmap & TODO](./docs/TODO.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Design Principles](./docs/DESIGN.md)
- [Development Principles](./docs/DEVELOPMENT_PRINCIPLES.md)
- [Game Phases](./docs/PHASES.md)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- .NET SDK 8.0
- Git

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Restore .NET dependencies:
   ```bash
   dotnet restore
   ```

3. Run the API:
   ```bash
   cd MTGCommander.API
   dotnet run
   ```

The API will be available at `http://localhost:5000`

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

The frontend build artifacts will be stored in the `frontend/dist/` directory.

### Backend Build

```bash
cd backend
dotnet build --configuration Release
```

The backend build artifacts will be stored in the `backend/MTGCommander.API/bin/Release/` directory.

## Testing

### Frontend Tests

In the frontend directory:

```bash
npm test          # Run tests
npm test:watch    # Run tests in watch mode
npm test:coverage # Run tests with coverage
```

### Backend Tests

In the backend directory:

```bash
dotnet test
```

### Test Structure

- Unit tests are located in `src/__tests__/`
- Each component or service has its own test file
- Mock data and test utilities are in `src/__tests__/utils/`

## Debugging

### Development Tools

- Redux DevTools: Monitor state changes in the Redux store
- React DevTools: Inspect component hierarchy and props
- Browser DevTools: Debug network requests, storage, and performance

### Common Issues

#### Storage Issues

The application uses both SessionStorage and IndexedDB for data persistence:
- SessionStorage: Game state
- IndexedDB: Card data

If you encounter storage-related errors:
1. Check browser storage permissions
2. Clear application data in browser settings
3. Verify storage availability in the console with:
   ```javascript
   StorageUtils.isStorageAvailable('sessionStorage')
   StorageUtils.isIndexedDBAvailable()
   ```

#### State Management

For Redux state issues:
1. Use Redux DevTools to inspect state changes
2. Check action payloads and reducer logic
3. Verify selectors are returning expected values

## Project Structure

The MTGCommander project follows a clean architecture pattern with clear separation of concerns between frontend and backend components.

### Root Directory Structure

```
MTGCommander/
├── .github/            # GitHub workflows and CI/CD configuration
├── backend/            # .NET 8.0 backend application
├── docs/               # Project documentation
├── frontend/           # React/TypeScript frontend application
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore configuration
├── README.md           # Project overview and setup instructions
├── gai-instructions.txt # Instructions for AI assistance
└── test.sh             # Testing script
```

### Backend Structure

The backend follows a clean architecture pattern with four main projects:

```
backend/
├── MTGCommander.API/              # Web API layer
│   ├── Configuration/             # API configuration and DI setup
│   ├── Controllers/               # API endpoints (CardsController, DecksController, etc.)
│   └── Properties/                # API project properties
│
├── MTGCommander.Core/             # Business logic and domain models
│   ├── DTOs/                      # Data Transfer Objects
│   ├── Entities/                  # Domain entities
│   ├── Interfaces/                # Service and repository interfaces
│   └── Services/                  # Business logic implementation
│
├── MTGCommander.Infrastructure/   # External services and data access
│   ├── External/                  # External API integrations
│   ├── Repositories/              # Data access implementations
│   └── Services/                  # Infrastructure service implementations
│
└── MTGCommander.Tests/            # Test projects
    ├── API/                       # API layer tests
    ├── Core/                      # Core layer tests
    │   ├── DTOs/                  # DTO tests
    │   └── Entities/              # Entity tests
    └── Infrastructure/            # Infrastructure layer tests
```

### Frontend Structure

The frontend is built with React, TypeScript, and Redux, following a feature-based organization:

```
frontend/
├── public/                        # Static assets and index.html
└── src/                           # Source code
    ├── actions/                   # Redux actions
    ├── api/                       # API client and request handling
    ├── components/                # Reusable UI components
    │   ├── DeckManagement/        # Deck management components
    │   └── Home/                  # Home page components
    ├── hooks/                     # Custom React hooks
    ├── middleware/                # Redux middleware
    ├── routes/                    # Route components
    │   ├── Home/                  # Home route
    │   ├── Multiplayer/           # Multiplayer game route
    │   └── Singleplayer/          # Singleplayer game route
    ├── services/                  # Service layer
    │   └── storage/               # Storage services
    ├── store/                     # Redux store configuration
    │   ├── game/                  # Game-related state
    │   └── slices/                # Redux Toolkit slices
    ├── types/                     # TypeScript type definitions
    │   ├── card/                  # Card-related types
    │   └── game/                  # Game-related types
    └── __tests__/                 # Test files
        ├── actions/               # Action tests
        ├── components/            # Component tests
        ├── middleware/            # Middleware tests
        ├── services/              # Service tests
        ├── store/                 # Store tests
        │   └── game/              # Game state tests
        └── types/                 # Type tests
            └── game/              # Game type tests
```

### Documentation Structure

The project includes comprehensive documentation in the docs directory:

```
docs/
├── API.md                        # API documentation
├── ARCHITECTURE.md               # Architecture overview
├── CONTRIBUTING.md               # Contributing guidelines
├── DECK_MANAGEMENT_TODO.md       # Deck management feature roadmap
├── DESIGN.md                     # Design principles and UI/UX guidelines
├── DEVELOPMENT_PRINCIPLES.md     # Development principles and best practices
├── GAI_DEVELOPMENT_PRINCIPLES.md # AI-assisted development guidelines
├── IMPLEMENTATION_SUMMARY.md     # Implementation details summary
├── PHASES.md                     # Game phases documentation
├── TODO.md                       # Project roadmap and todo items
└── VERIFICATION.md               # Verification process documentation
```

### Key Files and Their Purposes

#### Backend Key Files

- `MTGCommander.API/Program.cs`: Entry point for the API application
- `MTGCommander.API/Configuration/ServiceCollectionExtensions.cs`: DI configuration
- `MTGCommander.API/Controllers/*.cs`: API endpoints for different resources
- `MTGCommander.Core/DTOs/*.cs`: Data transfer objects for API communication
- `MTGCommander.Core/Entities/*.cs`: Domain entities representing game objects
- `MTGCommander.Core/Interfaces/*.cs`: Interfaces defining service contracts
- `MTGCommander.Core/Services/*.cs`: Business logic implementation
- `MTGCommander.Infrastructure/Repositories/*.cs`: Data access implementations
- `MTGCommander.Infrastructure/External/*.cs`: External API integrations

#### Frontend Key Files

- `frontend/src/App.tsx`: Main application component
- `frontend/src/components/*.tsx`: Reusable UI components
- `frontend/src/store/index.ts`: Redux store configuration
- `frontend/src/store/slices/*.ts`: Redux Toolkit slices for state management
- `frontend/src/services/*.ts`: Service layer implementations
- `frontend/src/types/*.ts`: TypeScript type definitions
- `frontend/src/routes/*.tsx`: Route components for different pages

## Development Tools

### Frontend Development

- Vite Dev Server with HMR
- Redux DevTools
- React DevTools
- TypeScript support

### Backend Development

- Swagger UI at `/swagger`
- .NET Hot Reload
- Serilog for logging

## Environment Configuration

Create `.env` files in both frontend and backend:

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (appsettings.Development.json)
The default development settings are included in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Wizards of the Coast](https://magic.wizards.com/) for Magic: The Gathering
- [Scryfall API](https://scryfall.com/docs/api) for card data

## Verification

The project includes a verification script that checks both the backend and frontend code:

```bash
# Run verification
node verify.js
```

### Environment Configuration

You can customize the verification process by creating a `.env` file in the root directory. Use the `.env.example` file as a template:

```bash
# Copy the example file
cp .env.example .env
```

Available environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Set to 'development' for local development mode | - |
| LOCAL_DEV | Enable local development features | false |
| SKIP_FRONTEND_BUILD | Skip frontend build during verification | false |
| API_URL | URL for the backend API | http://localhost:5000/api |

### Verification Features

In local development mode (`NODE_ENV=development` or `LOCAL_DEV=true`):
- Uses `npm install` instead of `npm ci` for dependencies
- Runs `npm run lint:fix` to automatically fix linting issues
- Uses interactive test mode with `npm run test:watch`
- Builds in development mode

When `SKIP_FRONTEND_BUILD=true`:
- Skips the frontend build step entirely

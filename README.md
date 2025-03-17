# MTG Commander

A digital implementation of the Magic: The Gathering Commander format, built with React, TypeScript, and .NET 8.0.

## Documentation

- [Project Roadmap & TODO](./docs/TODO.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)

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

```
MTGCommander/
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── services/        # Service layer
│   │   ├── store/          # Redux store
│   │   ├── types/          # TypeScript types
│   │   └── __tests__/      # Frontend tests
│   └── public/             # Static assets
├── backend/
│   ├── MTGCommander.API/    # Web API
│   ├── MTGCommander.Core/   # Business logic
│   ├── MTGCommander.Infrastructure/ # External services
│   └── MTGCommander.Tests/  # Backend tests
└── docs/                    # Documentation
```

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
- Still runs linting and tests
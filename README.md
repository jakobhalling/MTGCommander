# MTG Commander

A digital implementation of the Magic: The Gathering Commander format, built with React, TypeScript, and Redux.

## Documentation

- [Project Roadmap & TODO](./TODO.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MTGCommander.git
   cd MTGCommander
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Testing

### Running Tests

Run all tests:

```bash
npm test
# or
yarn test
```

Run tests with coverage:

```bash
npm test -- --coverage
# or
yarn test --coverage
```

Run specific tests:

```bash
npm test -- -t "StorageService"
# or
yarn test -t "StorageService"
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
├── src/
│   ├── components/       # UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Service layer (API, storage)
│   ├── store/            # Redux store configuration
│   │   ├── game/         # Game state management
│   │   └── cards/        # Card data management
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── __tests__/        # Test files
├── public/               # Static assets
└── docs/                 # Documentation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Wizards of the Coast](https://magic.wizards.com/) for Magic: The Gathering
- [Scryfall API](https://scryfall.com/docs/api) for card data 
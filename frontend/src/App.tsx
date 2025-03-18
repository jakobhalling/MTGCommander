import React from 'react';
import DeckManagementRoutes from './routes/DeckManagementRoutes';
import { Header, HeaderName } from '@carbon/react';
import './carbonStyles.css';

const App: React.FC = () => {
  // Hardcoded user for now as requested
  const hardcodedUser = {
    id: '1',
    username: 'commander_player',
  };

  return (
    <div className="app">
      <Header aria-label="MTG Commander">
        <HeaderName href="/" prefix="">
          MTG Commander - Deck Management
        </HeaderName>
      </Header>
      <DeckManagementRoutes />
    </div>
  );
};

export default App;

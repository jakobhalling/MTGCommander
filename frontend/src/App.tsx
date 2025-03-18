import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import DeckManagementRoutes from './routes/DeckManagementRoutes';
import HomeRoutes from './routes/Home/HomeRoutes';
import MultiplayerRoutes from './routes/Multiplayer/MultiplayerRoutes';
import SingleplayerRoutes from './routes/Singleplayer/SingleplayerRoutes';
import { Header, HeaderName, HeaderNavigation, HeaderMenuItem } from '@carbon/react';
import './carbonStyles.css';

// Navigation component that will be used in App
const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper function to determine if a path is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <HeaderNavigation aria-label="MTG Commander">
      <HeaderMenuItem 
        onClick={() => navigate('/')}
        isCurrentPage={location.pathname === '/'}
      >
        Home
      </HeaderMenuItem>
      <HeaderMenuItem 
        onClick={() => navigate('/multiplayer')}
        isCurrentPage={isActive('/multiplayer')}
      >
        Multiplayer
      </HeaderMenuItem>
      <HeaderMenuItem 
        onClick={() => navigate('/singleplayer')}
        isCurrentPage={isActive('/singleplayer')}
      >
        Singleplayer
      </HeaderMenuItem>
      <HeaderMenuItem 
        onClick={() => navigate('/decks')}
        isCurrentPage={isActive('/decks')}
      >
        Deck Management
      </HeaderMenuItem>
    </HeaderNavigation>
  );
};

// App component with updated routing
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
          MTG Commander
        </HeaderName>
        <Navigation />
      </Header>
      
      <Routes>
        <Route path="/" element={<HomeRoutes />} />
        <Route path="/multiplayer/*" element={<MultiplayerRoutes />} />
        <Route path="/singleplayer/*" element={<SingleplayerRoutes />} />
        <Route path="/decks/*" element={<DeckManagementRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;

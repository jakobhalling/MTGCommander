import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  Content,
  Theme,
  Button
} from '@carbon/react';
import GameBoard from './components/GameBoard';
import ComponentShowcase from './components/ComponentShowcase';

interface HeaderRenderProps {
  isSideNavExpanded: boolean;
  onClickSideNavExpand: () => void;
}

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Theme theme="g100">
      <div className="cds--g100" data-testid="app-container">
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }: HeaderRenderProps) => (
            <Header aria-label="MTG Commander">
              <HeaderName prefix="">MTG Commander</HeaderName>
              <HeaderNavigation aria-label="MTG Commander">
                <HeaderMenuItem
                  isCurrentPage={location.pathname === '/'}
                  onClick={() => navigate('/')}
                >
                  Home
                </HeaderMenuItem>
                <HeaderMenuItem
                  isCurrentPage={location.pathname === '/game'}
                  onClick={() => navigate('/game')}
                >
                  Game
                </HeaderMenuItem>
                <HeaderMenuItem
                  isCurrentPage={location.pathname === '/showcase'}
                  onClick={() => navigate('/showcase')}
                >
                  Component Showcase
                </HeaderMenuItem>
              </HeaderNavigation>
            </Header>
          )}
        />
      
        <Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<GameBoard />} />
            <Route path="/showcase" element={<ComponentShowcase />} />
          </Routes>
        </Content>
      </div>
    </Theme>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to MTG Commander</h1>
      <p className="mb-8 text-lg">
        This is a digital implementation of the Magic: The Gathering Commander format.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Play Game</h2>
          <p className="mb-6">Start a new game or continue where you left off.</p>
          <Button
            onClick={() => navigate('/game')}
            kind="primary"
            size="lg"
          >
            Go to Game
          </Button>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Component Showcase</h2>
          <p className="mb-6">View and interact with all the UI components.</p>
          <Button
            onClick={() => navigate('/showcase')}
            kind="secondary"
            size="lg"
          >
            View Showcase
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;

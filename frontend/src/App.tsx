import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GameBoard from './components/GameBoard';

const App: React.FC = () => {
  return (
    <div data-testid="app-container" className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/game" element={<GameBoard />} />
        {/* Add more routes as we create components */}
      </Routes>
    </div>
  );
};

export default App;

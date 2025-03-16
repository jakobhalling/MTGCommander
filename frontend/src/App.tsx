import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import GameBoard from './components/GameBoard';
import ComponentShowcase from './components/ComponentShowcase';

const App: React.FC = () => {
  return (
    <div data-testid="app-container" className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <div className="text-xl font-bold">MTG Commander</div>
          <div className="flex space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/game" className="hover:underline">Game</Link>
            <Link to="/showcase" className="hover:underline">Component Showcase</Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<GameBoard />} />
          <Route path="/showcase" element={<ComponentShowcase />} />
        </Routes>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to MTG Commander</h1>
      <p className="mb-4">
        This is a digital implementation of the Magic: The Gathering Commander format.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-2">Play Game</h2>
          <p className="mb-4">Start a new game or continue where you left off.</p>
          <Link 
            to="/game" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Game
          </Link>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-2">Component Showcase</h2>
          <p className="mb-4">View and interact with all the UI components.</p>
          <Link 
            to="/showcase" 
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            View Showcase
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;

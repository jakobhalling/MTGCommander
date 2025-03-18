import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Content } from '@carbon/react';

// This is a placeholder component for the Singleplayer section
// It will be expanded in future development
const SingleplayerLobby: React.FC = () => {
  return (
    <div className="singleplayer-lobby">
      <h1>Singleplayer Mode</h1>
      <p>This is the singleplayer mode where you can play against AI opponents.</p>
      <p>This feature is currently under development.</p>
    </div>
  );
};

const SingleplayerRoutes: React.FC = () => {
  return (
    <Content>
      <Routes>
        <Route path="/" element={<SingleplayerLobby />} />
        {/* Additional routes will be added here as the singleplayer functionality is developed */}
        <Route path="/create" element={<div>Create Singleplayer Game (Coming Soon)</div>} />
        <Route path="/game/:id" element={<div>Singleplayer Game Board (Coming Soon)</div>} />
      </Routes>
    </Content>
  );
};

export default SingleplayerRoutes;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeckListPage from '../pages/DeckManagement/DeckListPage';
import DeckDetailPage from '../pages/DeckManagement/DeckDetailPage';
import DeckImportPage from '../pages/DeckManagement/DeckImportPage';
import CreateDeckPage from '../pages/DeckManagement/CreateDeckPage';
import { Content } from '@carbon/react';

const DeckManagementRoutes: React.FC = () => {
  return (
    <Content>
      <Routes>
        <Route path="/" element={<Navigate to="/decks" replace />} />
        <Route path="/decks" element={<DeckListPage />} />
        <Route path="/decks/create" element={<CreateDeckPage />} />
        <Route path="/decks/:id" element={<DeckDetailPage />} />
        <Route path="/decks/import" element={<DeckImportPage />} />
      </Routes>
    </Content>
  );
};

export default DeckManagementRoutes;

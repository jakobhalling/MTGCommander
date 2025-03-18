import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeckList from '../components/DeckManagement/DeckList';
import DeckDetail from '../components/DeckManagement/DeckDetail';
import DeckImport from '../components/DeckManagement/DeckImport';
import { Content } from '@carbon/react';

const DeckManagementRoutes: React.FC = () => {
  return (
    <Content>
      <Routes>
        <Route path="/" element={<Navigate to="/decks" replace />} />
        <Route path="/decks" element={<DeckList />} />
        <Route path="/decks/:id" element={<DeckDetail />} />
        <Route path="/decks/import" element={<DeckImport />} />
      </Routes>
    </Content>
  );
};

export default DeckManagementRoutes;

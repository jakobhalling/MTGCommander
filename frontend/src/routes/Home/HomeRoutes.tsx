import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../../components/Home/HomePage';
import { Content } from '@carbon/react';

const HomeRoutes: React.FC = () => {
  return (
    <Content>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Content>
  );
};

export default HomeRoutes;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './Login';
import Profile from './Profile';
import Nuuly from './Nuuly';
import History from './History';


const Routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/nuuly" element={<Nuuly />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
};

export default Routes;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './Login';
import Profile from './Profile';
import Nuuly from './Nuuly';


const Routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/nuuly" element={<Nuuly />} />
    </Routes>
  );
};

export default Routes;
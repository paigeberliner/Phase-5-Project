import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './Login';
impor HomePage from './HomePage';
import Profile from './Profile';
import Nuuly from './Nuuly';
import HomePage from './Homepage';


const Routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/nuuly" element={<Nuuly />} />
    </Routes>
  );
};

export default Routes;
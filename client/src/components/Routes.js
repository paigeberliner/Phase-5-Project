import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './Login';
import CreateUser from './CreateUser';
import Nuuly from './Nuuly';


const Routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/createuser" element={<CreateUser />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/nuuly" element={<Nuuly />} />
    </Routes>
  );
};

export default Routes;
// src/app.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './NavBar'; 
import Login from './Login';
import Profile from './Profile';
import Inventory from './Inventory';
import Nuuly from './Nuuly'; 
import History from './History';
import { AuthProvider } from './AuthContext'; // Import the AuthProvider

function App() {
  return (
    <AuthProvider> {/* Wrap your app with AuthProvider */}
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/nuuly" element={<Nuuly />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

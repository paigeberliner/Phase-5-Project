import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './NavBar'; 
import Homepage from './Homepage';  // Replace 'Homepage' with the actual component name for your homepage component
import Login from './Login';
import Profile from './Profile';
import Inventory from './Inventory';
import Nuuly from './Nuuly'; 

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/home" element={<Homepage />}/>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/nuuly" element={<Nuuly />} />
      </Routes>
    </Router>
  );
}

export default App;
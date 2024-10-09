import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './NavBar'; 
import Login from './Login';
import Inventory from './Inventory';
import Nuuly from './Nuuly'; 

function App() {



  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/nuuly" element={<Nuuly />} />
      </Routes>
    </Router>
  );
}

export default App;
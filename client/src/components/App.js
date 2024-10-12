import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './NavBar'; 
import Login from './Login';
import CreateUser from './CreateUser';
import Inventory from './Inventory';
import Nuuly from './Nuuly'; 

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/createuser" element={<CreateUser />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/nuuly" element={<Nuuly />} />
      </Routes>
    </Router>
  );
}

export default App;
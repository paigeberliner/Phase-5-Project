import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './NavBar'; // Assuming you have a Navbar component
import Login from './Login';
import Nuuly from './Nuuly'; // Adjust the component name as needed

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nuuly" element={<Nuuly />} />
      </Routes>
    </Router>
  );
}

export default App;
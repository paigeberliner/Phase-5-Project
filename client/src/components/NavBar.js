import React, { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Import AuthContext
import '../index.css';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext); // Use context to get user data and logout function

  return (
    <div className="navbar">
      {user ? (
        <>
          <button className="button logout-button" onClick={logout} >Logout</button>
        </>
      ) : (
        <a href="/login" className="nav-link">Login</a>
      )}
      <a href="/inventory" className="nav-link">Check Inventory</a>
      <a href="/nuuly" className="nav-link">Nuuly Site</a>
      <a href="/history" className="nav-link">See What Your Friends are Tracking</a>
      <a href="/profile" className="nav-link">Profile</a>
    </div>
  );
};

export default NavBar;

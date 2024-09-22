import React from 'react';
import '../index.css'; 

const NavBar = () => {
    return (
      <div className="navbar">
        <a href="/login" className="nav-link">Login</a>
        <a href="/wishlist" className="nav-link">Create A WishList</a>
        <a href="/inventory" className="nav-link">Check Inventory</a>
        <a href="/nuuly" className="nav-link">Nuuly Site</a>
        <a href="/history" className="nav-link">Track Your History</a>
      </div>
    );
  };
  
  export default NavBar;

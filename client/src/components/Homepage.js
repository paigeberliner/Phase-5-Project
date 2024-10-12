import React, { useEffect, useState } from 'react';
import '../index.css'; // Import the CSS file

const HomePage = () => {
  const [allUrls, setAllUrls] = useState([]);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/urls');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllUrls(data);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      }
    };

    fetchUrls();
  }, []);

  return (
    <div className="home-container">
      <header className="navbar">
        <h1 className="header-title">Nully Inventory Checker</h1>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <img 
          src="https://m.media-amazon.com/images/I/41iGgXNMr9L._AC_UF894,1000_QL80_.jpg" 
          alt="Smiley flower" 
          className="header-image" 
        />
        <p className="hero-text">
          Get first visibility into the inventory of your most wanted Nully Items!
        </p>
      </section>

      {/* Inventory Section */}
      <section className="inventory-section">
        <h2 className="inventory-title hot-pink-title">Current Items Being Tracked</h2>

        {allUrls.length > 0 ? (
          <ul className="inventory-list">
            {allUrls.map((urlItem) => (
              <li key={urlItem.id} className="url-item">
                <span className="item-name">
                  {urlItem.item_name
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No available items at the moment.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;

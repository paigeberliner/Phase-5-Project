import React, { useEffect, useState } from 'react';

const InventoryContainer = () => {
  const [allUrls, setAllUrls] = useState([]); // State for storing URLs
  const [inventory, setInventory] = useState(null); // State for storing inventory data
  const [inventoryLoading, setInventoryLoading] = useState(false); // State for loading status
  const [inventoryError, setInventoryError] = useState(''); // State for error messages

  useEffect(() => {
    // Fetch URLs from your API or other data source
    const fetchUrls = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/urls'); // Replace with your endpoint
        const data = await response.json();
        setAllUrls(data);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      }
    };

    fetchUrls();
  }, []);

  const handleInventoryFetch = async (name, colorCode) => {
    const slug = name; // Use item_name directly for slug
    const url = `https://www.nuuly.com/api/product/slug/${slug}?color=${colorCode}&view=rent`;

    try {
      setInventoryLoading(true);
      const response = await fetch(url, {
        method: 'GET', // Ensure you are using the correct method
        headers: {
          'Content-Type': 'application/json',
          // Uncomment and replace if needed for authentication
          // 'Authorization': 'Bearer your_token_here',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.status}`);
      }

      const inventoryData = await response.json();
      console.log('Fetched inventory data:', inventoryData); // Log inventory data
      setInventory(inventoryData);
    } catch (error) {
      setInventoryError(error.message);
    } finally {
      setInventoryLoading(false);
    }
  };

  return (
    <div className="inventory-container">
      <h2>Inventory</h2>
      {inventoryLoading && <p>Loading inventory...</p>}
      {inventoryError && <p>Error: {inventoryError}</p>}
      {allUrls.length > 0 ? (
        allUrls.map((urlItem) => (
          <div
            className="url-item"
            key={urlItem.id}
            onClick={() => handleInventoryFetch(urlItem.item_name, urlItem.item_color)} // Using item_name and item_color
            style={{ cursor: 'pointer' }}
          >
            <p>{urlItem.item_name ? urlItem.item_name.replace(/-/g, ' ') : 'Unnamed Item'}</p> {/* Check for undefined */}
          </div>
        ))
      ) : (
        <p>No URLs submitted to check inventory</p>
      )}
      {inventory && (
        <div>
          <h3>Inventory Details:</h3>
          {/* Render your inventory details here */}
          <pre>{JSON.stringify(inventory, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default InventoryContainer;

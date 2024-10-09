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

  const handleInventoryFetch = async (slug, colorCode) => {
    const url = `https://www.nuuly.com/api/product/slug/${slug}?color=${colorCode}&view=rent`;

    try {
      setInventoryLoading(true);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.status}`);
      }

      const inventoryData = await response.json();
      console.log('Fetched inventory data:', inventoryData);
      setInventory(inventoryData);
    } catch (error) {
      setInventoryError(error.message);
    } finally {
      setInventoryLoading(false);
    }
  };

  return (
    <div className="inventory-container">
      <h2>Inventory List</h2>
      {inventoryLoading && <p>Loading inventory...</p>}
      {inventoryError && <p>Error: {inventoryError}</p>}
      {allUrls.length > 0 ? (
        allUrls.map((urlItem) => {
          const slug = urlItem.item_name; // Use the item's name as the slug
          const colorCode = urlItem.item_color; // Get the item's color code
          const generatedUrl = `https://www.nuuly.com/api/product/slug/${slug}?color=${colorCode}&view=rent`; // Construct the URL

          return (
            <div
              className="url-item"
              key={urlItem.id}
            >
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation to the URL
                  console.log("Clicked"); // Call the function to fetch inventory data
                }}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} // Styling the link
              >
                {generatedUrl}
              </a>
            </div>
          );
        })
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

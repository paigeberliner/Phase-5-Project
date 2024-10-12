import React, { useEffect, useState } from 'react';

const InventoryContainer = () => {
  const [allUrls, setAllUrls] = useState([]); // State for storing URLs
  const [inventory, setInventory] = useState([]); // State for storing inventory data
  const [inventoryLoading, setInventoryLoading] = useState(false); // State for loading status
  const [inventoryError, setInventoryError] = useState(''); // State for error messages
  const [showTable, setShowTable] = useState(false); // State to control table visibility
  const [productName, setProductName] = useState(''); // State to store the current product name

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/urls');
        const data = await response.json();
        setAllUrls(data);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      }
    };

    fetchUrls();
  }, []);

  const extractProductNameFromUrl = (url) => {
    const slug = url.split('/slug/')[1].split('?')[0]; // Extract the product slug from the URL
    return slug.replace(/-/g, ' '); // Convert dashes to spaces to match product names
  };

  const handleInventoryFetch = async (url) => {
    try {
      setInventoryLoading(true);
      const response = await fetch('http://127.0.0.1:5000/scrape-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }), // Send the URL to the server
      });

      if (!response.ok) {
        throw new Error(`Error scraping inventory: ${response.status}`);
      }

      // Fetch inventory from the API
      const inventoryResponse = await fetch('http://127.0.0.1:5000/inventory');
      const inventoryData = await inventoryResponse.json();

      // Remove duplicates based on name, color, and size
      const uniqueInventory = Array.from(
        new Map(
          inventoryData.map((item) => [
            `${item.name}-${item.color}-${item.size}`, // Create a unique key
            item, // Keep the item
          ])
        ).values()
      );

      // Extract product name from URL and filter the inventory
      const extractedProductName = extractProductNameFromUrl(url);
      setProductName(extractedProductName); // Store the extracted product name

      const filteredInventory = uniqueInventory.filter(
        (item) => item.name.toLowerCase() === extractedProductName.toLowerCase()
      );

      setInventory(filteredInventory); // Store the filtered inventory in state
      setShowTable(true); // Show the inventory table
    } catch (error) {
      setInventoryError(error.message);
    } finally {
      setInventoryLoading(false);
    }
  };

  const handleCloseTable = () => {
    setShowTable(false); // Hide the inventory table
    setInventory([]); // Clear the inventory data
    setInventoryError(''); // Reset any error messages
  };

  // Handle delete function to delete URL from both API and state
 const handleDelete = async (id) => {
  console.log(`http://127.0.0.1:5000/urls/${id}`)
  try {
    const response = await fetch(`http://127.0.0.1:5000/urls/2`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error deleting URL: ${response.status}`);
    }

    // Update the state to remove the deleted URL
    setAllUrls((prevUrls) => prevUrls.filter(url => url.id !== id));
  } catch (error) {
    console.error('Error deleting URL:', error);
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
          const formattedName = slug
            .split('-') // Split the slug by hyphens
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(' '); // Join words back with spaces
          const colorCode = urlItem.item_color; // Get the item's color code
          const generatedUrl = `https://www.nuuly.com/api/product/slug/${slug}?color=${colorCode}&view=rent`; // Construct the URL

          return (
            <div className="url-item" key={urlItem.id}>
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor click behavior
                  handleInventoryFetch(generatedUrl); // Fetch inventory on click
                }}
              >
                {formattedName}
              </a>
              <button onClick={() => handleDelete(urlItem.id)}> X </button>
            </div>
          );
        })
      ) : (
        <p>No URLs available.</p>
      )}

      {/* Render the inventory table if showTable is true */}
      {showTable && inventory.length > 0 && (
        <div>
          <h3>Inventory for: {productName}</h3>
          <button onClick={handleCloseTable} style={{ marginBottom: '10px' }}>
            Close Table
          </button>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Color</th>
                <th>Size</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.color}</td>
                  <td>{item.size}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showTable && inventory.length === 0 && (
        <p>No matching inventory found for this product.</p>
      )}
    </div>
  );
};

export default InventoryContainer;

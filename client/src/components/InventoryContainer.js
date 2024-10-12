import React, { useEffect, useState } from 'react';
import InventoryForm from './InventoryForm';
import '../index.css'; // Add your custom styles

const InventoryContainer = () => {
  const [allUrls, setAllUrls] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [productName, setProductName] = useState('');

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
    const slug = url.split('/slug/')[1].split('?')[0];
    return slug.replace(/-/g, ' ');
  };

  const handleInventoryFetch = async (url) => {
    try {
      setInventoryLoading(true);
      const response = await fetch('http://127.0.0.1:5000/scrape-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Error scraping inventory: ${response.status}`);
      }

      const inventoryResponse = await fetch('http://127.0.0.1:5000/inventory');
      const inventoryData = await inventoryResponse.json();

      const uniqueInventory = Array.from(
        new Map(
          inventoryData.map((item) => [
            `${item.name}-${item.color}-${item.size}`,
            item,
          ])
        ).values()
      );

      const extractedProductName = extractProductNameFromUrl(url);
      setProductName(extractedProductName);

      const filteredInventory = uniqueInventory.filter(
        (item) => item.name.toLowerCase() === extractedProductName.toLowerCase()
      );

      setInventory(filteredInventory);
      setShowTable(true);
    } catch (error) {
      setInventoryError(error.message);
    } finally {
      setInventoryLoading(false);
    }
  };

  const handleCloseTable = () => {
    setShowTable(false);
    setInventory([]);
    setInventoryError('');
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/urls/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error deleting URL: ${response.status}`);
      }

      setAllUrls((prevUrls) => prevUrls.filter(url => url.id !== id));
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  return (
    <div className="inventory-container">
      <h2>Inventory List</h2>
      <InventoryForm setAllUrls={setAllUrls} />
      {inventoryLoading && <p>Loading inventory...</p>}
      {inventoryError && <p>Error: {inventoryError}</p>}
      {allUrls.length > 0 ? (
        allUrls.map((urlItem) => {
          const slug = urlItem.item_name;
          const formattedName = slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          const colorCode = urlItem.item_color;
          const generatedUrl = `https://www.nuuly.com/api/product/slug/${slug}?color=${colorCode}&view=rent`;

          return (
            <div className="url-item" key={urlItem.id}>
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleInventoryFetch(generatedUrl);
                }}
              >
                {formattedName}
              </a>
              <button className="delete-button" onClick={() => handleDelete(urlItem.id)}> X </button>
            </div>
          );
        })
      ) : (
        <p>No URLs available.</p>
      )}

      {showTable && inventory.length > 0 && (
        <div>
          <h3>Inventory for: {productName}</h3>
          <button onClick={handleCloseTable} className="close-button">
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

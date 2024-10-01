import React, { useState } from 'react';
import InventoryForm from './InventoryForm';
import InventoryContainer from './InventoryContainer';
import '../index.css'; 

const Inventory = () => {
  const [allUrls, setAllUrls] = useState([]); // State to store all URLs from the backend

  return (
    <div>
      <InventoryForm setAllUrls={setAllUrls} />
      <InventoryContainer allUrls={allUrls} />
    </div>
  );
};

export default Inventory;
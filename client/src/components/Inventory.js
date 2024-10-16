import React, { useState } from 'react';

import InventoryContainer from './InventoryContainer';

import '../index.css'; 

const Inventory = () => {
  const [allUrls, setAllUrls] = useState([]); // State to store all URLs from the backend
  

  return (
    <div>

      <InventoryContainer allUrls={allUrls} />
    </div>
  );
};

export default Inventory;
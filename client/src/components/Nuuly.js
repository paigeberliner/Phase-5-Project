import React from 'react';
import '../index.css'; // Import the CSS file

const NuulyLink = () => {
  const handleNuulyClick = () => {
    window.open('https://www.nuuly.com/', '_blank', 'noopener, noreferrer');
  };

  return (
    <div className="nuuly-link-container">
      <img
        className="nuuly-link-image"
        src="data:image/png;base64,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"
        alt="Nuuly Link"
        onClick={handleNuulyClick}
      />
      <p className="nuuly-link-text"> Click on the Nuuly logo to go directly to the nuuly site!</p>
    </div>
  );
};

export default NuulyLink;
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Import the AuthContext
import '../index.css'; // Add your custom styles

const HistoryTable = () => {
  const { isLoggedIn } = useContext(AuthContext); // Get isLoggedIn from context
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/history');
        if (!response.ok) {
          throw new Error(`Error fetching history: ${response.status}`);
        }
        const data = await response.json();
        setHistoryData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (!isLoggedIn) {
    return <p>Please log in to view your tracked URLs.</p>;
  }

  return (
    <div className="inventory-container">
      <h2>Nuuly Items Your Friends Are Tracking</h2>
      {loading && <p>Loading history...</p>}
      {error && <p>Error: {error}</p>}
      {historyData.length > 0 ? (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Tracked URL</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map(item => (
              <tr key={item.id}>
                <td>{item.user}</td>
                <td>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tracked URLs found.</p>
      )}
    </div>
  );
};

export default HistoryTable;

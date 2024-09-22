import React, { useState, useEffect } from 'react';
import '../index.css'; // Assuming your CSS file is named LoginPage.css

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState({}); // Add state to store user data

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Fetch User Data
      const response = await fetch(`http://127.0.0.1:5000/users?email=${email}`);

      if (response.ok) {
        const users = await response.json(); // Parse response as JSON

        // 2. Check for User Existence and Match Email with Username
        const matchingUser = users.find(user => user.email === email);

        if (matchingUser) {
          // User Found, Proceed with Login Logic
          const loginResponse = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }) // Assuming password is also used
          });

          if (loginResponse.ok) {
            // Login Successful
            const loginData = await loginResponse.json(); // Parse login response
            setUser(loginData.user); // Assuming the response contains user data
            setIsLoggedIn(true); // Update login state
          } else {
            const errorMessage = await loginResponse.text(); // Read error message
            setErrorMessage(errorMessage);
          }
        } else {
          setErrorMessage('Incorrect email or password.'); // User not found
        }
      } else {
        setErrorMessage('An error occurred while fetching user data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to connect to server. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div className="welcome-message">
          <h2>Welcome, {email}!</h2>
        </div>
      ) : (
        <>
          <div className="login-message">
            <h2>Welcome to Nuuly Checker</h2>
            <img src="https://m.media-amazon.com/images/I/41iGgXNMr9L._AC_UF894,1000_QL80_.jpg" alt="Smiley flower" />
            <p>Please Login to continue using site.</p>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <h2 className="login-header">Login</h2>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button">Login</button>
          </form>
        </>
      )}
    </div>
  );
};

export default LoginPage;
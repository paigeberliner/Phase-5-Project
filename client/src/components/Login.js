// src/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Import AuthContext

const LoginPage = () => {
  const { login, isLoggedIn, user } = useContext(AuthContext); // Use context to get the login function, isLoggedIn state, and user data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:5000/users?email=${email}`);

      if (response.ok) {
        const users = await response.json();
        const matchingUser = users.find(user => user.email === email);

        if (matchingUser) {
          const loginResponse = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            login(matchingUser); // Call login from context with user data
          } else {
            const errorMessage = await loginResponse.text();
            setErrorMessage(errorMessage);
          }
        } else {
          setErrorMessage('Incorrect email or password. If you do not have a user please go to the profile section to reate a user.');
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
          <h2>Welcome {user.first_name}!</h2> {/* Use user's first name for greeting */}
        </div>
      ) : (
        <>
          <div className="login-message">
            <h2>Welcome to Nuuly Checker</h2>
            <img src="https://m.media-amazon.com/images/I/41iGgXNMr9L._AC_UF894,1000_QL80_.jpg" alt="Smiley flower" />
            <p>Please Login to continue using the site.</p>
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

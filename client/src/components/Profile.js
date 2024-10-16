import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Import AuthContext
import '../index.css'; // Ensure your CSS file is included

const Profile = () => {
    const { isLoggedIn } = useContext(AuthContext); // Access the login state from context
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [message, setMessage] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [userId, setUserId] = useState('');
    const [fetchedUser, setFetchedUser] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { email, first_name: firstName, last_name: lastName };

        try {
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const newUser = await response.json();
                setMessage(`User created successfully: ${newUser.email}`);
                setEmail('');
                setFirstName('');
                setLastName('');
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message}`);
            }
        } catch {
            setMessage('An unexpected error occurred.');
        }
    };

    const fetchUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const user = await response.json();
                setFetchedUser(user);
                setMessage('User fetched successfully.');
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message}`);
            }
        } catch {
            setMessage('An unexpected error occurred.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:5000/users/${deleteId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const result = await response.json();
                setDeleteMessage(result.message);
                setDeleteId('');
            } else {
                const errorData = await response.json();
                setDeleteMessage(`Error: ${errorData.message}`);
            }
        } catch {
            setDeleteMessage('An unexpected error occurred.');
        }
    };

    return (
        <div className="profile-container">
            {/* Create User Section */}
            {!isLoggedIn && (
                <>
                    <h1>Create User</h1>
                    <form className="user-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email:</label>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>First Name:</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Last Name:</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                        <button type="submit" className="button">Create User</button>
                        {message && <p className="message">{message}</p>}
                    </form>
                </>
            )}

            {/* Edit User Section */}
            {isLoggedIn && (
                <>
                    <h2>Edit User</h2>
                    <form className="fetch-user-form" onSubmit={fetchUser}>
                        <div className="input-group">
                            <label>Enter Your Nuuly Checker ID</label>
                            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
                        </div>
                        <button type="submit" className="button">Edit User</button>
                    </form>

                    {fetchedUser && (
                        <div>
                            <h2>Edit User</h2>
                            <form className="edit-user-form" onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        value={fetchedUser.email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>First Name:</label>
                                    <input
                                        type="text"
                                        value={fetchedUser.first_name}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Last Name:</label>
                                    <input
                                        type="text"
                                        value={fetchedUser.last_name}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="button">Update User</button>
                            </form>
                        </div>
                    )}

                    {/* Delete User Section */}
                    <h2>Delete User</h2>
                    <form className="delete-user-form" onSubmit={handleDelete}>
                        <div className="input-group">
                            <label>Enter Your Nuuly Checker ID:</label>
                            <input type="text" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} required />
                        </div>
                        <button type="submit" className="button">Delete User</button>
                        {deleteMessage && <p className="message">{deleteMessage}</p>}
                    </form>
                </>
            )}
        </div>
    );
};

export default Profile;

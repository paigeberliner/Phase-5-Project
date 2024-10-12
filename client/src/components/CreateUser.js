import React, { useState } from 'react';
import '../index.css'; // Ensure your CSS file is included

const CreateUser = () => {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [deleteId, setDeleteId] = useState(''); // State for delete user ID
    const [message, setMessage] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');


    // Handle user creation form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        const userData = {
            email,
            first_name: firstName,
            last_name: lastName,
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const newUser = await response.json();
                setMessage(`User created successfully: ${newUser.email}`);
                // Clear the form fields
                setEmail('');
                setFirstName('');
                setLastName('');
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            setMessage('An unexpected error occurred.');
        }
    };

    // Handle user deletion by ID
    const handleDelete = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        console.log(deleteId);

        try {
            const response = await fetch(`http://127.0.0.1:5000/users/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setDeleteMessage(result.message); // Use correct message from the response
                setDeleteId(''); // Clear the input field after deletion
            } else {
                const errorData = await response.json();
                setDeleteMessage(`Error: ${errorData.message}`); // Correctly set error message
            }
        } catch (error) {
            setDeleteMessage('An unexpected error occurred.'); // Handle unexpected errors
        }
    };

    return (
        <div className="create-user-container">
            <h1>Create User</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create User</button>
            </form>
            {message && <p className="message">{message}</p>} {/* Display success/error messages */}

            <h2>Delete User</h2>
            <form onSubmit={handleDelete}>
                <div className="input-group">
                    <label>User ID:</label>
                    <input
                        type="text"
                        value={deleteId}
                        onChange={(e) => setDeleteId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Delete User</button>
                {deleteMessage && <p className="message">{deleteMessage}</p>} {/* Display success/error messages */}
            </form>
        </div>
    );
};

export default CreateUser;

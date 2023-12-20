// src/App.tsx
import React, { useState } from 'react';
import { User } from './models/User';
import './index.css';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);

  const handleLogin = () => {
    setLoggedIn(!loggedIn);
  };

  const isEmailUnique = (email: string) => {
    return !users.some((user) => user.email === email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as 'Admin' | 'Regular';

    if (name && email && role) {
      if (!isEmailUnique(email)) {
        alert('Email is already in use. Please choose another email.');
        return;
      }

      if (editUserId !== null) {
        const updatedUsers = users.map((user) =>
          user.id === editUserId ? { ...user, name, email, role } : user
        );
        setUsers(updatedUsers);
        setEditUserId(null);
      } else {
        const newUser: User = {
          id: users.length + 1,
          name,
          email,
          role,
        };
        setUsers([...users, newUser]);
      }

      // Clear the form
      e.currentTarget.reset();
    }
  };

  const handleEdit = (userId: number) => {
    setEditUserId(userId);
    const userToEdit = users.find((user) => user.id === userId);

    if (userToEdit) {
      // Fill the form with existing user details
      (document.getElementById('name') as HTMLInputElement).value =
        userToEdit.name;
      (document.getElementById('email') as HTMLInputElement).value =
        userToEdit.email;
      (document.getElementById('role') as HTMLInputElement).value =
        userToEdit.role;
    }
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    // Clear the form
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('email') as HTMLInputElement).value = '';
    (document.getElementById('role') as HTMLSelectElement).value = 'Admin'; // Default role
  };

  return (
    <div className={`container ${loggedIn ? 'logged-in' : ''}`}>
      {loggedIn ? (
        <div>
          <h2>User List</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} - {user.email} - {user.role}{' '}
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => {
                    const updatedUsers = users.filter((u) => u.id !== user.id);
                    setUsers(updatedUsers);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <h2>{editUserId !== null ? 'Edit User' : 'Add User'}</h2>
          <form className="user-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" name="name" id="name" />
            </label>
            <label>
              Email:
              <input type="email" name="email" id="email" />
            </label>
            <label>
              Role:
              <select name="role" id="role">
                <option value="Admin">Admin</option>
                <option value="Regular">Regular</option>
              </select>
            </label>
            <br />
            <button type="submit">
              {editUserId !== null ? 'Update User' : 'Add User'}
            </button>
            {editUserId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      ) : (
        <div>
          <h1>User Management System</h1>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default App;

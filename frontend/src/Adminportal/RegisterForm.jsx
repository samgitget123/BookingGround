import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous messages
    setMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', {
        name,
        phone_number: phone,
        password,
      });
      setMessage(response.data.message);
      // Optionally, clear form fields
      setName('');
      setPhone('');
      setPassword('');
    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      // Display error message
      setError(err.response && err.response.data && err.response.data.message 
               ? err.response.data.message 
               : 'Registration failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form 
        onSubmit={handleSubmit} 
        className="p-4 border rounded shadow" 
        style={{ width: '300px' }}
      >
        <h2 className="mb-4 text-center">Register</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="text"
            id="phone"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

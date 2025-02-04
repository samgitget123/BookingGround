import React, { useState } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/user/loginUser', {
        phone_number: phone,
        password: password,
      });
      console.log(response, 'loginresponse')
      console.log('Login successful:', response);
      // Optionally, you can store the token or navigate to another page:
      localStorage.setItem('token', response.data.token);
      navigate('/admindashboard');
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response && err.response.data && err.response.data.message 
               ? err.response.data.message 
               : 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form 
        onSubmit={handleSubmit} 
        className="p-4 border rounded shadow" 
        style={{ width: '300px' }}
      >
        <h2 className="mb-4 text-center">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
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
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

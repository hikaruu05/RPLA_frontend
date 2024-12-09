import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import API_URL from '../../api';

const LoginForm = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Only for registration
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const endpoint = isRegisterMode
        ? `${API_URL}/register`
        : `${API_URL}/login`;
        const body = isRegisterMode
            ? { name, email, password }
            : { email: name, password };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Request failed');
        }

        const data = await response.json();
        console.log('Success:', data);
        alert(isRegisterMode ? 'Registration successful!' : 'Login successful!');
    } catch (error) {
        console.error('Error:', error.message);
        setError(error.message);
    }
};

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setSuccess('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className={`wrapper ${isRegisterMode ? 'active' : ''}`}>
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <h1>{isRegisterMode ? 'Registration' : 'Login'}</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          {isRegisterMode && (
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaEnvelope className="icon" />
            </div>
          )}
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
          {isRegisterMode && (
            <div className="remember-forgot">
              <label>
                <input type="checkbox" required /> I agree to the terms & conditions
              </label>
            </div>
          )}
          {!isRegisterMode && (
            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a
            href="/remember-forgot" onClick={(e) => {e.preventDefault();
                
                console.log('Forgot password clicked');
            }}
            className="clickable-text">
                Forgot password?
                </a>
            </div>
          )}
          <button type="submit">{isRegisterMode ? 'Register' : 'Login'}</button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="register-link">
            <p>
         {isRegisterMode
            ? 'Already have an account? '
            : "Don't have an account? "}
            <a
                href="/register-link" onClick={(e) => {e.preventDefault();
                    toggleMode();
                }}
                className="clickable-text">
                    {isRegisterMode ? 'Login' : 'Register'}
                    </a>
                </p>
            </div>  
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

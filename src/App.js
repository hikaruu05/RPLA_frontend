import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserDashboard from './components/UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect dari root ke User Dashboard */}
        <Route path="/" element={<Navigate to="/user" />} />
        <Route path="/user/*" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

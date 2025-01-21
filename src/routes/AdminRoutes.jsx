// src/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from '../pages/Dashboard/Dashboard';
import Clubs from '../pages/Clubs/Clubs';
import Candidates from '../pages/Candidates/Candidates';
import Applications from '../pages/Applications/Applications';
import Events from '../pages/Events/Events';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/candidates" element={<Candidates />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/events" element={<Events />} />
      {/* more routes if needed */}
    </Routes>
  );
}

export default AdminRoutes;

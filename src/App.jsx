import React from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MyTripsPage from './pages/MyTripsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <div id="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cursele-mele" element={<MyTripsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <nav className="bottom-nav">
        <NavItem to="/" label="Acasă" end />
        <NavItem to="/cursele-mele" label="Cursele mele" />
        <NavItem to="/chat" label="Chat" />
        <NavItem to="/profil" label="Profil" />
      </nav>
    </div>
  );
}

function NavItem({ to, label, end = false }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
      {label}
    </NavLink>
  );
}

import React, { useMemo, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MyTripsPage from './pages/MyTripsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import { mockTrips, myTrips as baseMyTrips } from './data';

export default function App() {
  const [publishedTrips, setPublishedTrips] = useState([]);

  const allTrips = useMemo(() => [...publishedTrips, ...mockTrips], [publishedTrips]);

  const myTrips = useMemo(
    () => ({
      ...baseMyTrips,
      driver: [...publishedTrips.map((trip) => ({ id: trip.id, route: trip.route, when: trip.when, seats: trip.seats })), ...baseMyTrips.driver],
      courier: [
        ...publishedTrips
          .filter((trip) => trip.mode !== 'passengers')
          .map((trip) => ({ id: `${trip.id}-c`, route: trip.route, when: trip.when })),
        ...baseMyTrips.courier
      ]
    }),
    [publishedTrips]
  );

  return (
    <div id="app">
      <Routes>
        <Route path="/" element={<HomePage trips={allTrips} onPublishTrip={setPublishedTrips} />} />
        <Route path="/cursele-mele" element={<MyTripsPage myTrips={myTrips} />} />
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

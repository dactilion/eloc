import React, { useMemo, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MyTripsPage from './pages/MyTripsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { getSession, getTrips, getUsers, saveSession, saveTrips, saveUsers, clearSession } from './storage';
import { myTrips as baseMyTrips } from './data';

export default function App() {
  const [session, setSession] = useState(getSession());
  const [users, setUsers] = useState(getUsers());
  const [trips, setTrips] = useState(getTrips());

  const onLogin = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return false;
    const newSession = { email: user.email, name: user.name, phone: user.phone };
    setSession(newSession);
    saveSession(newSession);
    return true;
  };

  const onRegister = (data) => {
    if (users.some((u) => u.email === data.email)) return false;
    const newUser = { name: data.name, email: data.email, password: data.password, phone: data.phone };
    const nextUsers = [newUser, ...users];
    setUsers(nextUsers);
    saveUsers(nextUsers);
    const newSession = { email: newUser.email, name: newUser.name, phone: newUser.phone };
    setSession(newSession);
    saveSession(newSession);
    return true;
  };

  const addTrip = (trip) => {
    const next = [trip, ...trips];
    setTrips(next);
    saveTrips(next);
  };

  const deleteTrip = (tripId) => {
    const next = trips.filter((t) => t.id !== tripId);
    setTrips(next);
    saveTrips(next);
  };

  const myUserTrips = useMemo(() => trips.filter((t) => t.ownerEmail === session?.email), [trips, session]);
  const myTrips = useMemo(
    () => ({
      ...baseMyTrips,
      driver: myUserTrips.map((trip) => ({ id: trip.id, route: trip.route, when: trip.when, seats: trip.seats, price: trip.price, status: 'Activă', mode: trip.mode })),
      courier: myUserTrips.filter((t) => t.mode !== 'passengers').map((trip) => ({ id: `${trip.id}-c`, route: trip.route, when: trip.when, status: 'Activă' }))
    }),
    [myUserTrips]
  );

  if (!session) {
    return <AuthPage onLogin={onLogin} onRegister={onRegister} />;
  }

  return (
    <div id="app">
      <Routes>
        <Route path="/" element={<HomePage trips={trips} session={session} onPublishTrip={addTrip} />} />
        <Route path="/cursele-mele" element={<MyTripsPage myTrips={myTrips} onDeleteTrip={deleteTrip} />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profil" element={<ProfilePage session={session} onLogout={() => { clearSession(); setSession(null); }} />} />
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
  return <NavLink to={to} end={end} className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>{label}</NavLink>;
}

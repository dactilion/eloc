import React, { useMemo, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MyTripsPage from './pages/MyTripsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import {
  getReservations,
  getSession,
  getTrips,
  getUsers,
  saveReservations,
  saveSession,
  saveTrips,
  saveUsers,
  clearSession
} from './storage';

export default function App() {
  const [session, setSession] = useState(getSession());
  const [users, setUsers] = useState(getUsers());
  const [trips, setTrips] = useState(getTrips());
  const [reservations, setReservations] = useState(getReservations());

  const onLogin = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return false;
    const s = { email: user.email, name: user.name, phone: user.phone };
    setSession(s); saveSession(s); return true;
  };

  const onRegister = (data) => {
    if (users.some((u) => u.email === data.email)) return false;
    const newUser = { name: data.name, email: data.email, password: data.password, phone: data.phone };
    const nextUsers = [newUser, ...users];
    setUsers(nextUsers); saveUsers(nextUsers);
    const s = { email: newUser.email, name: newUser.name, phone: newUser.phone };
    setSession(s); saveSession(s); return true;
  };

  const addTrip = (trip) => { const next = [trip, ...trips]; setTrips(next); saveTrips(next); };
  const updateTrip = (tripId, updates) => {
    const next = trips.map((t) => (t.id === tripId ? { ...t, ...updates } : t));
    setTrips(next); saveTrips(next);
  };

  const deleteTrip = (tripId) => {
    const nextTrips = trips.filter((t) => t.id !== tripId);
    const nextReservations = reservations.filter((r) => r.tripId !== tripId);
    setTrips(nextTrips); saveTrips(nextTrips);
    setReservations(nextReservations); saveReservations(nextReservations);
  };

  const reserveTrip = (tripId, passengers = 1) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || trip.seats < passengers) return false;
    const already = reservations.find((r) => r.tripId === tripId && r.userEmail === session.email);
    if (already) return false;
    const nextTrips = trips.map((t) => (t.id === tripId ? { ...t, seats: t.seats - passengers } : t));
    const nextReservations = [{ id: `res-${Date.now()}`, tripId, userEmail: session.email, passengers }, ...reservations];
    setTrips(nextTrips); saveTrips(nextTrips);
    setReservations(nextReservations); saveReservations(nextReservations);
    return true;
  };

  const cancelReservation = (tripId) => {
    const reservation = reservations.find((r) => r.tripId === tripId && r.userEmail === session.email);
    if (!reservation) return;
    const nextTrips = trips.map((t) => (t.id === tripId ? { ...t, seats: t.seats + reservation.passengers } : t));
    const nextReservations = reservations.filter((r) => !(r.tripId === tripId && r.userEmail === session.email));
    setTrips(nextTrips); saveTrips(nextTrips);
    setReservations(nextReservations); saveReservations(nextReservations);
  };

  const myDriverTrips = useMemo(() => trips.filter((t) => t.ownerEmail === session?.email), [trips, session]);
  const myReservations = useMemo(() => reservations.filter((r) => r.userEmail === session?.email), [reservations, session]);

  if (!session) return <AuthPage onLogin={onLogin} onRegister={onRegister} />;

  return (
    <div id="app">
      <Routes>
        <Route path="/" element={<HomePage trips={trips} myReservations={myReservations} session={session} onPublishTrip={addTrip} onReserveTrip={reserveTrip} onCancelReservation={cancelReservation} />} />
        <Route path="/cursele-mele" element={<MyTripsPage myDriverTrips={myDriverTrips} myReservations={myReservations} trips={trips} onDeleteTrip={deleteTrip} onCancelReservation={cancelReservation} onUpdateTrip={updateTrip} />} />
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

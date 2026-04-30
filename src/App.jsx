import React, { useMemo, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MyTripsPage from './pages/MyTripsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { getReservations, getSession, getTrips, getUsers, saveReservations, saveSession, saveTrips, saveUsers, clearSession } from './storage';
import { mockTrips } from './data';

const normalizeTripDate = (trip) => trip.date || (typeof trip.when === 'string' && /\d{4}-\d{2}-\d{2}/.test(trip.when) ? trip.when.slice(0,10) : '');

export default function App() {
  const [session, setSession] = useState(getSession());
  const [users, setUsers] = useState(getUsers());
  const [trips, setTrips] = useState(() => { const existing = getTrips(); if (existing.length) return existing; const today = new Date().toISOString().slice(0,10); const seeded = mockTrips.map((t, i) => ({ ...t, id: `seed-${t.id}`, date: today, ownerEmail: `seed-driver-${i}@eloc.ro`, when: `${today} ${t.time}` })); saveTrips(seeded); return seeded; });
  const [reservations, setReservations] = useState(getReservations());

  const onLogin = (email, password) => { const user = users.find((u) => u.email === email && u.password === password); if (!user) return false; const s = { email: user.email, name: user.name, phone: user.phone }; setSession(s); saveSession(s); return true; };
  const onRegister = (data) => { if (users.some((u) => u.email === data.email)) return false; const nu = { name: data.name, email: data.email, password: data.password, phone: data.phone }; const next = [nu, ...users]; setUsers(next); saveUsers(next); const s = { email: nu.email, name: nu.name, phone: nu.phone }; setSession(s); saveSession(s); return true; };

  const addTrip = (trip) => { const next = [{ ...trip, date: normalizeTripDate(trip) }, ...trips]; setTrips(next); saveTrips(next); };
  const updateTrip = (tripId, updates) => { const next = trips.map((t) => (t.id === tripId ? { ...t, ...updates, date: normalizeTripDate({ ...t, ...updates }) } : t)); setTrips(next); saveTrips(next); };
  const deleteTrip = (tripId) => { const nextTrips = trips.filter((t) => t.id !== tripId); const nextRes = reservations.filter((r) => r.tripId !== tripId); setTrips(nextTrips); saveTrips(nextTrips); setReservations(nextRes); saveReservations(nextRes); };

  const reserveTrip = (tripId, passengers = 1) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || trip.seats < passengers) return false;
    if (reservations.find((r) => r.tripId === tripId && r.userEmail === session.email && r.kind === 'passenger')) return false;
    const nextTrips = trips.map((t) => (t.id === tripId ? { ...t, seats: t.seats - passengers } : t));
    const nextRes = [{ id: `res-${Date.now()}`, tripId, userEmail: session.email, passengers, kind: 'passenger' }, ...reservations];
    setTrips(nextTrips); saveTrips(nextTrips); setReservations(nextRes); saveReservations(nextRes); return true;
  };
  const reserveCourier = (tripId) => {
    if (reservations.find((r) => r.tripId === tripId && r.userEmail === session.email && r.kind === 'courier')) return false;
    const nextRes = [{ id: `res-${Date.now()}`, tripId, userEmail: session.email, passengers: 0, kind: 'courier' }, ...reservations];
    setReservations(nextRes); saveReservations(nextRes); return true;
  };
  const cancelReservation = (tripId, kind = 'passenger') => {
    const reservation = reservations.find((r) => r.tripId === tripId && r.userEmail === session.email && r.kind === kind);
    if (!reservation) return;
    let nextTrips = trips;
    if (kind === 'passenger') nextTrips = trips.map((t) => (t.id === tripId ? { ...t, seats: t.seats + reservation.passengers } : t));
    const nextRes = reservations.filter((r) => !(r.tripId === tripId && r.userEmail === session.email && r.kind === kind));
    setTrips(nextTrips); saveTrips(nextTrips); setReservations(nextRes); saveReservations(nextRes);
  };

  const myDriverTrips = useMemo(() => trips.filter((t) => t.ownerEmail === session?.email), [trips, session]);
  const myReservations = useMemo(() => reservations.filter((r) => r.userEmail === session?.email && r.kind === 'passenger'), [reservations, session]);
  const myCourierReservations = useMemo(() => reservations.filter((r) => r.userEmail === session?.email && r.kind === 'courier'), [reservations, session]);

  if (!session) return <AuthPage onLogin={onLogin} onRegister={onRegister} />;
  return <div id="app"><Routes><Route path="/" element={<HomePage trips={trips} myReservations={myReservations} myCourierReservations={myCourierReservations} session={session} onPublishTrip={addTrip} onReserveTrip={reserveTrip} onReserveCourier={reserveCourier} onCancelReservation={cancelReservation} />} /><Route path="/cursele-mele" element={<MyTripsPage myDriverTrips={myDriverTrips} myReservations={myReservations} trips={trips} onDeleteTrip={deleteTrip} onCancelReservation={cancelReservation} onUpdateTrip={updateTrip} />} /><Route path="/chat" element={<ChatPage />} /><Route path="/profil" element={<ProfilePage session={session} onLogout={() => { clearSession(); setSession(null); }} />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes><nav className="bottom-nav"><NavItem to="/" label="Acasă" end /><NavItem to="/cursele-mele" label="Cursele mele" /><NavItem to="/chat" label="Chat" /><NavItem to="/profil" label="Profil" /></nav></div>;
}

function NavItem({ to, label, end = false }) { return <NavLink to={to} end={end} className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>{label}</NavLink>; }

export const KEYS = {
  users: 'eloc_users',
  session: 'eloc_session',
  trips: 'eloc_trips',
  reservations: 'eloc_reservations'
};

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getUsers = () => read(KEYS.users, []);
export const saveUsers = (users) => write(KEYS.users, users);

export const getSession = () => read(KEYS.session, null);
export const saveSession = (session) => write(KEYS.session, session);
export const clearSession = () => localStorage.removeItem(KEYS.session);

export const getTrips = () => read(KEYS.trips, []);
export const saveTrips = (trips) => write(KEYS.trips, trips);

export const getReservations = () => read(KEYS.reservations, []);
export const saveReservations = (reservations) => write(KEYS.reservations, reservations);

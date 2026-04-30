import React, { useState } from 'react';

export default function MyTripsPage({ myDriverTrips, myReservations, trips, onDeleteTrip, onCancelReservation, onUpdateTrip }) {
  const [editing, setEditing] = useState(null);
  const reservedTrips = myReservations.map((r) => ({ ...r, trip: trips.find((t) => t.id === r.tripId) })).filter((x) => x.trip);
  return <><header className="header"><h1>Cursele mele</h1><p>Curse publicate și rezervări.</p></header><section className="card"><h2>Ca șofer</h2>{myDriverTrips.length ? <div className="list">{myDriverTrips.map((r) => <article className="card trip-card" key={r.id}><h3>{r.route}</h3><p className="meta">{r.when}</p><p className="meta">Locuri: {r.seats} • Preț: {r.price} • Status: {r.seats <= 0 ? 'Cursă plină' : 'Activă'}</p><div className="row-2"><button className="btn subtle-btn" onClick={() => setEditing(r)}>Editează cursa</button><button className="btn subtle-btn" onClick={() => onDeleteTrip(r.id)}>Șterge cursa</button></div></article>)}</div> : <div className="empty">Nicio cursă publicată.</div>}</section>{editing && <div className="modal-backdrop"><div className="modal-content"><EditTrip trip={editing} onClose={() => setEditing(null)} onSave={onUpdateTrip} /></div></div>}<section className="card"><h2>Rezervările mele (pasager)</h2>{reservedTrips.length ? <div className="list">{reservedTrips.map(({ trip, passengers }) => <article className="card trip-card" key={trip.id}><h3>{trip.route}</h3><p className="meta">{trip.when}</p><p className="meta">Rezervat pentru: {passengers} persoană • Preț: {trip.price}</p><button className="btn subtle-btn" onClick={() => onCancelReservation(trip.id)}>Anulează rezervarea</button></article>)}</div> : <div className="empty">Nu ai rezervări active.</div>}</section></>;
}

function EditTrip({ trip, onClose, onSave }) {
  const [mode, setMode] = useState(trip.mode);
  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    onSave(trip.id, {
      route: `${data.from} → ${data.to}`,
      when: new Date(data.datetime).toLocaleString('ro-RO', { dateStyle: 'short', timeStyle: 'short' }),
      date: data.datetime.split('T')[0],
      time: new Date(data.datetime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
      seats: Number(data.seats),
      price: `${data.price} RON`,
      mode: data.mode,
      parcelSize: data.mode === 'passengers' ? '' : data.parcelSize
    });
    onClose();
  };
  const [from, to] = trip.route.split(' → ');
  const priceNum = Number(String(trip.price).replace(/[^\d]/g, '')) || 0;
  return <section className="card"><div className="card-title-row"><h2>Editează cursa</h2><button className="subtle-btn" onClick={onClose}>Închide</button></div><form className="form-grid" onSubmit={onSubmit}><label>Oraș plecare<input required name="from" defaultValue={from} /></label><label>Oraș destinație<input required name="to" defaultValue={to} /></label><label>Data și ora<input required type="datetime-local" name="datetime" defaultValue={toDateTimeLocal(trip.date, trip.time)} /></label><label>Locuri disponibile<input required type="number" min="0" max="6" name="seats" defaultValue={trip.seats} /></label><label className="full">Preț / pasager<input required type="number" min="0" name="price" defaultValue={priceNum} /></label><div className="full modes"><label className="mode-pill"><span><input checked={mode === 'passengers'} onChange={() => setMode('passengers')} type="radio" name="mode" value="passengers" />Accept pasageri</span></label><label className="mode-pill"><span><input checked={mode === 'parcel-only'} onChange={() => setMode('parcel-only')} type="radio" name="mode" value="parcel-only" />Accept colete</span></label><label className="mode-pill"><span><input checked={mode === 'mixed'} onChange={() => setMode('mixed')} type="radio" name="mode" value="mixed" />Accept pasageri și colete</span></label></div><label className="full">Mărime colet<select name="parcelSize" defaultValue={trip.parcelSize || 'small'} disabled={mode === 'passengers'}><option value="small">Mic</option><option value="medium">Mediu</option><option value="large">Mare</option></select></label><div className="full"><button className="btn">Salvează</button></div></form></section>;
}

function toDateTimeLocal(date, time) {
  if (!date) return '';
  const t = (time || '00:00').slice(0, 5);
  return `${date}T${t}`;
}

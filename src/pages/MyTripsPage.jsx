import React from 'react';

export default function MyTripsPage({ myTrips, onDeleteTrip }) {
  return <><header className="header"><h1>Cursele mele</h1><p>Toate cursele publicate de tine.</p></header><TripSection title="Ca șofer" rows={myTrips.driver} type="driver" onDeleteTrip={onDeleteTrip} /><TripSection title="Ca pasager" rows={myTrips.passenger} type="passenger" /><TripSection title="Curier / colete" rows={myTrips.courier} type="courier" /></>;
}

function TripSection({ title, rows, type, onDeleteTrip }) {
  return <section className="card"><h2>{title}</h2>{rows.length ? <div className="list">{rows.map((r) => <article className="card trip-card" key={r.id}><h3>{r.route}</h3><p className="meta">{r.when}</p><p className="meta">{type === 'driver' ? `Locuri: ${r.seats} • Preț: ${r.price} • Status: ${r.status}` : type === 'passenger' ? `Preț: ${r.price}` : `Status: ${r.status}`}</p>{type === 'driver' && <button className="btn subtle-btn" onClick={() => onDeleteTrip(r.id)}>Șterge cursa</button>}</article>)}</div> : <div className="empty">Nicio înregistrare.</div>}</section>;
}

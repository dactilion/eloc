import React from 'react';

export default function MyTripsPage({ myTrips }) {
  return (
    <>
      <header className="header"><h1>Cursele mele</h1><p>Publicate și rezervările tale.</p></header>
      <TripSection title="Ca șofer" rows={myTrips.driver} type="driver" />
      <TripSection title="Ca pasager" rows={myTrips.passenger} type="passenger" />
      <TripSection title="Curier / colete" rows={myTrips.courier} type="courier" />
    </>
  );
}

function TripSection({ title, rows, type }) {
  return <section className="card"><h2>{title}</h2>{rows.length ? <div className="list">{rows.map((r) => <article className="card trip-card" key={r.id}><h3>{r.route}</h3><p className="meta">{r.when}</p><p className="meta">{type === 'driver' ? `Locuri: ${r.seats}` : type === 'passenger' ? `Preț: ${r.price}` : 'Transport colet'}</p></article>)}</div> : <div className="empty">Nicio înregistrare.</div>}</section>;
}

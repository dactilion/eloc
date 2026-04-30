import React, { useMemo, useState } from 'react';

const quickCards = [
  { id: 'cauta', title: 'Caută cursă', desc: 'Găsește rapid un loc disponibil.' },
  { id: 'publica', title: 'Publică cursă', desc: 'Adaugă o cursă în câteva secunde.' },
  { id: 'curier', title: 'Curier', desc: 'Trimite sau caută transport pentru colete.' }
];

export default function HomePage({ trips, onPublishTrip, session, onReserveTrip, onCancelReservation, myReservations }) {
  const [panel, setPanel] = useState('cauta');
  return <><header className="header"><h1>Bine ai venit, {session.name}</h1><p>E loc, folosește-l.</p></header><section className="grid-quick">{quickCards.map((card) => <button key={card.id} className={`quick-btn ${panel === card.id ? 'active' : ''}`} onClick={() => setPanel(card.id)}><strong>{card.title}</strong><span>{card.desc}</span></button>)}</section>{panel === 'cauta' && <SearchPanel trips={trips} myReservations={myReservations} onReserveTrip={onReserveTrip} onCancelReservation={onCancelReservation} />}{panel === 'publica' && <PublishPanel onPublishTrip={onPublishTrip} session={session} />}{panel === 'curier' && <CourierPanel trips={trips} />}</>;
}

function SearchPanel({ trips, myReservations, onReserveTrip, onCancelReservation }) {
  const [loading, setLoading] = useState(false); const [filters, setFilters] = useState({ from: '', to: '' });
  const reservedIds = new Set(myReservations.map((r) => r.tripId));
  const filteredTrips = useMemo(() => trips.filter((t) => t.mode !== 'parcel-only' && (!filters.from || t.route.toLowerCase().includes(filters.from.toLowerCase())) && (!filters.to || t.route.toLowerCase().includes(filters.to.toLowerCase()))), [filters, trips]);
  const onSubmit = (e) => { e.preventDefault(); if (!e.currentTarget.reportValidity()) return; const d = Object.fromEntries(new FormData(e.currentTarget).entries()); setLoading(true); setTimeout(() => { setFilters({ from: d.from, to: d.to }); setLoading(false); }, 300); };
  return <section className="card"><div className="card-title-row"><h2>Caută cursă</h2><span className="status">Pasager</span></div><form className="form-grid" onSubmit={onSubmit}><label>Oraș plecare<input required name="from" /></label><label>Oraș destinație<input required name="to" /></label><label>Data<input required type="date" /></label><label>Număr pasageri<input required type="number" min="1" max="6" defaultValue="1" /></label><div className="full"><button className="btn">Caută curse</button></div></form>{loading ? <p className="meta">Se caută curse...</p> : <TripsList trips={filteredTrips} reservedIds={reservedIds} onReserveTrip={onReserveTrip} onCancelReservation={onCancelReservation} />}</section>;
}

function PublishPanel({ onPublishTrip, session }) {
  const [feedback, setFeedback] = useState('Completează formularul pentru a publica cursa.');
  const onSubmit = (e) => { e.preventDefault(); if (!e.currentTarget.reportValidity()) return; const data = Object.fromEntries(new FormData(e.currentTarget).entries()); onPublishTrip({ id: `trip-${Date.now()}`, ownerEmail: session.email, driver: session.name, route: `${data.from} → ${data.to}`, when: new Date(data.datetime).toLocaleString('ro-RO', { dateStyle: 'short', timeStyle: 'short' }), time: new Date(data.datetime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }), seats: Number(data.seats), price: `${data.price} RON`, mode: data.mode }); setFeedback('Cursa a fost publicată cu succes.'); e.currentTarget.reset(); };
  return <section className="card"><div className="card-title-row"><h2>Publică cursă</h2><span className="status success">Șofer</span></div><form className="form-grid" onSubmit={onSubmit}><label>Oraș plecare<input required name="from" /></label><label>Oraș destinație<input required name="to" /></label><label>Data și ora<input required type="datetime-local" name="datetime" /></label><label>Locuri disponibile<input required type="number" min="0" max="6" name="seats" defaultValue="3" /></label><label className="full">Preț / pasager<input required type="number" min="0" name="price" /></label><div className="full modes"><label className="mode-pill"><span><input defaultChecked type="radio" name="mode" value="passengers" />Accept pasageri</span></label><label className="mode-pill"><span><input type="radio" name="mode" value="parcel-only" />Accept colete</span></label><label className="mode-pill"><span><input type="radio" name="mode" value="mixed" />Accept pasageri și colete</span></label></div><label className="full">Mărime colet<select name="parcelSize"><option value="small">Mic (plic)</option><option value="medium">Mediu (cutie pantofi)</option><option value="large">Mare (geamantan cabină)</option></select></label><div className="full"><button className="btn">Publică</button></div></form><p className="meta">{feedback}</p></section>;
}

function CourierPanel({ trips }) { const courierTrips = trips.filter((t) => t.mode !== 'passengers'); return <section className="card"><div className="card-title-row"><h2>Curier</h2><span className="status warning">Colete</span></div><TripsList trips={courierTrips} reservedIds={new Set()} hideActions /></section>; }

function TripsList({ trips, reservedIds, onReserveTrip, onCancelReservation, hideActions = false }) {
  if (!trips.length) return <div className="empty">Nu există curse disponibile momentan.</div>;
  return <div className="list">{trips.map((t) => { const isReserved = reservedIds.has(t.id); const full = t.seats <= 0; return <article key={t.id} className="card trip-card"><h3>{t.route}</h3><div className="trip-meta"><span>Șofer: {t.driver}</span><span>Plecare: {t.time}</span></div><div className="trip-meta"><span>Preț: {t.price}</span><span>{full ? 'Cursă plină' : `Locuri: ${t.seats}`}</span></div>{!hideActions && <div className="action-row">{!isReserved && !full && <button className="btn" onClick={() => onReserveTrip(t.id, 1)}>Rezervă cursa</button>}{isReserved && <button className="btn subtle-btn" onClick={() => onCancelReservation(t.id)}>Anulează rezervarea</button>}{!isReserved && full && <button className="btn subtle-btn" disabled>Cursă plină</button>}</div>}</article>; })}</div>;
}

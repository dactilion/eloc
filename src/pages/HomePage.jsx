import React, { useMemo, useState } from 'react';
import { user } from '../data';

const quickCards = [
  { id: 'cauta', title: 'Caută cursă', desc: 'Găsește rapid un loc disponibil.' },
  { id: 'publica', title: 'Publică cursă', desc: 'Adaugă o cursă în câteva secunde.' },
  { id: 'curier', title: 'Curier', desc: 'Trimite sau caută transport pentru colete.' }
];

export default function HomePage({ trips, onPublishTrip }) {
  const [panel, setPanel] = useState('cauta');
  return (
    <>
      <header className="header">
        <h1>Bine ai venit, {user.name}</h1>
        <p>E loc, folosește-l.</p>
      </header>
      <section className="grid-quick">
        {quickCards.map((card) => (
          <button key={card.id} className={`quick-btn ${panel === card.id ? 'active' : ''}`} onClick={() => setPanel(card.id)}>
            <strong>{card.title}</strong><span>{card.desc}</span>
          </button>
        ))}
      </section>
      {panel === 'cauta' && <SearchPanel trips={trips} />}
      {panel === 'publica' && <PublishPanel onPublishTrip={onPublishTrip} />}
      {panel === 'curier' && <CourierPanel trips={trips} />}
    </>
  );
}

function SearchPanel({ trips }) {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ from: '', to: '' });
  const filteredTrips = useMemo(() => trips.filter((t) => t.mode !== 'parcel-only' && (!filters.from || t.route.toLowerCase().includes(filters.from.toLowerCase())) && (!filters.to || t.route.toLowerCase().includes(filters.to.toLowerCase()))), [filters, trips]);
  const onSubmit = (e) => { e.preventDefault(); if (!e.currentTarget.reportValidity()) return; const data = Object.fromEntries(new FormData(e.currentTarget).entries()); setLoading(true); setTimeout(() => { setFilters({ from: data.from, to: data.to }); setLoading(false); }, 500); };
  return <section className="card"><div className="card-title-row"><h2>Caută cursă</h2><span className="status">Pasager</span></div><form className="form-grid" onSubmit={onSubmit}><label>Oraș plecare<input required name="from" /></label><label>Oraș destinație<input required name="to" /></label><label>Data<input required type="date" name="date" /></label><label>Număr pasageri<input required type="number" min="1" max="6" defaultValue="1" name="passengers" /></label><div className="full"><button className="btn">Caută curse</button></div></form>{loading ? <p className="meta">Se caută curse...</p> : <TripsList trips={filteredTrips} />}</section>;
}

function PublishPanel({ onPublishTrip }) {
  const [feedback, setFeedback] = useState('Completează formularul pentru a publica cursa.');
  const [error, setError] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) { setError(true); setFeedback('Verifică datele introduse.'); return; }
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const route = `${data.from} → ${data.to}`;
    const when = new Date(data.datetime).toLocaleString('ro-RO', { dateStyle: 'short', timeStyle: 'short' });
    const trip = {
      id: `pub-${Date.now()}`,
      driver: user.name,
      time: new Date(data.datetime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
      route,
      when,
      price: `${data.price} RON`,
      seats: Number(data.seats),
      mode: data.mode
    };
    onPublishTrip((prev) => [trip, ...prev]);
    setError(false);
    setFeedback(data.mode === 'parcel-only' ? `Cursa de curier a fost publicată (${route}, colet ${data.parcelSize}).` : `Cursa a fost publicată (${route}).`);
    e.currentTarget.reset();
  };
  return <section className="card"><div className="card-title-row"><h2>Publică cursă</h2><span className="status success">Șofer</span></div><form className="form-grid" onSubmit={onSubmit}><label>Oraș plecare<input required name="from" /></label><label>Oraș destinație<input required name="to" /></label><label>Data și ora<input required type="datetime-local" name="datetime" /></label><label>Locuri disponibile<input required type="number" min="0" max="6" name="seats" defaultValue="3" /></label><label className="full">Preț / pasager<input required type="number" min="0" name="price" /></label><div className="full modes"><label className="mode-pill"><span><input defaultChecked type="radio" name="mode" value="passengers" />Accept pasageri</span></label><label className="mode-pill"><span><input type="radio" name="mode" value="parcel-only" />Accept colete</span></label><label className="mode-pill"><span><input type="radio" name="mode" value="mixed" />Accept pasageri și colete</span></label></div><label className="full">Mărime colet<select name="parcelSize"><option value="small">Mic (plic)</option><option value="medium">Mediu (cutie pantofi)</option><option value="large">Mare (geamantan cabină)</option></select></label><div className="full"><button className="btn">Publică</button></div></form><p className={error ? 'error' : 'meta'}>{feedback}</p></section>;
}

function CourierPanel({ trips }) {
  const [loading, setLoading] = useState(false); const [show, setShow] = useState(false);
  const courierTrips = trips.filter((t) => t.mode !== 'passengers');
  const onSubmit = (e) => { e.preventDefault(); if (!e.currentTarget.reportValidity()) return; setLoading(true); setTimeout(() => { setLoading(false); setShow(true); }, 500); };
  return <section className="card"><div className="card-title-row"><h2>Curier</h2><span className="status warning">Colete</span></div><form className="form-grid" onSubmit={onSubmit}><label>Oraș predare<input required /></label><label>Oraș livrare<input required /></label><label>Dimensiune colet<select><option>Mic</option><option>Mediu</option><option>Mare</option></select></label><label>Greutate aproximativă (kg)<input required type="number" min="0.1" step="0.1" /></label><label className="full">Data dorită<input required type="date" /></label><div className="full"><button className="btn">Caută transport colet</button></div></form>{loading ? <p className="meta">Se caută curse pentru colet...</p> : show ? <TripsList trips={courierTrips} /> : <div className="empty">Completează formularul pentru a vedea cursele disponibile.</div>}</section>;
}

function TripsList({ trips }) {
  if (!trips.length) return <div className="empty">Nu există curse disponibile momentan.</div>;
  return <div className="list">{trips.map((t) => <article key={t.id} className="card trip-card"><h3>{t.route}</h3><div className="trip-meta"><span>Șofer: {t.driver}</span><span>Plecare: {t.time}</span></div><div className="trip-meta"><span>Preț: {t.price}</span><span>Locuri: {t.seats}</span></div></article>)}</div>;
}

import React, { useMemo, useState } from 'react';

const quickCards = [
  { id: 'cauta', title: 'Caută cursă', desc: 'Găsește rapid un loc disponibil.' },
  { id: 'publica', title: 'Publică cursă', desc: 'Adaugă o cursă în câteva secunde.' },
  { id: 'curier', title: 'Curier', desc: 'Trimite sau caută transport pentru colete.' }
];

export default function HomePage({ trips, onPublishTrip, session, onReserveTrip, onReserveCourier, onCancelReservation, myReservations, myCourierReservations }) {
  const [panel, setPanel] = useState('cauta');
  return (
    <>
      <header className="header"><h1>Bine ai venit, {session.name}</h1><p>E loc, folosește-l.</p></header>
      <section className="grid-quick">{quickCards.map((card) => <button key={card.id} className={`quick-btn ${panel === card.id ? 'active' : ''}`} onClick={() => setPanel(card.id)}><strong>{card.title}</strong><span>{card.desc}</span></button>)}</section>
      {panel === 'cauta' && <SearchPanel trips={trips} myReservations={myReservations} onReserveTrip={onReserveTrip} onCancelReservation={onCancelReservation} />}
      {panel === 'publica' && <PublishPanel onPublishTrip={onPublishTrip} session={session} />}
      {panel === 'curier' && <CourierPanel trips={trips} myCourierReservations={myCourierReservations} onReserveCourier={onReserveCourier} onCancelReservation={onCancelReservation} />}
    </>
  );
}

function SearchPanel({ trips, myReservations, onReserveTrip, onCancelReservation }) {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ from: '', to: '', date: '' });
  const reserved = new Map(myReservations.map((r) => [r.tripId, r]));
  const filteredTrips = useMemo(() => {
    if (!filters.date) return [];
    return trips.filter((t) => t.mode !== 'parcel-only' && (t.date || '') === filters.date && (!filters.from || t.route.toLowerCase().startsWith(filters.from.toLowerCase())) && (!filters.to || t.route.toLowerCase().endsWith(filters.to.toLowerCase())));
  }, [trips, filters]);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setLoading(true);
    setTimeout(() => { setFilters({ from: String(data.from || '').trim(), to: String(data.to || '').trim(), date: data.date }); setLoading(false); }, 250);
  };

  return <section className="card"><div className="card-title-row"><h2>Caută cursă</h2><span className="status">Pasager</span></div><form className="form-grid" onSubmit={onSubmit}><label>Oraș plecare<input name="from" /></label><label>Oraș destinație<input name="to" /></label><label>Data<input required type="date" name="date" /></label><label>Număr pasageri<input required type="number" min="1" max="4" defaultValue="1" /></label><div className="full"><button className="btn">Caută curse</button></div></form>{loading ? <p className="meta">Se caută curse...</p> : <TripsList trips={filteredTrips} reservedMap={reserved} onReserveTrip={onReserveTrip} onCancelReservation={onCancelReservation} selectedDate={filters.date} />}</section>;
}

function CourierPanel({ trips, myCourierReservations, onReserveCourier, onCancelReservation }) {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ from: '', to: '', date: '' });
  const courierTrips = useMemo(() => {
    if (!filters.date) return [];
    return trips.filter((t) => (t.mode === 'parcel-only' || t.mode === 'mixed') && !!t.parcelSize && t.date === filters.date && (!filters.from || t.route.toLowerCase().startsWith(filters.from.toLowerCase())) && (!filters.to || t.route.toLowerCase().endsWith(filters.to.toLowerCase())));
  }, [trips, filters]);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setLoading(true);
    setTimeout(() => { setFilters({ from: String(data.from || '').trim(), to: String(data.to || '').trim(), date: data.date }); setLoading(false); }, 250);
  };

  return <section className="card"><div className="card-title-row"><h2>Curier</h2><span className="status warning">Colete</span></div><form className="form-grid" onSubmit={onSubmit}><label>Oraș predare<input name="from" /></label><label>Oraș livrare<input name="to" /></label><label className="full">Data<input required type="date" name="date" /></label><div className="full"><button className="btn">Caută curse curier</button></div></form>{loading ? <p className="meta">Se caută curse pentru colet...</p> : <TripsList trips={courierTrips} reservedMap={new Map(myCourierReservations.map((r)=>[r.tripId,r]))} onReserveCourier={onReserveCourier} onCancelReservation={onCancelReservation} hidePassengerActions selectedDate={filters.date} />}</section>;
}

function PublishPanel({ onPublishTrip, session }) {
  const [feedback, setFeedback] = useState('Completează formularul pentru a publica cursa.');
  const [mode, setMode] = useState('passengers');
  const onSubmit = (e) => { e.preventDefault(); if (!e.currentTarget.reportValidity()) return; const data = Object.fromEntries(new FormData(e.currentTarget).entries()); onPublishTrip({ id: `trip-${Date.now()}`, ownerEmail: session.email, driver: session.name, route: `${data.from} → ${data.to}`, when: new Date(data.datetime).toLocaleString('ro-RO', { dateStyle: 'short', timeStyle: 'short' }), date: data.datetime.split('T')[0], time: new Date(data.datetime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }), seats: Number(data.seats), price: `${data.price} RON`, mode: data.mode, parcelSize: data.mode === 'passengers' ? '' : data.parcelSize }); setFeedback('Cursa a fost publicată cu succes.'); e.currentTarget.reset(); setMode('passengers'); };
  return <section className="card"><div className="card-title-row"><h2>Publică cursă</h2><span className="status success">Șofer</span></div><form className="form-grid" onSubmit={onSubmit}><label>Oraș plecare<input required name="from" /></label><label>Oraș destinație<input required name="to" /></label><label>Data și ora<input required type="datetime-local" name="datetime" /></label><label>Locuri disponibile<input required type="number" min="0" max="6" name="seats" defaultValue="3" /></label><label className="full">Preț / pasager<input required type="number" min="0" name="price" /></label><div className="full modes"><label className="mode-pill"><span><input checked={mode === 'passengers'} onChange={() => setMode('passengers')} type="radio" name="mode" value="passengers" />Accept pasageri</span></label><label className="mode-pill"><span><input checked={mode === 'parcel-only'} onChange={() => setMode('parcel-only')} type="radio" name="mode" value="parcel-only" />Accept colete</span></label><label className="mode-pill"><span><input checked={mode === 'mixed'} onChange={() => setMode('mixed')} type="radio" name="mode" value="mixed" />Accept pasageri și colete</span></label></div><label className="full">Mărime colet<select name="parcelSize" disabled={mode === 'passengers'}><option value="small">Mic (plic)</option><option value="medium">Mediu (cutie pantofi)</option><option value="large">Mare (geamantan cabină)</option></select></label><div className="full"><button className="btn">Publică</button></div></form><p className="meta">{feedback}</p></section>;
}

function TripsList({ trips, reservedMap, onReserveTrip, onReserveCourier, onCancelReservation, hidePassengerActions = false, selectedDate }) {
  if (selectedDate && !trips.length) return <div className="empty">Nu există curse disponibile pentru data selectată.</div>;
  if (!selectedDate && !trips.length) return <div className="empty">Nu există curse disponibile momentan.</div>;

  return (
    <div className="list">
      {trips.map((t) => {
        const res = reservedMap.get(t.id);
        const full = t.seats <= 0;
        const maxAllowed = Math.min(4, t.seats || 0);

        return (
          <article key={t.id} className="card trip-card">
            <h3>{t.route}</h3>
            <div className="trip-meta"><span>Șofer: {t.driver}</span><span>Plecare: {t.time}</span></div>
            <div className="trip-meta"><span>Preț: {t.price}</span><span>{full ? 'Cursă plină' : `Locuri: ${t.seats}`}</span></div>
            {(t.mode === 'parcel-only' || t.mode === 'mixed') && !!t.parcelSize && <p className="meta">📦 {t.parcelSize}</p>}

            <div className="action-row">
              {!hidePassengerActions && !res && !full && (
                <div className="row-2">
                  <select id={`p-${t.id}`} defaultValue="1">
                    {Array.from({ length: maxAllowed }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} pasager{i === 0 ? '' : 'i'}</option>
                    ))}
                  </select>
                  <button className="btn reserve-btn" onClick={() => onReserveTrip(t.id, Number(document.getElementById(`p-${t.id}`).value || 1))}>Rezervă cursa</button>
                </div>
              )}

              {!hidePassengerActions && res && <button className="btn subtle-btn" onClick={() => onCancelReservation(t.id, 'passenger')}>Anulează rezervarea</button>}
              {!hidePassengerActions && !res && full && <button className="btn subtle-btn" disabled>Cursă plină</button>}
              {hidePassengerActions && !res && <button className="btn reserve-btn" onClick={() => onReserveCourier(t.id)}>Rezervă transport colet</button>}
              {hidePassengerActions && res && <button className="btn subtle-btn" onClick={() => onCancelReservation(t.id, 'courier')}>Anulează rezervarea</button>}
            </div>
          </article>
        );
      })}
    </div>
  );
}

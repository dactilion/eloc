const quickCards = [
  { id: 'search', title: 'Caută cursă', desc: 'Găsește rapid un loc disponibil.' },
  { id: 'publish', title: 'Publică cursă', desc: 'Adaugă o cursă în câteva secunde.' },
  { id: 'courier', title: 'Curier', desc: 'Trimite sau caută colete prin șoferi.' }
];

export default function HomePage() {
  return (
    <>
      <header className="header">
        <h1>Bine ai venit, Andrei</h1>
        <p>E loc, folosește-l.</p>
      </header>

      <section className="grid-quick">
        {quickCards.map((card) => (
          <article className="quick-btn" key={card.id}>
            <strong>{card.title}</strong>
            <span>{card.desc}</span>
          </article>
        ))}
      </section>

      <section className="card">
        <h2>Pornire rapidă</h2>
        <p className="meta">Alege una dintre opțiunile de mai sus pentru a continua.</p>
      </section>
    </>
  );
}

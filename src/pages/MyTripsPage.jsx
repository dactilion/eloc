const sections = [
  { title: 'Ca șofer', items: ['Cluj → Brașov • 02 mai • 3 locuri'] },
  { title: 'Ca pasager', items: ['București → Iași • 10 mai • 120 RON'] },
  { title: 'Curier / Colete', items: [] }
];

export default function MyTripsPage() {
  return (
    <>
      <header className="header"><h1>Cursele mele</h1><p>Publicate și rezervate.</p></header>
      {sections.map((section) => (
        <section className="card" key={section.title}>
          <h2>{section.title}</h2>
          {section.items.length ? (
            <div className="list">{section.items.map((item) => <article className="card trip-card" key={item}><h3>{item}</h3></article>)}</div>
          ) : (
            <div className="empty">Nicio înregistrare.</div>
          )}
        </section>
      ))}
    </>
  );
}

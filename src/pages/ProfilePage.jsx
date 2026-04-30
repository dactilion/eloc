import React from 'react';
export default function ProfilePage() {
  return (
    <>
      <header className="header"><h1>Profil</h1><p>Date utilizator și setări.</p></header>
      <section className="card">
        <div className="profile">
          <img
            className="avatar"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80&auto=format&fit=crop"
            alt="Profil"
          />
          <div>
            <h2>Andrei</h2>
            <p className="meta">Rating: 4.9 ★</p>
            <p className="meta">Telefon verificat: Da</p>
            <p className="meta">Email: andrei@eloc.ro</p>
          </div>
        </div>
      </section>
    </>
  );
}

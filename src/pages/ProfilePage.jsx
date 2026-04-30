import React from 'react';
import { user } from '../data';

export default function ProfilePage() {
  return (
    <>
      <header className="header"><h1>Profil</h1><p>Informații cont și acțiuni rapide.</p></header>
      <section className="card">
        <div className="profile">
          <img className="avatar" src={user.avatar} alt="Profil" />
          <div>
            <h2>{user.name}</h2>
            <p className="meta">Rating: {user.rating} ★</p>
            <p className="meta">Telefon verificat: {user.phoneVerified ? 'Da' : 'Nu'}</p>
            <p className="meta">Email: {user.email}</p>
          </div>
        </div>
        <div className="action-row">
          <button className="btn subtle-btn">Editează profil</button>
          <button className="btn subtle-btn">Setări</button>
          <button className="btn">Logout</button>
        </div>
      </section>
    </>
  );
}

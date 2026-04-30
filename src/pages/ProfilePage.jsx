import React from 'react';

export default function ProfilePage({ session, onLogout }) {
  return <><header className="header"><h1>Profil</h1><p>Informații cont și setări.</p></header><section className="card"><div className="profile"><div className="avatar" style={{ background: '#e8eeff', display: 'grid', placeItems: 'center' }}>{session.name?.slice(0, 1)}</div><div><h2>{session.name}</h2><p className="meta">Telefon: {session.phone || '-'}</p><p className="meta">Email: {session.email}</p></div></div><div className="action-row"><button className="btn subtle-btn">Editează profil</button><button className="btn subtle-btn">Setări</button><button className="btn" onClick={onLogout}>Logout</button></div></section></>;
}

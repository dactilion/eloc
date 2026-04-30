import React, { useState } from 'react';

export default function AuthPage({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const ok = onLogin(data.email, data.password);
    if (!ok) setError('Email sau parolă invalidă.');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (data.password !== data.confirmPassword) {
      setError('Parolele nu coincid.');
      return;
    }
    const ok = onRegister(data);
    if (!ok) setError('Există deja cont cu acest email.');
  };

  return (
    <div id="app">
      <header className="header">
        <h1>eloc</h1>
        <p>Autentifică-te sau creează un cont.</p>
      </header>
      <section className="grid-quick">
        <button className={`quick-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Autentificare</button>
        <button className={`quick-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Înregistrare</button>
      </section>
      <section className="card">
        {mode === 'login' ? (
          <form className="form-grid" onSubmit={handleLogin}>
            <label>Email<input required type="email" name="email" /></label>
            <label>Parolă<input required type="password" name="password" /></label>
            <div className="full"><button className="btn">Autentificare</button></div>
          </form>
        ) : (
          <form className="form-grid" onSubmit={handleRegister}>
            <label>Nume<input required name="name" /></label>
            <label>Email<input required type="email" name="email" /></label>
            <label>Parolă<input required minLength="6" type="password" name="password" /></label>
            <label>Confirmare parolă<input required minLength="6" type="password" name="confirmPassword" /></label>
            <label className="full">Număr telefon<input required name="phone" /></label>
            <div className="full"><button className="btn">Creează cont</button></div>
          </form>
        )}
        {error && <p className="error">{error}</p>}
      </section>
    </div>
  );
}

const state = {
  currentTab: 'acasa',
  homePanel: 'cauta',
  user: {
    name: 'Andrei',
    rating: 4.9,
    phoneVerified: true,
    email: 'andrei@eloc.ro',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80&auto=format&fit=crop'
  },
  loading: { search: false, courier: false },
  myTrips: {
    driver: [{ route: 'Cluj → Brașov', when: '02 mai, 08:30', seats: 3 }],
    passenger: [{ route: 'București → Iași', when: '10 mai, 09:00', price: '120 RON' }],
    courier: []
  },
  chats: [
    { id: 1, name: 'Mara (șofer)', msg: 'Ne vedem la 08:20, lângă gară.' },
    { id: 2, name: 'Radu (colet)', msg: 'Coletul este pregătit, mulțumesc!' }
  ]
};

const mockTrips = [
  { driver: 'Ioana P.', time: '08:00', route: 'Cluj → Sibiu', price: '75 RON', seats: 2, mode: 'passengers' },
  { driver: 'Vlad D.', time: '09:30', route: 'Cluj → Sibiu', price: '65 RON', seats: 1, mode: 'mixed' },
  { driver: 'Elena T.', time: '11:15', route: 'Cluj → Sibiu', price: '80 RON', seats: 0, mode: 'parcel-only' }
];

function ui() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="header">
      <h1>Bine ai venit, ${state.user.name}</h1>
      <p>E loc, folosește-l.</p>
    </header>
    ${renderTab()}
    ${renderBottomNav()}
  `;
  bind();
}

function renderTab() {
  switch (state.currentTab) {
    case 'acasa': return renderHome();
    case 'cursele': return renderMyTrips();
    case 'chat': return renderChat();
    case 'profil': return renderProfile();
    default: return '<div class="card">Secțiune indisponibilă</div>';
  }
}

const quickCards = [
  { id: 'cauta', title: 'Caută cursă', desc: 'Găsește rapid un loc disponibil.' },
  { id: 'publica', title: 'Publică cursă', desc: 'Adaugă o cursă în câteva secunde.' },
  { id: 'curier', title: 'Curier', desc: 'Trimite sau caută transport pentru colete.' }
];

function renderHome() {
  return `
    <section class="grid-quick">${quickCards.map(q => `
      <button class="quick-btn ${state.homePanel === q.id ? 'active' : ''}" data-home="${q.id}">
        <strong>${q.title}</strong><span>${q.desc}</span>
      </button>`).join('')}
    </section>
    ${state.homePanel === 'cauta' ? renderSearch() : state.homePanel === 'publica' ? renderPublish() : renderCourier()}
  `;
}

function renderSearch() {
  return `<section class="card">
      <div class="card-title-row"><h2>Caută cursă</h2><span class="status">Pasager</span></div>
      <form id="search-form" class="form-grid">
        <label>Oraș plecare<input required name="from" placeholder="ex. Cluj" /></label>
        <label>Oraș destinație<input required name="to" placeholder="ex. Sibiu" /></label>
        <label>Data<input required type="date" name="date" /></label>
        <label>Număr pasageri<input required type="number" min="1" max="6" value="1" name="passengers" /></label>
        <div class="full"><button class="btn">Caută curse</button></div>
      </form>
      ${state.loading.search ? '<p class="meta">Se caută curse...</p>' : renderTrips(mockTrips.filter(t => t.mode !== 'parcel-only'))}
    </section>`;
}

function renderPublish() {
  return `<section class="card">
      <div class="card-title-row"><h2>Publică cursă</h2><span class="status success">Șofer</span></div>
      <form id="publish-form" class="form-grid">
        <label>Oraș plecare<input required name="from" /></label>
        <label>Oraș destinație<input required name="to" /></label>
        <label>Data și ora<input required type="datetime-local" name="datetime" /></label>
        <label>Locuri disponibile<input required type="number" min="0" max="6" name="seats" value="3" /></label>
        <label class="full">Preț / pasager<input required type="number" min="0" name="price" placeholder="RON" /></label>
        <div class="full modes">
          <label class="mode-pill"><span><input checked type="radio" name="mode" value="passengers" />Accept pasageri</span></label>
          <label class="mode-pill"><span><input type="radio" name="mode" value="parcel-only" />Accept colete</span></label>
          <label class="mode-pill"><span><input type="radio" name="mode" value="mixed" />Accept pasageri și colete</span></label>
        </div>
        <label class="full">Mărime colet (dacă accepți colete)
          <select name="parcelSize">
            <option value="small">Mic (plic)</option>
            <option value="medium">Mediu (cutie pantofi)</option>
            <option value="large">Mare (geamantan cabină)</option>
          </select>
        </label>
        <div class="full"><button class="btn">Publică</button></div>
      </form>
      <p id="publish-feedback" class="meta">Completează formularul pentru a publica cursa.</p>
    </section>`;
}

function renderCourier() {
  return `<section class="card">
      <div class="card-title-row"><h2>Curier</h2><span class="status warning">Colete</span></div>
      <form id="courier-form" class="form-grid">
        <label>Oraș predare<input required name="from" /></label>
        <label>Oraș livrare<input required name="to" /></label>
        <label>Dimensiune colet
          <select name="size"><option>Mic</option><option>Mediu</option><option>Mare</option></select>
        </label>
        <label>Greutate aproximativă (kg)<input required type="number" min="0.1" step="0.1" name="weight" /></label>
        <label class="full">Data dorită<input required type="date" name="date" /></label>
        <div class="full"><button class="btn">Caută transport colet</button></div>
      </form>
      ${state.loading.courier ? '<p class="meta">Se caută curse pentru colet...</p>' : renderTrips(mockTrips.filter(t => t.mode !== 'passengers'))}
    </section>`;
}

function renderTrips(trips) {
  if (!trips.length) return '<div class="empty">Nu există curse disponibile momentan.</div>';
  return `<div class="list">${trips.map(t => `<article class="card trip-card">
      <h3>${t.route}</h3>
      <div class="trip-meta"><span>Șofer: ${t.driver}</span><span>Plecare: ${t.time}</span></div>
      <div class="trip-meta"><span>Preț: ${t.price}</span><span>Locuri: ${t.seats}</span></div>
    </article>`).join('')}</div>`;
}

function renderMyTrips() {
  const sec = (title, rows, type) => `<section class="card"><h2>${title}</h2>${rows.length ? `<div class="list">${rows.map(r => `<article class="card trip-card"><h3>${r.route}</h3><p class="meta">${r.when}</p><p class="meta">${type === 'driver' ? `Locuri: ${r.seats}` : type === 'passenger' ? `Preț: ${r.price}` : 'Transport colet'}</p></article>`).join('')}</div>` : '<div class="empty">Nicio înregistrare.</div>'}</section>`;
  return `${sec('Ca șofer', state.myTrips.driver, 'driver')}${sec('Ca pasager', state.myTrips.passenger, 'passenger')}${sec('Curier / colete', state.myTrips.courier, 'courier')}`;
}

function renderChat() {
  return `<section class="card"><h2>Conversații</h2>
    ${state.chats.length ? `<div class="list">${state.chats.map(c => `<article class="card chat-item"><h3>${c.name}</h3><p class="meta">${c.msg}</p></article>`).join('')}</div>` : '<div class="empty">Nu ai mesaje încă.</div>'}
  </section>`;
}

function renderProfile() {
  return `<section class="card">
      <div class="profile">
        <img class="avatar" src="${state.user.avatar}" alt="avatar" />
        <div>
          <h2>${state.user.name}</h2>
          <p class="meta">Rating: ${state.user.rating} ★</p>
          <p class="meta">Telefon verificat: ${state.user.phoneVerified ? 'Da' : 'Nu'}</p>
          <p class="meta">Email: ${state.user.email}</p>
        </div>
      </div>
      <div class="action-row">
        <button class="btn subtle-btn">Editează profil</button>
        <button class="btn subtle-btn">Setări</button>
        <button class="btn">Logout</button>
      </div>
    </section>`;
}

function renderBottomNav() {
  const items = [
    ['acasa', 'Acasă'], ['cursele', 'Cursele mele'], ['chat', 'Chat'], ['profil', 'Profil']
  ];
  return `<nav class="bottom-nav">${items.map(([id, label]) => `<button class="nav-btn ${state.currentTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`).join('')}</nav>`;
}

function bind() {
  document.querySelectorAll('[data-home]').forEach(btn => btn.onclick = () => { state.homePanel = btn.dataset.home; ui(); });
  document.querySelectorAll('[data-tab]').forEach(btn => btn.onclick = () => { state.currentTab = btn.dataset.tab; ui(); });

  const searchForm = document.getElementById('search-form');
  if (searchForm) searchForm.onsubmit = e => {
    e.preventDefault();
    if (!searchForm.reportValidity()) return;
    state.loading.search = true; ui();
    setTimeout(() => { state.loading.search = false; ui(); }, 700);
  };

  const courierForm = document.getElementById('courier-form');
  if (courierForm) courierForm.onsubmit = e => {
    e.preventDefault();
    if (!courierForm.reportValidity()) return;
    state.loading.courier = true; ui();
    setTimeout(() => { state.loading.courier = false; ui(); }, 700);
  };

  const publishForm = document.getElementById('publish-form');
  if (publishForm) publishForm.onsubmit = e => {
    e.preventDefault();
    const fb = document.getElementById('publish-feedback');
    if (!publishForm.reportValidity()) { fb.textContent = 'Verifică datele introduse.'; fb.className = 'error'; return; }
    const data = Object.fromEntries(new FormData(publishForm).entries());
    const parcelOnly = data.mode === 'parcel-only';
    fb.textContent = parcelOnly
      ? `Cursa de curier a fost publicată (${data.from} → ${data.to}, colet ${data.parcelSize}).`
      : `Cursa a fost publicată (${data.from} → ${data.to}).`;
    fb.className = 'meta';
  };
}

ui();

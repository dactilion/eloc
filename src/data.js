export const user = {
  name: 'Andrei',
  rating: 4.9,
  phoneVerified: true,
  email: 'andrei@eloc.ro',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80&auto=format&fit=crop'
};

export const mockTrips = [
  { id: 1, driver: 'Ioana P.', time: '08:00', route: 'Cluj → Sibiu', price: '75 RON', seats: 2, mode: 'passengers' },
  { id: 2, driver: 'Vlad D.', time: '09:30', route: 'Cluj → Sibiu', price: '65 RON', seats: 1, mode: 'mixed' },
  { id: 3, driver: 'Elena T.', time: '11:15', route: 'Cluj → Sibiu', price: '80 RON', seats: 0, mode: 'parcel-only' }
];

export const myTrips = {
  driver: [{ id: 'd1', route: 'Cluj → Brașov', when: '02 mai, 08:30', seats: 3 }],
  passenger: [{ id: 'p1', route: 'București → Iași', when: '10 mai, 09:00', price: '120 RON' }],
  courier: []
};

export const chats = [
  {
    id: 'c1',
    name: 'Mara (șofer)',
    lastMessage: 'Ne vedem la 08:20, lângă gară.',
    messages: [
      { from: 'Mara', text: 'Bună! Confirmăm cursa?' },
      { from: 'Tu', text: 'Da, ne vedem la 08:20.' }
    ]
  },
  {
    id: 'c2',
    name: 'Radu (colet)',
    lastMessage: 'Coletul este pregătit, mulțumesc!',
    messages: [
      { from: 'Tu', text: 'Salut, coletul e gata?' },
      { from: 'Radu', text: 'Da, este pregătit. Mulțumesc!' }
    ]
  }
];

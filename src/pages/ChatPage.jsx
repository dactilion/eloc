import React, { useState } from 'react';
import { chats as seedChats } from '../data';

export default function ChatPage() {
  const [activeId, setActiveId] = useState(seedChats[0]?.id || null);
  const activeChat = seedChats.find((chat) => chat.id === activeId);

  return (
    <>
      <header className="header"><h1>Chat</h1><p>Mesaje între pasageri, șoferi și curier.</p></header>
      <section className="card">
        <h2>Conversații</h2>
        {!seedChats.length ? <div className="empty">Nu ai mesaje încă.</div> : <div className="list">{seedChats.map((chat) => <button key={chat.id} className={`quick-btn ${activeId === chat.id ? 'active' : ''}`} onClick={() => setActiveId(chat.id)}><strong>{chat.name}</strong><span>{chat.lastMessage}</span></button>)}</div>}
      </section>
      <section className="card">
        <h2>Conversație</h2>
        {!activeChat ? <div className="empty">Selectează o conversație.</div> : <div className="list">{activeChat.messages.map((m, idx) => <article key={`${m.from}-${idx}`} className="card chat-item"><h3>{m.from}</h3><p className="meta">{m.text}</p></article>)}</div>}
      </section>
    </>
  );
}

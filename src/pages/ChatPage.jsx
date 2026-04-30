import React from 'react';
const chats = [
  { name: 'Mara (șofer)', message: 'Ne vedem la 08:20, lângă gară.' },
  { name: 'Radu (colet)', message: 'Coletul este pregătit, mulțumesc!' }
];

export default function ChatPage() {
  return (
    <>
      <header className="header"><h1>Chat</h1><p>Mesaje cu șoferi, pasageri și curieri.</p></header>
      <section className="card">
        <h2>Conversații</h2>
        <div className="list">
          {chats.map((chat) => (
            <article className="card chat-item" key={chat.name}>
              <h3>{chat.name}</h3>
              <p className="meta">{chat.message}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

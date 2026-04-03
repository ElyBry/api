const { io } = require('socket.io-client');

const BASE_URL = process.env.WS_URL || 'http://localhost:3000';

function once(socket, event) {
  return new Promise((resolve) => socket.once(event, resolve));
}

async function main() {
  const socket = io(BASE_URL, { transports: ['websocket'] });

  socket.on('connect', async () => {
    try {
      const requestId = `req_${Date.now()}`;
      const isbn = `ws-isbn-${Date.now()}`;

      // 1) create
      socket.emit('books.create', {
        requestId,
        input: { isbn }, // title/author опциональны
      });
      const created = await once(socket, 'books.create.result');
      console.log('books.create.result:', created);

      // 2) byIsbn
      socket.emit('books.byIsbn', { requestId, isbn });
      const byIsbn = await once(socket, 'books.byIsbn.result');
      console.log('books.byIsbn.result:', byIsbn);

      // 3) list + onlyWithTitle
      socket.emit('books.list', {
        requestId,
        page: 1,
        limit: 10,
        filter: { onlyWithTitle: true },
      });
      const list = await once(socket, 'books.list.result');
      console.log('books.list.result:', list);
      // 4) chat (namespace /chat)
      const chat = io(`${BASE_URL}/chat`, { transports: ['websocket'] });
      await once(chat, 'connect');
      chat.emit('chat.login', { login: `smoke_${Date.now()}` });
      await new Promise((r) => setTimeout(r, 50));
      chat.emit('chat.message', { text: 'hello from smoke test' });
      const chatLine = await once(chat, 'chat.message');
      console.log('chat.message:', chatLine);
      chat.disconnect();
    } catch (err) {
      console.error('WS smoke test error:', err);
    } finally {
      socket.disconnect();
    }
  });

  socket.on('connect_error', (e) => {
    console.error('connect_error:', e?.message || e);
    socket.disconnect();
  });
}

main();


import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class WsTestController {
  @Get('api/ws-test')
  wsTest(@Res() res: Response) {
    res.type('html').send(`<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>WS Test</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 20px; }
      .row { display: flex; gap: 16px; flex-wrap: wrap; }
      .col { flex: 1; min-width: 320px; }
      textarea { width: 100%; min-height: 140px; padding: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      pre { background: #0b1020; color: #dbe7ff; padding: 12px; border-radius: 10px; overflow: auto; }
      select, button { padding: 10px; font-size: 14px; }
      button { cursor: pointer; }
      .muted { color: #667085; font-size: 12px; }
      .status { font-weight: 600; }
      .examples { display: flex; gap: 8px; flex-wrap: wrap; }
      .examples button { background: #1f2937; color: white; border: 0; border-radius: 8px; }
      .examples button:hover { background: #111827; }
    </style>
  </head>
  <body>
    <h2>WebSocket Test (socket.io)</h2>

    <div class="row">
      <div class="col">
        <div class="muted">Статус соединения: <span id="status" class="status">connecting...</span></div>
        <div style="margin-top: 10px;">
          <label>Событие</label><br />
          <select id="event" style="width: 100%; margin-top: 6px;">
            <option value="books.list">books.list</option>
            <option value="books.byIsbn">books.byIsbn</option>
            <option value="books.byId">books.byId</option>
            <option value="books.create">books.create</option>
            <option value="books.update">books.update</option>
            <option value="books.delete">books.delete</option>

            <option value="cabinets.list">cabinets.list</option>
            <option value="cabinets.byId">cabinets.byId</option>
            <option value="cabinets.create">cabinets.create</option>
            <option value="cabinets.update">cabinets.update</option>
            <option value="cabinets.delete">cabinets.delete</option>

            <option value="users.list">users.list</option>
            <option value="users.deleted.list">users.deleted.list</option>
            <option value="users.byId">users.byId</option>
            <option value="users.create">users.create</option>
            <option value="users.update">users.update</option>
            <option value="users.delete">users.delete</option>
          </select>
        </div>

        <div style="margin-top: 12px;">
          <label>Payload JSON</label>
          <div class="muted">Можно передать requestId. Если не передать — сгенерируем.</div>
          <textarea id="payload" spellcheck="false"></textarea>
          <div style="margin-top: 10px;">
            <button id="send" type="button">Send</button>
          </div>

          <div style="margin-top: 16px;">
            <div class="muted">Примеры:</div>
            <div class="examples" style="margin-top: 8px;">
              <button type="button" onclick="loadExample('books.create')">books.create</button>
              <button type="button" onclick="loadExample('books.list')">books.list</button>
              <button type="button" onclick="loadExample('books.byIsbn')">books.byIsbn</button>
              <button type="button" onclick="loadExample('cabinets.create')">cabinets.create</button>
              <button type="button" onclick="loadExample('users.create')">users.create</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="muted">Ответ сервера (event: *.result):</div>
        <pre id="out">{}</pre>
        <div class="muted" style="margin-top: 12px;">
          Совет: для книг сработает сценарий <code>books.create</code> -> сохранить isbn -> <code>books.byIsbn</code>.
        </div>
      </div>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io({ transports: ['websocket'] });
      const statusEl = document.getElementById('status');
      const eventEl = document.getElementById('event');
      const payloadEl = document.getElementById('payload');
      const outEl = document.getElementById('out');

      function uuid() {
        return Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
      }

      socket.on('connect', () => { statusEl.textContent = 'connected'; });
      socket.on('connect_error', (e) => { statusEl.textContent = 'connect_error: ' + (e && e.message ? e.message : e); });
      socket.on('disconnect', () => { statusEl.textContent = 'disconnected'; });

      function defaultPayloadFor(event) {
        switch (event) {
          case 'books.create':
            return { requestId: uuid(), input: { isbn: '978-1-4028-9462-6', title: 'Test', author: 'Author', publication_year: 2024 } };
          case 'books.list':
            return { requestId: uuid(), page: 1, limit: 10, filter: { onlyWithTitle: true } };
          case 'books.byIsbn':
            return { requestId: uuid(), isbn: '978-1-4028-9462-6' };
          case 'cabinets.create':
            return { requestId: uuid(), input: { number: 'A-WS-1' } };
          case 'users.create':
            return { requestId: uuid(), input: { full_name: 'WS User', email: 'ws@example.com', phone: '+7 999 000-00-00' } };
          case 'books.update':
            return { requestId: uuid(), id: 1, input: { title: 'Updated title' } };
          case 'books.delete':
            return { requestId: uuid(), id: 1 };
          case 'cabinets.list':
            return { requestId: uuid(), page: 1, limit: 10 };
          case 'cabinets.byId':
            return { requestId: uuid(), id: 1 };
          case 'cabinets.update':
            return { requestId: uuid(), id: 1, input: { number: 'A-WS-2' } };
          case 'cabinets.delete':
            return { requestId: uuid(), id: 1 };
          case 'users.list':
            return { requestId: uuid(), page: 1, limit: 10 };
          case 'users.deleted.list':
            return { requestId: uuid(), page: 1, limit: 10 };
          case 'users.byId':
            return { requestId: uuid(), id: 1 };
          case 'users.update':
            return { requestId: uuid(), id: 1, input: { email: 'updated-ws@example.com' } };
          case 'users.delete':
            return { requestId: uuid(), id: 1 };
          default:
            return { requestId: uuid() };
        }
      }

      function loadExample(eventName) {
        eventEl.value = eventName;
        payloadEl.value = JSON.stringify(defaultPayloadFor(eventName), null, 2);
      }

      loadExample(eventEl.value);

      socket.onAny((event, ...args) => {
        const msg = args && args.length ? args[0] : null;
        if (typeof event === 'string' && event.endsWith('.result')) {
          outEl.textContent = JSON.stringify({ event, message: msg }, null, 2);
        }
      });

      document.getElementById('send').addEventListener('click', () => {
        const eventName = eventEl.value;
        let payload;
        try {
          payload = JSON.parse(payloadEl.value || '{}');
        } catch (e) {
          alert('Payload JSON невалидный: ' + e.message);
          return;
        }
        if (!payload || typeof payload !== 'object') payload = {};
        payload.requestId = payload.requestId ?? uuid();
        socket.emit(eventName, payload);
        outEl.textContent = JSON.stringify({ event: eventName, payload }, null, 2);
      });
    </script>
  </body>
</html>`);
  }

  @Get('api/chat-test')
  chatTest(@Res() res: Response) {
    res.type('html').send(`<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Чат (WS)</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 20px; max-width: 720px; }
      #log { background: #0b1020; color: #dbe7ff; padding: 12px; border-radius: 10px; min-height: 200px; max-height: 420px; overflow: auto; white-space: pre-wrap; word-break: break-word; }
      .line { margin: 4px 0; }
      .line.sys { color: #94a3b8; }
      .line.err { color: #fca5a5; }
      input, button { padding: 10px; font-size: 14px; }
      input[type="text"] { width: 100%; max-width: 360px; box-sizing: border-box; }
      .row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 10px 0; }
      .status { font-weight: 600; margin: 8px 0; }
    </style>
  </head>
  <body>
    <h2>Реалтайм-чат (namespace <code>/chat</code>)</h2>
    <p class="muted">Сначала укажите логин, затем отправляйте сообщения. Формат в ленте: <strong>Логин: сообщение</strong>.</p>
    <div class="status" id="status">Подключение…</div>
    <div class="row">
      <label>Логин: <input type="text" id="login" placeholder="Ваш ник" maxlength="64" /></label>
      <button type="button" id="btnLogin">Войти</button>
    </div>
    <div class="row">
      <input type="text" id="msg" placeholder="Сообщение" maxlength="2000" style="flex:1; min-width:200px;" />
      <button type="button" id="btnSend">Отправить</button>
    </div>
    <div id="log"></div>
    <script src="https://cdn.socket.io/4.8.1/socket.io.min.js" crossorigin="anonymous"></script>
    <script>
      const logEl = document.getElementById('log');
      const statusEl = document.getElementById('status');
      function appendLine(text, cls) {
        const d = document.createElement('div');
        d.className = 'line' + (cls ? ' ' + cls : '');
        d.textContent = text;
        logEl.appendChild(d);
        logEl.scrollTop = logEl.scrollHeight;
      }
      const socket = io('/chat', { path: '/socket.io', transports: ['websocket'] });
      socket.on('connect', () => { statusEl.textContent = 'Подключено'; });
      socket.on('disconnect', () => { statusEl.textContent = 'Отключено'; });
      socket.on('chat.system', (p) => { appendLine(p.text || JSON.stringify(p), 'sys'); });
      socket.on('chat.error', (p) => { appendLine(p.text || JSON.stringify(p), 'err'); });
      socket.on('chat.message', (p) => { appendLine(p.line || (p.login + ': ' + p.text)); });
      document.getElementById('btnLogin').onclick = () => {
        const login = document.getElementById('login').value.trim();
        socket.emit('chat.login', { login });
      };
      function sendMsg() {
        const msg = document.getElementById('msg');
        const text = msg.value.trim();
        if (!text) return;
        socket.emit('chat.message', { text });
        msg.value = '';
      }
      document.getElementById('btnSend').onclick = sendMsg;
      document.getElementById('msg').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); sendMsg(); }
      });
    </script>
  </body>
</html>`);
  }
}


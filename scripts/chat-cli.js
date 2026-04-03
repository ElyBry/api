/**
 * Интерактивный чат в терминале (Socket.IO, namespace /chat).
 * Запуск: npm run chat:cli
 * Другой хост: WS_URL=http://127.0.0.1:3000 npm run chat:cli
 * Логин из argv: npm run chat:cli -- alice
 */
const readline = require('readline');
const { io } = require('socket.io-client');

const BASE_URL = process.env.WS_URL || 'http://localhost:3000';
const loginFromArgv = process.argv[2]?.trim();

const chat = io(`${BASE_URL}/chat`, {
  path: '/socket.io',
  transports: ['websocket'],
});

function log(...args) {
  console.log(...args);
}

chat.on('connect', () => log('Подключено к', `${BASE_URL}/chat`));
chat.on('connect_error', (e) => {
  log('Ошибка подключения:', e?.message || e);
  process.exit(1);
});
chat.on('disconnect', () => log('Отключено'));
chat.on('chat.system', (p) => log('[система]', p.text));
chat.on('chat.error', (p) => log('[ошибка]', p.text));
chat.on('chat.message', (p) => log(p.line));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

async function main() {
  await new Promise((resolve, reject) => {
    chat.once('connect', resolve);
    chat.once('connect_error', reject);
  });

  let login = loginFromArgv;
  if (!login) {
    login = (await ask('Логин: ')).trim();
  }
  if (!login) {
    log('Нужен непустой логин.');
    rl.close();
    chat.disconnect();
    process.exit(1);
  }
  const password = (await ask('Пароль: ')).trim();
  chat.emit('chat.login', { login, password });
  await new Promise((r) => setTimeout(r, 80));

  log('Пишите сообщения. Команды: /q — выход');
  rl.setPrompt('> ');
  rl.prompt();

  rl.on('line', (line) => {
    const t = line.trim();
    if (t === '/q' || t === '/quit') {
      rl.close();
      chat.disconnect();
      return;
    }
    if (t) chat.emit('chat.message', { text: t });
    rl.prompt();
  });
}

main().catch((err) => {
  console.error(err);
  rl.close();
  chat.disconnect();
  process.exit(1);
});

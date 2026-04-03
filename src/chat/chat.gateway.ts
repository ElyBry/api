import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Namespace, Socket } from 'socket.io';

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ??
  'http://localhost:5678/webhook/chat-message';

const MAX_LOGIN = 64;
const MAX_MESSAGE = 2000;
const ALLOWED_PASSWORDS = new Set(['12345', '1234512345']);

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Namespace;

  private readonly socketLogin = new Map<string, string>();

  handleConnection(client: Socket) {
    client.emit('chat.system', {
      text: 'Укажите логин событием chat.login, затем пишите chat.message.',
    });
  }

  handleDisconnect(client: Socket) {
    this.socketLogin.delete(client.id);
  }

  @SubscribeMessage('chat.login')
  chatLogin(
    @MessageBody() body: { login?: string; password?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const raw = (body?.login ?? '').trim();
    if (!raw || raw.length > MAX_LOGIN) {
      client.emit('chat.error', {
        code: 'INVALID_LOGIN',
        text: `Логин обязателен, до ${MAX_LOGIN} символов.`,
      });
      return;
    }
    if (!ALLOWED_PASSWORDS.has(body?.password ?? '')) {
      client.emit('chat.error', {
        code: 'INVALID_PASSWORD',
        text: 'Неверный пароль.',
      });
      return;
    }
    this.socketLogin.set(client.id, raw);
    client.emit('chat.system', { text: `Вы вошли как «${raw}». Можно писать.` });
    this.server.emit('chat.system', { text: `Подключился: ${raw}` });
  }

  @SubscribeMessage('chat.message')
  chatMessage(
    @MessageBody() body: { text?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const login = this.socketLogin.get(client.id);
    if (!login) {
      client.emit('chat.error', {
        code: 'NO_LOGIN',
        text: 'Сначала отправьте chat.login с полем login.',
      });
      return;
    }
    const text = (body?.text ?? '').trim();
    if (!text || text.length > MAX_MESSAGE) {
      client.emit('chat.error', {
        code: 'INVALID_MESSAGE',
        text: `Сообщение обязательно, до ${MAX_MESSAGE} символов.`,
      });
      return;
    }
    const ts = new Date().toISOString();
    const line = `${login}: ${text}`;
    this.server.emit('chat.message', { login, text, line, ts });

    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, text, ts }),
    }).catch(() => {
      // n8n недоступен — не роняем чат
    });
  }
}

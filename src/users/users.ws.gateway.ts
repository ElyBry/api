import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { UsersService, type UserRow } from './users.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { getPaginationParams } from '../common/dto/pagination-query.dto';

type WsRequestMeta = { requestId?: string };

type UsersListWsRequest = WsRequestMeta & {
  page?: number;
  limit?: number;
};

type UsersGetByIdWsRequest = WsRequestMeta & {
  id: number;
};

type UsersCreateWsRequest = WsRequestMeta & {
  input: CreateUserDto;
};

type UsersUpdateWsRequest = WsRequestMeta & {
  id: number;
  input: UpdateUserDto;
};

type UsersDeleteWsRequest = WsRequestMeta & {
  id: number;
};

@WebSocketGateway({ cors: { origin: '*' } })
export class UsersWsGateway {
  constructor(private readonly usersService: UsersService) {}

  @SubscribeMessage('users.list')
  async usersList(
    @MessageBody() body: UsersListWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const { limit, offset } = getPaginationParams(body?.page, body?.limit);
      const data = await this.usersService.findAll(limit, offset);
      client.emit('users.list.result', { requestId, data });
    } catch (err) {
      client.emit('users.list.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('users.deleted.list')
  async usersDeletedList(
    @MessageBody() body: UsersListWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const { limit, offset } = getPaginationParams(body?.page, body?.limit);
      const data = await this.usersService.findDeleted(limit, offset);
      client.emit('users.deleted.list.result', { requestId, data });
    } catch (err) {
      client.emit('users.deleted.list.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('users.byId')
  async usersById(
    @MessageBody() body: UsersGetByIdWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data = await this.usersService.findOne(body.id);
      client.emit('users.byId.result', { requestId, data });
    } catch (err) {
      client.emit('users.byId.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('users.create')
  async usersCreate(
    @MessageBody() body: UsersCreateWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data: UserRow = await this.usersService.create(body.input);
      client.emit('users.create.result', { requestId, data });
    } catch (err) {
      client.emit('users.create.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('users.update')
  async usersUpdate(
    @MessageBody() body: UsersUpdateWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data = await this.usersService.update(body.id, body.input);
      client.emit('users.update.result', { requestId, data });
    } catch (err) {
      client.emit('users.update.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('users.delete')
  async usersDelete(
    @MessageBody() body: UsersDeleteWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data = await this.usersService.softDelete(body.id);
      client.emit('users.delete.result', { requestId, data });
    } catch (err) {
      client.emit('users.delete.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }
}


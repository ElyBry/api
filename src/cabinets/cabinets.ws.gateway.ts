import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { CabinetsService, type CabinetRow } from './cabinets.service';
import type { CreateCabinetDto } from './dto/create-cabinet.dto';
import type { UpdateCabinetDto } from './dto/update-cabinet.dto';
import { getPaginationParams } from '../common/dto/pagination-query.dto';

type WsRequestMeta = { requestId?: string };

type CabinetsListWsRequest = WsRequestMeta & {
  page?: number;
  limit?: number;
};

type CabinetsGetByIdWsRequest = WsRequestMeta & {
  id: number;
};

type CabinetsCreateWsRequest = WsRequestMeta & {
  input: CreateCabinetDto;
};

type CabinetsUpdateWsRequest = WsRequestMeta & {
  id: number;
  input: UpdateCabinetDto;
};

type CabinetsDeleteWsRequest = WsRequestMeta & {
  id: number;
};

@WebSocketGateway({ cors: { origin: '*' } })
export class CabinetsWsGateway {
  constructor(private readonly cabinetsService: CabinetsService) {}

  @SubscribeMessage('cabinets.list')
  async cabinetsList(
    @MessageBody() body: CabinetsListWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const { limit, offset } = getPaginationParams(body?.page, body?.limit);
      const data = await this.cabinetsService.findAll(limit, offset);
      client.emit('cabinets.list.result', { requestId, data });
    } catch (err) {
      client.emit('cabinets.list.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('cabinets.byId')
  async cabinetsById(
    @MessageBody() body: CabinetsGetByIdWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data = await this.cabinetsService.findOne(body.id);
      client.emit('cabinets.byId.result', { requestId, data });
    } catch (err) {
      client.emit('cabinets.byId.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('cabinets.create')
  async cabinetsCreate(
    @MessageBody() body: CabinetsCreateWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data: CabinetRow = await this.cabinetsService.create(body.input);
      client.emit('cabinets.create.result', { requestId, data });
    } catch (err) {
      client.emit('cabinets.create.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('cabinets.update')
  async cabinetsUpdate(
    @MessageBody() body: CabinetsUpdateWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data = await this.cabinetsService.update(body.id, body.input);
      client.emit('cabinets.update.result', { requestId, data });
    } catch (err) {
      client.emit('cabinets.update.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('cabinets.delete')
  async cabinetsDelete(
    @MessageBody() body: CabinetsDeleteWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data = await this.cabinetsService.softDelete(body.id);
      client.emit('cabinets.delete.result', { requestId, data });
    } catch (err) {
      client.emit('cabinets.delete.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }
}


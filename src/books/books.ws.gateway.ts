import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { BooksService, type BookRow } from './books.service';
import type { BooksFilterDto } from './dto/books-filter.dto';
import type { CreateBookDto } from './dto/create-book.dto';
import type { UpdateBookDto } from './dto/update-book.dto';
import { getPaginationParams } from '../common/dto/pagination-query.dto';

type WsRequestMeta = { requestId?: string };

type BooksListWsRequest = WsRequestMeta & {
  page?: number;
  limit?: number;
  filter?: BooksFilterDto;
};

type BooksGetByIsbnWsRequest = WsRequestMeta & {
  isbn: string;
};

type BooksGetByIdWsRequest = WsRequestMeta & {
  id: number;
};

type BooksCreateWsRequest = WsRequestMeta & {
  input: CreateBookDto;
};

type BooksUpdateWsRequest = WsRequestMeta & {
  id: number;
  input: UpdateBookDto;
};

type BooksDeleteWsRequest = WsRequestMeta & {
  id: number;
};

@WebSocketGateway({ cors: { origin: '*' } })
export class BooksWsGateway {
  constructor(private readonly booksService: BooksService) {}

  @SubscribeMessage('books.list')
  async booksList(
    @MessageBody() body: BooksListWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const { limit, offset } = getPaginationParams(body?.page, body?.limit);
      const data = await this.booksService.findAll(
        limit,
        offset,
        body?.filter,
      );
      client.emit('books.list.result', { requestId, data });
    } catch (err) {
      client.emit('books.list.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('books.byIsbn')
  async booksByIsbn(
    @MessageBody() body: BooksGetByIsbnWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data = await this.booksService.findByIsbn(body.isbn);
      client.emit('books.byIsbn.result', { requestId, data });
    } catch (err) {
      client.emit('books.byIsbn.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('books.byId')
  async booksById(
    @MessageBody() body: BooksGetByIdWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data = await this.booksService.findOne(body.id);
      client.emit('books.byId.result', { requestId, data });
    } catch (err) {
      client.emit('books.byId.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('books.create')
  async booksCreate(
    @MessageBody() body: BooksCreateWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data: BookRow = await this.booksService.create(body.input);
      client.emit('books.create.result', { requestId, data });
    } catch (err) {
      client.emit('books.create.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('books.update')
  async booksUpdate(
    @MessageBody() body: BooksUpdateWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data = await this.booksService.update(body.id, body.input);
      client.emit('books.update.result', { requestId, data });
    } catch (err) {
      client.emit('books.update.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  @SubscribeMessage('books.delete')
  async booksDelete(
    @MessageBody() body: BooksDeleteWsRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const requestId = body?.requestId ?? null;
    try {
      const data = await this.booksService.softDelete(body.id);
      client.emit('books.delete.result', { requestId, data });
    } catch (err) {
      client.emit('books.delete.result', {
        requestId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }
}


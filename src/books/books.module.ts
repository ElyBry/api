import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';
import { BooksWsGateway } from './books.ws.gateway';

@Module({
  controllers: [BooksController],
  providers: [BooksService, BooksResolver, BooksWsGateway],
})
export class BooksModule {}

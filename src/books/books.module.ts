import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, BooksResolver],
})
export class BooksModule {}

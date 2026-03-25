import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { getPaginationParams } from '../common/dto/pagination-query.dto';
import { IdResult } from '../common/id.model';
import { Book } from './book.model';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { BooksFilterInput } from './dto/books-filter.input';
import { BooksService } from './books.service';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => [Book], { name: 'books' })
  async books(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('filter', { type: () => BooksFilterInput, nullable: true })
    filter?: BooksFilterInput,
  ) {
    const { limit: l, offset } = getPaginationParams(page, limit);
    return this.booksService.findAll(l, offset, filter ?? undefined);
  }

  @Query(() => Book, { name: 'book', nullable: true })
  async book(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.findOne(id);
  }

  @Query(() => Book, { name: 'bookByIsbn', nullable: true })
  async bookByIsbn(@Args('isbn', { type: () => String }) isbn: string) {
    return this.booksService.findByIsbn(isbn);
  }

  @Mutation(() => Book)
  async createBook(@Args('input') input: CreateBookInput) {
    return this.booksService.create({
      isbn: input.isbn,
      title: input.title,
      author: input.author,
      publication_year: input.publication_year,
    });
  }

  @Mutation(() => Book, { nullable: true })
  async updateBook(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateBookInput,
  ) {
    return this.booksService.update(id, {
      isbn: input.isbn,
      title: input.title,
      author: input.author,
      publication_year: input.publication_year,
    });
  }

  @Mutation(() => IdResult)
  async deleteBook(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.softDelete(id);
  }
}

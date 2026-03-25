import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import type { BooksFilterDto } from './dto/books-filter.dto';

export interface BookRow {
  id: number;
  title: string | null;
  author: string | null;
  isbn: string;
  publication_year: number | null;
  is_deleted: boolean;
}

@Injectable()
export class BooksService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateBookDto): Promise<BookRow> {
    const r = await this.db.execQuery<BookRow>(
      `INSERT INTO books (title, author, isbn, publication_year)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        dto.title ?? null,
        dto.author ?? null,
        dto.isbn,
        dto.publication_year ?? null,
      ],
      'one',
    );
    return r as BookRow;
  }

  async findAll(
    limit: number,
    offset: number,
    filter?: BooksFilterDto,
  ): Promise<BookRow[]> {
    const conditions: string[] = ['is_deleted = FALSE'];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (filter?.isbn != null && filter.isbn !== '') {
      conditions.push(`isbn = $${paramIndex++}`);
      values.push(filter.isbn);
    }
    if (filter?.title != null && filter.title !== '') {
      conditions.push(`title = $${paramIndex++}`);
      values.push(filter.title);
    }
    if (filter?.author != null && filter.author !== '') {
      conditions.push(`author = $${paramIndex++}`);
      values.push(filter.author);
    }
    if (filter?.publication_year != null) {
      conditions.push(`publication_year = $${paramIndex++}`);
      values.push(filter.publication_year);
    }
    if (filter?.onlyWithTitle === true) {
      conditions.push("title IS NOT NULL AND trim(title) != ''");
    }

    const where = conditions.join(' AND ');
    values.push(limit, offset);
    const rows = await this.db.execQuery<BookRow>(
      `SELECT * FROM books WHERE ${where} ORDER BY id LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      values,
      'all',
    );
    return rows as BookRow[];
  }

  async findOne(id: number): Promise<BookRow | null> {
    const r = await this.db.execQuery<BookRow>(
      'SELECT * FROM books WHERE id = $1 AND is_deleted = FALSE',
      [id],
      'one',
    );
    return r as BookRow | null;
  }

  async findByIsbn(isbn: string): Promise<BookRow | null> {
    const r = await this.db.execQuery<BookRow>(
      'SELECT * FROM books WHERE isbn = $1 AND is_deleted = FALSE',
      [isbn],
      'one',
    );
    return r as BookRow | null;
  }

  async update(id: number, dto: UpdateBookDto): Promise<BookRow | null> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    if (dto.isbn !== undefined) {
      updates.push(`isbn = $${i++}`);
      values.push(dto.isbn);
    }
    if (dto.title !== undefined) {
      updates.push(`title = $${i++}`);
      values.push(dto.title);
    }
    if (dto.author !== undefined) {
      updates.push(`author = $${i++}`);
      values.push(dto.author);
    }
    if (dto.publication_year !== undefined) {
      updates.push(`publication_year = $${i++}`);
      values.push(dto.publication_year);
    }
    if (updates.length === 0) return this.findOne(id);
    values.push(id);
    await this.db.execQuery(
      `UPDATE books SET ${updates.join(', ')} WHERE id = $${i} AND is_deleted = FALSE`,
      values,
    );
    return this.findOne(id);
  }

  async softDelete(id: number): Promise<{ id: number }> {
    await this.db.execQuery(
      'UPDATE books SET is_deleted = TRUE WHERE id = $1',
      [id],
    );
    return { id };
  }
}

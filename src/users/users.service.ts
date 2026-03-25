import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface UserRow {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  is_deleted: boolean;
}

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateUserDto): Promise<UserRow> {
    const r = await this.db.execQuery<UserRow>(
      'INSERT INTO users (full_name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [dto.full_name, dto.email, dto.phone ?? null],
      'one',
    );
    return r as UserRow;
  }

  async findAll(limit: number, offset: number): Promise<UserRow[]> {
    const rows = await this.db.execQuery<UserRow>(
      'SELECT * FROM users WHERE is_deleted = FALSE ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset],
      'all',
    );
    return rows as UserRow[];
  }

  async findOne(id: number): Promise<UserRow | null> {
    const r = await this.db.execQuery<UserRow>(
      'SELECT * FROM users WHERE id = $1 AND is_deleted = FALSE',
      [id],
      'one',
    );
    return r as UserRow | null;
  }

  async findDeleted(limit: number, offset: number): Promise<UserRow[]> {
    const rows = await this.db.execQuery<UserRow>(
      'SELECT * FROM users WHERE is_deleted = TRUE ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset],
      'all',
    );
    return rows as UserRow[];
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserRow | null> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    if (dto.full_name !== undefined) {
      updates.push(`full_name = $${i++}`);
      values.push(dto.full_name);
    }
    if (dto.email !== undefined) {
      updates.push(`email = $${i++}`);
      values.push(dto.email);
    }
    if (dto.phone !== undefined) {
      updates.push(`phone = $${i++}`);
      values.push(dto.phone);
    }
    if (updates.length === 0) return this.findOne(id);
    values.push(id);
    await this.db.execQuery(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${i} AND is_deleted = FALSE`,
      values,
    );
    return this.findOne(id);
  }

  async softDelete(userId: number): Promise<{ id: number }> {
    await this.db.execQuery(
      'UPDATE users SET is_deleted = TRUE WHERE id = $1',
      [userId],
    );
    return { id: userId };
  }
}

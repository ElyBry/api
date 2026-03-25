import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCabinetDto } from './dto/create-cabinet.dto';
import { UpdateCabinetDto } from './dto/update-cabinet.dto';

export interface CabinetRow {
  id: number;
  number: string;
  is_deleted: boolean;
}

@Injectable()
export class CabinetsService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateCabinetDto): Promise<CabinetRow> {
    const r = await this.db.execQuery<CabinetRow>(
      'INSERT INTO cabinets (number) VALUES ($1) RETURNING *',
      [dto.number],
      'one',
    );
    return r as CabinetRow;
  }

  async findAll(limit: number, offset: number): Promise<CabinetRow[]> {
    const rows = await this.db.execQuery<CabinetRow>(
      'SELECT * FROM cabinets WHERE is_deleted = FALSE ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset],
      'all',
    );
    return rows as CabinetRow[];
  }

  async findOne(id: number): Promise<CabinetRow | null> {
    const r = await this.db.execQuery<CabinetRow>(
      'SELECT * FROM cabinets WHERE id = $1 AND is_deleted = FALSE',
      [id],
      'one',
    );
    return r as CabinetRow | null;
  }

  async update(id: number, dto: UpdateCabinetDto): Promise<CabinetRow | null> {
    if (dto.number === undefined) return this.findOne(id);
    await this.db.execQuery(
      'UPDATE cabinets SET number = $1 WHERE id = $2 AND is_deleted = FALSE',
      [dto.number, id],
    );
    return this.findOne(id);
  }

  async softDelete(id: number): Promise<{ id: number }> {
    await this.db.execQuery(
      'UPDATE cabinets SET is_deleted = TRUE WHERE id = $1',
      [id],
    );
    return { id };
  }
}

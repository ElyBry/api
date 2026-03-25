import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResultRow } from 'pg';

export type FetchMode = 'all' | 'one' | null;

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private config: ConfigService) {
    this.pool = new Pool({
      connectionString: this.config.get<string>('DATABASE_URL'),
    });
  }

  async execQuery<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = [],
    fetch: FetchMode = null,
  ): Promise<T[] | T | void> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, params);
      if (fetch === 'all') return result.rows as T[];
      if (fetch === 'one') return (result.rows[0] ?? null) as T;
      return;
    } finally {
      client.release();
    }
  }
}

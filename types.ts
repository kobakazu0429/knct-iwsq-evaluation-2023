import type { DB } from "sqlite";

export interface Table {
  tableName: string;
  seeds: (db: DB) => Promise<void>;
}

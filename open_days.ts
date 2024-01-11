import type { DB } from "sqlite";
import { Table } from "./types.ts";

const data = [
  [2022, 3, 10],
  [2022, 4, 16],
  [2022, 5, 9],
  [2022, 6, 20],
  [2022, 7, 14],
  [2022, 8, 4],
  [2022, 9, 5],
  [2022, 10, 16],
  [2022, 11, 11],
  [2022, 12, 13],
  [2023, 1, 9],
  [2023, 2, 8],
  [2023, 3, 18],
  [2023, 4, 15],
  [2023, 5, 12],
  [2023, 6, 20],
  [2023, 7, 9],
  [2023, 8, 3],
  [2023, 9, 3],
  [2023, 10, 20],
  [2023, 11, 13],
  [2023, 12, 16],
];

export const openDays: Table = {
  tableName: "open_days",
  seeds: async function (db: DB) {
    db.execute(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        count INTEGER NOT NULL
      )
    `);

    const q = db.prepareQuery(
      `INSERT INTO ${this.tableName} (key, year, month, count) VALUES (?, ?, ?, ?)`
    );
    data.forEach((v) =>
      q.execute([`${v[0]}-${String(v[1]).padStart(2, "0")}`, ...v])
    );

    q.finalize();
  },
};

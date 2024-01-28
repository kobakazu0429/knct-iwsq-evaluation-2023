import type { DB } from "sqlite";
import { readCSVObjects } from "csv";
import {
  DEPARTMENT_MAP,
  EQUIPMENT_MAP,
  dateToSqliteDatetime,
  extractUserInfo,
  getFY,
} from "./utils.ts";
import { Table } from "./types.ts";

export const leaveHistory: Table = {
  tableName: "leave_history",
  seeds: async function (db: DB) {
    db.execute(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        student_no TEXT NOT NULL,
        department TEXT NOT NULL,
        grade INTEGER NOT NULL,
        fy INTEGER NOT NULL,
        equipment_id TEXT,
        equipment_name TEXT,
        equipment_kind TEXT
      )
    `);

    const query = db.prepareQuery(
      `INSERT INTO ${this.tableName} (created_at, student_no, department, grade, fy, equipment_id, equipment_name, equipment_kind) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const f = await Deno.open("./入退室システム - 退室.csv");
    for await (const obj of readCSVObjects(f, { lineSeparator: "\r" })) {
      const datetime = obj["退室時間"].trim();
      const studentNoRaw = obj["学生番号"].trim();
      const usedEquipments = obj["使った設備"]
        .trim()
        .split(",")
        .map((v) => v.trim());
      const user = extractUserInfo(studentNoRaw);

      usedEquipments.forEach((v) => {
        const [id, name] = [v, v.slice(0, -4)];
        const data = [
          dateToSqliteDatetime(new Date(datetime)),
          user.studentNo,
          user.department,
          user.grade,
          getFY(new Date(datetime)),
          id,
          name,
          // @ts-expect-error
          EQUIPMENT_MAP[name],
        ];

        query.execute(data);
      });
    }

    query.finalize();
  },
};

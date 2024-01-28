import type { DB } from "sqlite";
import { dateToSqliteDatetime, extractUserInfo, getFY } from "./utils.ts";
import { Table } from "./types.ts";

export const enterHistory: Table = {
  tableName: "enter_history",
  seeds: async function (db: DB) {
    db.execute(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        student_no TEXT NOT NULL,
        department TEXT NOT NULL,
        grade INTEGER NOT NULL,
        fy INTEGER NOT NULL,
        enter_count INTEGER NOT NULL
      )
    `);

    const enterData = Deno.readTextFileSync("./入退室システム - 入室.csv");
    const enterDataArray = enterData
      .split("\n")
      .slice(1)
      .filter((v) => v !== "")
      .map((v) => {
        const [datetime, studentNoRaw, enterCount] = v.trim().split(",");
        const user = extractUserInfo(studentNoRaw);
        return [
          dateToSqliteDatetime(new Date(datetime)),
          user.studentNo,
          user.department,
          user.grade,
          getFY(new Date(datetime)),
          parseInt(enterCount, 10),
        ];
      });

    const query = db.prepareQuery(
      `INSERT INTO ${this.tableName} (created_at, student_no, department, grade, fy, enter_count) VALUES (?, ?, ?, ?, ?, ?)`
    );
    enterDataArray.forEach((v) => query.execute(v));
    query.finalize();
  },
};

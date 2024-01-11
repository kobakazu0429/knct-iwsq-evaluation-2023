import { Table } from "./types.ts";
import {
  dateToSqliteDatetime,
  extractUserInfo,
  getFY,
  readTSV,
} from "./utils.ts";

export const lectureHistory: Table = {
  tableName: "lecture_history",
  seeds: async function (db) {
    db.execute(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_no TEXT NOT NULL,
        created_at TEXT NOT NULL,
        name TEXT NOT NULL,
        lecture_name TEXT NOT NULL,
        instructor_name TEXT NOT NULL,
        department TEXT NOT NULL,
        year INTEGER NOT NULL,
        fy INTEGER NOT NULL
      )
    `);
    const q = db.prepareQuery(
      `INSERT INTO ${this.tableName} (student_no, created_at, name, lecture_name, instructor_name, department, year, fy) VALUES (?,?,?,?,?,?,?,?)`
    );
    const data = readTSV("./講習会受講登録 - DB.tsv");
    data.forEach((v) => {
      const user = extractUserInfo(v["学生番号"], false);

      q.execute([
        v["学生番号"],
        dateToSqliteDatetime(new Date(v["日付"])),
        v["名前"],
        v["講習"],
        v["講習担当者名を入力してください。"],
        user["department"],
        user["year"],
        getFY(new Date(v["日付"])),
      ]);
    });
    q.finalize();
  },
};

import type { Table } from "./types.ts";
import { extractUserInfo, readTSV } from "./utils.ts";

export const students: Table = {
  tableName: "students",
  seeds: async function (db) {
    db.execute(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_no TEXT NOT NULL,
        department TEXT NOT NULL,
        year INTEGER NOT NULL,
        name TEXT NOT NULL,
        team TEXT NOT NULL,
        UNIQUE(student_no, team)
      )
    `);

    const q = db.prepareQuery(
      `INSERT INTO ${this.tableName} (student_no, department, year, name, team) VALUES (:student_no, :department, :year, :name, :team)`
    );

    {
      const users = readTSV("./ロボコン部.tsv");
      users.forEach((u) => {
        const user = extractUserInfo(u["学生番号"], false);
        const data = {
          student_no: user.studentNo,
          department: user.department,
          year: user.year,
          name: u["名前"],
          team: "ロボコン部",
        };
        console.log(data);

        q.execute(data);
      });
    }

    q.finalize();
  },
};

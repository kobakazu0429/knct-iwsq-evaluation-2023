import type { Table } from "./types.ts";
import { readTSV } from "./utils.ts";

const DOMAIN = "kure.kosen-ac.jp";

export const ta: Table = {
  tableName: "ta",
  seeds: async function (db) {
    db.execute(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department TEXT,
        name TEXT UNIQUE,
        regular_student_no TEXT NOT NULL,
        advanced_student_no TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        regular_email TEXT NOT NULL,
        advanced_email TEXT NOT NULL,
        google_email TEXT NOT NULL UNIQUE,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL
      )
    `);

    const q = db.prepareQuery(
      `INSERT INTO ${this.tableName} (department, name, regular_student_no, advanced_student_no, username, regular_email, advanced_email, google_email, start_date, end_date) VALUES (?,?,?,?,?,?,?,?,?,?)`
    );
    const users = readTSV("./TA一覧 - 一覧.tsv");
    users.forEach((u) =>
      q.execute([
        u["学科"],
        u["名前"],
        u["本科学生番号"],
        u["専攻科学生番号"],
        u["Scrapbox Username"],
        u["本科メールアドレス"] === "-"
          ? u["本科メールアドレス"]
          : `${u["本科メールアドレス"]}@${DOMAIN}`,
        u["専攻科メールアドレス"] === "-"
          ? u["専攻科メールアドレス"]
          : `${u["専攻科メールアドレス"]}@${DOMAIN}`,
        u["Googleメールアドレス"],
        u["TA開始"] === "-" ? "-" : u["TA開始"].replaceAll("/", "-"),
        u["TA終了"] === "-" ? "-" : u["TA終了"].replaceAll("/", "-"),
      ])
    );

    q.finalize();
  },
};

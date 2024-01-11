import { DB } from "sqlite";
import type { Table } from "./types.ts";
import { enterHistory } from "./enter_history.ts";
import { leaveHistory } from "./leave_history.ts";
import { openDays } from "./open_days.ts";
import { ta } from "./ta.ts";
import { lectureHistory } from "./lecture_history.ts";

const db = new DB("test.db");

const dropTable = (db: DB, tableName: string) => {
  db.execute(`DROP TABLE IF EXISTS ${tableName}`);
};

const log = (msg: string) => {
  console.log(new Date(), msg);
};

const use = async (table: Table) => {
  log(`start ${table.tableName}`);
  dropTable(db, table.tableName);
  await table.seeds(db);
  log(`end ${table.tableName}`);
};

use(enterHistory);
use(leaveHistory);
use(openDays);
use(ta);
use(lectureHistory);

db.close();

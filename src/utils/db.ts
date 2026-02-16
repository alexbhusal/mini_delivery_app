import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("delivery.db");

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipient TEXT,
        address TEXT,
        status TEXT,
        is_synced INTEGER,
        updated_at TEXT
      );
    `);
  });
};

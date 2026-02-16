import { db } from "@/utils/db";

export const getOrders = (cb) => {
  db.transaction(tx => {
    tx.executeSql("SELECT * FROM orders", [], (_, res) => {
      cb(res.rows._array);
    });
  });
};

export const saveOrderOffline = (order) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO orders 
      (recipient, address, status, is_synced, updated_at)
      VALUES (?, ?, ?, ?, ?)`,
      [
        order.recipient,
        order.address,
        "Pending",
        0,
        new Date().toISOString()
      ]
    );
  });
};
